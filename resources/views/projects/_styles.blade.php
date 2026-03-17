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

            /* Prose styles for rendered markdown */
            .project-prose {
                color: var(--terminal-text);
            }

            .project-prose p {
                margin-bottom: 1.25rem;
                line-height: 1.75;
            }

            .project-prose h2:first-child {
                margin-top: 0;
            }

            .project-prose h2 {
                color: var(--terminal-yellow);
                font-size: 1.125rem;
                font-weight: 700;
                margin-top: 1.75rem;
                margin-bottom: 0.5rem;
            }

            .project-prose h3,
            .project-prose h4 {
                color: var(--terminal-yellow);
                font-size: 1.1rem;
                font-weight: 600;
                margin-top: 1.5rem;
                margin-bottom: 0.75rem;
            }

            .project-prose a {
                color: var(--terminal-accent);
                text-decoration: underline;
                text-underline-offset: 3px;
            }

            .project-prose a:hover {
                color: var(--terminal-yellow);
            }

            .project-prose strong {
                color: var(--terminal-text);
                font-weight: 600;
            }

            .project-prose code {
                background: rgba(60, 56, 54, 0.6);
                padding: 0.15rem 0.35rem;
                border-radius: 0.4rem;
                font-size: 0.85em;
            }

            .project-prose pre {
                background: var(--terminal-bg);
                border: 1px solid var(--terminal-border);
                border-radius: 0.6rem;
                padding: 1rem;
                overflow-x: auto;
                margin: 1.25rem 0;
            }

            .project-prose pre code {
                background: none;
                padding: 0;
                border-radius: 0;
                font-size: 0.85rem;
            }

            .project-prose ul,
            .project-prose ol {
                margin: 1rem 0;
                padding-left: 1.5rem;
            }

            .project-prose ul {
                list-style: disc;
            }

            .project-prose ol {
                list-style: decimal;
            }

            .project-prose li {
                line-height: 1.75;
            }

            .project-prose li + li {
                margin-top: 0.35rem;
            }

            .project-prose blockquote {
                border-left: 3px solid var(--terminal-accent);
                padding-left: 1rem;
                margin: 1.25rem 0;
                color: var(--terminal-subtle);
                font-style: italic;
            }

            .project-prose img {
                max-width: 100%;
                border-radius: 0.5rem;
                margin: 1.25rem 0;
            }

            .project-prose hr {
                border: none;
                border-top: 1px solid var(--terminal-border);
                margin: 2rem 0;
            }

            .word-break {
                word-break: break-word;
            }
        </style>
    @endpush
@endonce
