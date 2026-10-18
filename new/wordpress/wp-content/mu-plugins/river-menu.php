<?php
/**
 * Plugin Name: River Menu Content
 * Description: Registers editable River menu items and exposes the normalized menu contract for Astro.
 */

if (!defined('ABSPATH')) {
    exit;
}

const RIVER_MENU_ITEM_POST_TYPE = 'river_menu_item';
const RIVER_MENU_SECTION_TAXONOMY = 'river_menu_section';

function river_menu_groups_config()
{
    return [
        'menu' => [
            'admin_label' => 'Food',
            'label_hr' => 'Hrana',
            'label_en' => 'Food',
            'order' => 0,
        ],
        'drinks' => [
            'admin_label' => 'Drinks',
            'label_hr' => 'Piće',
            'label_en' => 'Drinks',
            'order' => 1,
        ],
        'pizza' => [
            'admin_label' => 'Pizza',
            'label_hr' => 'Pizza',
            'label_en' => 'Pizza',
            'order' => 2,
        ],
        'wine' => [
            'admin_label' => 'Wine',
            'label_hr' => 'Vino',
            'label_en' => 'Wine',
            'order' => 3,
        ],
    ];
}

function river_menu_group_slugs()
{
    return array_keys(river_menu_groups_config());
}

add_action('init', function () {
    register_post_type(RIVER_MENU_ITEM_POST_TYPE, [
        'labels' => [
            'name' => 'Menu',
            'singular_name' => 'Menu Item',
            'add_new_item' => 'Add Menu Item',
            'edit_item' => 'Edit Menu Item',
        ],
        'public' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'menu_position' => 22,
        'menu_icon' => 'dashicons-food',
        'supports' => ['title', 'page-attributes'],
        'show_in_rest' => true,
        'rewrite' => false,
    ]);

    register_taxonomy(RIVER_MENU_SECTION_TAXONOMY, [RIVER_MENU_ITEM_POST_TYPE], [
        'labels' => [
            'name' => 'Menu Sections',
            'singular_name' => 'Menu Section',
        ],
        'hierarchical' => true,
        'show_ui' => true,
        'show_admin_column' => true,
        'show_in_rest' => true,
        'rewrite' => false,
    ]);

    river_ensure_menu_group_terms();

    foreach ([
        '_river_name_hr',
        '_river_name_en',
        '_river_description_hr',
        '_river_description_en',
        '_river_quantity_hr',
        '_river_quantity_en',
        '_river_price_eur',
        '_river_anchor_price_eur',
        '_river_anchor_price_date',
        '_river_jumbo_price_eur',
        '_river_jumbo_anchor_price_eur',
        '_river_jumbo_anchor_price_date',
        '_river_promo_active',
        '_river_promo_name_hr',
    ] as $meta_key) {
        register_post_meta(RIVER_MENU_ITEM_POST_TYPE, $meta_key, [
            'single' => true,
            'type' => $meta_key === '_river_promo_active' ? 'boolean' : 'string',
            'show_in_rest' => true,
            'sanitize_callback' => $meta_key === '_river_promo_active' ? 'rest_sanitize_boolean' : 'sanitize_text_field',
            'auth_callback' => function () {
                return current_user_can('edit_posts');
            },
        ]);
    }
});

function river_ensure_menu_group_terms()
{
    foreach (river_menu_groups_config() as $slug => $group) {
        $term = get_term_by('slug', $slug, RIVER_MENU_SECTION_TAXONOMY);
        if ($term && !is_wp_error($term)) {
            $term_id = (int) $term->term_id;
            if ($term->name !== $group['admin_label'] || $term->slug !== $slug || (int) $term->parent !== 0) {
                wp_update_term($term_id, RIVER_MENU_SECTION_TAXONOMY, [
                    'name' => $group['admin_label'],
                    'slug' => $slug,
                    'parent' => 0,
                ]);
            }
        } else {
            $created = wp_insert_term($group['admin_label'], RIVER_MENU_SECTION_TAXONOMY, [
                'slug' => $slug,
                'parent' => 0,
            ]);
            if (is_wp_error($created)) {
                continue;
            }
            $term_id = (int) $created['term_id'];
        }

        update_term_meta($term_id, '_river_order', (int) $group['order']);
        update_term_meta($term_id, '_river_label_hr', $group['label_hr']);
        update_term_meta($term_id, '_river_label_en', $group['label_en']);
        update_term_meta($term_id, '_river_is_group', '1');
    }
}

