<?php
/**
 * Plugin Name: River ACF JSON Loader
 * Description: Loads committed River ACF JSON field groups from the migration repo.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_filter('acf/settings/load_json', function ($paths) {
    $paths[] = __DIR__ . '/acf-json';
    return $paths;
});

add_filter('acf/settings/save_json', function () {
    return __DIR__ . '/acf-json';
});

add_action('enqueue_block_editor_assets', function () {
    wp_enqueue_style(
        'river-block-editor',
        plugins_url('assets/river-block-editor.css', __FILE__),
        [],
        filemtime(__DIR__ . '/assets/river-block-editor.css')
    );
});
