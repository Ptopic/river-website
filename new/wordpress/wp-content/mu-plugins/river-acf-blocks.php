<?php
/**
 * Plugin Name: River ACF Block Reader
 * Description: Reads River ACF blocks from post_content and converts them into section rows.
 */

if (!defined('ABSPATH')) {
    exit;
}

const RIVER_BLOCK_PREFIX = 'acf/river-';
const RIVER_BLOCK_PREVIEW_TTL = 900;
const RIVER_BLOCK_PREVIEW_VIEWPORT = 1728;
const RIVER_BLOCK_PREVIEW_MAX_HEIGHT = 700;

function river_blocks_layouts()
{
    static $cache = null;
    if ($cache !== null) {
        return $cache;
    }
    if (!function_exists('acf_get_field')) {
        return [];
    }
    $fc = acf_get_field('field_river_sections');
    if (!is_array($fc) || empty($fc['layouts'])) {
        return [];
    }
    $layouts = [];
    foreach ($fc['layouts'] as $layout) {
        if (isset($layout['name'])) {
            $layouts[$layout['name']] = $layout;
        }
    }
    return $cache = $layouts;
}

function river_blocks_block_name($layout_name)
{
    return RIVER_BLOCK_PREFIX . str_replace('_', '-', (string) $layout_name);
}

function river_blocks_layout_for_block($block_name)
{
    static $map = null;
    if ($map === null) {
        $layouts = river_blocks_layouts();
        if (!$layouts) {
            return null;
        }
        $map = [];
        foreach (array_keys($layouts) as $name) {
            $map[river_blocks_block_name($name)] = $name;
            $map[RIVER_BLOCK_PREFIX . $name] = $name; // legacy underscore seed support
        }
    }
    return $map[$block_name] ?? null;
}

add_action('acf/init', function () {
    if (!function_exists('acf_register_block_type') || !function_exists('acf_add_local_field_group')) {
        return;
    }

    foreach (river_blocks_layouts() as $name => $layout) {
        $block_name = river_blocks_block_name($name);
        acf_register_block_type([
            'name' => substr($block_name, strlen('acf/')),
            'title' => $layout['label'] ?? ucwords(str_replace('_', ' ', $name)),
            'description' => 'River section rendered by Astro.',
            'category' => 'river-sections',
            'icon' => 'restaurant',
            'mode' => 'preview',
            'supports' => [
                'mode' => true,
                'align' => false,
                'html' => false,
                'jsx' => false,
                'anchor' => true,
                'customClassName' => false,
            ],
            'render_callback' => 'river_blocks_render_preview',
        ]);

        acf_add_local_field_group([
            'key' => 'group_riverblk_' . $name,
            'title' => $layout['label'] ?? ucwords(str_replace('_', ' ', $name)),
            'fields' => $layout['sub_fields'] ?? [],
            'location' => [[[
                'param' => 'block',
                'operator' => '==',
                'value' => $block_name,
            ]]],
        ]);
    }
}, 20);

add_filter('block_categories_all', function ($categories) {
    $known = array_column($categories, 'slug');
    if (!in_array('river-sections', $known, true)) {
        array_unshift($categories, [
            'slug' => 'river-sections',
            'title' => 'River Sections',
        ]);
    }
    return $categories;
});

function river_blocks_read_sections($post_id)
{
    $post = get_post($post_id);
    if (!$post || !has_blocks($post->post_content)) {
        return null;
    }

    $sections = [];
    foreach (parse_blocks($post->post_content) as $block) {
        $section = river_block_to_section($block);
        if ($section) {
            $sections[] = $section;
        }
    }

    return $sections ?: null;
}

function river_block_to_section($block)
{
    if (!is_array($block) || empty($block['blockName'])) {
        return null;
    }

    if (strpos((string) $block['blockName'], RIVER_BLOCK_PREFIX) !== 0) {
        return null;
    }

    $type = river_blocks_layout_for_block((string) $block['blockName'])
        ?: str_replace('-', '_', substr((string) $block['blockName'], strlen(RIVER_BLOCK_PREFIX)));
    $data = isset($block['attrs']['data']) && is_array($block['attrs']['data'])
        ? $block['attrs']['data']
        : [];

    $section = [
        'acf_fc_layout' => $type,
        'type' => $type,
    ];

    foreach ($data as $key => $value) {
        if (strpos((string) $key, '_') === 0) {
            continue;
        }
        $section[$key] = $value;
    }

    return $section;
}