add_action('add_meta_boxes', function () {
    add_meta_box(
        'river-menu-item-fields',
        'River Menu Item',
        'river_render_menu_item_metabox',
        RIVER_MENU_ITEM_POST_TYPE,
        'normal',
        'high'
    );

    remove_meta_box(RIVER_MENU_SECTION_TAXONOMY . 'div', RIVER_MENU_ITEM_POST_TYPE, 'side');
    add_meta_box(
        'river-menu-section-picker',
        'Menu Section',
        'river_render_menu_section_picker',
        RIVER_MENU_ITEM_POST_TYPE,
        'side',
        'high'
    );
});

function river_render_menu_item_metabox($post)
{
    wp_nonce_field('river_menu_item_save', 'river_menu_item_nonce');
    $fields = [
        '_river_name_hr' => 'Name HR',
        '_river_name_en' => 'Name EN',
        '_river_description_hr' => 'Description HR',
        '_river_description_en' => 'Description EN',
        '_river_quantity_hr' => 'Quantity HR',
        '_river_quantity_en' => 'Quantity EN',
        '_river_price_eur' => 'Price EUR',
        '_river_anchor_price_eur' => 'Sidrena cijena EUR',
        '_river_anchor_price_date' => 'Sidrena cijena date',
        '_river_jumbo_price_eur' => 'Jumbo price EUR',
        '_river_jumbo_anchor_price_eur' => 'Jumbo sidrena cijena EUR',
        '_river_jumbo_anchor_price_date' => 'Jumbo sidrena cijena date',
        '_river_promo_active' => 'Posebni oblik prodaje',
        '_river_promo_name_hr' => 'Naziv posebnog oblika (HR)',
    ];

    echo '<table class="form-table"><tbody>';
    foreach ($fields as $key => $label) {
        $value = (string) get_post_meta($post->ID, $key, true);
        $type = str_ends_with($key, '_date') ? 'date' : 'text';
        if ($type === 'date') {
            $value = river_normalize_anchor_date($value);
        }
        echo '<tr><th><label for="' . esc_attr($key) . '">' . esc_html($label) . '</label></th><td>';
        if ($key === '_river_promo_active') {
            echo '<input type="checkbox" id="_river_promo_active" name="_river_promo_active" value="1"' . checked($value, '1', false) . ' />';
        } else {
            echo '<input class="regular-text" type="' . esc_attr($type) . '" id="' . esc_attr($key) . '" name="' . esc_attr($key) . '" value="' . esc_attr($value) . '" />';
        }
        echo '</td></tr>';
    }
    echo '</tbody></table>';
    echo '<p>Assign each item to one subsection under Food, Drinks, Pizza, or Wine.</p>';
}

