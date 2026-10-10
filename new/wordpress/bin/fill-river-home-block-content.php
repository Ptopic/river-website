<?php
/**
 * Fill the Home page River blocks with ACF-native block values.
 *
 * Copies legacy files into the WordPress media library and writes block data in
 * the flat ACF format used by the editor sidebar:
 *   field => value, _field => field_key, repeater_0_child => value, ...
 *
 * Usage:
 *   wp eval-file wordpress/bin/fill-river-home-block-content.php
 */

if (!defined('ABSPATH')) {
    fwrite(STDERR, "Run through WP-CLI inside WordPress.\n");
    exit(1);
}

const RIVER_FILL_ASSET_DIR = '/tmp/river-assets';

function river_fill_media_id($filename, $alt = '')
{
    $filename = basename((string) $filename);
    $source = trailingslashit(RIVER_FILL_ASSET_DIR) . $filename;

    if (!is_readable($source)) {
        WP_CLI::warning("Missing asset: {$source}");
        return 0;
    }

    $existing = get_posts([
        'post_type' => 'attachment',
        'post_status' => 'inherit',
        'posts_per_page' => 1,
        'fields' => 'ids',
        'meta_key' => '_river_source_filename',
        'meta_value' => $filename,
    ]);

    if ($existing) {
        $id = (int) $existing[0];
        if ($alt !== '') {
            update_post_meta($id, '_wp_attachment_image_alt', $alt);
        }
        return $id;
    }

    require_once ABSPATH . 'wp-admin/includes/file.php';
    require_once ABSPATH . 'wp-admin/includes/media.php';
    require_once ABSPATH . 'wp-admin/includes/image.php';

    $tmp = wp_tempnam($filename);
    if (!$tmp || !copy($source, $tmp)) {
        WP_CLI::warning("Could not stage asset: {$filename}");
        return 0;
    }

    $file = [
        'name' => $filename,
        'tmp_name' => $tmp,
    ];
    $id = media_handle_sideload($file, 0);

    if (is_wp_error($id)) {
        @unlink($tmp);
        WP_CLI::warning("Could not import {$filename}: " . $id->get_error_message());
        return 0;
    }

    update_post_meta((int) $id, '_river_source_filename', $filename);
    if ($alt !== '') {
        update_post_meta((int) $id, '_wp_attachment_image_alt', $alt);
    }

    return (int) $id;
}

function river_fill_set(&$data, $name, $field_key, $value)
{
    $data[$name] = $value;
    $data['_' . $name] = $field_key;
}

function river_fill_media(&$data, $name, $field_key, $filename, $alt)
{
    river_fill_set($data, $name, $field_key, river_fill_media_id($filename, $alt));
}

function river_fill_group(&$data, $name, $field_key, $fields)
{
    $data['_' . $name] = $field_key;
    foreach ($fields as $field) {
        river_fill_set($data, $name . '_' . $field['name'], $field['key'], $field['value']);
    }
}

function river_fill_repeater(&$data, $name, $field_key, $rows, $fields)
{
    river_fill_set($data, $name, $field_key, count($rows));

    foreach (array_values($rows) as $index => $row) {
        foreach ($fields as $field) {
            $child_name = $field['name'];
            $value = $row[$child_name] ?? '';
            if (($field['type'] ?? '') === 'media') {
                $value = river_fill_media_id($value['filename'] ?? '', $value['alt'] ?? '');
            }
            river_fill_set($data, $name . '_' . $index . '_' . $child_name, $field['key'], $value);
        }
    }
}

