<?php
/**
 * Seed only the editable River menu CPT/taxonomy content.
 *
 * Usage inside WordPress:
 *   php seed-river-menu.php
 *
 * Optional:
 *   RIVER_MENU_SEED=/path/to/menu-groups.json php seed-river-menu.php
 */

$wp_load = getenv('WP_LOAD_PATH') ?: '/var/www/html/wp-load.php';
if (!defined('ABSPATH')) {
    if (is_file($wp_load)) {
        require_once $wp_load;
    } else {
        fwrite(STDERR, "WordPress bootstrap not found at {$wp_load}.\n");
        exit(1);
    }
}

if (!defined('RIVER_MENU_ITEM_POST_TYPE') || !defined('RIVER_MENU_SECTION_TAXONOMY')) {
    fwrite(STDERR, "River menu plugin is not loaded.\n");
    exit(1);
}

$seed_path = getenv('RIVER_MENU_SEED') ?: (__DIR__ . '/../data/menu-groups.json');
$seed = json_decode((string) file_get_contents($seed_path), true);
if (!is_array($seed) || !isset($seed['groups']) || !is_array($seed['groups'])) {
    fwrite(STDERR, "Invalid menu seed at {$seed_path}.\n");
    exit(1);
}

function river_seed_menu_term($name, $slug, $parent, $order, $label_hr, $label_en)
{
    $term = get_term_by('slug', $slug, RIVER_MENU_SECTION_TAXONOMY);
    if ($term && !is_wp_error($term)) {
        $term_id = (int) $term->term_id;
        wp_update_term($term_id, RIVER_MENU_SECTION_TAXONOMY, [
            'name' => $name,
            'slug' => $slug,
            'parent' => $parent,
        ]);
    } else {
        $created = wp_insert_term($name, RIVER_MENU_SECTION_TAXONOMY, [
            'slug' => $slug,
            'parent' => $parent,
        ]);
        if (is_wp_error($created)) {
            fwrite(STDERR, $created->get_error_message() . "\n");
            exit(1);
        }
        $term_id = (int) $created['term_id'];
    }

    update_term_meta($term_id, '_river_order', $order);
    update_term_meta($term_id, '_river_label_hr', $label_hr);
    update_term_meta($term_id, '_river_label_en', $label_en);
    return $term_id;
}

function river_seed_menu_group_labels($group_slug, $fallback_title, $fallback_en)
{
    $labels = [
        'menu' => ['Food', 'Hrana', 'Food'],
        'drinks' => ['Drinks', 'Piće', 'Drinks'],
        'pizza' => ['Pizza', 'Pizza', 'Pizza'],
        'wine' => ['Wine', 'Vino', 'Wine'],
    ];

    return $labels[$group_slug] ?? [$fallback_title, $fallback_title, $fallback_en];
}

function river_seed_menu_value($item, $key, $fallback = '')
{
    return (string) ($item[$key] ?? $fallback);
}

function river_seed_menu_normalize_date($value)
{
    $value = trim((string) $value);
    if ($value === '') {
        return '';
    }

    if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $value)) {
        return $value;
    }

    if (preg_match('/^(\d{1,2})\.(\d{1,2})\.(\d{4})\.?$/', $value, $matches)) {
        return sprintf('%04d-%02d-%02d', (int) $matches[3], (int) $matches[2], (int) $matches[1]);
    }

    return $value;
}

river_ensure_menu_group_terms();

$posts = get_posts([
    'post_type' => RIVER_MENU_ITEM_POST_TYPE,
    'post_status' => 'any',
    'posts_per_page' => -1,
    'fields' => 'ids',
]);
foreach ($posts as $post_id) {
    wp_delete_post((int) $post_id, true);
}

$terms = get_terms([
    'taxonomy' => RIVER_MENU_SECTION_TAXONOMY,
    'hide_empty' => false,
]);
if (!is_wp_error($terms)) {
    foreach ($terms as $term) {
        if ((int) $term->parent > 0) {
            wp_delete_term((int) $term->term_id, RIVER_MENU_SECTION_TAXONOMY);
        }
    }
}

