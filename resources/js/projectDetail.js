(() => {
    const init = () => {
        const projectRoot = document.querySelector('[data-project-detail]');
        if (!projectRoot) {
            return;
        }

        const body = document.body;
        let activeThumb = null;
        let modalOverlay = null;

        const closeModal = ({ preserveThumb = false } = {}) => {
            if (!modalOverlay) {
                return;
            }

            document.removeEventListener('keydown', handleEscape);
            modalOverlay.remove();
            modalOverlay = null;
            body.classList.remove('hire-modal-open');

            if (!preserveThumb && activeThumb) {
                activeThumb.classList.remove('is-active');
                activeThumb = null;
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                closeModal();
            }
        };

        const openModal = (content, { preserveThumb = false, variant = 'default' } = {}) => {
            closeModal({ preserveThumb });

            modalOverlay = document.createElement('div');
            modalOverlay.classList.add('hire-modal-overlay');
            if (variant === 'media') {
                modalOverlay.classList.add('hire-modal-overlay--media');
            }
            modalOverlay.setAttribute('role', 'dialog');
            modalOverlay.setAttribute('aria-modal', 'true');
            modalOverlay.addEventListener('click', (event) => {
                if (event.target === modalOverlay) {
                    closeModal({ preserveThumb });
                }
            });

            const modal = document.createElement('div');
            modal.classList.add('hire-modal');
            if (variant === 'media') {
                modal.classList.add('hire-modal--media');
            }
            modalOverlay.appendChild(modal);

            const closeButton = document.createElement('button');
            closeButton.type = 'button';
            closeButton.classList.add('hire-modal-close');
            if (variant === 'media') {
                closeButton.classList.add('hire-modal-close--media');
            }
            closeButton.setAttribute('aria-label', 'Close dialog');
            closeButton.innerHTML = '&times;';
            closeButton.addEventListener('click', () => closeModal({ preserveThumb }));
            modal.appendChild(closeButton);

            if (variant === 'media') {
                modal.appendChild(content);
            } else {
                const header = document.createElement('div');
                header.classList.add('hire-modal-header');
                modal.insertBefore(header, closeButton);
                header.appendChild(closeButton);

                const modalBody = document.createElement('div');
                modalBody.classList.add('hire-modal-body', 'project-modal-body');
                modal.appendChild(modalBody);
                modalBody.appendChild(content);
            }

            body.appendChild(modalOverlay);
            body.classList.add('hire-modal-open');
            document.addEventListener('keydown', handleEscape);

            if (typeof closeButton.focus === 'function') {
                requestAnimationFrame(() => {
                    closeButton.focus({ preventScroll: true });
                });
            }
        };

        const renderFeaturedAsset = (button) => {
            const type = button.dataset.assetType;
            const url = button.dataset.assetUrl;

            if (!type || !url) {
                return;
            }

            const title = button.dataset.assetTitle;
            const caption = button.dataset.assetCaption;

            if (type === 'image') {
                const img = document.createElement('img');
                img.src = url;
                img.alt = title || 'Project asset';
                img.loading = 'lazy';

                openModal(img, { preserveThumb: true, variant: 'media' });
                return;
            }

            const content = document.createElement('div');
            content.classList.add('project-modal-content');

            if (title && type !== 'image') {
                const heading = document.createElement('h2');
                heading.textContent = title;
                content.appendChild(heading);
            }

            const figure = document.createElement('figure');
            figure.classList.add('project-modal-asset');

            if (type === 'video') {
                const iframe = document.createElement('iframe');
                iframe.src = url;
                iframe.title = title || 'Project video';
                iframe.setAttribute('allowfullscreen', '');
                iframe.loading = 'lazy';
                figure.appendChild(iframe);
            } else {
                const link = document.createElement('a');
                link.href = url;
                link.target = '_blank';
                link.rel = 'noopener';
                link.classList.add('terminal-link');
                link.textContent = title || url;
                figure.appendChild(link);
            }

            if (caption) {
                const figcaption = document.createElement('figcaption');
                figcaption.textContent = caption;
                figure.appendChild(figcaption);
            }

            content.appendChild(figure);
            openModal(content, { preserveThumb: true });
        };

        projectRoot.querySelectorAll('[data-featured-thumb]').forEach((button) => {
            button.addEventListener('click', () => {
                if (activeThumb && activeThumb !== button) {
                    activeThumb.classList.remove('is-active');
                }

                button.classList.add('is-active');
                activeThumb = button;
                renderFeaturedAsset(button);
            });
        });

        projectRoot.querySelectorAll('[data-update-trigger]').forEach((button) => {
            button.addEventListener('click', () => {
                const templateId = button.dataset.updateTrigger;
                const template = templateId ? document.getElementById(templateId) : null;

                if (!template) {
                    return;
                }

                const fragment = template.content.cloneNode(true);
                const modalContent = fragment.querySelector('.project-modal-content') || fragment.firstElementChild;

                if (!modalContent) {
                    return;
                }

                openModal(modalContent);
            });
        });

    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
