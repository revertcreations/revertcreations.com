@props(['variant' => 'public'])

@php($isAdmin = $variant === 'admin')

<footer class="bg-gradient-to-r from-gruvbox-charcoal via-gruvbox-stone to-gruvbox-charcoal px-6 py-4 text-sm font-semibold uppercase tracking-wide text-gruvbox-white">
    <div class="mx-auto flex w-full max-w-6xl items-center justify-between gap-2">
        @if ($isAdmin)
            <span>Admin • Revert Creations</span>
            <div class="flex items-center gap-4">
                <a href="{{ route('home') }}" class="hover:underline">Public Site</a>
                <a href="mailto:trever@revertcreations.com" class="hover:underline">Contact</a>
            </div>
        @else
            <div class="flex w-full justify-end">
                <a href="mailto:trever@revertcreations.com" class="hover:underline">Email</a>
            </div>
        @endif
    </div>
</footer>