function river_fill_home_block_data($block_name)
{
    $data = [];

    switch ($block_name) {
        case 'acf/river-site-nav':
            river_fill_media($data, 'logo', 'field_river_site_nav_logo', 'novilogowhite.png', 'Konoba Pizzeria River logo');
            river_fill_repeater($data, 'items', 'field_river_site_nav_items', [
                ['label' => 'HOME', 'href' => '#home'],
                ['label' => 'RESERVATIONS', 'href' => '#info-container'],
                ['label' => 'MENU', 'href' => '/menu'],
                ['label' => 'GALLERY', 'href' => '#galery'],
                ['label' => 'CONTACT', 'href' => '#footer'],
            ], [
                ['name' => 'label', 'key' => 'field_river_site_nav_item_label'],
                ['name' => 'href', 'key' => 'field_river_site_nav_item_href'],
            ]);
            river_fill_group($data, 'cta', 'field_river_site_nav_cta', [
                ['name' => 'label', 'key' => 'field_river_site_nav_cta_item_label', 'value' => 'BOOK A TABLE'],
                ['name' => 'href', 'key' => 'field_river_site_nav_cta_item_href', 'value' => '#info-container'],
            ]);
            return $data;

        case 'acf/river-home-hero':
            river_fill_set($data, 'eyebrow', 'field_river_home_hero_eyebrow', 'Welcome to Our Restaurant');
            river_fill_set($data, 'title', 'field_river_home_hero_title', 'Konoba-pizzeria River');
            river_fill_set($data, 'body', 'field_river_home_hero_body', 'Mediterenian food');
            river_fill_repeater($data, 'slides', 'field_river_home_hero_slides', [
                ['image' => ['filename' => 'interior.jpeg', 'alt' => 'River restaurant interior']],
                ['image' => ['filename' => 'exterior.jpeg', 'alt' => 'River restaurant exterior']],
            ], [
                ['name' => 'image', 'key' => 'field_river_home_hero_slide_image', 'type' => 'media'],
            ]);
            return $data;

        case 'acf/river-category-recap':
            river_fill_set($data, 'heading', 'field_river_category_recap_heading', 'Menus');
            river_fill_repeater($data, 'items', 'field_river_category_recap_items', [
                ['title' => 'APPETIZERS', 'body' => '', 'href' => '/menu', 'image' => ['filename' => 'appetizers.png', 'alt' => 'Appetizers icon']],
                ['title' => 'MAIN MEALS', 'body' => '', 'href' => '/menu', 'image' => ['filename' => 'burgersvg.svg', 'alt' => 'Main meals icon']],
                ['title' => 'DESERTS', 'body' => '', 'href' => '/menu', 'image' => ['filename' => 'deserts.png', 'alt' => 'Desserts icon']],
                ['title' => 'DRINKS', 'body' => '', 'href' => '/drinks', 'image' => ['filename' => 'drinks.png', 'alt' => 'Drinks icon']],
            ], [
                ['name' => 'title', 'key' => 'field_river_category_recap_item_title'],
                ['name' => 'body', 'key' => 'field_river_category_recap_item_body'],
                ['name' => 'href', 'key' => 'field_river_category_recap_item_href'],
                ['name' => 'image', 'key' => 'field_river_category_recap_item_image', 'type' => 'media'],
            ]);
            river_fill_group($data, 'cta', 'field_river_category_recap_cta', [
                ['name' => 'label', 'key' => 'field_river_category_recap_cta_label', 'value' => 'MENU'],
                ['name' => 'href', 'key' => 'field_river_category_recap_cta_href', 'value' => '/menu'],
            ]);
            return $data;

        case 'acf/river-info-cards':
            river_fill_set($data, 'heading', 'field_river_info_cards_heading', 'Restaurant Info');
            river_fill_repeater($data, 'cards', 'field_river_info_cards_cards', [
                ['title' => 'Working Hours', 'text' => 'Mon - Sun: 10:00 - 24:00', 'href' => 'tel:+385 021 260 081', 'label' => 'CONTACT US'],
                ['title' => 'Need a table?', 'text' => '+385 021 260 081', 'href' => 'tel:+385 021 260 081', 'label' => 'BOOK A TABLE'],
            ], [
                ['name' => 'title', 'key' => 'field_river_info_cards_card_title'],
                ['name' => 'text', 'key' => 'field_river_info_cards_card_text'],
                ['name' => 'href', 'key' => 'field_river_info_cards_card_href'],
                ['name' => 'label', 'key' => 'field_river_info_cards_card_label'],
            ]);
            return $data;

        case 'acf/river-contact-location':
            river_fill_media($data, 'icon', 'field_river_contact_location_icon', 'pin.svg', 'Location pin icon');
            river_fill_set($data, 'heading', 'field_river_contact_location_heading', 'OUR LOCATION');
            river_fill_set($data, 'body', 'field_river_contact_location_body', 'River is located at Ul. kralja Zvonimira 46, 21210, Solin.');
            river_fill_set($data, 'address', 'field_river_contact_location_address', 'Ul. kralja Zvonimira 46, 21210, Solin');
            river_fill_set($data, 'phone', 'field_river_contact_location_phone', '+385 021 260 081');
            river_fill_set($data, 'email', 'field_river_contact_location_email', 'antetopic355@gmail.com');
            river_fill_repeater($data, 'ctas', 'field_river_contact_location_ctas', [
                ['label' => 'GOOGLE MAPS', 'href' => 'https://www.google.com/maps/place/River+Pizzeria+Konoba/@43.5357525,16.4867657,17z/data=!3m1!4b1!4m6!3m5!1s0x13355f00736d972f:0x289bc0cd2af01b9b!8m2!3d43.5357525!4d16.489346!16s%2Fg%2F11b7q555_6?entry=ttu'],
            ], [
                ['name' => 'label', 'key' => 'field_river_contact_location_cta_label'],
                ['name' => 'href', 'key' => 'field_river_contact_location_cta_href'],
            ]);
            return $data;

        case 'acf/river-story':
            river_fill_set($data, 'eyebrow', 'field_river_story_eyebrow', 'Discover');
            river_fill_set($data, 'heading', 'field_river_story_heading', 'OUR STORY');
            river_fill_set($data, 'body', 'field_river_story_body', 'Nestled in the picturesque small town of Solin, near the vibrant city of Split, a hidden gem awaits along the serene banks of River Jadro. This charming restaurant, simply known as "River" holds the key to an unforgettable culinary experience. With a dedication to Mediterranean cuisine, every dish is carefully prepared using the freshest ingredients sourced from local farmers and markets ensuring an authentic taste of the region.');
            river_fill_repeater($data, 'images', 'field_river_story_images', [
                ['image' => ['filename' => 'oven.jpeg', 'alt' => 'River pizza oven']],
                ['image' => ['filename' => 'oven2.jpeg', 'alt' => 'River pizza oven']],
            ], [
                ['name' => 'image', 'key' => 'field_river_story_image_image', 'type' => 'media'],
            ]);
            return $data;

        case 'acf/river-section-heading':
            river_fill_set($data, 'eyebrow', 'field_river_section_heading_eyebrow', 'Our');
            river_fill_set($data, 'heading', 'field_river_section_heading_heading', 'Dishes');
            river_fill_set($data, 'body', 'field_river_section_heading_body', '');
            return $data;

        case 'acf/river-gallery':
            river_fill_set($data, 'heading', 'field_river_gallery_heading', 'Gallery');
            river_fill_repeater($data, 'images', 'field_river_gallery_images', [
                ['image' => ['filename' => 'food2.jpeg', 'alt' => 'River dish 1']],
                ['image' => ['filename' => 'food3.jpeg', 'alt' => 'River dish 2']],
                ['image' => ['filename' => 'food8.jpeg', 'alt' => 'River dish 3']],
                ['image' => ['filename' => 'food5.jpeg', 'alt' => 'River dish 4']],
                ['image' => ['filename' => 'food9.jpeg', 'alt' => 'River dish 5']],
                ['image' => ['filename' => 'pizza.jpeg', 'alt' => 'River pizza']],
            ], [
                ['name' => 'image', 'key' => 'field_river_gallery_image_image', 'type' => 'media'],
            ]);
            return $data;

        case 'acf/river-map':
            river_fill_set($data, 'title', 'field_river_map_title', 'Find River');
            river_fill_set($data, 'address', 'field_river_map_address', 'Ul. kralja Zvonimira 46, 21210, Solin');
            river_fill_set($data, 'embedUrl', 'field_river_map_embed_url', 'https://www.google.com/maps?q=Ul.%20kralja%20Zvonimira%2046%2C%2021210%2C%20Solin&output=embed');
            return $data;

        case 'acf/river-site-footer':
            river_fill_media($data, 'logo', 'field_river_footer_logo', 'novilogowhite.png', 'Konoba Pizzeria River logo');
            river_fill_set($data, 'address', 'field_river_footer_address', 'Ul. kralja Zvonimira 46, 21210, Solin');
            river_fill_set($data, 'phone', 'field_river_footer_phone', '+385 021 260 081');
            river_fill_set($data, 'email', 'field_river_footer_email', 'antetopic355@gmail.com');
            river_fill_repeater($data, 'hours', 'field_river_footer_hours', [
                ['label' => 'Mon - Fri', 'value' => '10:00 - 24:00'],
                ['label' => 'Sat', 'value' => '10:00 - 24:00'],
                ['label' => 'Sun', 'value' => '10:00 - 24:00'],
            ], [
                ['name' => 'label', 'key' => 'field_river_footer_hour_label'],
                ['name' => 'value', 'key' => 'field_river_footer_hour_value'],
            ]);
            river_fill_repeater($data, 'socialLinks', 'field_river_footer_social', [
                ['label' => 'Facebook', 'href' => 'https://www.facebook.com/p/Konoba-Pizzeria-River-100054423162174/'],
                ['label' => 'Instagram', 'href' => 'https://www.instagram.com/river_pizzeria_restoran/'],
                ['label' => 'Tripadvisor', 'href' => 'https://www.tripadvisor.com/Restaurant_Review-g1203167-d3410911-Reviews-Konoba_Pizzeria_River-Solin_Split_Dalmatia_County_Dalmatia.html'],
                ['label' => 'Email', 'href' => 'mailto:antetopic355@gmail.com'],
            ], [
                ['name' => 'label', 'key' => 'field_river_footer_social_link_label'],
                ['name' => 'href', 'key' => 'field_river_footer_social_link_href'],
            ]);
            river_fill_repeater($data, 'supportLogos', 'field_river_footer_support_logos', [
                ['image' => ['filename' => 'esif.jpg', 'alt' => 'ESIF support logo']],
                ['image' => ['filename' => 'eu.jpg', 'alt' => 'European Union support logo']],
                ['image' => ['filename' => 'hamag.jpg', 'alt' => 'HAMAG support logo']],
            ], [
                ['name' => 'image', 'key' => 'field_river_footer_support_logo_image', 'type' => 'media'],
            ]);
            return $data;
    }

    return null;
}

$page = get_page_by_path('home', OBJECT, 'page');
if (!$page) {
    WP_CLI::error('Home page not found.');
}

$changed = false;
$blocks = parse_blocks($page->post_content);
foreach ($blocks as &$block) {
    if (empty($block['blockName']) || strpos((string) $block['blockName'], RIVER_BLOCK_PREFIX) !== 0) {
        continue;
    }

    $next = river_fill_home_block_data(str_replace('_', '-', (string) $block['blockName']));
    if ($next === null) {
        continue;
    }

    $current = isset($block['attrs']['data']) && is_array($block['attrs']['data']) ? $block['attrs']['data'] : [];
    if ($next !== $current) {
        $block['attrs']['data'] = $next;
        $changed = true;
    }
}

unset($block);

if (!$changed) {
    WP_CLI::success('Home blocks already contain ACF-native content values.');
    return;
}

$result = wp_update_post([
    'ID' => (int) $page->ID,
    'post_content' => wp_slash(serialize_blocks($blocks)),
], true);

if (is_wp_error($result)) {
    WP_CLI::error($result->get_error_message());
}

WP_CLI::success('Filled Home block content values and imported media assets.');
