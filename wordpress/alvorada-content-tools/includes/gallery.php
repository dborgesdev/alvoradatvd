<?php
namespace Alvorada\ContentTools;
defined('ABSPATH') || exit;

function gallery_box() {
    add_meta_box('act-gallery', 'Fotografias do Álbum', __NAMESPACE__ . '\render_gallery', 'album', 'normal');
}

function render_gallery($post) {
    wp_nonce_field('act_save_album', 'act_nonce_album');
    $ids = image_ids(get_post_meta($post->ID, 'fotografias', true));
    echo '<div id="act-gallery-ui"><p>A imagem destacada continua sendo a capa. Arraste as fotografias ou use os botões de mover.</p>';
    echo '<input type="hidden" name="act_fotografias" id="act-photo-ids" value="' . esc_attr(wp_json_encode($ids)) . '">';
    echo '<button type="button" class="button" id="act-add-photos">Adicionar fotografias</button> ';
    echo '<span id="act-photo-count" role="status" aria-live="polite">' . esc_html(count($ids)) . ' fotografia(s)</span>';
    echo '<ul id="act-photos" class="act-photos">';
    foreach ($ids as $id) {
        echo '<li class="act-photo" data-id="' . esc_attr($id) . '"><span class="act-drag" aria-hidden="true">↔ Arrastar</span>';
        echo wp_get_attachment_image($id, 'thumbnail');
        echo '<span>Fotografia #' . esc_html($id) . '</span><div class="act-photo-actions">';
        echo '<button type="button" class="button act-prev" aria-label="Mover fotografia anterior">←</button> ';
        echo '<button type="button" class="button act-next" aria-label="Mover fotografia seguinte">→</button> ';
        echo '<button type="button" class="button act-remove">Remover</button></div></li>';
    }
    echo '</ul></div>';
}

function save_gallery($post_id) {
    if (!can_save($post_id, 'album', 'act_fotografias')) {
        return;
    }
    $raw = $_POST['act_fotografias'];
    $value = is_string($raw) ? json_decode(wp_unslash($raw), true) : null;
    if (!is_array($value)) {
        save_error('Não foi possível ler as fotografias.');
        return;
    }
    update_post_meta($post_id, 'fotografias', image_ids($value));
}
