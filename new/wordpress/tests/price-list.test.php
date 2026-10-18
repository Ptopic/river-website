<?php
// Run with PHP directly, or stream this file with the plugin source into a PHP container.
define('ABSPATH', '/test/');
define('RIVER_MENU_ITEM_POST_TYPE', 'river_menu_item');
define('RIVER_MENU_SECTION_TAXONOMY', 'river_menu_section');
define('DAY_IN_SECONDS', 86400);
function add_action($hook, $callback, $priority = 10, $accepted_args = 1)
{
    $GLOBALS['wp_actions'][$hook][] = [$callback, $accepted_args];
}
function fire_action($hook, ...$args)
{
    foreach ($GLOBALS['wp_actions'][$hook] ?? [] as [$callback, $accepted_args]) {
        $callback(...array_slice($args, 0, $accepted_args));
    }
}
function add_filter() {}
function river_menu_group_slugs() { return ['menu', 'drinks', 'pizza', 'wine']; }
function wp_upload_dir() { return ['basedir' => $GLOBALS['price_list_test_root']]; }
function trailingslashit($value) { return rtrim($value, '/') . '/'; }
function get_option($key, $default = null) { return $GLOBALS['wp_options'][$key] ?? $default; }
function update_option($key, $value)
{
    if ($key === RIVER_PRICE_LIST_STATUS_OPTION && !empty($GLOBALS['assert_status_under_lock'])) {
        $probe = fopen($GLOBALS['price_list_test_root'] . '/river-cjenik/publish.lock', 'c');
        $acquired = flock($probe, LOCK_EX | LOCK_NB);
        if ($acquired) {
            flock($probe, LOCK_UN);
        }
        fclose($probe);
        check(!$acquired, 'Publication status is written while the file lock is held.');
    }
    $GLOBALS['wp_options'][$key] = $value;
    return true;
}
function rest_url($path) { return 'https://example.test/wp-json/' . $path; }
function wp_mkdir_p($path) { return mkdir($path, 0777, true); }
function wp_json_encode($value, $flags = 0) { return json_encode($value, $flags); }
function sanitize_title($value) { return trim(preg_replace('/[^a-z0-9_-]+/', '-', strtolower($value)), '-'); }
function get_posts($args)
{
    check(($args['post_type'] ?? null) === RIVER_MENU_ITEM_POST_TYPE, 'Publication queries River menu items.');
    check(($args['post_status'] ?? null) === 'publish', 'Publication excludes unpublished items.');
    $GLOBALS['get_posts_calls'] = ($GLOBALS['get_posts_calls'] ?? 0) + 1;
    return $GLOBALS['wp_posts'];
}
function get_post_type($post_id) { return in_array($post_id, [10, 11], true) ? RIVER_MENU_ITEM_POST_TYPE : 'post'; }
function get_the_terms($post_id) { return $GLOBALS['wp_terms'][$post_id] ?? false; }
function is_wp_error($value) { return false; }
function get_term($term_id) { return $GLOBALS['wp_parents'][$term_id] ?? false; }
function get_post_meta($post_id, $key) { return $GLOBALS['wp_meta'][$post_id][$key] ?? ''; }
require __DIR__ . '/../wp-content/mu-plugins/river-price-list.php';

function check($condition, $message)
{
    if (!$condition) {
        throw new RuntimeException($message);
    }
}

function rejects($item, $message)
{
    try {
        river_price_list_rows([$item]);
    } catch (RuntimeException $error) {
        return;
    }
    throw new RuntimeException($message);
}

$pizza = [
    'id' => 10,
    'group' => 'pizza',
    'name' => 'Šunka, sir "domaći"',
    'quantity' => '',
    'price' => '0',
    'anchor' => '10.5',
    'jumbo_price' => '12',
    'jumbo_anchor' => '13.25',
    'promo_active' => '1',
    'promo_name' => 'Posebna ponuda',
];
$drink = [
    'id' => 11,
    'group' => 'drinks',
    'name' => 'Žlahtina',
    'quantity' => '0,75 l',
    'price' => '3.2',
    'anchor' => '3.2',
    'jumbo_price' => '',
    'jumbo_anchor' => '',
    'promo_active' => '0',
    'promo_name' => '',
];
$rows = river_price_list_rows([$pizza, $drink]);
check(count($rows) === 3, 'Every priced variant needs a row.');
check($rows[0] === ['Šunka, sir "domaći" - Velika', '0.00', 'DA', 'Posebna ponuda', '10.50'], 'Pizza Velika, zero price and promotion.');
check($rows[1] === ['Šunka, sir "domaći" - Jumbo', '12.00', 'DA', 'Posebna ponuda', '13.25'], 'Pizza Jumbo promotion and anchor.');
check($rows[2] === ['Žlahtina (0,75 l)', '3.20', 'NE', '', '3.20'], 'Croatian drink quantity and plain sale.');

