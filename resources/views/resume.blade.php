<x-layout>
    <div class="w-full py-6 px-4">
        <div class="mx-auto" style="max-width: 860px;">
            <div class="flex justify-end mb-4">
                <a href="{{ route('resume.download') }}"
                   class="text-sm text-gruvbox-yellow underline hover:text-gruvbox-orange">
                    Download PDF
                </a>
            </div>
            <div id="pdf-container" class="flex flex-col items-center gap-6"></div>
        </div>
    </div>

    @push('scripts')
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
    <script>
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

        (async () => {
            const pdfUrl = '{{ asset('TreverHillisResume2026.pdf') }}';
            const container = document.getElementById('pdf-container');
            const pdf = await pdfjsLib.getDocument(pdfUrl).promise;

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const dpr = window.devicePixelRatio || 1;
                const containerWidth = container.clientWidth || 800;

                const baseViewport = page.getViewport({ scale: 1 });
                const displayScale = containerWidth / baseViewport.width;
                const displayViewport = page.getViewport({ scale: displayScale });
                const renderViewport = page.getViewport({ scale: displayScale * dpr });

                const pageWrapper = document.createElement('div');
                pageWrapper.style.cssText = `position:relative;width:${displayViewport.width}px;height:${displayViewport.height}px;box-shadow:0 2px 16px rgba(0,0,0,0.6);`;

                const canvas = document.createElement('canvas');
                canvas.width = renderViewport.width;
                canvas.height = renderViewport.height;
                canvas.style.cssText = `position:absolute;top:0;left:0;width:${displayViewport.width}px;height:${displayViewport.height}px;`;

                pageWrapper.appendChild(canvas);
                container.appendChild(pageWrapper);

                await page.render({ canvasContext: canvas.getContext('2d'), viewport: renderViewport }).promise;

                // Overlay clickable links from PDF annotations
                const annotations = await page.getAnnotations();
                for (const ann of annotations) {
                    if (ann.subtype !== 'Link' || !ann.url) continue;

                    const rect = displayViewport.convertToViewportRectangle(ann.rect);
                    const x = Math.min(rect[0], rect[2]);
                    const y = Math.min(rect[1], rect[3]);
                    const w = Math.abs(rect[2] - rect[0]);
                    const h = Math.abs(rect[3] - rect[1]);

                    const link = document.createElement('a');
                    link.href = ann.url;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    link.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;cursor:pointer;`;
                    pageWrapper.appendChild(link);
                }
            }
        })();
    </script>
    @endpush
</x-layout>
