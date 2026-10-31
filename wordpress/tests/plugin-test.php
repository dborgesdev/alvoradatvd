<?php
// Isolated unit harness: WordPress APIs below are doubles, not a live WordPress install.
define('ABSPATH', __DIR__);
class WP_Error {
    private $message;
    function __construct($code, $message) { $this->message = $message; }
    function get_error_message() { return $this->message; }
}
function is_wp_error($v) { return $v instanceof WP_Error; }
function add_action() {}
function sanitize_text_field($v) { return trim(strip_tags($v)); }
function sanitize_textarea_field($v) { return trim(strip_tags($v)); }
function wp_unslash($v) { return stripslashes($v); }
$types = array(10 => 'album', 20 => 'programa', 1 => 'attachment', 2 => 'attachment', 3 => 'attachment', 4 => 'attachment', 5 => 'attachment', 6 => 'attachment');
$statuses = array(1 => 'inherit', 2 => 'inherit', 3 => 'inherit', 4 => 'trash', 5 => 'private');
function get_post_type($id) { global $types; return $types[$id] ?? false; }
function get_post_status($id) { global $statuses; return $statuses[$id] ?? 'publish'; }
function wp_attachment_is_image($id) { return in_array($id, array(1, 2, 4, 5, 6), true); }
$allowed = true; $revision = false; $autosave = false; $meta = array(); $errors = array(); $registered = array();
function current_user_can($cap, $id) { global $allowed; return $allowed; }
function wp_is_post_revision($id) { global $revision; return $revision; }
function wp_is_post_autosave($id) { global $autosave; return $autosave; }
function wp_verify_nonce($value, $action) { return $value === 'valid'; }
function update_post_meta($id, $key, $value) { global $meta; $meta[$id][$key] = $value; }
function get_post_meta($id, $key, $single) { global $meta; return $meta[$id][$key] ?? ''; }
function get_current_user_id() { return 99; }
function set_transient($key, $value, $ttl) { global $errors; $errors[] = $value; }
function register_rest_field($type, $name, $args) { global $registered; $registered[$type][$name] = $args; }
function get_post($id) { return (object) array('ID' => $id, 'post_status' => get_post_status($id), 'post_parent' => $id === 2 ? 100 : 0, 'post_password' => ''); }
function is_post_publicly_viewable($post) { return false; }
function wp_get_attachment_image_src($id, $size) { return array('https://example.test/' . $id . '.jpg', 1200, 800); }
function wp_get_attachment_metadata($id) { return array('sizes' => array('thumbnail' => array(), 'medium' => array())); }
function wp_get_attachment_image_url($id, $size) { return 'https://example.test/' . $id . '-' . $size . '.jpg'; }
require __DIR__ . '/../alvorada-content-tools/includes/validation.php';
require __DIR__ . '/../alvorada-content-tools/includes/gallery.php';
require __DIR__ . '/../alvorada-content-tools/includes/schedule.php';
require __DIR__ . '/../alvorada-content-tools/includes/rest.php';

$count = 0;
function check($condition, $message) { global $count; ++$count; if (!$condition) { throw new Exception($message); } echo "PASS $message\n"; }
function row($changes = array()) { return array_merge(array('dias' => array(1, 2, 3, 4, 5), 'inicio' => '08:00', 'fim' => '09:00', 'tipo' => 'ao_vivo', 'observacao' => ''), $changes); }
use function Alvorada\ContentTools\image_ids;
use function Alvorada\ContentTools\schedule_rows;
use function Alvorada\ContentTools\save_gallery;
use function Alvorada\ContentTools\save_schedule;
use function Alvorada\ContentTools\resolved_photos;

check(image_ids(array(2, '1', 2, -1, '1evil', 3, 4, 999, array(), true, '9999999999999999999999999')) === array(2, 1), 'image validation, deduplication and order');
check(image_ids('bad') === array(), 'invalid image list');
check(schedule_rows(array()) === array(), 'empty schedule');
check(schedule_rows(array(row()))[0]['dias'] === array(1, 2, 3, 4, 5), 'multiple days');
check(count(schedule_rows(array(row(), row(array('dias' => array(6), 'inicio' => '10:00', 'fim' => '11:00', 'tipo' => 'reprise'))))) === 2, 'multiple time slots');
check(schedule_rows(array(row(array('dias' => array('7', 1, 1)))))[0]['dias'] === array(1, 7), 'normalize days');
check(!is_wp_error(schedule_rows(array(row(array('dias' => array(7), 'inicio' => '23:30', 'fim' => '00:30'))))), 'overnight Sunday to Monday');
foreach (array('24:00', '12:60', '8:00', '12:00:00', '', array()) as $time) {
    check(is_wp_error(schedule_rows(array(row(array('inicio' => $time))))), 'invalid time ' . json_encode($time));
}
foreach (array(array(), array(0), array(8), array('1x'), array(true)) as $days) {
    check(is_wp_error(schedule_rows(array(row(array('dias' => $days))))), 'invalid days ' . json_encode($days));
}
check(is_wp_error(schedule_rows(array(row(array('fim' => '08:00'))))), 'reject equal times');
check(is_wp_error(schedule_rows(array(row(array('tipo' => 'unexpected'))))), 'reject unknown type');
check(is_wp_error(schedule_rows(null)), 'reject malformed structure');
check(schedule_rows(array(row(array('observacao' => '<b>Teste</b>'))))[0]['observacao'] === 'Teste', 'sanitize note');