$csv = river_price_list_csv($rows);
$stream = fopen('php://temp', 'w+');
fwrite($stream, $csv);
rewind($stream);
check(fgetcsv($stream) === ['naziv_usluge', 'maloprodajna_cijena', 'posebni_oblik_prodaje', 'naziv_posebnog_oblika', 'sidrena_cijena'], 'CSV header order.');
check(fgetcsv($stream) === $rows[0], 'UTF-8 accents, quotes and commas round trip.');
fclose($stream);

rejects(array_merge($drink, ['name' => '']), 'Missing Croatian name must fail.');
rejects(array_merge($drink, ['price' => '']), 'Missing price must fail.');
rejects(array_merge($drink, ['price' => '3,20']), 'Comma decimal must fail.');
rejects(array_merge($drink, ['anchor' => '']), 'Missing anchor must fail.');
rejects(array_merge($pizza, ['jumbo_anchor' => '']), 'Missing Jumbo anchor must fail.');
rejects(array_merge($drink, ['promo_active' => '1', 'promo_name' => '']), 'Unnamed promotion must fail.');
rejects(array_merge($drink, ['name' => '=SUM(1,2)']), 'Spreadsheet formulas must fail.');
rejects(array_merge($drink, ['promo_active' => '1', 'promo_name' => '=SUM(1,2)']), 'Promotion formulas must fail.');
check(!river_price_list_valid_filename('../escape.csv'), 'Archive filename must not traverse directories.');

$directory = sys_get_temp_dir() . '/river-cjenik-test-' . bin2hex(random_bytes(4));
mkdir($directory);
$old = 'cjenik_old.csv';
$current = 'cjenik_current.csv';
file_put_contents($directory . '/' . $old, 'old');
file_put_contents($directory . '/' . $current, 'current');
$index = ['sequence' => 2, 'versions' => [
    ['filename' => $current, 'timestamp' => time() - 40 * DAY_IN_SECONDS],
    ['filename' => $old, 'timestamp' => time() - 40 * DAY_IN_SECONDS],
]];
river_price_list_prune($directory, $index);
check(count($index['versions']) === 1 && $index['versions'][0]['filename'] === $current, 'Current version survives retention expiry.');
check(!is_file($directory . '/' . $old), 'Expired version is removed.');
unlink($directory . '/' . $current);
rmdir($directory);

$root = sys_get_temp_dir() . '/river-cjenik-manifest-' . bin2hex(random_bytes(4));
$GLOBALS['price_list_test_root'] = $root;
$GLOBALS['wp_options'] = [RIVER_PRICE_LIST_STATUS_OPTION => ['ok' => true]];
mkdir($root);
mkdir($root . '/river-cjenik');
file_put_contents($root . '/river-cjenik/cjenik_old.csv', 'old');
file_put_contents($root . '/river-cjenik/index.json', json_encode(['sequence' => 2, 'versions' => [
    ['filename' => 'cjenik_current.csv', 'published_at' => '2026-10-18T09:00:00+02:00'],
    ['filename' => 'cjenik_old.csv', 'published_at' => '2026-10-17T09:00:00+02:00'],
]]));
$manifest = river_price_list_manifest();
check(!$manifest['available'] && $manifest['current'] === null, 'Missing latest file cannot promote an older version to current.');
check(count($manifest['archive']) === 1 && $manifest['archive'][0]['filename'] === 'cjenik_old.csv', 'Prior version remains downloadable.');
unlink($root . '/river-cjenik/cjenik_old.csv');
unlink($root . '/river-cjenik/index.json');
rmdir($root . '/river-cjenik');
rmdir($root);

$root = sys_get_temp_dir() . '/river-cjenik-publish-' . bin2hex(random_bytes(4));
mkdir($root);
$GLOBALS['price_list_test_root'] = $root;
$GLOBALS['wp_options'] = [RIVER_PRICE_LIST_OPTION => [
    'business_type' => 'ugostiteljski_objekt',
    'address' => 'ulica rijeke 46',
    'premises_id' => 'abc123',
]];
$GLOBALS['wp_posts'] = [(object) ['ID' => 10], (object) ['ID' => 11]];
$GLOBALS['wp_terms'] = [
    10 => [(object) ['parent' => 201]],
    11 => [(object) ['parent' => 202]],
];
$GLOBALS['wp_parents'] = [
    201 => (object) ['slug' => 'pizza'],
    202 => (object) ['slug' => 'drinks'],
];
$GLOBALS['wp_meta'] = [
    10 => [
        '_river_name_hr' => $pizza['name'], '_river_quantity_hr' => '',
        '_river_price_eur' => $pizza['price'], '_river_anchor_price_eur' => $pizza['anchor'],
        '_river_jumbo_price_eur' => $pizza['jumbo_price'], '_river_jumbo_anchor_price_eur' => $pizza['jumbo_anchor'],
        '_river_promo_active' => '1', '_river_promo_name_hr' => $pizza['promo_name'],
    ],
    11 => [
        '_river_name_hr' => $drink['name'], '_river_quantity_hr' => $drink['quantity'],
        '_river_price_eur' => $drink['price'], '_river_anchor_price_eur' => $drink['anchor'],
        '_river_jumbo_price_eur' => '', '_river_jumbo_anchor_price_eur' => '',
        '_river_promo_active' => '0', '_river_promo_name_hr' => '',
    ],
];
$GLOBALS['assert_status_under_lock'] = true;

