<?php
/**
 * Plugin Name: River Headless Hardening
 * Description: Small defaults for a headless WordPress instance.
 */

if (!defined('ABSPATH')) {
    exit;
}

add_filter('xmlrpc_enabled', '__return_false');
remove_action('wp_head', 'wp_generator');

add_filter('upload_mimes', function ($mimes) {
    $mimes['svg'] = 'image/svg+xml';
    return $mimes;
});

add_filter('rest_endpoints', function ($endpoints) {
    if (!is_user_logged_in()) {
        unset($endpoints['/wp/v2/users']);
        unset($endpoints['/wp/v2/users/(?P<id>[\d]+)']);
    }
    return $endpoints;
});
