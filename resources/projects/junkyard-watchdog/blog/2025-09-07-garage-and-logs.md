# Sep 7, 2025 – Garage Love & Better Logs

Today was all about making the garage tab feel like a place you actually want to hang out. I tightened up the list layout, styled the matches drill-down, and dropped in a lightweight Home screen that bubbles up nearby finds without rearranging the main tab order.

On the ops side, I finally wired client-side errors into the backend so when Expo throws a fit we see it in `/admin/client-logs`. Everything flows through console overrides with some throttling so the logs stay readable.

```ts
const originalError = console.error;
console.error = (...args) => {
  sendClientLog('error', args);
  originalError(...args);
};
```

Add in the new Expo ticket storage, a scheduled receipts poller, and a fresh batch of tests (`make test-all` is happy again), and the app feels way more trustworthy. That’s the kind of Sunday sprint I can get behind.
