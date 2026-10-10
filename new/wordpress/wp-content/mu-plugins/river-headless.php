<?php
/**
 * Plugin Name: River Headless Contract
 * Description: Exposes River page sections as the `river_sections` REST field for the Astro block renderer.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('rest_api_init', function () {
    register_rest_field('page', 'river_sections', [
        'get_callback' => function ($post) {
            $post_id = isset($post['id']) ? (int) $post['id'] : 0;
            if ($post_id <= 0) {
                return [];
            }

            $sections = function_exists('river_blocks_read_sections')
                ? river_blocks_read_sections($post_id)
                : null;

            if ($sections === null && function_exists('get_field')) {
                $sections = get_field('sections', $post_id);
            }

            if (!is_array($sections)) {
                return [];
            }

            return array_map('river_resolve_section', $sections);
        },
        'schema' => [
            'description' => 'Ordered River section rows for the Astro frontend.',
            'type' => 'array',
        ],
    ]);

    register_rest_field('page', 'river_seo', [
        'get_callback' => function ($post) {
            $post_id = isset($post['id']) ? (int) $post['id'] : 0;
            if (!$post_id) {
                return [];
            }

            return [
                'title' => function_exists('get_field')
                    ? (string) get_field('seo_title', $post_id)
                    : (string) get_post_meta($post_id, 'seo_title', true),
                'description' => function_exists('get_field')
                    ? (string) get_field('seo_description', $post_id)
                    : (string) get_post_meta($post_id, 'seo_description', true),
            ];
        },
        'schema' => [
            'description' => 'SEO fields consumed by Astro.',
            'type' => 'object',
        ],
    ]);
});

function river_resolve_section($section)
{
    if (!is_array($section)) {
        return [];
    }

    if (isset($section['acf_fc_layout']) && !isset($section['type'])) {
        $section['type'] = $section['acf_fc_layout'];
    }

    array_walk_recursive($section, function (&$value) {
        if (is_string($value)) {
            $value = river_normalize_text_value($value);
            return;
        }

        if (is_int($value) && wp_attachment_is_image($value)) {
            $value = river_media_contract($value);
        }
    });

    $section = river_normalize_structured_block_fields($section);

    return $section;
}

function river_structured_block_fields()
{
    $cta = ['label' => 'string', 'href' => 'string'];
    $image = ['image' => 'media'];
    $menu_item = [
        'name' => 'string',
        'description' => 'string',
        'quantity' => 'string',
        'priceEur' => 'string',
        'jumboPriceEur' => 'string',
    ];
    $menu_category = [
        'title' => 'string',
        'items' => ['type' => 'repeater', 'fields' => $menu_item],
    ];
    $language = [
        'code' => 'string',
        'label' => 'string',
        'categories' => ['type' => 'repeater', 'fields' => $menu_category],
    ];

    return [
        'logo' => ['type' => 'media'],
        'icon' => ['type' => 'media'],
        'items' => ['type' => 'repeater', 'fields' => [
            'label' => 'string',
            'href' => 'string',
            'title' => 'string',
            'body' => 'string',
            'image' => 'media',
        ]],
        'cta' => ['type' => 'group', 'fields' => $cta],
        'slides' => ['type' => 'repeater', 'fields' => $image],
        'cards' => ['type' => 'repeater', 'fields' => [
            'title' => 'string',
            'text' => 'string',
            'href' => 'string',
            'label' => 'string',
        ]],
        'ctas' => ['type' => 'repeater', 'fields' => $cta],
        'images' => ['type' => 'repeater', 'fields' => $image],
        'hours' => ['type' => 'repeater', 'fields' => [
            'label' => 'string',
            'value' => 'string',
        ]],
        'socialLinks' => ['type' => 'repeater', 'fields' => $cta],
        'supportLogos' => ['type' => 'repeater', 'fields' => $image],
        'languages' => ['type' => 'repeater', 'fields' => $language],
        'nav' => ['type' => 'repeater', 'fields' => $cta],
    ];
}

function river_normalize_structured_block_fields($section)
{
    foreach (river_structured_block_fields() as $field_name => $schema) {
        $value = $section[$field_name] ?? null;

        if (is_string($value)) {
            $decoded = json_decode($value, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $value = $decoded;
            }
        }

        if (($schema['type'] ?? '') === 'media') {
            $normalized = river_normalize_media_value($value);
            if ($normalized) {
                $section[$field_name] = $normalized;
            }
            continue;
        }

        if ($schema['type'] === 'group') {
            $normalized = is_array($value)
                ? river_normalize_structured_row($value, $schema['fields'])
                : (river_has_structured_flat_keys($section, $field_name)
                    ? river_extract_structured_row($section, $field_name, $schema['fields'])
                    : null);
            if ($normalized) {
                $section[$field_name] = $normalized;
            }
            $section = river_remove_structured_flat_keys($section, $field_name);
            continue;
        }

        if ($schema['type'] === 'repeater') {
            $normalized = river_normalize_structured_repeater($value, $schema['fields']);
            if ($normalized === null) {
                $normalized = river_extract_structured_repeater($section, $field_name, $schema['fields']);
            }
            if ($normalized !== null) {
                if (in_array($field_name, ['slides', 'images', 'supportLogos'], true)) {
                    $normalized = river_flatten_media_rows($normalized);
                }
                $section[$field_name] = $normalized;
            }
            $section = river_remove_structured_flat_keys($section, $field_name);
        }
    }

    return $section;
}

function river_flatten_media_rows($rows)
{
    $media = [];
    foreach ($rows as $row) {
        if (is_array($row) && isset($row['image']) && is_array($row['image'])) {
            $media[] = $row['image'];
            continue;
        }
        if (is_array($row) && isset($row['src'])) {
            $media[] = $row;
        }
    }
    return $media;
}

function river_normalize_structured_repeater($value, $schema)
{
    if (!is_array($value)) {
        return null;
    }

    $rows = [];
    foreach ($value as $row) {
        if (is_array($row)) {
            $rows[] = river_normalize_structured_row($row, $schema);
        }
    }
    return $rows;
}

function river_extract_structured_repeater($section, $field_name, $schema)
{
    if (!isset($section[$field_name]) || !is_numeric($section[$field_name])) {
        return null;
    }

    $rows = [];
    $count = (int) $section[$field_name];
    for ($index = 0; $index < $count; $index++) {
        $rows[] = river_extract_structured_row($section, $field_name . '_' . $index, $schema);
    }
    return $rows;
}

function river_extract_structured_row($section, $prefix, $schema)
{
    $row = [];
    foreach ($schema as $name => $child_schema) {
        $key = $prefix . '_' . $name;
        if (is_array($child_schema)) {
            if (($child_schema['type'] ?? '') === 'repeater') {
                $row[$name] = river_extract_structured_repeater($section, $key, $child_schema['fields']) ?: [];
            } elseif (($child_schema['type'] ?? '') === 'group') {
                $row[$name] = river_extract_structured_row($section, $key, $child_schema['fields']);
            }
            continue;
        }

        if ($child_schema === 'media') {
            $row[$name] = river_normalize_media_value($section[$key] ?? null) ?: [];
            continue;
        }

        $row[$name] = isset($section[$key]) && is_scalar($section[$key]) ? (string) $section[$key] : '';
    }
    return $row;
}

function river_normalize_structured_row($row, $schema)
{
    $normalized = [];
    foreach ($schema as $name => $child_schema) {
        if (is_array($child_schema)) {
            if (($child_schema['type'] ?? '') === 'repeater') {
                $normalized[$name] = river_normalize_structured_repeater($row[$name] ?? [], $child_schema['fields']) ?: [];
            } elseif (($child_schema['type'] ?? '') === 'group') {
                $normalized[$name] = is_array($row[$name] ?? null)
                    ? river_normalize_structured_row($row[$name], $child_schema['fields'])
                    : [];
            }
            continue;
        }

        if ($child_schema === 'media') {
            $media = river_normalize_media_value($row[$name] ?? null);
            if ($media) {
                $normalized[$name] = $media;
            }
            continue;
        }

        if (isset($row[$name]) && is_scalar($row[$name])) {
            $normalized[$name] = river_normalize_text_value((string) $row[$name]);
        }
    }
    return $normalized;
}

function river_normalize_text_value($value)
{
    $value = (string) $value;

    if (strpos($value, 'u00') === false) {
        return $value;
    }

    return preg_replace_callback('/\\\\?u([0-9a-fA-F]{4})/', function ($matches) {
        $decoded = json_decode('"\\u' . $matches[1] . '"');
        return is_string($decoded) ? $decoded : $matches[0];
    }, $value);
}

function river_normalize_media_value($value)
{
    if (is_array($value)) {
        if (isset($value['src']) && is_scalar($value['src'])) {
            return [
                'src' => (string) $value['src'],
                'alt' => isset($value['alt']) && is_scalar($value['alt']) ? (string) $value['alt'] : '',
                'width' => isset($value['width']) ? (int) $value['width'] : null,
                'height' => isset($value['height']) ? (int) $value['height'] : null,
                'sizes' => isset($value['sizes']) && is_array($value['sizes']) ? $value['sizes'] : [],
            ];
        }
        return null;
    }

    if (is_int($value) || (is_string($value) && ctype_digit($value))) {
        $attachment_id = (int) $value;
        return $attachment_id > 0 ? river_media_contract($attachment_id) : null;
    }

    if (is_string($value) && trim($value) !== '') {
        return ['src' => trim($value), 'alt' => '', 'width' => null, 'height' => null, 'sizes' => []];
    }

    return null;
}

function river_remove_structured_flat_keys($section, $field_name)
{
    foreach (array_keys($section) as $key) {
        if (strpos((string) $key, $field_name . '_') === 0) {
            unset($section[$key]);
        }
    }
    return $section;
}

function river_has_structured_flat_keys($section, $field_name)
{
    foreach (array_keys($section) as $key) {
        if (strpos((string) $key, $field_name . '_') === 0) {
            return true;
        }
    }
    return false;
}

function river_media_contract($attachment_id)
{
    $attachment_id = (int) $attachment_id;
    $src = wp_get_attachment_image_url($attachment_id, 'full');
    $metadata = wp_get_attachment_metadata($attachment_id);

    return [
        'src' => $src ?: '',
        'alt' => (string) get_post_meta($attachment_id, '_wp_attachment_image_alt', true),
        'width' => isset($metadata['width']) ? (int) $metadata['width'] : null,
        'height' => isset($metadata['height']) ? (int) $metadata['height'] : null,
        'sizes' => river_media_sizes($attachment_id),
    ];
}

function river_media_sizes($attachment_id)
{
    $sizes = [];
    foreach (get_intermediate_image_sizes() as $size) {
        $url = wp_get_attachment_image_url($attachment_id, $size);
        if ($url) {
            $sizes[$size] = $url;
        }
    }
    return $sizes;
}