function river_render_menu_section_picker($post)
{
    $current_terms = wp_get_object_terms($post->ID, RIVER_MENU_SECTION_TAXONOMY, ['fields' => 'ids']);
    $selected = (!is_wp_error($current_terms) && isset($current_terms[0])) ? (int) $current_terms[0] : 0;
    $requested_group = isset($_GET['river_group']) ? sanitize_key((string) $_GET['river_group']) : '';

    echo '<p><label for="river_menu_section_id">Subsection</label></p>';
    echo '<select id="river_menu_section_id" name="river_menu_section_id" style="width:100%;">';
    echo '<option value="">Select a subsection</option>';

    foreach (river_menu_groups_config() as $group_slug => $group) {
        $group_term = get_term_by('slug', $group_slug, RIVER_MENU_SECTION_TAXONOMY);
        if (!$group_term || is_wp_error($group_term)) {
            continue;
        }

        $children = get_terms([
            'taxonomy' => RIVER_MENU_SECTION_TAXONOMY,
            'hide_empty' => false,
            'parent' => (int) $group_term->term_id,
            'meta_key' => '_river_order',
            'orderby' => 'meta_value_num',
            'order' => 'ASC',
        ]);

        if (is_wp_error($children) || empty($children)) {
            continue;
        }

        echo '<optgroup label="' . esc_attr($group['admin_label']) . '">';
        foreach ($children as $child) {
            $is_selected = $selected === (int) $child->term_id;
            if (!$is_selected && $selected === 0 && $requested_group === $group_slug) {
                $is_selected = true;
                $selected = (int) $child->term_id;
            }
            echo '<option value="' . esc_attr((string) $child->term_id) . '"' . selected($is_selected, true, false) . '>';
            echo esc_html(river_term_label($child, 'hr') . ' / ' . river_term_label($child, 'en'));
            echo '</option>';
        }
        echo '</optgroup>';
    }

    echo '</select>';
    echo '<p class="description">The top-level sections are fixed. Add or reorder category subsections in Menu Sections.</p>';
}

add_action('save_post_' . RIVER_MENU_ITEM_POST_TYPE, function ($post_id) {
    if (!isset($_POST['river_menu_item_nonce']) || !wp_verify_nonce((string) $_POST['river_menu_item_nonce'], 'river_menu_item_save')) {
        return;
    }
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    foreach ([
        '_river_name_hr',
        '_river_name_en',
        '_river_description_hr',
        '_river_description_en',
        '_river_quantity_hr',
        '_river_quantity_en',
        '_river_price_eur',
        '_river_anchor_price_eur',
        '_river_anchor_price_date',
        '_river_jumbo_price_eur',
        '_river_jumbo_anchor_price_eur',
        '_river_jumbo_anchor_price_date',
        '_river_promo_active',
        '_river_promo_name_hr',
    ] as $key) {
        $value = $key === '_river_promo_active'
            ? (isset($_POST[$key]) ? '1' : '0')
            : (isset($_POST[$key]) ? sanitize_text_field((string) $_POST[$key]) : '');
        if (str_ends_with($key, '_date')) {
            $value = river_normalize_anchor_date($value);
        }
        update_post_meta($post_id, $key, $value);
    }

    $section_id = isset($_POST['river_menu_section_id']) ? absint($_POST['river_menu_section_id']) : 0;
    if ($section_id > 0) {
        $section = get_term($section_id, RIVER_MENU_SECTION_TAXONOMY);
        if ($section && !is_wp_error($section) && (int) $section->parent > 0) {
            wp_set_object_terms($post_id, [$section_id], RIVER_MENU_SECTION_TAXONOMY, false);
        }
    }
});

add_action('admin_menu', function () {
    $parent_slug = 'edit.php?post_type=' . RIVER_MENU_ITEM_POST_TYPE;
    remove_submenu_page(
        $parent_slug,
        'edit-tags.php?taxonomy=' . RIVER_MENU_SECTION_TAXONOMY . '&post_type=' . RIVER_MENU_ITEM_POST_TYPE
    );

    foreach (river_menu_groups_config() as $group_slug => $group) {
        add_submenu_page(
            $parent_slug,
            $group['admin_label'],
            $group['admin_label'],
            'edit_posts',
            'edit.php?post_type=' . RIVER_MENU_ITEM_POST_TYPE . '&river_group=' . $group_slug
        );
    }

    add_submenu_page(
        $parent_slug,
        'Menu Sections',
        'Menu Sections',
        'manage_categories',
        'edit-tags.php?taxonomy=' . RIVER_MENU_SECTION_TAXONOMY . '&post_type=' . RIVER_MENU_ITEM_POST_TYPE
    );
}, 99);

