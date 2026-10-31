<?php
/**
 * Plugin Name: Rede Alvorada — Complementos
 * Description: Fotografias de álbuns e faixas de exibição dos programas existentes.
 * Version: 1.0.0
 * Requires at least: 5.8
 * Requires PHP: 7.4
 * Author: Rede Alvorada
 * License: GPL-2.0-or-later
 * Text Domain: alvorada-content-tools
 */

namespace Alvorada\ContentTools;

defined('ABSPATH') || exit;

define(__NAMESPACE__ . '\VERSION', '1.0.0');
define(__NAMESPACE__ . '\PLUGIN_URL', plugin_dir_url(__FILE__));

require_once __DIR__ . '/includes/validation.php';
require_once __DIR__ . '/includes/gallery.php';
require_once __DIR__ . '/includes/schedule.php';
require_once __DIR__ . '/includes/rest.php';

add_action('add_meta_boxes_album', __NAMESPACE__ . '\gallery_box');
add_action('add_meta_boxes_programa', __NAMESPACE__ . '\schedule_box');
add_action('save_post_album', __NAMESPACE__ . '\save_gallery');
add_action('save_post_programa', __NAMESPACE__ . '\save_schedule');
add_action('rest_api_init', __NAMESPACE__ . '\register_fields');
add_action('admin_enqueue_scripts', function ($hook) {
    $screen = get_current_screen();
    if (!in_array($hook, array('post.php', 'post-new.php'), true) || !$screen || !in_array($screen->post_type, array('album', 'programa'), true)) {
        return;
    }
    wp_enqueue_style('alvorada-content-tools', PLUGIN_URL . 'assets/admin.css', array(), VERSION);
    if ('album' === $screen->post_type) {
        wp_enqueue_media();
        wp_enqueue_script('alvorada-gallery', PLUGIN_URL . 'assets/gallery.js', array('media-views', 'jquery-ui-sortable'), VERSION, true);
    } else {
        wp_enqueue_script('alvorada-schedule', PLUGIN_URL . 'assets/schedule.js', array(), VERSION, true);
    }
});
