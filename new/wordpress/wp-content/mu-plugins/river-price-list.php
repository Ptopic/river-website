<?php
/**
 * Plugin Name: River Croatian Price List
 * Description: Publishes versioned, public CSV price lists from the River menu.
 */

if (!defined('ABSPATH')) {
    exit;
}

const RIVER_PRICE_LIST_OPTION = 'river_price_list_settings';
const RIVER_PRICE_LIST_STATUS_OPTION = 'river_price_list_status';

function river_price_list_settings()
{
    return array_merge([
        'business_type' => 'ugostiteljski_objekt',
        'address' => 'Ul. kralja Zvonimira 46, 21210 Solin',
        'premises_id' => '',
    ], (array) get_option(RIVER_PRICE_LIST_OPTION, []));
}

function river_price_list_directory()
{
    $uploads = wp_upload_dir();
    if (!empty($uploads['error'])) {
        throw new RuntimeException('Uploads nisu dostupni: ' . $uploads['error']);
    }
    return trailingslashit($uploads['basedir']) . 'river-cjenik';
}

function river_price_list_index($directory)
{
    $path = $directory . '/index.json';
    if (!is_file($path)) {
        return ['sequence' => 0, 'versions' => []];
    }
    $index = json_decode((string) file_get_contents($path), true);
    if (!is_array($index) || !isset($index['sequence'], $index['versions']) || !is_array($index['versions'])) {
        throw new RuntimeException('Arhivski indeks cjenika nije valjan.');
    }
    return $index;
}

function river_price_list_atomic_write($path, $contents)
{
    $temporary = tempnam(dirname($path), '.river-cjenik-');
    if ($temporary === false) {
        throw new RuntimeException('Privremena datoteka cjenika nije dostupna.');
    }
    try {
        if (file_put_contents($temporary, $contents) !== strlen($contents) || !rename($temporary, $path)) {
            throw new RuntimeException('Cjenik nije moguće sigurno pohraniti.');
        }
    } finally {
        if (is_file($temporary)) {
            unlink($temporary);
        }
    }
}

function river_price_list_money($value, $context)
{
    $value = trim((string) $value);
    if (!preg_match('/^(?:0|[1-9][0-9]{0,8})(?:\.[0-9]{1,2})?$/D', $value)) {
        throw new RuntimeException($context . ': cijena mora biti nenegativan broj s najviše dvije decimale.');
    }
    return number_format((float) $value, 2, '.', '');
}

function river_price_list_rows($items)
{
    $rows = [];
    foreach ($items as $item) {
        $context = 'Stavka #' . $item['id'];
        $name = trim((string) $item['name']);
        $quantity = trim((string) $item['quantity']);
        if ($name === '' || preg_match('/[\r\n]/', $name . $quantity) || preg_match('/^[=+@\-]/', $name)) {
            throw new RuntimeException($context . ': naziv na hrvatskom jeziku nije valjan.');
        }
        if (!in_array($item['group'], river_menu_group_slugs(), true)) {
            throw new RuntimeException($context . ': stavka mora pripadati jednoj skupini jelovnika.');
        }
        $promoted = $item['promo_active'] === '1';
        $promotion = trim((string) $item['promo_name']);
        if ($promoted && ($promotion === '' || preg_match('/[\r\n]/', $promotion) || preg_match('/^[=+@\-]/', $promotion))) {
            throw new RuntimeException($context . ': unesite hrvatski naziv posebnog oblika prodaje.');
        }
        $variants = [[
            'label' => $item['group'] === 'pizza' ? 'Velika' : '',
            'price' => $item['price'],
            'anchor' => $item['anchor'],
        ]];
        if (trim((string) $item['jumbo_price']) !== '') {
            if ($item['group'] !== 'pizza') {
                throw new RuntimeException($context . ': Jumbo cijena dopuštena je samo za pizzu.');
            }
            $variants[] = ['label' => 'Jumbo', 'price' => $item['jumbo_price'], 'anchor' => $item['jumbo_anchor']];
        } elseif (trim((string) $item['jumbo_anchor']) !== '') {
            throw new RuntimeException($context . ': Jumbo sidrena cijena nema odgovarajuću prodajnu cijenu.');
        }
        foreach ($variants as $variant) {
            $variant_name = $name;
            if ($quantity !== '') {
                $variant_name .= ' (' . $quantity . ')';
            }
            if ($variant['label'] !== '') {
                $variant_name .= ' - ' . $variant['label'];
            }
            $price = river_price_list_money($variant['price'], $context . ' ' . $variant['label']);
            $anchor = river_price_list_money($variant['anchor'], $context . ' sidrena cijena');
            $rows[] = [$variant_name, $price, $promoted ? 'DA' : 'NE', $promoted ? $promotion : '', $anchor];
        }
    }
    if (!$rows) {
        throw new RuntimeException('Nema objavljenih stavki za cjenik.');
    }
    return $rows;
}