add_action('admin_init', function () {
    $page = isset($_GET['page']) ? sanitize_key((string) $_GET['page']) : '';
    if (strpos($page, 'river-menu-group-') !== 0) {
        return;
    }

    $group_slug = substr($page, strlen('river-menu-group-'));
    if (!isset(river_menu_groups_config()[$group_slug])) {
        return;
    }

    wp_safe_redirect(admin_url('edit.php?post_type=' . RIVER_MENU_ITEM_POST_TYPE . '&river_group=' . $group_slug));
    exit;
});

add_action('pre_get_posts', function ($query) {
    if (!is_admin() || !$query->is_main_query()) {
        return;
    }
    if ($query->get('post_type') !== RIVER_MENU_ITEM_POST_TYPE) {
        return;
    }

    $group_slug = isset($_GET['river_group']) ? sanitize_key((string) $_GET['river_group']) : '';
    if (!isset(river_menu_groups_config()[$group_slug])) {
        return;
    }

    $group = get_term_by('slug', $group_slug, RIVER_MENU_SECTION_TAXONOMY);
    if (!$group || is_wp_error($group)) {
        return;
    }

    $children = get_terms([
        'taxonomy' => RIVER_MENU_SECTION_TAXONOMY,
        'hide_empty' => false,
        'parent' => (int) $group->term_id,
        'fields' => 'ids',
    ]);

    if (is_wp_error($children) || empty($children)) {
        $query->set('post__in', [0]);
        return;
    }

    $query->set('tax_query', [
        [
            'taxonomy' => RIVER_MENU_SECTION_TAXONOMY,
            'field' => 'term_id',
            'terms' => array_map('intval', $children),
            'include_children' => false,
        ],
    ]);
});

add_filter('views_edit-' . RIVER_MENU_ITEM_POST_TYPE, function ($views) {
    $group_slug = isset($_GET['river_group']) ? sanitize_key((string) $_GET['river_group']) : '';
    if (!isset(river_menu_groups_config()[$group_slug])) {
        return $views;
    }

    $group = river_menu_groups_config()[$group_slug];
    echo '<div class="notice notice-info inline"><p><strong>' . esc_html($group['admin_label']) . '</strong> menu items are shown here. Add category subsections under Menu Sections, then assign items to those subsections.</p></div>';
    return $views;
});

add_action('rest_api_init', function () {
    register_rest_route('river/v1', '/menu', [
        'methods' => 'GET',
        'permission_callback' => '__return_true',
        'callback' => 'river_menu_rest_response',
    ]);
});

function river_menu_rest_response()
{
    return rest_ensure_response([
        'groups' => array_values(array_filter(array_map('river_menu_group_contract', river_menu_group_slugs()))),
    ]);
}

function river_menu_group_contract($group_slug)
{
    $group = get_term_by('slug', $group_slug, RIVER_MENU_SECTION_TAXONOMY);
    if (!$group || is_wp_error($group)) {
        return null;
    }

    $categories = get_terms([
        'taxonomy' => RIVER_MENU_SECTION_TAXONOMY,
        'hide_empty' => false,
        'parent' => (int) $group->term_id,
        'meta_key' => '_river_order',
        'orderby' => 'meta_value_num',
        'order' => 'ASC',
    ]);

    if (is_wp_error($categories)) {
        $categories = [];
    }

    $hr_categories = [];
    $en_categories = [];
    foreach ($categories as $category) {
        $items = river_menu_items_for_category((int) $category->term_id);
        $hr_categories[] = [
            'title' => river_term_label($category, 'hr'),
            'items' => array_map(fn ($item) => river_menu_item_contract($item, 'hr'), $items),
        ];
        $en_categories[] = [
            'title' => river_term_label($category, 'en'),
            'items' => array_map(fn ($item) => river_menu_item_contract($item, 'en'), $items),
        ];
    }

    return [
        'slug' => $group_slug === 'wine' ? 'wine' : $group_slug,
        'title' => river_term_label($group, 'hr'),
        'languages' => [
            ['code' => 'hr', 'label' => 'HR', 'categories' => $hr_categories],
            ['code' => 'en', 'label' => 'EN', 'categories' => $en_categories],
        ],
    ];
}

