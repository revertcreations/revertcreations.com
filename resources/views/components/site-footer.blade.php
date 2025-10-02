@props(['variant' => 'public'])

@php($isAdmin = $variant === 'admin')

<footer class="bg-gradient-to-r from-gruvbox-purple via-gruvbox-light-purple to-gruvbox-purple px-6 py-4 text-sm font-semibold uppercase tracking-wide text-gruvbox-white">
    <div class="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 md:flex-row">
        @if ($isAdmin)
            <span>Admin • Revert Creations</span>
            <div class="flex items-center gap-4">
                <a href="{{ route('home') }}" class="hover:underline">Public Site</a>
                <a href="mailto:trever@revertcreations.com" class="hover:underline">Contact</a>
            </div>
        @else
            <span>Building in public — Trever Hillis</span>
            <div class="flex items-center gap-4">
                <a href="https://www.linkedin.com/in/trever-hillis-6961a779/" target="_blank" class="hover:underline">LinkedIn</a>
                <a href="mailto:trever@revertcreations.com" class="hover:underline">Email</a>
            </div>
        @endif
    </div>
</footer>