function river_price_list_csv($rows)
{
    $stream = fopen('php://temp', 'w+');
    if ($stream === false) {
        throw new RuntimeException('CSV nije moguće pripremiti.');
    }
    fputcsv($stream, ['naziv_usluge', 'maloprodajna_cijena', 'posebni_oblik_prodaje', 'naziv_posebnog_oblika', 'sidrena_cijena'], ',', '"', '');
    foreach ($rows as $row) {
        fputcsv($stream, $row, ',', '"', '');
    }
    rewind($stream);
    $csv = stream_get_contents($stream);
    fclose($stream);
    return $csv;
}

function river_price_list_items()
{
    $posts = get_posts([
        'post_type' => RIVER_MENU_ITEM_POST_TYPE,
        'post_status' => 'publish',
        'posts_per_page' => -1,
        'orderby' => ['menu_order' => 'ASC', 'title' => 'ASC'],
    ]);
    $items = [];
    foreach ($posts as $post) {
        $terms = get_the_terms($post->ID, RIVER_MENU_SECTION_TAXONOMY);
        if (is_wp_error($terms)) {
            throw new RuntimeException('Nije moguće učitati kategorije stavke #' . $post->ID . '.');
        }
        $terms = $terms ?: [];
        $groups = [];
        foreach ($terms as $term) {
            $parent = $term->parent ? get_term($term->parent, RIVER_MENU_SECTION_TAXONOMY) : null;
            if ($parent && !is_wp_error($parent) && in_array($parent->slug, river_menu_group_slugs(), true)) {
                $groups[$parent->slug] = true;
            }
        }
        $meta = static function ($key) use ($post) { return (string) get_post_meta($post->ID, $key, true); };
        $items[] = [
            'id' => $post->ID,
            'group' => count($groups) === 1 ? array_key_first($groups) : '',
            'name' => $meta('_river_name_hr'),
            'quantity' => $meta('_river_quantity_hr'),
            'price' => $meta('_river_price_eur'),
            'anchor' => $meta('_river_anchor_price_eur'),
            'jumbo_price' => $meta('_river_jumbo_price_eur'),
            'jumbo_anchor' => $meta('_river_jumbo_anchor_price_eur'),
            'promo_active' => $meta('_river_promo_active'),
            'promo_name' => $meta('_river_promo_name_hr'),
        ];
    }
    return $items;
}

function river_price_list_prune($directory, &$index)
{
    $latest = $index['versions'][0]['filename'] ?? '';
    $cutoff = time() - 30 * DAY_IN_SECONDS;
    $retained = [];
    foreach ($index['versions'] as $version) {
        $filename = $version['filename'] ?? '';
        if (!river_price_list_valid_filename($filename)) {
            continue;
        }
        if ($filename !== $latest && (int) ($version['timestamp'] ?? 0) < $cutoff) {
            @unlink($directory . '/' . $filename);
            continue;
        }
        if (is_file($directory . '/' . $filename)) {
            $retained[] = $version;
        }
    }
    $index['versions'] = $retained;
}

function river_price_list_valid_filename($filename)
{
    return is_string($filename) && (bool) preg_match('/^[a-z0-9_-]+(?:-[a-z0-9_-]+)*\.csv$/D', $filename);
}