function river_menu_items_for_category($term_id)
{
    return get_posts([
        'post_type' => RIVER_MENU_ITEM_POST_TYPE,
        'post_status' => 'publish',
        'posts_per_page' => -1,
        'orderby' => ['menu_order' => 'ASC', 'title' => 'ASC'],
        'tax_query' => [
            [
                'taxonomy' => RIVER_MENU_SECTION_TAXONOMY,
                'field' => 'term_id',
                'terms' => [$term_id],
            ],
        ],
    ]);
}

function river_menu_item_contract($post, $language)
{
    $suffix = $language === 'en' ? 'en' : 'hr';
    $fallback_suffix = $language === 'en' ? 'hr' : 'en';
    $name = river_meta_fallback($post->ID, "_river_name_{$suffix}", "_river_name_{$fallback_suffix}", $post->post_title);
    $description = river_meta_fallback($post->ID, "_river_description_{$suffix}", "_river_description_{$fallback_suffix}", '');
    $quantity = river_meta_fallback($post->ID, "_river_quantity_{$suffix}", "_river_quantity_{$fallback_suffix}", '');

    $item = [
        'name' => $name,
        'priceEur' => (string) get_post_meta($post->ID, '_river_price_eur', true),
    ];
    $anchor = (string) get_post_meta($post->ID, '_river_anchor_price_eur', true);
    $anchor_date = river_format_anchor_date((string) get_post_meta($post->ID, '_river_anchor_price_date', true));
    if ($anchor !== '') {
        $item['anchorPriceEur'] = $anchor;
    }
    if ($anchor_date !== '') {
        $item['anchorPriceDate'] = $anchor_date;
    }
    if ($description !== '') {
        $item['description'] = $description;
    }
    if ($quantity !== '') {
        $item['quantity'] = $quantity;
    }
    $jumbo = (string) get_post_meta($post->ID, '_river_jumbo_price_eur', true);
    if ($jumbo !== '') {
        $item['jumboPriceEur'] = $jumbo;
    }
    $jumbo_anchor = (string) get_post_meta($post->ID, '_river_jumbo_anchor_price_eur', true);
    $jumbo_anchor_date = river_format_anchor_date((string) get_post_meta($post->ID, '_river_jumbo_anchor_price_date', true));
    if ($jumbo_anchor !== '') {
        $item['jumboAnchorPriceEur'] = $jumbo_anchor;
    }
    if ($jumbo_anchor_date !== '') {
        $item['jumboAnchorPriceDate'] = $jumbo_anchor_date;
    }

    return $item;
}

function river_normalize_anchor_date($value)
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

function river_format_anchor_date($value)
{
    $value = trim((string) $value);
    if ($value === '') {
        return '';
    }

    if (preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', $value, $matches)) {
        return sprintf('%d.%d.%d.', (int) $matches[3], (int) $matches[2], (int) $matches[1]);
    }

    return $value;
}

function river_meta_fallback($post_id, $primary_key, $fallback_key, $default)
{
    $primary = (string) get_post_meta($post_id, $primary_key, true);
    if ($primary !== '') {
        return $primary;
    }
    $fallback = (string) get_post_meta($post_id, $fallback_key, true);
    return $fallback !== '' ? $fallback : $default;
}

function river_term_label($term, $language)
{
    $label = (string) get_term_meta((int) $term->term_id, '_river_label_' . $language, true);
    return $label !== '' ? $label : $term->name;
}
