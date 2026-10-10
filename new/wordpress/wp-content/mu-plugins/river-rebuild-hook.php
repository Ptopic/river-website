<?php
/**
 * Plugin Name: River Netlify Rebuild Hook
 * Description: Triggers a debounced Netlify build when watched WordPress content changes.
 */

if (!defined('ABSPATH')) {
    exit;
}

function river_rebuild_watched_post_types()
{
    return ['page', 'attachment'];
}

function river_rebuild_hook_url()
{
    if (defined('RIVER_NETLIFY_BUILD_HOOK_URL')) {
        return (string) RIVER_NETLIFY_BUILD_HOOK_URL;
    }

    return (string) getenv('RIVER_NETLIFY_BUILD_HOOK_URL');
}

add_action('save_post', function ($post_id, $post, $update) {
    if (wp_is_post_revision($post_id) || !$post || !in_array($post->post_type, river_rebuild_watched_post_types(), true)) {
        return;
    }

    river_trigger_netlify_rebuild('save_post_' . $post->post_type);
}, 20, 3);

add_action('add_attachment', function () {
    river_trigger_netlify_rebuild('add_attachment');
});

function river_trigger_netlify_rebuild($reason)
{
    if (defined('RIVER_REBUILD_DISABLE') && RIVER_REBUILD_DISABLE) {
        return;
    }

    $hook = river_rebuild_hook_url();
    if ($hook === '') {
        return;
    }

    if (get_transient('river_netlify_rebuild_debounce')) {
        return;
    }
    set_transient('river_netlify_rebuild_debounce', 1, 90);

    wp_remote_post($hook, [
        'timeout' => 10,
        'headers' => ['Content-Type' => 'application/json'],
        'body' => wp_json_encode([
            'trigger_title' => 'River WordPress content update',
            'reason' => $reason,
            'site' => home_url(),
        ]),
    ]);
}
