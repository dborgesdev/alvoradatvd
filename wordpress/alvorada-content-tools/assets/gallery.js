/* global document, window */
(function () {
    'use strict';
    const list = document.getElementById('act-photos');
    if (!list) return;
    const input = document.getElementById('act-photo-ids');
    const sync = () => {
        const items = Array.from(list.children);
        input.value = JSON.stringify(items.map(item => Number(item.dataset.id)));
        document.getElementById('act-photo-count').textContent = `${items.length} fotografia(s)`;
        items.forEach((item, index) => {
            item.querySelector('.act-prev').disabled = index === 0;
            item.querySelector('.act-next').disabled = index === items.length - 1;
        });
    };
    const button = (label, className, actionLabel) => {
        const element = document.createElement('button');
        element.type = 'button';
        element.className = `button ${className}`;
        element.textContent = label;
        if (actionLabel) element.setAttribute('aria-label', actionLabel);
        return element;
    };
    document.getElementById('act-add-photos').addEventListener('click', () => {
        const frame = window.wp.media({
            title: 'Adicionar fotografias', button: { text: 'Adicionar ao álbum' },
            library: { type: 'image' }, multiple: true,
        });
        frame.on('select', () => {
            const existing = new Set(Array.from(list.children, item => Number(item.dataset.id)));
            frame.state().get('selection').each(attachment => {
                const photo = attachment.toJSON();
                if (photo.type !== 'image' || existing.has(photo.id)) return;
                existing.add(photo.id);
                const item = document.createElement('li');
                item.className = 'act-photo';
                item.dataset.id = photo.id;
                const handle = document.createElement('span');
                handle.className = 'act-drag';
                handle.textContent = '↔ Arrastar';
                handle.setAttribute('aria-hidden', 'true');
                const image = document.createElement('img');
                image.src = photo.sizes?.thumbnail?.url || photo.url;
                image.alt = photo.alt || '';
                const caption = document.createElement('span');
                caption.textContent = `Fotografia #${photo.id}`;
                const actions = document.createElement('div');
                actions.className = 'act-photo-actions';
                actions.append(button('←', 'act-prev', 'Mover fotografia anterior'), button('→', 'act-next', 'Mover fotografia seguinte'), button('Remover', 'act-remove'));
                item.append(handle, image, caption, actions);
                list.append(item);
            });
            sync();
            frame.remove();
        });
        frame.open();
    });
    list.addEventListener('click', event => {
        const control = event.target.closest('button');
        if (!control) return;
        const item = control.closest('.act-photo');
        if (control.classList.contains('act-remove')) {
            const next = item.nextElementSibling || item.previousElementSibling;
            item.remove();
            (next?.querySelector('.act-remove') || document.getElementById('act-add-photos')).focus();
        } else if (control.classList.contains('act-prev') && item.previousElementSibling) {
            list.insertBefore(item, item.previousElementSibling);
        } else if (control.classList.contains('act-next') && item.nextElementSibling) {
            list.insertBefore(item.nextElementSibling, item);
        }
        sync();
    });
    window.jQuery(list).sortable({ items: '> li', handle: '.act-drag', update: sync });
    sync();
}());
