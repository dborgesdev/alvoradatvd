<?php
namespace Alvorada\ContentTools;
defined('ABSPATH') || exit;

function schedule_box() {
    add_meta_box('act-schedule', 'Dias e Horários de Exibição', __NAMESPACE__ . '\render_schedule', 'programa', 'normal');
}

function render_schedule($post) {
    wp_nonce_field('act_save_programa', 'act_nonce_programa');
    $stored = get_post_meta($post->ID, 'grade_horarios', true);
    $rows = schedule_rows(is_array($stored) ? $stored : array());
    if (is_wp_error($rows)) {
        echo '<p role="alert">A grade armazenada contém dados inválidos. Ela será preservada até você salvar uma grade válida.</p>';
        $rows = array();
    }
    echo '<div id="act-schedule-ui"><p id="act-time-help">Horários locais do fuso configurado no WordPress: <strong>' . esc_html(wp_timezone_string()) . '</strong>. Quando o fim for anterior ao início, a faixa termina no dia seguinte. Os dias selecionados são os dias de início. Início e fim iguais não são aceitos.</p>';
    // Disabled until the editor initializes: a missing/failed script must never erase metadata.
    echo '<input disabled type="hidden" name="act_grade_horarios" id="act-schedule-data" value="' . esc_attr(wp_json_encode($rows)) . '">';
    echo '<noscript><p>Ative JavaScript para editar a grade. A grade atual será preservada.</p></noscript>';
    echo '<div id="act-slots"></div><button type="button" class="button" id="act-add-slot">Adicionar faixa</button><p id="act-schedule-status" role="status" aria-live="polite"></p></div>';
}

function save_schedule($post_id) {
    if (!can_save($post_id, 'programa', 'act_grade_horarios')) {
        return;
    }
    $raw = $_POST['act_grade_horarios'];
    $value = is_string($raw) ? json_decode(wp_unslash($raw), true) : null;
    $rows = schedule_rows($value);
    if (is_wp_error($rows)) {
        save_error($rows->get_error_message());
        return;
    }
    update_post_meta($post_id, 'grade_horarios', $rows);
}