function river_price_list_publish()
{
    try {
        $directory = river_price_list_directory();
        if (!is_dir($directory) && !wp_mkdir_p($directory)) {
            throw new RuntimeException('Arhivski direktorij cjenika nije moguće izraditi.');
        }
        $lock = fopen($directory . '/publish.lock', 'c');
        if ($lock === false || !flock($lock, LOCK_EX)) {
            throw new RuntimeException('Cjenik je trenutno zaključan za objavu.');
        }
        try {
            $settings = river_price_list_settings();
            foreach (['business_type', 'address', 'premises_id'] as $key) {
                if (trim((string) $settings[$key]) === '') {
                    throw new RuntimeException('Postavka ' . $key . ' mora biti popunjena prije objave.');
                }
            }
            $csv = river_price_list_csv(river_price_list_rows(river_price_list_items()));
            $index = river_price_list_index($directory);
            $latest = $index['versions'][0] ?? null;
            $settings_hash = hash('sha256', wp_json_encode($settings));
            if (!$latest || ($latest['sha256'] ?? '') !== hash('sha256', $csv) || ($latest['settings_hash'] ?? '') !== $settings_hash || !river_price_list_valid_filename($latest['filename'] ?? null) || !is_file($directory . '/' . $latest['filename'])) {
                $sequence = (int) $index['sequence'];
                $clock = new DateTimeImmutable('now', new DateTimeZone('Europe/Zagreb'));
                $parts = array_map('sanitize_title', [$settings['business_type'], $settings['address'], $settings['premises_id']]);
                if (in_array('', $parts, true)) {
                    throw new RuntimeException('Postavke naziva datoteke nisu valjane.');
                }
                do {
                    $sequence++;
                    $filename = implode('_', $parts) . '_' . sprintf('%04d', $sequence) . '_' . $clock->format('Ymd_Hi') . '.csv';
                } while (is_file($directory . '/' . $filename));
                river_price_list_atomic_write($directory . '/' . $filename, $csv);
                array_unshift($index['versions'], [
                    'filename' => $filename,
                    'timestamp' => $clock->getTimestamp(),
                    'published_at' => $clock->format(DateTimeInterface::ATOM),
                    'sha256' => hash('sha256', $csv),
                    'settings_hash' => $settings_hash,
                ]);
                $index['sequence'] = $sequence;
            }
            river_price_list_prune($directory, $index);
            river_price_list_atomic_write($directory . '/index.json', wp_json_encode($index, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
            update_option(RIVER_PRICE_LIST_STATUS_OPTION, ['ok' => true, 'checked_at' => time()], false);
        } catch (Throwable $error) {
            update_option(RIVER_PRICE_LIST_STATUS_OPTION, ['ok' => false, 'checked_at' => time(), 'error' => $error->getMessage()], false);
            error_log('River cjenik: ' . $error->getMessage());
        } finally {
            flock($lock, LOCK_UN);
            fclose($lock);
        }
    } catch (Throwable $error) {
        update_option(RIVER_PRICE_LIST_STATUS_OPTION, ['ok' => false, 'checked_at' => time(), 'error' => $error->getMessage()], false);
        error_log('River cjenik: ' . $error->getMessage());
    }
}

function river_price_list_mark_dirty()
{
    $GLOBALS['river_price_list_dirty'] = true;
}

function river_price_list_should_retry($status)
{
    return $status === false || (is_array($status) && empty($status['ok']) && time() - (int) ($status['checked_at'] ?? 0) >= 60);
}

add_action('init', function () {
    if (river_price_list_should_retry(get_option(RIVER_PRICE_LIST_STATUS_OPTION, false))) {
        river_price_list_mark_dirty();
    }
}, 100);
add_action('save_post_' . RIVER_MENU_ITEM_POST_TYPE, 'river_price_list_mark_dirty', 100);
add_action('transition_post_status', function ($new, $old, $post) {
    if ($post->post_type === RIVER_MENU_ITEM_POST_TYPE && $new !== $old) {
        river_price_list_mark_dirty();
    }
}, 10, 3);
foreach (['added_post_meta', 'updated_post_meta', 'deleted_post_meta'] as $hook) {
    add_action($hook, function ($meta_id, $post_id) {
        if (get_post_type($post_id) === RIVER_MENU_ITEM_POST_TYPE) {
            river_price_list_mark_dirty();
        }
    }, 10, 2);
}
add_action('set_object_terms', function ($object_id, $terms, $tt_ids, $taxonomy) {
    if ($taxonomy === RIVER_MENU_SECTION_TAXONOMY && get_post_type($object_id) === RIVER_MENU_ITEM_POST_TYPE) {
        river_price_list_mark_dirty();
    }
}, 10, 4);
foreach (['created_' . RIVER_MENU_SECTION_TAXONOMY, 'edited_' . RIVER_MENU_SECTION_TAXONOMY, 'delete_' . RIVER_MENU_SECTION_TAXONOMY] as $hook) {
    add_action($hook, 'river_price_list_mark_dirty');
}
foreach (['added_term_meta', 'updated_term_meta', 'deleted_term_meta'] as $hook) {
    add_action($hook, function ($meta_id, $term_id, $meta_key) {
        if (str_starts_with((string) $meta_key, '_river_') && term_exists($term_id, RIVER_MENU_SECTION_TAXONOMY)) {
            river_price_list_mark_dirty();
        }
    }, 10, 3);
}
add_action('before_delete_post', function ($post_id) {
    if (get_post_type($post_id) === RIVER_MENU_ITEM_POST_TYPE) {
        river_price_list_mark_dirty();
    }
});
add_action('shutdown', function () {
    if (!empty($GLOBALS['river_price_list_dirty'])) {
        river_price_list_publish();
    }
});

function river_price_list_manifest()
{
    if (river_price_list_should_retry(get_option(RIVER_PRICE_LIST_STATUS_OPTION, false))) {
        river_price_list_publish();
    }
    $directory = river_price_list_directory();
    $index = river_price_list_index($directory);
    $status = get_option(RIVER_PRICE_LIST_STATUS_OPTION, []);
    $archive = [];
    $latest_filename = $index['versions'][0]['filename'] ?? '';
    $latest_exists = river_price_list_valid_filename($latest_filename) && is_file($directory . '/' . $latest_filename);
    foreach ($index['versions'] as $version) {
        if (river_price_list_valid_filename($version['filename'] ?? null) && is_file($directory . '/' . $version['filename'])) {
            $archive[] = [
                'filename' => $version['filename'],
                'published_at' => $version['published_at'],
                'download_url' => rest_url('river/v1/price-list/files/' . rawurlencode($version['filename'])),
            ];
        }
    }
    return [
        'current' => !empty($status['ok']) && $latest_exists && $archive ? array_merge($archive[0], ['download_url' => rest_url('river/v1/price-list/current.csv')]) : null,
        'archive' => $archive,
        'available' => !empty($status['ok']) && $latest_exists,
    ];
}

function river_price_list_download($request)
{
    try {
        $manifest = river_price_list_manifest();
    } catch (Throwable $error) {
        return new WP_Error('river_price_list_unavailable', 'Cjenik nije dostupan.', ['status' => 503]);
    }
    $filename = (string) ($request['filename'] ?? '');
    if ($filename === '') {
        if (!$manifest['available']) {
            return new WP_Error('river_price_list_unavailable', 'Trenutačni cjenik nije dostupan.', ['status' => 503]);
        }
        $filename = $manifest['current']['filename'];
    } elseif (!river_price_list_valid_filename($filename) || !in_array($filename, array_column($manifest['archive'], 'filename'), true)) {
        return new WP_Error('river_price_list_not_found', 'Cjenik nije pronađen.', ['status' => 404]);
    }
    $path = river_price_list_directory() . '/' . $filename;
    if (!is_file($path)) {
        return new WP_Error('river_price_list_not_found', 'Cjenik nije pronađen.', ['status' => 404]);
    }
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('X-Content-Type-Options: nosniff');
    header($request['filename'] ? 'Cache-Control: public, max-age=86400' : 'Cache-Control: no-store');
    readfile($path);
    exit;
}

add_action('rest_api_init', function () {
    register_rest_route('river/v1', '/price-list', [
        'methods' => 'GET', 'permission_callback' => '__return_true',
        'callback' => function () {
            try {
                $response = rest_ensure_response(river_price_list_manifest());
                $response->header('Cache-Control', 'no-store');
                return $response;
            } catch (Throwable $error) {
                return new WP_Error('river_price_list_unavailable', 'Cjenik nije dostupan.', ['status' => 503]);
            }
        },
    ]);
    foreach (['/price-list/current\\.csv', '/price-list/files/(?P<filename>[a-z0-9_-]+(?:-[a-z0-9_-]+)*\\.csv)'] as $route) {
        register_rest_route('river/v1', $route, [
            'methods' => 'GET', 'permission_callback' => '__return_true',
            'callback' => 'river_price_list_download',
        ]);
    }
});

add_filter('rest_post_dispatch', function ($response, $server, $request) {
    if (str_starts_with($request->get_route(), '/river/v1/price-list') && $response instanceof WP_REST_Response) {
        $response->header('Cache-Control', 'no-store');
    }
    return $response;
}, 10, 3);

add_action('admin_menu', function () {
    add_submenu_page('edit.php?post_type=' . RIVER_MENU_ITEM_POST_TYPE, 'Digitalni cjenik', 'Digitalni cjenik', 'manage_options', 'river-price-list', 'river_price_list_settings_page');
});

function river_price_list_settings_page()
{
    $settings = river_price_list_settings();
    try {
        $available = river_price_list_manifest()['available'];
    } catch (Throwable $error) {
        $available = false;
    }
    $status = get_option(RIVER_PRICE_LIST_STATUS_OPTION, []);
    echo '<div class="wrap"><h1>Digitalni cjenik</h1>';
    if (!empty($status['ok']) && $available) {
        echo '<div class="notice notice-success"><p>Posljednja provjera uspjela je. <a href="' . esc_url(rest_url('river/v1/price-list/current.csv')) . '">Preuzmi trenutačni CSV</a></p></div>';
    } else {
        $error = $status['error'] ?? ($available ? 'Cjenik još nije generiran.' : 'Trenutačna datoteka nedostaje ili nije valjana.');
        echo '<div class="notice notice-error"><p>Objava nije uspjela: ' . esc_html($error) . ' Prethodne valjane verzije ostaju u arhivi.</p></div>';
    }
    echo '<form method="post" action="' . esc_url(admin_url('admin-post.php')) . '">';
    wp_nonce_field('river_price_list_settings');
    echo '<input type="hidden" name="action" value="river_price_list_settings">';
    echo '<table class="form-table">';
    foreach (['business_type' => 'Vrsta objekta', 'address' => 'Adresa', 'premises_id' => 'Identifikator poslovnog prostora'] as $key => $label) {
        echo '<tr><th><label for="' . esc_attr($key) . '">' . esc_html($label) . '</label></th><td><input class="regular-text" required id="' . esc_attr($key) . '" name="' . esc_attr($key) . '" value="' . esc_attr($settings[$key]) . '"></td></tr>';
    }
    echo '</table>';
    submit_button('Spremi i objavi cjenik');
    echo '</form></div>';
}

add_action('admin_post_river_price_list_settings', function () {
    if (!current_user_can('manage_options')) {
        wp_die('Nedopušteno.');
    }
    check_admin_referer('river_price_list_settings');
    $settings = [];
    foreach (['business_type', 'address', 'premises_id'] as $key) {
        $settings[$key] = sanitize_text_field((string) wp_unslash($_POST[$key] ?? ''));
    }
    update_option(RIVER_PRICE_LIST_OPTION, $settings, false);
    river_price_list_publish();
    wp_safe_redirect(admin_url('edit.php?post_type=' . RIVER_MENU_ITEM_POST_TYPE . '&page=river-price-list'));
    exit;
});
