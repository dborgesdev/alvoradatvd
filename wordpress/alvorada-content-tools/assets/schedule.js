/* global document */
(function () {
    'use strict';
    const root = document.getElementById('act-schedule-ui');
    if (!root) return;
    const input = document.getElementById('act-schedule-data');
    const slots = document.getElementById('act-slots');
    const days = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
    let serial = 0;
    const sync = () => {
        const rows = Array.from(slots.children, slot => ({
            dias: Array.from(slot.querySelectorAll('[data-day]:checked'), checkbox => Number(checkbox.value)),
            inicio: slot.querySelector('[data-field="inicio"]').value,
            fim: slot.querySelector('[data-field="fim"]').value,
            tipo: slot.querySelector('[data-field="tipo"]').value,
            observacao: slot.querySelector('[data-field="observacao"]').value,
        }));
        input.value = JSON.stringify(rows);
        Array.from(slots.children).forEach((slot, index) => {
            slot.querySelector('legend').textContent = `Faixa ${index + 1}`;
            const start = slot.querySelector('[data-field="inicio"]');
            const end = slot.querySelector('[data-field="fim"]');
            const checked = slot.querySelector('[data-day]:checked');
            slot.querySelector('[data-day]').setCustomValidity(checked ? '' : 'Selecione pelo menos um dia.');
            end.setCustomValidity(start.value && end.value === start.value ? 'Início e fim devem ser diferentes.' : '');
            slot.querySelector('.act-overnight').textContent = start.value && end.value && end.value < start.value ? 'Termina no dia seguinte ao dia selecionado.' : '';
        });
    };
    const add = row => {
        const id = ++serial;
        const slot = document.createElement('fieldset');
        slot.className = 'act-slot';
        const legend = document.createElement('legend');
        slot.append(legend);
        const dayGroup = document.createElement('fieldset');
        dayGroup.className = 'act-days';
        const dayLegend = document.createElement('legend');
        dayLegend.textContent = 'Dias da semana';
        dayGroup.append(dayLegend);
        days.forEach((name, index) => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.dataset.day = '';
            checkbox.value = index + 1;
            checkbox.checked = row.dias.includes(index + 1);
            label.append(checkbox, document.createTextNode(name));
            dayGroup.append(label);
        });
        slot.append(dayGroup);
        const fields = [['inicio', 'Horário inicial', 'time'], ['fim', 'Horário final', 'time'], ['tipo', 'Tipo de exibição', 'select'], ['observacao', 'Observação (opcional)', 'textarea']];
        fields.forEach(([key, title, type]) => {
            const label = document.createElement('label');
            label.className = 'act-field';
            label.htmlFor = `act-${id}-${key}`;
            label.textContent = title;
            const field = document.createElement(type === 'time' ? 'input' : type);
            field.id = label.htmlFor;
            field.dataset.field = key;
            if (type === 'time') {
                field.type = 'time';
                field.step = '60';
                field.required = true;
                field.setAttribute('aria-describedby', 'act-time-help');
            }
            if (type === 'select') {
                [['ao_vivo', 'Ao vivo'], ['gravado', 'Gravado'], ['reprise', 'Reprise']].forEach(([value, text]) => {
                    const option = document.createElement('option');
                    option.value = value;
                    option.textContent = text;
                    field.append(option);
                });
            }
            field.value = row[key] || '';
            label.append(field);
            slot.append(label);
        });
        const overnight = document.createElement('p');
        overnight.className = 'act-overnight';
        overnight.setAttribute('aria-live', 'polite');
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'button';
        remove.textContent = 'Remover faixa';
        remove.addEventListener('click', () => {
            slot.remove();
            input.disabled = false;
            sync();
            document.getElementById('act-add-slot').focus();
            document.getElementById('act-schedule-status').textContent = 'Faixa removida. Salve o programa para confirmar.';
        });
        slot.append(overnight, remove);
        slots.append(slot);
        return slot;
    };
    const initial = JSON.parse(input.value);
    initial.forEach(add);
    const changed = () => { input.disabled = false; sync(); };
    root.addEventListener('input', changed);
    root.addEventListener('change', changed);
    document.getElementById('act-add-slot').addEventListener('click', () => {
        const slot = add({ dias: [], inicio: '', fim: '', tipo: 'ao_vivo', observacao: '' });
        input.disabled = false;
        sync();
        slot.querySelector('input').focus();
    });
    sync();
}());
