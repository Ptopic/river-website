<?php
/**
 * WP-CLI media seed placeholder.
 *
 * The current Astro fixture references `/legacy-assets/*` until River decides
 * which files should become canonical WordPress media. Use this script as the
 * place to sideload selected images and update page sections during the final
 * content migration pass.
 */

if (!defined('ABSPATH')) {
    fwrite(STDERR, "Run through WP-CLI inside WordPress.\n");
    exit(1);
}

WP_CLI::log('Media seed is intentionally pending an asset ownership decision.');
