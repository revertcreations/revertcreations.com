@once
    @push('styles')
        <style>
            :root {
                --terminal-bg: #1d2021;
                --terminal-surface: #282828;
                --terminal-border: #3c3836;
                --terminal-border-strong: #504945;
                --terminal-text: #ebdbb2;
                --terminal-subtle: #a89984;
                --terminal-accent: #83a598;
                --terminal-orange: #fe8019;
                --terminal-yellow: #fabd2f;
                --terminal-green: #b8bb26;
                --terminal-blue: #83a598;
                --terminal-purple: #d3869b;
            }

            .project-terminal {
                color: var(--terminal-text);
            }

            .terminal-card {
                background: var(--terminal-surface);
                border: 1px solid var(--terminal-border);
                border-radius: 0.75rem;
                padding: 1.5rem;
                box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.25);
            }

            .terminal-card--accent {
                border-color: var(--terminal-border);
            }

            .terminal-grid {
                display: grid;
                gap: 2.5rem;
            }

            @media (min-width: 1024px) {
                .terminal-grid {
                    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
                }
            }

            .terminal-badge {
                border: 1px solid var(--terminal-border-strong);
                border-radius: 9999px;
                padding: 0.15rem 0.75rem;
                font-size: 0.7rem;
                letter-spacing: 0.2em;
                text-transform: uppercase;
            }

            .terminal-link {
                color: var(--terminal-accent);
                border-bottom: 1px dotted var(--terminal-accent);
                text-decoration: none;
            }

            .terminal-link:hover {
                color: var(--terminal-yellow);
                border-bottom-color: var(--terminal-yellow);
            }

            .asset-grid {
                display: grid;
                gap: 1rem;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            }

            @media (min-width: 640px) {
                .asset-grid--gallery {
                    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
                }
            }

            .asset-figure {
                border: 1px solid var(--terminal-border);
                border-radius: 0.75rem;
                background: var(--terminal-bg);
                overflow: hidden;
                display: flex;
                flex-direction: column;
                min-width: 0;
            }

            .asset-figure img,
            .asset-figure iframe {
                display: block;
                width: 100%;
                border-bottom: 1px solid var(--terminal-border);
                object-fit: cover;
            }

            .asset-image-wrapper {
                max-width: 480px;
                width: 100%;
                margin: 0 auto;
            }

            .asset-image-wrapper img {
                width: 100%;
                height: auto;
                object-fit: contain;
            }

            .asset-figure figcaption {
                padding: 0.75rem 1rem;
                font-size: 0.8rem;
                color: var(--terminal-subtle);
            }

            .featured-asset-thumbnails {
                display: grid;
                gap: 0.75rem;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            }

            .featured-asset-thumb {
                background: var(--terminal-bg);
                border: 1px solid var(--terminal-border);
                border-radius: 0.6rem;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                padding: 0.5rem;
                text-align: left;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                font-family: inherit;
                color: inherit;
            }

            .featured-asset-thumb:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
            }

            .featured-asset-thumb.is-active {
                border-color: var(--terminal-yellow);
                box-shadow: 0 0 0 1px rgba(250, 189, 47, 0.4);
            }

            .featured-asset-thumb img {
                width: 100%;
                border-radius: 0.4rem;
                aspect-ratio: 4 / 3;
                object-fit: cover;
            }

            .featured-asset-thumb__placeholder {
                align-items: center;
                aspect-ratio: 4 / 3;
                background: rgba(131, 165, 152, 0.2);
                border-radius: 0.4rem;
                display: flex;
                font-weight: 600;
                font-size: 1.1rem;
                justify-content: center;
                color: var(--terminal-accent);
            }

            .featured-asset-thumb__label {
                font-size: 0.65rem;
                letter-spacing: 0.18em;
                text-transform: uppercase;
                color: var(--terminal-subtle);
                line-height: 1.3;
            }

            .timeline-entry {
                border: 1px solid var(--terminal-border);
                border-radius: 0.75rem;
                background: var(--terminal-bg);
                padding: 1.25rem;
            }

            .timeline-entry__title {
                color: var(--terminal-yellow);
                font-size: 1rem;
                margin: 0;
            }

            .timeline-entry__meta {
                font-size: 0.65rem;
                letter-spacing: 0.2em;
                text-transform: uppercase;
                color: var(--terminal-subtle);
                margin-top: 0.25rem;
            }

            .timeline-entry__excerpt {
                margin-top: 0.75rem;
                font-size: 0.85rem;
                color: var(--terminal-text);
            }

            .timeline-entry__actions {
                margin-top: 1rem;
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.75rem;
            }

            .timeline-entry__button {
                background: none;
                border: none;
                color: inherit;
                font: inherit;
                padding: 0;
                cursor: pointer;
            }

            .markdown-body p {
                margin-bottom: 1rem;
            }

            .markdown-body h2,
            .markdown-body h3,
            .markdown-body h4 {
                color: var(--terminal-yellow);
                margin-top: 1.5rem;
                margin-bottom: 0.75rem;
            }

            .markdown-body code {
                background: rgba(60, 56, 54, 0.6);
                padding: 0.15rem 0.35rem;
                border-radius: 0.4rem;
                font-size: 0.85rem;
            }

            .markdown-body pre {
                background: rgba(40, 40, 40, 0.9);
                border: 1px solid var(--terminal-border);
                border-radius: 0.6rem;
                padding: 1rem;
                overflow-x: auto;
            }

            .markdown-body ul,
            .markdown-body ol {
                margin: 1rem 0;
                padding-left: 1.5rem;
            }

            .markdown-body ul {
                list-style: disc;
            }

            .markdown-body ol {
                list-style: decimal;
            }

            .markdown-body li + li {
                margin-top: 0.35rem;
            }

            .word-break {
                word-break: break-word;
            }

            .timeline-entry {
                overflow: hidden;
            }

            @media (min-width: 1024px) {
                .featured-asset-thumb__label {
                    font-size: 0.6rem;
                }
            }

            .project-modal-body {
                width: 100%;
                padding: 0 1.25rem 1.5rem;
            }

            .project-modal-content {
                width: min(900px, 100%);
                color: var(--terminal-text);
                font-family: inherit;
            }

            .project-modal-content h2 {
                font-size: 1.75rem;
                color: var(--terminal-yellow);
                margin-bottom: 0.5rem;
            }

            .project-modal-content time {
                display: block;
                margin-bottom: 1.25rem;
                font-size: 0.75rem;
                letter-spacing: 0.18em;
                text-transform: uppercase;
                color: var(--terminal-subtle);
            }

            .project-modal-assets {
                display: grid;
                gap: 1rem;
                margin-bottom: 1.5rem;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            }

            .project-modal-assets figure,
            .project-modal-asset {
                border: 1px solid var(--terminal-border);
                border-radius: 0.75rem;
                overflow: hidden;
                background: var(--terminal-bg);
            }

            .project-modal-assets img,
            .project-modal-assets iframe,
            .project-modal-asset img,
            .project-modal-asset iframe {
                display: block;
                width: 100%;
                aspect-ratio: 16 / 9;
                object-fit: contain;
                background: rgba(24, 24, 24, 0.35);
            }

            .project-modal-assets figcaption,
            .project-modal-asset figcaption {
                padding: 0.75rem 1rem;
                font-size: 0.8rem;
                color: var(--terminal-subtle);
            }

            .project-modal-body .markdown-body {
                color: var(--terminal-text);
                font-size: 0.95rem;
            }

            .hire-modal-overlay--media {
                background: rgba(0, 0, 0, 0.85);
                padding: 2rem;
            }

            .hire-modal--media {
                width: auto;
                max-width: 95vw;
                max-height: 95vh;
                background: transparent;
                border-radius: 0;
                box-shadow: none;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: visible;
                padding: 0;
            }

            .hire-modal--media img {
                max-width: min(95vw, 1400px);
                max-height: 90vh;
                width: auto;
                height: auto;
                display: block;
                object-fit: contain;
                border-radius: 0.75rem;
                box-shadow: 0 24px 48px rgba(0, 0, 0, 0.55);
            }

            .hire-modal-close--media {
                position: absolute;
                top: 0.75rem;
                right: 0.75rem;
                font-size: 3rem;
                line-height: 1;
                color: #fb3934;
                background: none;
                border: none;
                cursor: pointer;
                text-shadow: 0 0 12px rgba(0, 0, 0, 0.6);
                transition: color 150ms ease, transform 150ms ease;
            }

            .hire-modal-close--media:hover,
            .hire-modal-close--media:focus {
                color: #ff6b6b;
                transform: scale(1.05);
            }
        </style>
    @endpush
@endonce
