/**
 * CustomSelect — upgrades a native <select> into a premium glassmorphism dropdown.
 * Keeps the original <select> hidden and in sync so all existing event listeners
 * (addEventListener('change', ...)) continue to fire automatically.
 *
 * Usage:
 *   import { CustomSelect } from './custom-select.js';
 *   new CustomSelect(document.getElementById('my-select'));
 */
export class CustomSelect {
  constructor(selectEl) {
    this.select   = selectEl;
    this.options  = Array.from(selectEl.options);
    this._build();
  }

  _build() {
    const { select, options } = this;

    /* ── Wrapper ─────────────────────────────────────── */
    const wrapper = document.createElement('div');
    wrapper.className = 'cs-wrapper';

    /* ── Trigger button ──────────────────────────────── */
    const trigger = document.createElement('button');
    trigger.className = 'cs-trigger';
    trigger.type = 'button';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');

    const labelEl = document.createElement('span');
    labelEl.className = 'cs-label';
    labelEl.textContent = options[select.selectedIndex]?.text ?? '';

    const arrowEl = document.createElement('span');
    arrowEl.className = 'cs-arrow';
    arrowEl.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2 4L6 8L10 4" stroke="currentColor" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;

    trigger.appendChild(labelEl);
    trigger.appendChild(arrowEl);

    /* ── Dropdown panel ──────────────────────────────── */
    const panel = document.createElement('div');
    panel.className = 'cs-panel';
    panel.setAttribute('role', 'listbox');

    options.forEach(opt => {
      const item = document.createElement('button');
      item.className = 'cs-item';
      item.type = 'button';
      item.setAttribute('role', 'option');
      item.dataset.value = opt.value;

      /* Icon slot (empty by default, can be extended) */
      const itemLabel = document.createElement('span');
      itemLabel.textContent = opt.text;

      const checkEl = document.createElement('span');
      checkEl.className = 'cs-check';
      checkEl.innerHTML = `
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;

      item.appendChild(itemLabel);
      item.appendChild(checkEl);

      if (opt.selected) item.classList.add('selected');

      item.addEventListener('click', () => {
        /* Update native select */
        select.value = opt.value;
        /* Update visual label */
        labelEl.textContent = opt.text;
        /* Update selected state on items */
        panel.querySelectorAll('.cs-item').forEach(el => el.classList.remove('selected'));
        item.classList.add('selected');
        /* Close panel */
        this._close();
        /* Fire native change event so existing listeners still work */
        select.dispatchEvent(new Event('change', { bubbles: true }));
      });

      panel.appendChild(item);
    });

    /* ── Toggle open/close ───────────────────────────── */
    trigger.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = panel.classList.contains('open');
      /* Close any other open dropdowns first */
      document.querySelectorAll('.cs-panel.open').forEach(p => {
        p.classList.remove('open');
        p.previousElementSibling?.setAttribute('aria-expanded', 'false');
        p.previousElementSibling?.querySelector('.cs-arrow')?.classList.remove('open');
      });
      if (!isOpen) {
        panel.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        arrowEl.classList.add('open');
      }
    });

    /* ── Close on outside click ──────────────────────── */
    document.addEventListener('click', () => this._close());

    /* ── Assemble ────────────────────────────────────── */
    wrapper.appendChild(trigger);
    wrapper.appendChild(panel);

    /* Hide native select, insert wrapper right after it */
    select.style.display = 'none';
    select.after(wrapper);

    this.wrapper  = wrapper;
    this.trigger  = trigger;
    this.labelEl  = labelEl;
    this.arrowEl  = arrowEl;
    this.panel    = panel;
  }

  _close() {
    this.panel.classList.remove('open');
    this.trigger.setAttribute('aria-expanded', 'false');
    this.arrowEl.classList.remove('open');
  }

  /** Programmatically set the selected value and sync the visual label */
  setValue(value) {
    const opt = this.options.find(o => o.value === value);
    if (!opt) return;
    this.select.value = value;
    this.labelEl.textContent = opt.text;
    this.panel.querySelectorAll('.cs-item').forEach(el => {
      el.classList.toggle('selected', el.dataset.value === value);
    });
  }

  /** Rebuild the custom dropdown from current native select options */
  updateOptions() {
    this.options = Array.from(this.select.options);
    // Clear existing panel items
    this.panel.innerHTML = '';
    
    // Rebuild panel items
    this.options.forEach(opt => {
      const item = document.createElement('button');
      item.className = 'cs-item';
      item.type = 'button';
      item.setAttribute('role', 'option');
      item.dataset.value = opt.value;

      const itemLabel = document.createElement('span');
      itemLabel.textContent = opt.text;

      const checkEl = document.createElement('span');
      checkEl.className = 'cs-check';
      checkEl.innerHTML = `
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;

      item.appendChild(itemLabel);
      item.appendChild(checkEl);

      if (opt.selected) {
        item.classList.add('selected');
        this.labelEl.textContent = opt.text;
      }

      item.addEventListener('click', () => {
        this.select.value = opt.value;
        this.labelEl.textContent = opt.text;
        this.panel.querySelectorAll('.cs-item').forEach(el => el.classList.remove('selected'));
        item.classList.add('selected');
        this._close();
        this.select.dispatchEvent(new Event('change', { bubbles: true }));
      });

      this.panel.appendChild(item);
    });
  }
}
