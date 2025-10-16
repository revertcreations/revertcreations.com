<x-layout :title="'Magnet Board Lab'">
    <div class="flex w-full flex-1 flex-col gap-6 p-4 text-gruvbox-gray sm:p-6 md:p-8">
        <header class="space-y-2">
            <h1 class="text-3xl font-bold md:text-4xl">Magnet Board Lab</h1>
            <p class="max-w-2xl text-base md:text-lg">
                Use this sandbox to exercise the refactored <code>MagnetBoard</code> logic as you iterate. Feel
                free to tweak the markup below or paste new scenarios while you work.
            </p>
        </header>

        <section class="flex-1 rounded-lg border border-gruvbox-gray bg-gruvbox-black p-4 md:p-6">
            <div class="mb-4 text-sm uppercase tracking-wide text-gruvbox-yellow">Lead Content</div>

            <div class="relative space-y-4 text-lg leading-relaxed md:text-xl md:leading-relaxed"
                id="lead">
                <content-element>
                    Double-click any <interactive-element>interactive</interactive-element> element to toggle magnet
                    mode. The
                    refactor should keep nearby content like this <hint-element data-content="sandbox hint">
                        hint-element</hint-element> intact so you can compare behaviour against production.
                </content-element>
                <p>
                    Add more test text or components here to stress the board. Mix in <strong>bold</strong>,
                    <em>italic</em>, and other inline spans to see how letterization responds.
                </p>
            </div>
        </section>
    </div>
</x-layout>
