<?php
namespace Alvorada\ContentTools;
defined('ABSPATH') || exit;

function image_ids($value) {
    if (!is_array($value)) {
        return array();
    }
    $ids = array();
    foreach ($value as $raw) {
        if ((!is_int($raw) && !is_string($raw)) || !preg_match('/^[1-9][0-9]*$/D', (string) $raw)) {
            continue;
        }
        $id = filter_var($raw, FILTER_VALIDATE_INT, array('options' => array('min_range' => 1)));
        if ($id && 'attachment' === get_post_type($id) && 'trash' !== get_post_status($id) && wp_attachment_is_image($id)) {
            $ids[] = $id;
        }
    }
    return array_values(array_unique($ids));
}

function schedule_rows($value) {
    if (!is_array($value)) {
        return new \WP_Error('invalid_schedule', 'A grade deve ser uma lista de faixas.');
    }
    $rows = array();
    foreach ($value as $row) {
        if (!is_array($row) || !isset($row['dias'], $row['inicio'], $row['fim'], $row['tipo']) || !is_array($row['dias'])) {
            return new \WP_Error('invalid_schedule', 'Preencha dias, horários e tipo em todas as faixas.');
        }
        $days = array();
        foreach ($row['dias'] as $day) {
            if ((!is_int($day) && !is_string($day)) || !preg_match('/^[1-7]$/D', (string) $day)) {
                return new \WP_Error('invalid_days', 'Selecione dias de segunda a domingo.');
            }
            $days[] = (int) $day;
        }
        $days = array_values(array_unique($days));
        sort($days);
        foreach (array('inicio', 'fim') as $key) {
            if (!is_string($row[$key]) || !preg_match('/^(?:[01][0-9]|2[0-3]):[0-5][0-9]$/D', $row[$key])) {
                return new \WP_Error('invalid_time', 'Use horários válidos no formato HH:mm.');
            }
        }
        if (!$days || $row['inicio'] === $row['fim'] || !in_array($row['tipo'], array('ao_vivo', 'gravado', 'reprise'), true)) {
            return new \WP_Error('invalid_schedule', 'Selecione dias, tipo e horários diferentes para início e fim.');
        }
        if (isset($row['observacao']) && !is_string($row['observacao'])) {
            return new \WP_Error('invalid_note', 'A observação deve ser um texto.');
        }
        $rows[] = array('dias' => $days, 'inicio' => $row['inicio'], 'fim' => $row['fim'], 'tipo' => $row['tipo'], 'observacao' => sanitize_textarea_field($row['observacao'] ?? ''));
    }
    return $rows;
}

function can_save($post_id, $type, $field) {
    return !(defined('DOING_AUTOSAVE') && DOING_AUTOSAVE)
        && !wp_is_post_revision($post_id) && !wp_is_post_autosave($post_id)
        && $type === get_post_type($post_id) && current_user_can('edit_post', $post_id)
        && isset($_POST['act_nonce_' . $type], $_POST[$field])
        && is_string($_POST['act_nonce_' . $type])
        && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['act_nonce_' . $type])), 'act_save_' . $type);
}

function save_error($message) {
    set_transient('act_error_' . get_current_user_id(), $message, 60);
}

add_action('admin_notices', function () {
    $key = 'act_error_' . get_current_user_id();
    $message = get_transient($key);
    if ($message) {
        delete_transient($key);
        echo '<div class="notice notice-error"><p>' . esc_html($message) . ' Os metadados anteriores foram preservados.</p></div>';
    }
});
