<?php
namespace Alvorada\ContentTools;
defined('ABSPATH') || exit;

function resolved_photos($object) {
    $photos = array();
    foreach (image_ids(get_post_meta($object['id'], 'fotografias', true)) as $id) {
        $attachment = get_post($id);
        // Public responses never disclose attachments of private/password-protected content.
        if (!in_array($attachment->post_status, array('inherit', 'publish'), true) || $attachment->post_password) {
            continue;
        }
        if ($attachment->post_parent) {
            $parent = get_post($attachment->post_parent);
            if (!$parent || !is_post_publicly_viewable($parent) || $parent->post_password) {
                continue;
            }
        }
        $full = wp_get_attachment_image_src($id, 'full');
        if (!$full) {
            continue;
        }
        $sizes = array();
        $metadata = wp_get_attachment_metadata($id);
        foreach (array('thumbnail', 'medium', 'medium_large', 'large', '1536x1536', '2048x2048') as $size) {
            if (isset($metadata['sizes'][$size])) {
                $url = wp_get_attachment_image_url($id, $size);
                if ($url) {
                    $sizes[$size] = $url;
                }
            }
        }
        $photos[] = array('id' => $id, 'url' => $full[0], 'alt' => sanitize_text_field(get_post_meta($id, '_wp_attachment_image_alt', true)), 'width' => (int) $full[1], 'height' => (int) $full[2], 'sizes' => (object) $sizes);
    }
    return $photos;
}

function register_fields() {
    $contexts = array('view', 'embed', 'edit');
    register_rest_field('album', 'fotografias_resolvidas', array(
        'get_callback' => __NAMESPACE__ . '\resolved_photos',
        'schema' => array('type' => 'array', 'readonly' => true, 'context' => $contexts, 'items' => array(
            'type' => 'object', 'properties' => array(
                'id' => array('type' => 'integer'), 'url' => array('type' => 'string', 'format' => 'uri'),
                'alt' => array('type' => 'string'), 'width' => array('type' => 'integer'), 'height' => array('type' => 'integer'),
                'sizes' => array('type' => 'object', 'additionalProperties' => array('type' => 'string', 'format' => 'uri')),
            ),
        )),
    ));
    register_rest_field('programa', 'grade_horarios', array(
        'get_callback' => function ($object) {
            $stored = get_post_meta($object['id'], 'grade_horarios', true);
            $rows = schedule_rows(is_array($stored) ? $stored : array());
            return is_wp_error($rows) ? array() : $rows;
        },
        'schema' => array('type' => 'array', 'readonly' => true, 'context' => $contexts, 'items' => array(
            'type' => 'object', 'properties' => array(
                'dias' => array('type' => 'array', 'items' => array('type' => 'integer', 'minimum' => 1, 'maximum' => 7)),
                'inicio' => array('type' => 'string', 'pattern' => '^(?:[01][0-9]|2[0-3]):[0-5][0-9]$'),
                'fim' => array('type' => 'string', 'pattern' => '^(?:[01][0-9]|2[0-3]):[0-5][0-9]$'),
                'tipo' => array('type' => 'string', 'enum' => array('ao_vivo', 'gravado', 'reprise')),
                'observacao' => array('type' => 'string'),
            ),
        )),
    ));
}
