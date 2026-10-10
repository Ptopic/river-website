<?php
/**
 * WP-CLI script placeholder for importing River fixture pages into WordPress.
 *
 * Usage after WordPress is running:
 *   wp eval-file wordpress/bin/seed-river-content.php
 */

if (!defined('ABSPATH')) {
    fwrite(STDERR, "Run through WP-CLI inside WordPress.\n");
    exit(1);
}

$pages = [
    'home' => 'Konoba Pizzeria River',
    'vine' => 'Vine',
    'drinks' => 'Drinks',
    'pizza' => 'Pizza',
];

foreach ($pages as $slug => $title) {
    $existing = get_page_by_path($slug, OBJECT, 'page');
    if ($existing) {
        WP_CLI::log("Exists: {$slug}");
        continue;
    }

    $id = wp_insert_post([
        'post_type' => 'page',
        'post_status' => 'publish',
        'post_name' => $slug,
        'post_title' => $title,
    ], true);

    if (is_wp_error($id)) {
        WP_CLI::warning($id->get_error_message());
    } else {
        WP_CLI::success("Created {$slug}");
    }
}

WP_CLI::log('Add section rows in ACF or extend this script to import tmp-river-fixture-export.json.');
