<?php
$path = __DIR__ . '/../wp-content/mu-plugins/acf-json/group_river_page_sections.json';
$json = json_decode(file_get_contents($path), true);

if (!$json || !isset($json['fields'][0]['key']) || $json['fields'][0]['key'] !== 'field_river_sections') {
    fwrite(STDERR, "River ACF sections field is missing.\n");
    exit(1);
}

$layouts = $json['fields'][0]['layouts'] ?? [];
$required = ['site_nav', 'home_hero', 'category_recap', 'info_cards', 'contact_location', 'story', 'section_heading', 'gallery', 'map', 'site_footer', 'menu_page', 'wine_list'];
$present = array_map(fn ($layout) => $layout['name'] ?? '', array_values($layouts));
$missing = array_values(array_diff($required, $present));

if ($missing) {
    fwrite(STDERR, "Missing layouts: " . implode(', ', $missing) . "\n");
    exit(1);
}

echo "River ACF structure check passed.\n";
