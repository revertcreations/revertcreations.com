import { SourceStateManager, STATE_CHANGED_EVENT } from './SourceStateManager';

class SourceViewer {
    constructor() {
        this.mountRoot = document.getElementById('source-viewer-root');
        if (!this.mountRoot) {
            return;
        }

        this.config = this.parseConfig(this.mountRoot.dataset.sourceViewer || '{}');
        this.statesMeta = this.config.states || {};
        if (!Object.keys(this.statesMeta).length) {
            return;
        }

        this.mountRoot.classList.remove('pointer-events-none');
        this.mountRoot.classList.add('source-viewer-mount');

        this.stateManager = new SourceStateManager(this.config);
        this.cache = new Map();
        this.activeState = this.stateManager.getActiveState();
        this.isOpen = false;
        this.previouslyFocused = null;

        this.handleStateChanged = this.handleStateChanged.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);

        window.addEventListener(STATE_CHANGED_EVENT, this.handleStateChanged);

        this.button = this.createButton();
        this.mountRoot.appendChild(this.button);
        this.buildOverlay();
        this.updateButtonBadge();
    }

    parseConfig(raw) {
        try {
            return JSON.parse(raw);
        } catch (error) {
            console.error('[SourceViewer] Failed to parse config', error);
            return { states: {} };
        }
    }

    createButton() {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'source-viewer-button';
        button.setAttribute('aria-haspopup', 'dialog');
        button.setAttribute('aria-expanded', 'false');
        button.innerHTML = `
            <span>View Source Code</span>
            <span class="source-viewer-badge"></span>
        `;
        button.addEventListener('click', () => this.openPanel());
        return button;
    }

    buildOverlay() {
        this.backdrop = document.createElement('div');
        this.backdrop.className = 'source-viewer-backdrop is-hidden';
        this.backdrop.addEventListener('click', () => this.closePanel());

        this.panel = document.createElement('div');
        this.panel.className = 'source-viewer-panel is-hidden';
        this.panel.setAttribute('role', 'dialog');
        this.panel.setAttribute('aria-modal', 'true');
        this.panel.setAttribute('aria-labelledby', 'source-viewer-heading');
        this.panel.setAttribute('aria-busy', 'false');

        const header = document.createElement('div');
        header.className = 'source-viewer-header';

        const titleWrap = document.createElement('div');
        titleWrap.className = 'source-viewer-heading';

        this.titleEl = document.createElement('h2');
        this.titleEl.id = 'source-viewer-heading';
        this.titleEl.className = 'source-viewer-title';
        this.titleEl.textContent = 'Source Code';

        this.subtitleEl = document.createElement('p');
        this.subtitleEl.className = 'source-viewer-subtitle';

        titleWrap.appendChild(this.titleEl);
        titleWrap.appendChild(this.subtitleEl);

        this.closeButton = document.createElement('button');
        this.closeButton.type = 'button';
        this.closeButton.className = 'source-viewer-close';
        this.closeButton.setAttribute('aria-label', 'Close source viewer');
        this.closeButton.innerHTML = '&times;';
        this.closeButton.addEventListener('click', () => this.closePanel());

        header.appendChild(titleWrap);
        header.appendChild(this.closeButton);

        this.panelBody = document.createElement('div');
        this.panelBody.className = 'source-viewer-body';

        this.panel.appendChild(header);
        this.panel.appendChild(this.panelBody);

        document.body.appendChild(this.backdrop);
        document.body.appendChild(this.panel);
    }

    updateButtonBadge() {
        if (!this.button) return;
        const badge = this.button.querySelector('.source-viewer-badge');
        const meta = this.statesMeta[this.activeState] || {};
        if (badge) {
            badge.textContent = meta.label || 'Unknown';
        }
        const hint = meta.badge_hint || meta.description || '';
        this.button.setAttribute('title', `Current view: ${hint || meta.label || this.activeState}`);
    }

    handleStateChanged(event) {
        const { state } = event.detail || {};
        this.activeState = state || this.activeState;
        this.updateButtonBadge();
        if (this.isOpen) {
            this.renderState();
        }
    }

    openPanel() {
        if (!this.panel || this.isOpen) return;
        this.isOpen = true;
        this.previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        this.backdrop.classList.remove('is-hidden');
        this.panel.classList.remove('is-hidden');
        this.button.setAttribute('aria-expanded', 'true');
        document.body.classList.add('source-viewer-scroll-lock');
        document.addEventListener('keydown', this.handleKeydown);
        this.closeButton.focus({ preventScroll: true });
        this.renderState();
    }

    closePanel() {
        if (!this.isOpen) return;
        this.isOpen = false;
        this.backdrop.classList.add('is-hidden');
        this.panel.classList.add('is-hidden');
        this.button.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('source-viewer-scroll-lock');
        document.removeEventListener('keydown', this.handleKeydown);
        if (this.previouslyFocused) {
            this.previouslyFocused.focus({ preventScroll: true });
        }
    }

    handleKeydown(event) {
        if (event.key === 'Escape') {
            event.preventDefault();
            this.closePanel();
            return;
        }

        if (event.key === 'Tab') {
            this.trapFocus(event);
        }
    }

    trapFocus(event) {
        const focusableSelectors = [
            'a[href]',
            'button:not([disabled])',
            'textarea:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
        ];
        const nodes = this.panel.querySelectorAll(focusableSelectors.join(','));
        const focusable = Array.from(nodes);
        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    async renderState() {
        if (!this.panelBody) return;
        const state = this.activeState;
        this.panel.setAttribute('aria-busy', 'true');
        this.panelBody.innerHTML = '<p class="source-viewer-loading">Loading source…</p>';
        this.titleEl.textContent = this.statesMeta[state]?.label || 'Source Code';
        this.subtitleEl.textContent = this.statesMeta[state]?.badge_hint || '';

        try {
            const payload = await this.fetchState(state);
            this.panel.setAttribute('aria-busy', 'false');
            this.renderFiles(payload);
        } catch (error) {
            console.error('[SourceViewer] Failed to load state', error);
            this.panel.setAttribute('aria-busy', 'false');
            this.renderError(error, state);
        }
    }

    async fetchState(state) {
        if (this.cache.has(state)) {
            return this.cache.get(state);
        }
        const response = await fetch(`/source-code/${state}`, {
            headers: {
                Accept: 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }
        const data = await response.json();
        this.cache.set(state, data);
        return data;
    }

    renderFiles(payload) {
        const { files = [], label, description } = payload;
        const container = document.createElement('div');
        container.className = 'source-viewer-section';

        if (description) {
            const desc = document.createElement('p');
            desc.className = 'source-viewer-description';
            desc.textContent = description;
            container.appendChild(desc);
        }

        if (files.length > 1) {
            const tabRow = document.createElement('div');
            tabRow.className = 'source-viewer-tabs';
            const contentWrap = document.createElement('div');
            contentWrap.className = 'source-viewer-tabpanel';

            files.forEach((file, index) => {
                const tabButton = document.createElement('button');
                tabButton.type = 'button';
                tabButton.className = 'source-viewer-tab';
                tabButton.textContent = file.displayName || `File ${index + 1}`;
                tabButton.setAttribute('data-index', index);
                tabButton.addEventListener('click', () => {
                    this.selectTab(contentWrap, files, index, tabRow);
                });
                tabRow.appendChild(tabButton);
                if (index === 0) {
                    tabButton.classList.add('is-active');
                }
            });

            container.appendChild(tabRow);
            container.appendChild(contentWrap);
            this.selectTab(contentWrap, files, 0, tabRow);
        } else if (files.length === 1) {
            container.appendChild(this.buildFileBlock(files[0]));
        } else {
            const empty = document.createElement('p');
            empty.className = 'source-viewer-empty';
            empty.textContent = 'No files available.';
            container.appendChild(empty);
        }

        this.panelBody.innerHTML = '';
        this.panelBody.appendChild(container);
    }

    selectTab(container, files, index, tabRow) {
        container.innerHTML = '';
        const file = files[index];
        container.appendChild(this.buildFileBlock(file));
        tabRow.querySelectorAll('button').forEach((button) => {
            button.classList.toggle('is-active', button.getAttribute('data-index') === String(index));
        });
    }

    buildFileBlock(file) {
        const wrapper = document.createElement('div');
        wrapper.className = 'source-viewer-file';

        const header = document.createElement('div');
        header.className = 'source-viewer-file-header';
        header.textContent = file.displayName || 'Untitled';

        const copyButton = document.createElement('button');
        copyButton.type = 'button';
        copyButton.className = 'source-viewer-copy';
        copyButton.textContent = 'Copy';
        copyButton.addEventListener('click', () => this.copyToClipboard(file.content || '', copyButton));

        header.appendChild(copyButton);

        const pre = document.createElement('pre');
        pre.className = 'source-viewer-code';
        const code = document.createElement('code');
        code.className = `language-${file.language || 'text'}`;
        code.textContent = file.content || '';
        pre.appendChild(code);

        wrapper.appendChild(header);
        wrapper.appendChild(pre);
        return wrapper;
    }

    async copyToClipboard(content, trigger) {
        const original = trigger.textContent;
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(content);
            } else {
                const textarea = document.createElement('textarea');
                textarea.value = content;
                textarea.setAttribute('readonly', '');
                textarea.style.position = 'absolute';
                textarea.style.left = '-9999px';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }
            trigger.textContent = 'Copied!';
            trigger.classList.add('text-gruvbox-green');
        } catch (error) {
            console.error('[SourceViewer] Copy failed', error);
            trigger.textContent = 'Copy failed';
            trigger.classList.add('text-gruvbox-red');
        } finally {
            setTimeout(() => {
                trigger.textContent = original;
                trigger.classList.remove('text-gruvbox-green', 'text-gruvbox-red');
            }, 1600);
        }
    }

    renderError(error, state) {
        this.panelBody.innerHTML = '';
        const wrapper = document.createElement('div');
        wrapper.className = 'source-viewer-error';
        const message = document.createElement('p');
        message.textContent = `We couldn't load the ${state} source right now.`;
        const hint = document.createElement('button');
        hint.type = 'button';
        hint.className = 'source-viewer-retry';
        hint.textContent = 'Retry';
        hint.addEventListener('click', () => this.renderState());
        wrapper.appendChild(message);
        wrapper.appendChild(hint);
        this.panelBody.appendChild(wrapper);
    }
}

export const bootstrapSourceViewer = () => new SourceViewer();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapSourceViewer, { once: true });
} else {
    bootstrapSourceViewer();
}
