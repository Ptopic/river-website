<?php
/**
 * Migrate legacy JSON textarea values to proper ACF block field values.
 *
 * Usage:
 *   wp eval-file wordpress/bin/migrate-river-block-fields.php
 */

if (!defined('ABSPATH')) {
    fwrite(STDERR, "Run through WP-CLI inside WordPress.\n");
    exit(1);
}

if (!function_exists('river_structured_block_fields')) {
    fwrite(STDERR, "River headless plugin is not loaded.\n");
    exit(1);
}

function river_migrate_block_attrs($blocks, &$changed)
{
    foreach ($blocks as &$block) {
        if (!is_array($block)) {
            continue;
        }

        if (!empty($block['innerBlocks']) && is_array($block['innerBlocks'])) {
            $block['innerBlocks'] = river_migrate_block_attrs($block['innerBlocks'], $changed);
        }

        if (empty($block['blockName']) || strpos((string) $block['blockName'], RIVER_BLOCK_PREFIX) !== 0) {
            continue;
        }

        if (empty($block['attrs']['data']) || !is_array($block['attrs']['data'])) {
            continue;
        }

        foreach (array_keys(river_structured_block_fields()) as $field_name) {
            if (!isset($block['attrs']['data'][$field_name]) || !is_string($block['attrs']['data'][$field_name])) {
                continue;
            }

            $decoded = json_decode($block['attrs']['data'][$field_name], true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                continue;
            }

            $block['attrs']['data'][$field_name] = $decoded;
            $changed = true;
        }
    }

    return $blocks;
}

$pages = get_posts([
    'post_type' => 'page',
    'post_status' => ['publish', 'draft', 'private', 'pending', 'future'],
    'posts_per_page' => -1,
]);

$updated = 0;
foreach ($pages as $page) {
    if (!has_blocks($page->post_content)) {
        continue;
    }

    $changed = false;
    $blocks = river_migrate_block_attrs(parse_blocks($page->post_content), $changed);
    if (!$changed) {
        continue;
    }

    $result = wp_update_post([
        'ID' => (int) $page->ID,
        'post_content' => wp_slash(serialize_blocks($blocks)),
    ], true);

    if (is_wp_error($result)) {
        WP_CLI::error($result->get_error_message());
    }

    $updated++;
    WP_CLI::log("Migrated River block fields on page {$page->post_name}.");
}

WP_CLI::success("Updated {$updated} page(s).");