river_price_list_publish();
check($GLOBALS['wp_options'][RIVER_PRICE_LIST_STATUS_OPTION]['ok'], 'Initial publication succeeds.');
$directory = $root . '/river-cjenik';
$index = river_price_list_index($directory);
check($index['sequence'] === 1 && count($index['versions']) === 1, 'Initial publication creates one version.');
$first = $index['versions'][0]['filename'];
check(str_contains($first, 'ugostiteljski_objekt_ulica-rijeke-46_abc123_0001_'), 'Filename carries settings, sequence and local publication time.');
$first_csv = file_get_contents($directory . '/' . $first);
$stream = fopen('php://temp', 'w+');
fwrite($stream, $first_csv);
rewind($stream);
check(count(fgetcsv($stream)) === 5 && fgetcsv($stream) === $rows[0], 'Published CSV has the five required fields and expected first row.');
fclose($stream);
check(river_price_list_manifest()['current']['filename'] === $first, 'Manifest points to initial current version.');

river_price_list_publish();
check(river_price_list_index($directory)['sequence'] === 1, 'Unchanged content creates no duplicate version.');
$GLOBALS['wp_meta'][10]['_river_price_eur'] = '1.00';
$GLOBALS['river_price_list_dirty'] = false;
fire_action('updated_post_meta', 1, 999, '_river_price_eur', '1.00');
check(empty($GLOBALS['river_price_list_dirty']), 'Unrelated post meta does not trigger publication.');
fire_action('updated_post_meta', 2, 10, '_river_price_eur', '1.00');
check(!empty($GLOBALS['river_price_list_dirty']), 'Registered menu meta hook marks publication dirty.');
check(river_price_list_index($directory)['sequence'] === 1, 'Meta hook waits for the completed request.');
fire_action('shutdown');
$index = river_price_list_index($directory);
check($index['sequence'] === 2 && count($index['versions']) === 2, 'Shutdown publishes the same-minute price edit as a numbered version.');
$second = $index['versions'][0]['filename'];
check($second !== $first && file_get_contents($directory . '/' . $first) === $first_csv, 'Old CSV stays immutable.');

$GLOBALS['wp_options'][RIVER_PRICE_LIST_OPTION]['address'] = 'nova adresa 7';
river_price_list_publish();
$index = river_price_list_index($directory);
check($index['sequence'] === 3 && str_contains($index['versions'][0]['filename'], '_nova-adresa-7_'), 'Setting identity publishes a newly named version.');
check(count($index['versions']) === 3, 'Recent archives survive pruning.');

$GLOBALS['wp_meta'][10]['_river_anchor_price_eur'] = '';
river_price_list_publish();
check(!$GLOBALS['wp_options'][RIVER_PRICE_LIST_STATUS_OPTION]['ok'], 'Invalid anchor is visible in publication status.');
$calls_before_retry = $GLOBALS['get_posts_calls'];
$GLOBALS['river_price_list_dirty'] = false;
fire_action('init');
check(empty($GLOBALS['river_price_list_dirty']), 'Recent failure does not schedule another publication.');
$manifest = river_price_list_manifest();
check($GLOBALS['get_posts_calls'] === $calls_before_retry, 'Recent failure does not retry during manifest reads.');
check(!$manifest['available'] && $manifest['current'] === null && count($manifest['archive']) === 3, 'Invalid publication keeps archives but disables current.');
check(river_price_list_index($directory)['sequence'] === 3, 'Invalid publication does not alter the archive index.');
$GLOBALS['wp_meta'][10]['_river_anchor_price_eur'] = '10.50';
$GLOBALS['wp_options'][RIVER_PRICE_LIST_STATUS_OPTION]['checked_at'] = time() - 61;
fire_action('init');
check(!empty($GLOBALS['river_price_list_dirty']), 'Old failure schedules publication at init.');
check(river_price_list_manifest()['available'], 'Old failure retries on manifest and restores current availability.');
check($GLOBALS['get_posts_calls'] === $calls_before_retry + 1, 'Manifest retry validates the corrected menu.');
$GLOBALS['assert_status_under_lock'] = false;

foreach (glob($directory . '/*') as $path) {
    unlink($path);
}
rmdir($directory);
rmdir($root);

echo "price-list tests passed\n";
