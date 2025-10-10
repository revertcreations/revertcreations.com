# Sep 5, 2025 – The Tamagui Detour

I couldn’t resist seeing what Tamagui felt like in the app, so I took a hard left and ported everything for a day. New tokens, new provider, new buttons—the whole nine. The dialog turned into a barebones modal, autocomplete got rebuilt from scratch, and I even added a `make dev-web-clear` script because Metro caches do not play nice with constant rewires.

```tsx
<TamaguiProvider config={config}>
  <Theme name={colorScheme === 'dark' ? 'dark' : 'light'}>
    {children}
  </Theme>
</TamaguiProvider>
```

In the end I backed out—Paper still fits our needs better right now—but the detour wasn’t wasted. We gained notification toggles on Account, the watchlist dialog logic is cleaner, and I know exactly what it’ll take if we ever run the migration for real. Sometimes you’ve gotta scratch the itch to move on.
