# Sep 22–29, 2025 – Making The Watchlist Form Feel Nice

The watchlist dialog had been giving off total panic energy—every time I typed a name the cursor hopped around like it drank six espressos. On **Sep 22 at 9:06 PM EDT** (commit `b8957ec`) I finally called it: time to build my own text input wrapper so the UI would stop gaslighting me.

I threw together an `UncontrolledTextInput` that just… leaves people alone while they type. It keeps the “real” value in a ref, pokes the native field with `setNativeProps`, and only syncs React state when it’s ready. No more jitter, no more ghost deletes.

```ts
useImperativeHandle(ref, () => ({
  getValue: () => valueRef.current,
  setValue: (value: string) => {
    valueRef.current = value;
    setNativeText(value);
    onValueChange?.(value);
  },
  clear: () => {
    valueRef.current = '';
    setNativeText('');
  },
}));
```

Once the dialog behaved, I rode that momentum. The watchlist tab picked up the new component, the Expo badge updates stayed in sync, and I wrote a tiny QA checklist so anyone can sanity-check the floating labels. The polishing pass wrapped on **Sep 29 at 9:11 PM EDT** (commit `689c1f3`) when I tweaked the focus handling one last time.

The whole decision chain was basically: “Does this feel gross?” → “Yes” → “Okay, build the thing that makes it feel human.” Code’s just the vehicle. The fun part is when it stops fighting us and starts behaving like an actual app you’d be proud to hand to a friend.
