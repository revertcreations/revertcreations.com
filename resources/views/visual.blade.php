<x-layout>

    <div class="visual-page mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-6 md:px-6 lg:px-8">
        <section id="videos" class="flex flex-col gap-6" data-visual-section>
            <i class="mt-1 inline-block rounded bg-black px-3 py-1 text-xl font-semibold uppercase tracking-wide text-white md:text-3xl lg:text-4xl">Videos</i>
            <div class="visual-short">
                <iframe width="560" height="315" src="https://www.youtube.com/embed/MXbiPwPgKbY?si=2HXEymkjObm31A_A" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
            <div class="visual-short">
                <iframe width="560" height="315" src="https://www.youtube.com/embed/c7jHeDIc7Ek?si=D--wBzpNOJz2sLOz" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
        </section>


        <section id="shorts" class="flex flex-col gap-6" data-visual-section>
            <i class="mt-1 inline-block rounded bg-black px-3 py-1 text-xl font-semibold uppercase tracking-wide text-white md:text-3xl lg:text-4xl">Shorts</i>
            <div class="visual-shorts">
                <div class="visual-short">
                    <iframe class="visual-short__frame"
                        src="https://youtube.com/embed/jikZedWNWO4?si=d4NUNcjbJKjt4Acz"
                        title="Charvel Jake E Lee"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen></iframe>
                </div>

                <div class="visual-short">
                    <iframe class="visual-short__frame"
                        src="https://youtube.com/embed/CiOJgVWf9pE?feature=share"
                        title="1980 Gibson Firebrand"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen></iframe>
                </div>

                <div class="visual-short">
                    <iframe class="visual-short__frame"
                        src="https://youtube.com/embed/xcynwkfcXaQ?feature=share"
                        title="2008 EVH Wolfgang USA"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen></iframe>
                </div>
            </div>
        </section>

        <section id="photography" class="flex flex-col gap-6" data-visual-section>
            <i class="mt-1 inline-block rounded bg-black px-3 py-1 text-xl font-semibold uppercase tracking-wide text-white md:text-3xl lg:text-4xl">Photography</i>

            <div class="visual-thumbnail-grid" id="thumbnail_wrap">
                @foreach ($portfolio as $index => $image)
                    <button
                        type="button"
                        class="visual-thumbnail"
                        data-visual-image
                        data-full="https://res.cloudinary.com/junkyardwatchdog/image/upload/{{ $image->public_id }}.{{ $image->extension }}"
                        data-alt="{{ $image->title ?? $image->description ?? 'Photography portfolio image' }}"
                        aria-label="{{ $image->title ?? $image->description ?? 'Open portfolio image in full screen' }}">
                        <img
                            class="visual-thumbnail__image"
                            loading="lazy"
                            src="https://res.cloudinary.com/junkyardwatchdog/image/upload/w_400,c_scale,q_auto:low/{{ $image->public_id }}.{{ $image->extension }}"
                            alt="{{ $image->title ?? $image->description ?? 'Photography portfolio image' }}">
                    </button>
                @endforeach
            </div>

        </section>


    </div>

    <div aria-hidden="true" class="visual-overlay" id="visual-overlay">
        <button aria-label="Close full screen image" class="visual-overlay__close" id="visual-overlay-close" type="button">&times;</button>
        <img alt="" class="visual-overlay__image" id="visual-overlay-image" loading="lazy">
    </div>

    @push('styles')
        <style>
            .visual-page {
                width: 100%;
            }

            .visual-shorts {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
                align-items: center;
            }

            @media (min-width: 768px) {
                .visual-shorts {
                    flex-direction: row;
                    justify-content: center;
                }
            }

            .visual-short {
                display: flex;
                justify-content: center;
            }

            .visual-short__frame {
                aspect-ratio: 9 / 16;
                width: min(90vw, 20rem);
                border: 0;
                border-radius: 0.75rem;
                background-color: #000;
                box-shadow: 0 15px 45px rgba(0, 0, 0, 0.4);
            }

            @media (min-width: 1024px) {
                .visual-short__frame {
                    width: 19.5rem;
                }
            }

            .visual-thumbnail-grid {
                display: grid;
                gap: 1rem;
                grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                width: 100%;
            }

            @media (min-width: 640px) {
                .visual-thumbnail-grid {
                    gap: 1.25rem;
                    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                }
            }

            @media (min-width: 1024px) {
                .visual-thumbnail-grid {
                    gap: 1.5rem;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                }
            }

            .visual-thumbnail {
                background: none;
                border: 0;
                cursor: pointer;
                display: block;
                padding: 0;
                position: relative;
            }

            .visual-thumbnail:focus-visible {
                outline: 3px solid #fabd2f;
                outline-offset: 4px;
            }

            .visual-thumbnail__image {
                width: 100%;
                height: 100%;
                border-radius: 0.75rem;
                object-fit: cover;
                box-shadow: 0 12px 35px rgba(0, 0, 0, 0.35);
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }

            .visual-thumbnail:hover .visual-thumbnail__image,
            .visual-thumbnail:focus-visible .visual-thumbnail__image {
                transform: scale(1.03);
                box-shadow: 0 18px 45px rgba(0, 0, 0, 0.4);
            }

            .visual-overlay {
                position: fixed;
                inset: 0;
                z-index: 999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1.5rem;
                background-color: rgba(0, 0, 0, 0.92);
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
            }

            .visual-overlay.is-open {
                opacity: 1;
                visibility: visible;
            }

            .visual-overlay__image {
                max-height: 90vh;
                max-width: 100%;
                object-fit: contain;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
            }

            .visual-overlay__close {
                position: absolute;
                top: 1.5rem;
                right: 1.5rem;
                background: rgba(0, 0, 0, 0.65);
                border: 2px solid #fff;
                border-radius: 9999px;
                color: #fff;
                cursor: pointer;
                font-size: 1.75rem;
                line-height: 1;
                padding: 0.4rem 0.85rem 0.55rem;
            }

            .visual-overlay__close:hover,
            .visual-overlay__close:focus-visible {
                background: rgba(255, 255, 255, 0.18);
                color: #fff;
            }

            body.visual-overlay-active {
                overflow: hidden;
            }
        </style>
    @endpush

    @push('scripts')
        <script>
            document.addEventListener('DOMContentLoaded', function () {
                const overlay = document.getElementById('visual-overlay');
                const overlayImage = document.getElementById('visual-overlay-image');
                const closeButton = document.getElementById('visual-overlay-close');

                if (!overlay || !overlayImage) {
                    return;
                }

                const triggers = document.querySelectorAll('[data-visual-image]');
                const body = document.body;
                const sections = document.querySelectorAll('[data-visual-section]');
                let activeTrigger = null;
                let lastScrollY = 0;

                function openImage(event) {
                    const trigger = event.currentTarget;
                    const fullSrc = trigger.dataset.full;

                    if (!fullSrc) {
                        return;
                    }

                    lastScrollY = window.scrollY || document.documentElement.scrollTop || 0;

                    overlayImage.src = fullSrc;
                    overlayImage.alt = trigger.dataset.alt || 'Visual portfolio image';

                    overlay.classList.add('is-open');
                    overlay.setAttribute('aria-hidden', 'false');

                    body.classList.add('visual-overlay-active');
                    sections.forEach(function (section) {
                        section.classList.add('hidden');
                    });

                    activeTrigger = trigger;

                    if (closeButton) {
                        requestAnimationFrame(function () {
                            closeButton.focus();
                        });
                    }

                    document.addEventListener('keydown', handleKeydown);
                }

                function closeImage() {
                    overlay.classList.remove('is-open');
                    overlay.setAttribute('aria-hidden', 'true');

                    overlayImage.src = '';
                    overlayImage.alt = '';

                    body.classList.remove('visual-overlay-active');
                    sections.forEach(function (section) {
                        section.classList.remove('hidden');
                    });

                    document.removeEventListener('keydown', handleKeydown);

                    if (activeTrigger) {
                        activeTrigger.focus();
                        activeTrigger = null;
                    }

                    window.requestAnimationFrame(function () {
                        window.scrollTo(0, lastScrollY || 0);
                    });
                }

                function handleKeydown(event) {
                    if (event.key === 'Escape') {
                        closeImage();
                    }
                }

                triggers.forEach(function (trigger) {
                    trigger.addEventListener('click', openImage);
                });

                if (closeButton) {
                    closeButton.addEventListener('click', closeImage);
                }

                overlay.addEventListener('click', function (event) {
                    if (event.target === overlay) {
                        closeImage();
                    }
                });
            });
        </script>
    @endpush

</x-layout>