function river_blocks_render_preview($block)
{
    $layout = river_blocks_layout_for_block($block['name'] ?? '') ?: ($block['title'] ?? 'River section');
    $data = isset($block['data']) && is_array($block['data']) ? $block['data'] : [];
    $url = river_block_preview_url($layout, $data, isset($block['post_id']) ? (int) $block['post_id'] : 0);

    if (!$url) {
        river_blocks_render_stub($block, $layout, $data);
        return;
    }

    $frame_id = 'river-bp-' . md5($url);
    ?>
    <div class="river-bp-box" data-river-clipped="" style="position:relative;border:1px solid #e0e0e0;border-radius:4px;overflow:hidden;background:#fff">
        <iframe id="<?php echo esc_attr($frame_id); ?>"
                src="<?php echo esc_url($url); ?>"
                loading="lazy"
                style="display:block;width:<?php echo (int) RIVER_BLOCK_PREVIEW_VIEWPORT; ?>px;height:320px;border:0;pointer-events:none;transform-origin:0 0"
                scrolling="no"></iframe>
    </div>
    <script>
    (function () {
        var frame = document.getElementById(<?php echo wp_json_encode($frame_id); ?>);
        if (!frame || frame.dataset.riverBound) { return; }
        frame.dataset.riverBound = '1';
        var box = frame.parentNode;
        var viewport = <?php echo (int) RIVER_BLOCK_PREVIEW_VIEWPORT; ?>;
        var height = 320;
        var maxBox = <?php echo (int) RIVER_BLOCK_PREVIEW_MAX_HEIGHT; ?>;
        var fit = function () {
            if (!box.clientWidth) { return; }
            var scale = Math.min(1, box.clientWidth / viewport);
            frame.style.transform = 'scale(' + scale + ')';
            var full = Math.round(height * scale);
            box.style.height = Math.min(maxBox, full) + 'px';
            box.dataset.riverClipped = full > maxBox ? '1' : '';
        };
        window.addEventListener('message', function (event) {
            if (event.source !== frame.contentWindow) { return; }
            if (!event.data || event.data.type !== 'river:preview-height') { return; }
            height = Math.max(120, parseInt(event.data.height, 10) || 0);
            frame.style.height = height + 'px';
            fit();
        });
        if (window.ResizeObserver) { new ResizeObserver(fit).observe(box); }
        fit();
    })();
    </script>
    <?php
}

function river_blocks_render_stub($block, $layout, $data)
{
    $title = $block['title'] ?? ucwords(str_replace('_', ' ', $layout));
    $summary = river_blocks_preview_summary($layout, $data);
    echo '<section class="river-editor-block river-editor-block--' . esc_attr(str_replace('_', '-', $layout)) . '">';
    echo '<div class="river-editor-block__eyebrow">River block</div>';
    echo '<h3>' . esc_html($title) . '</h3>';
    if ($summary !== '') {
        echo '<p>' . esc_html($summary) . '</p>';
    }
    echo '<span>Exact Astro preview is waiting for RIVER_ASTRO_PREVIEW_URL. Fields are editable in the block sidebar.</span>';
    echo '</section>';
}

function river_block_preview_frontend_url()
{
    $url = defined('RIVER_ASTRO_PREVIEW_URL') ? (string) RIVER_ASTRO_PREVIEW_URL : (string) getenv('RIVER_ASTRO_PREVIEW_URL');
    return rtrim($url, '/');
}

function river_block_preview_token($hash)
{
    return hash_hmac('sha256', $hash, wp_salt('river_block_preview'));
}

function river_block_preview_url($layout, $data, $post_id)
{
    $frontend = river_block_preview_frontend_url();
    if ($frontend === '') {
        return null;
    }

    $row = array_merge([
        'acf_fc_layout' => $layout,
        'type' => $layout,
    ], is_array($data) ? $data : []);

    if (function_exists('river_resolve_section')) {
        $row = river_resolve_section($row);
    }

    $payload = [
        'layout' => $layout,
        'page' => $post_id ? (get_post_field('post_name', $post_id) ?: 'home') : 'home',
        'row' => $row,
    ];

    $hash = md5(wp_json_encode($payload));
    set_transient('river_bp_' . $hash, $payload, RIVER_BLOCK_PREVIEW_TTL);

    return $frontend . '/block-preview/' . rawurlencode($layout) . '/' . $hash . '?t=' . river_block_preview_token($hash);
}

add_action('rest_api_init', function () {
    register_rest_route('river/v1', '/block-preview/(?P<hash>[a-f0-9]{32})', [
        'methods' => 'GET',
        'permission_callback' => function ($request) {
            $token = (string) $request->get_param('t');
            return $token !== '' && hash_equals(river_block_preview_token($request['hash']), $token);
        },
        'callback' => function ($request) {
            $payload = get_transient('river_bp_' . $request['hash']);
            if (!$payload) {
                return new WP_Error('river_preview_expired', 'Preview expired', ['status' => 404]);
            }
            return rest_ensure_response($payload);
        },
    ]);
});

function river_blocks_preview_summary($layout, $data)
{
    $pick = function ($keys) use ($data) {
        foreach ($keys as $key) {
            if (isset($data[$key]) && is_scalar($data[$key]) && trim((string) $data[$key]) !== '') {
                return trim((string) $data[$key]);
            }
        }
        return '';
    };

    if ($layout === 'site_nav') {
        return 'Navigation and booking link';
    }
    if ($layout === 'site_footer') {
        return $pick(['address', 'phone', 'email']);
    }
    if ($layout === 'gallery') {
        return 'Dish gallery';
    }
    if ($layout === 'map') {
        return $pick(['title', 'address']);
    }
    return $pick(['title', 'heading', 'eyebrow', 'body']);
}
