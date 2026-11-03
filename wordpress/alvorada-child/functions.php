<?php
/**
 * Alvorada FM - Child Theme Functions
 * Desenvolvido por Smart Local
 */

// 1. Redireciona acessos single/arquivos do WP para o Front-end (caso acessem links do WP vindos do Google)
add_action('template_redirect', 'smart_local_redirecionar_para_frontend');
function smart_local_redirecionar_para_frontend() {
    // Se não for a tela de login, o painel admin, ou chamadas de API, joga para o front-end
    if (!is_admin() && !$file && !defined('REST_REQUEST')) {
        $slug = get_post_field('post_name', get_post());
        $post_type = get_post_type();
        
        // Se for um post do blog, joga para a rota interna correspondente no React
        if (is_single() && $post_type == 'post') {
            wp_redirect('https://alvoradatvd.com/' . $slug, 301);
            exit;
        }
        
        // Fallback para qualquer outra página residual
        wp_redirect('https://alvoradatvd.com', 301);
        exit;
    }
}

/**
 * Permite que Editores utilizem o WP REST Cache.
 */
add_filter('wp_rest_cache/settings_capability', function ($capability) {
    return 'edit_posts';
});
