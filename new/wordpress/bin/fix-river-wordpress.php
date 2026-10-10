<?php
/**
 * Fix the River WordPress content model:
 * - one public page, `home`, containing the home section blocks
 * - menu content stored as River Menu items + Menu Sections taxonomy
 *
 * Usage:
 *   wp eval-file wordpress/bin/fix-river-wordpress.php
 */

if (!defined('ABSPATH')) {
    fwrite(STDERR, "Run through WP-CLI inside WordPress.\n");
    exit(1);
}

if (!defined('RIVER_MENU_ITEM_POST_TYPE') || !defined('RIVER_MENU_SECTION_TAXONOMY')) {
    fwrite(STDERR, "River menu plugin is not loaded.\n");
    exit(1);
}

$seed_path = getenv('RIVER_MENU_SEED') ?: (__DIR__ . '/../data/menu-groups.json');
$seed = json_decode(file_get_contents($seed_path), true);
if (!is_array($seed) || !isset($seed['groups']) || !is_array($seed['groups'])) {
    fwrite(STDERR, "Invalid menu seed at {$seed_path}.\n");
    exit(1);
}

function river_seed_json($value)
{
    return wp_json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

function river_seed_acf_block($name, array $data = [])
{
    $block_name = 'acf/river-' . str_replace('_', '-', $name);
    return '<!-- wp:' . $block_name . ' ' . river_seed_json([
        'name' => $block_name,
        'data' => $data,
        'mode' => 'preview',
    ]) . ' /-->';
}

function river_seed_asset($name, $alt = '')
{
    return [
        'src' => '/legacy-assets/' . $name,
        'alt' => $alt,
    ];
}

function river_seed_home_content()
{
    $story = 'Nestled in the picturesque small town of Solin, near the vibrant city of Split, a hidden gem awaits along the serene banks of River Jadro. This charming restaurant, simply known as "River" holds the key to an unforgettable culinary experience. With a dedication to Mediterranean cuisine, every dish is carefully prepared using the freshest ingredients sourced from local farmers and markets ensuring an authentic taste of the region.';

    $blocks = [
        river_seed_acf_block('site_nav', [
            'logo' => river_seed_asset('novilogowhite.png', 'Konoba Pizzeria River logo'),
            'items' => [
                ['label' => 'HOME', 'href' => '#home'],
                ['label' => 'RESERVATIONS', 'href' => '#info-container'],
                ['label' => 'GALLERY', 'href' => '#galery'],
                ['label' => 'CONTACT', 'href' => '#footer'],
            ],
            'cta' => ['label' => 'BOOK A TABLE', 'href' => '#info-container'],
        ]),
        river_seed_acf_block('home_hero', [
            'eyebrow' => 'Welcome to Our Restaurant',
            'title' => 'Konoba-pizzeria River',
            'body' => 'Mediterenian food',
            'slides' => [
                river_seed_asset('interior.jpeg', 'River restaurant interior'),
                river_seed_asset('exterior.jpeg', 'River restaurant exterior'),
            ],
        ]),
        river_seed_acf_block('category_recap', [
            'heading' => 'Menus',
            'items' => [
                ['title' => 'APPETIZERS', 'body' => '', 'href' => '/menu', 'src' => '/legacy-assets/appetizers.png', 'alt' => 'Appetizers icon'],
                ['title' => 'MAIN MEALS', 'body' => '', 'href' => '/menu', 'src' => '/legacy-assets/burgersvg.svg', 'alt' => 'Main meals icon'],
                ['title' => 'DESERTS', 'body' => '', 'href' => '/menu', 'src' => '/legacy-assets/deserts.png', 'alt' => 'Desserts icon'],
                ['title' => 'DRINKS', 'body' => '', 'href' => '/drinks', 'src' => '/legacy-assets/drinks.png', 'alt' => 'Drinks icon'],
            ],
        ]),
        river_seed_acf_block('info_cards', [
            'heading' => 'Restaurant Info',
            'cards' => [
                ['title' => 'Working Hours', 'text' => 'Mon - Sun: 10:00 - 24:00', 'href' => 'tel:+385 021 260 081', 'label' => 'CONTACT US'],
                ['title' => 'Need a table?', 'text' => '+385 021 260 081', 'href' => 'tel:+385 021 260 081', 'label' => 'BOOK A TABLE'],
            ],
        ]),
        river_seed_acf_block('contact_location', [
            'icon' => river_seed_asset('pin.svg', 'Location pin icon'),
            'heading' => 'OUR LOCATION',
            'body' => 'River is located at Ul. kralja Zvonimira 46, 21210, Solin.',
            'address' => 'Ul. kralja Zvonimira 46, 21210, Solin',
            'phone' => '+385 021 260 081',
            'email' => 'antetopic355@gmail.com',
            'ctas' => [
                ['label' => 'GOOGLE MAPS', 'href' => 'https://www.google.com/maps/place/River+Pizzeria+Konoba/@43.5357525,16.4867657,17z/data=!3m1!4b1!4m6!3m5!1s0x13355f00736d972f:0x289bc0cd2af01b9b!8m2!3d43.5357525!4d16.489346!16s%2Fg%2F11b7q555_6?entry=ttu'],
            ],
        ]),
        river_seed_acf_block('story', [
            'eyebrow' => 'Discover',
            'heading' => 'OUR STORY',
            'body' => $story,
            'images' => [
                river_seed_asset('oven.jpeg', 'River pizza oven'),
                river_seed_asset('oven2.jpeg', 'River pizza oven'),
            ],
        ]),
        river_seed_acf_block('section_heading', [
            'eyebrow' => 'Our',
            'heading' => 'Dishes',
        ]),
        river_seed_acf_block('gallery', [
            'heading' => 'Gallery',
            'images' => [
                river_seed_asset('food2.jpeg', 'River dish 1'),
                river_seed_asset('food3.jpeg', 'River dish 2'),
                river_seed_asset('food8.jpeg', 'River dish 3'),
                river_seed_asset('food5.jpeg', 'River dish 4'),
                river_seed_asset('food9.jpeg', 'River dish 5'),
                river_seed_asset('pizza.jpeg', 'River pizza'),
            ],
        ]),
        river_seed_acf_block('map', [
            'title' => 'Find River',
            'address' => 'Ul. kralja Zvonimira 46, 21210, Solin',
            'embedUrl' => 'https://www.google.com/maps?q=Ul.%20kralja%20Zvonimira%2046%2C%2021210%2C%20Solin&output=embed',
        ]),
        river_seed_acf_block('site_footer', [
            'logo' => river_seed_asset('novilogowhite.png', 'Konoba Pizzeria River logo'),
            'address' => 'Ul. kralja Zvonimira 46, 21210, Solin',
            'phone' => '+385 021 260 081',
            'email' => 'antetopic355@gmail.com',
            'hours' => [
                ['label' => 'Mon - Fri', 'value' => '10:00 - 24:00'],
                ['label' => 'Sat', 'value' => '10:00 - 24:00'],
                ['label' => 'Sun', 'value' => '10:00 - 24:00'],
            ],
            'socialLinks' => [
                ['label' => 'Facebook', 'href' => 'https://www.facebook.com/p/Konoba-Pizzeria-River-100054423162174/'],
                ['label' => 'Instagram', 'href' => 'https://www.instagram.com/river_pizzeria_restoran/'],
                ['label' => 'Tripadvisor', 'href' => 'https://www.tripadvisor.com/Restaurant_Review-g1203167-d3410911-Reviews-Konoba_Pizzeria_River-Solin_Split_Dalmatia_County_Dalmatia.html'],
                ['label' => 'Email', 'href' => 'mailto:antetopic355@gmail.com'],
            ],
            'supportLogos' => [
                river_seed_asset('esif.jpg', 'ESIF support logo'),
                river_seed_asset('eu.jpg', 'European Union support logo'),
                river_seed_asset('hamag.jpg', 'HAMAG support logo'),
            ],
        ]),
    ];

    return implode("\n\n", $blocks);
}

$home = get_page_by_path('home', OBJECT, 'page');
$home_id = $home ? (int) $home->ID : 0;
$home_args = [
    'post_type' => 'page',
    'post_status' => 'publish',
    'post_name' => 'home',
    'post_title' => 'Konoba Pizzeria River',
    'post_content' => wp_slash(river_seed_home_content()),
];

if ($home_id) {
    $home_args['ID'] = $home_id;
    $result = wp_update_post($home_args, true);
} else {
    $result = wp_insert_post($home_args, true);
}

if (is_wp_error($result)) {
    WP_CLI::error($result->get_error_message());
}
$home_id = (int) $result;
update_post_meta($home_id, 'seo_title', 'Konoba Pizzeria River | Solin');
update_post_meta($home_id, 'seo_description', 'Konoba Pizzeria River in Solin.');
update_option('show_on_front', 'page');
update_option('page_on_front', $home_id);
WP_CLI::success("Ensured home page id={$home_id}.");

$pages = get_posts([
    'post_type' => 'page',
    'post_status' => ['publish', 'draft', 'private', 'pending', 'future'],
    'posts_per_page' => -1,
    'post__not_in' => [$home_id],
]);
foreach ($pages as $page) {
    wp_delete_post((int) $page->ID, true);
    WP_CLI::log("Deleted page {$page->post_name}.");
}

function river_seed_term($name, $slug, $parent, $order, $label_hr, $label_en)
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
            WP_CLI::error($created->get_error_message());
        }
        $term_id = (int) $created['term_id'];
    }

    update_term_meta($term_id, '_river_order', $order);
    update_term_meta($term_id, '_river_label_hr', $label_hr);
    update_term_meta($term_id, '_river_label_en', $label_en);
    return $term_id;
}