$_POST = array('act_nonce_album' => 'valid', 'act_fotografias' => '[1,2]');
save_gallery(10);
check($meta[10]['fotografias'] === array(1, 2), 'save multiple photographs');
$_POST['act_fotografias'] = '[2,1,5]'; save_gallery(10);
check($meta[10]['fotografias'] === array(2, 1, 5), 'append and reorder photographs');
$_POST['act_fotografias'] = '[1]'; save_gallery(10);
check($meta[10]['fotografias'] === array(1), 'remove photograph');
foreach (array('missing', 'nonce', 'capability', 'revision', 'autosave', 'malformed') as $case) {
    $_POST = array('act_nonce_album' => 'valid', 'act_fotografias' => '[]');
    if ($case === 'missing') unset($_POST['act_fotografias']);
    if ($case === 'nonce') $_POST['act_nonce_album'] = 'bad';
    if ($case === 'capability') $allowed = false;
    if ($case === 'revision') $revision = true;
    if ($case === 'autosave') $autosave = true;
    if ($case === 'malformed') $_POST['act_fotografias'] = '{broken';
    save_gallery(10);
    check($meta[10]['fotografias'] === array(1), 'preserve gallery on ' . $case);
    $allowed = true; $revision = false; $autosave = false;
}
$_POST = array('act_nonce_album' => 'valid', 'act_fotografias' => '[]'); save_gallery(20);
check(!isset($meta[20]['fotografias']), 'wrong post type untouched');
$_POST = array('act_nonce_programa' => 'valid', 'act_grade_horarios' => json_encode(array(row()))); save_schedule(20);
check(count($meta[20]['grade_horarios']) === 1, 'save schedule');
foreach (array('nonce', 'capability', 'revision', 'autosave') as $case) {
    $_POST = array('act_nonce_programa' => 'valid', 'act_grade_horarios' => '[]');
    if ($case === 'nonce') $_POST['act_nonce_programa'] = 'bad';
    if ($case === 'capability') $allowed = false;
    if ($case === 'revision') $revision = true;
    if ($case === 'autosave') $autosave = true;
    save_schedule(20);
    check(count($meta[20]['grade_horarios']) === 1, 'preserve schedule on ' . $case);
    $allowed = true; $revision = false; $autosave = false;
}
$_POST = array('act_nonce_programa' => 'valid');
$_POST['act_grade_horarios'] = json_encode(array(row(array('inicio' => '99:00')))); save_schedule(20);
check($meta[20]['grade_horarios'][0]['inicio'] === '08:00', 'invalid schedule preserves previous data');
unset($_POST['act_grade_horarios']); save_schedule(20);
check(count($meta[20]['grade_horarios']) === 1, 'partial schedule save preserves data');
$_POST['act_grade_horarios'] = '[]'; save_schedule(20);
check($meta[20]['grade_horarios'] === array(), 'explicit empty schedule removes slots');
$meta[10]['fotografias'] = array(2, 1, 5);
$photos = resolved_photos(array('id' => 10));
check(array_column($photos, 'id') === array(1), 'REST excludes private attachments and private parents');
check(array_keys($photos[0]) === array('id', 'url', 'alt', 'width', 'height', 'sizes'), 'REST only necessary attachment data');
check($photos[0]['url'] === 'https://example.test/1.jpg' && $photos[0]['width'] === 1200, 'REST resolves native media URLs and dimensions');
check(isset($photos[0]['sizes']->thumbnail), 'REST thumbnail URLs');
check(resolved_photos(array('id' => 999)) === array(), 'REST empty gallery');
$meta[10]['fotografias'] = array(6, 1);
check(array_column(resolved_photos(array('id' => 10)), 'id') === array(6, 1), 'REST preserves configured photo order');
Alvorada\ContentTools\register_fields();
check(!isset($registered['album']['fotografias_resolvidas']['update_callback']), 'gallery REST read only');
check(!isset($registered['programa']['grade_horarios']['update_callback']), 'schedule REST read only');
check(call_user_func($registered['programa']['grade_horarios']['get_callback'], array('id' => 20)) === array(), 'REST empty schedule');
echo "$count checks passed (isolated WordPress doubles).\n";