$created_posts = 0;
foreach ($seed['groups'] as $group_index => $group) {
    $group_slug = sanitize_title((string) $group['slug']);
    $group_title = (string) ($group['title'] ?? $group_slug);
    [$admin_label, $label_hr, $label_en] = river_seed_menu_group_labels(
        $group_slug,
        $group_title,
        (string) ($group['languages'][1]['label'] ?? $group_title)
    );
    $group_id = river_seed_menu_term($admin_label, $group_slug, 0, $group_index, $label_hr, $label_en);

    $hr_categories = $group['languages'][0]['categories'] ?? [];
    $en_categories = $group['languages'][1]['categories'] ?? [];
    foreach ($hr_categories as $category_index => $category) {
        $en_category = $en_categories[$category_index] ?? [];
        $category_slug = $group_slug . '-' . sanitize_title((string) $category['title']);
        $category_id = river_seed_menu_term(
            (string) $category['title'],
            $category_slug,
            $group_id,
            $category_index,
            (string) $category['title'],
            (string) ($en_category['title'] ?? $category['title'])
        );

        foreach (($category['items'] ?? []) as $item_index => $item) {
            $en_item = $en_category['items'][$item_index] ?? [];
            $slug = sanitize_title("river-{$group_slug}-{$category_index}-{$item_index}");
            $post_id = wp_insert_post([
                'post_type' => RIVER_MENU_ITEM_POST_TYPE,
                'post_status' => 'publish',
                'post_name' => $slug,
                'post_title' => river_seed_menu_value($item, 'name'),
                'menu_order' => $item_index,
            ], true);

            if (is_wp_error($post_id)) {
                fwrite(STDERR, $post_id->get_error_message() . "\n");
                exit(1);
            }

            update_post_meta($post_id, '_river_name_hr', river_seed_menu_value($item, 'name'));
            update_post_meta($post_id, '_river_name_en', river_seed_menu_value($en_item, 'name', river_seed_menu_value($item, 'name')));
            update_post_meta($post_id, '_river_description_hr', river_seed_menu_value($item, 'description'));
            update_post_meta($post_id, '_river_description_en', river_seed_menu_value($en_item, 'description', river_seed_menu_value($item, 'description')));
            update_post_meta($post_id, '_river_quantity_hr', river_seed_menu_value($item, 'quantity'));
            update_post_meta($post_id, '_river_quantity_en', river_seed_menu_value($en_item, 'quantity', river_seed_menu_value($item, 'quantity')));
            update_post_meta($post_id, '_river_price_eur', river_seed_menu_value($item, 'priceEur'));
            update_post_meta($post_id, '_river_anchor_price_eur', river_seed_menu_value($item, 'anchorPriceEur', river_seed_menu_value($item, 'priceEur')));
            update_post_meta($post_id, '_river_anchor_price_date', river_seed_menu_normalize_date(river_seed_menu_value($item, 'anchorPriceDate', '2026-09-10')));
            update_post_meta($post_id, '_river_jumbo_price_eur', river_seed_menu_value($item, 'jumboPriceEur'));
            update_post_meta($post_id, '_river_jumbo_anchor_price_eur', river_seed_menu_value($item, 'jumboAnchorPriceEur', river_seed_menu_value($item, 'jumboPriceEur')));
            update_post_meta($post_id, '_river_jumbo_anchor_price_date', river_seed_menu_normalize_date(river_seed_menu_value($item, 'jumboAnchorPriceDate', isset($item['jumboPriceEur']) ? '2026-09-10' : '')));
            wp_set_object_terms($post_id, [$category_id], RIVER_MENU_SECTION_TAXONOMY, false);
            $created_posts++;
        }
    }
}

echo "Seeded River menu items: {$created_posts}\n";