function river_seed_group_labels($group_slug, $fallback_title, $fallback_en)
{
    $labels = [
        'menu' => ['Food', 'Hrana', 'Food'],
        'drinks' => ['Drinks', 'Piće', 'Drinks'],
        'pizza' => ['Pizza', 'Pizza', 'Pizza'],
        'wine' => ['Wine', 'Vino', 'Wine'],
    ];

    return $labels[$group_slug] ?? [$fallback_title, $fallback_title, $fallback_en];
}

function river_seed_anchor_date($value)
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

foreach ($seed['groups'] as $group_index => $group) {
    $group_slug = sanitize_title((string) $group['slug']);
    $group_title = (string) $group['title'];
    $hr_categories = $group['languages'][0]['categories'] ?? [];
    $en_categories = $group['languages'][1]['categories'] ?? [];
    [$admin_label, $label_hr, $label_en] = river_seed_group_labels($group_slug, $group_title, (string) ($group['languages'][1]['label'] ?? $group_title));
    $group_id = river_seed_term($admin_label, $group_slug, 0, $group_index, $label_hr, $label_en);

    foreach ($hr_categories as $category_index => $category) {
        $en_category = $en_categories[$category_index] ?? [];
        $category_slug = $group_slug . '-' . sanitize_title((string) $category['title']);
        $category_id = river_seed_term(
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
            $existing = get_page_by_path($slug, OBJECT, RIVER_MENU_ITEM_POST_TYPE);
            $post_args = [
                'post_type' => RIVER_MENU_ITEM_POST_TYPE,
                'post_status' => 'publish',
                'post_name' => $slug,
                'post_title' => (string) $item['name'],
                'menu_order' => $item_index,
            ];

            if ($existing) {
                $post_args['ID'] = (int) $existing->ID;
                $post_id = wp_update_post($post_args, true);
            } else {
                $post_id = wp_insert_post($post_args, true);
            }

            if (is_wp_error($post_id)) {
                WP_CLI::error($post_id->get_error_message());
            }

            update_post_meta($post_id, '_river_name_hr', (string) ($item['name'] ?? ''));
            update_post_meta($post_id, '_river_name_en', (string) ($en_item['name'] ?? $item['name'] ?? ''));
            update_post_meta($post_id, '_river_description_hr', (string) ($item['description'] ?? ''));
            update_post_meta($post_id, '_river_description_en', (string) ($en_item['description'] ?? $item['description'] ?? ''));
            update_post_meta($post_id, '_river_quantity_hr', (string) ($item['quantity'] ?? ''));
            update_post_meta($post_id, '_river_quantity_en', (string) ($en_item['quantity'] ?? $item['quantity'] ?? ''));
            update_post_meta($post_id, '_river_price_eur', (string) ($item['priceEur'] ?? ''));
            update_post_meta($post_id, '_river_anchor_price_eur', (string) ($item['anchorPriceEur'] ?? $item['priceEur'] ?? ''));
            update_post_meta($post_id, '_river_anchor_price_date', river_seed_anchor_date((string) ($item['anchorPriceDate'] ?? '2026-09-10')));
            update_post_meta($post_id, '_river_jumbo_price_eur', (string) ($item['jumboPriceEur'] ?? ''));
            update_post_meta($post_id, '_river_jumbo_anchor_price_eur', (string) ($item['jumboAnchorPriceEur'] ?? $item['jumboPriceEur'] ?? ''));
            update_post_meta($post_id, '_river_jumbo_anchor_price_date', river_seed_anchor_date((string) ($item['jumboAnchorPriceDate'] ?? (isset($item['jumboPriceEur']) ? '2026-09-10' : ''))));
            wp_set_object_terms($post_id, [$category_id], RIVER_MENU_SECTION_TAXONOMY, false);
        }
    }
}

WP_CLI::success('Seeded River menu groups, sections, and items.');
