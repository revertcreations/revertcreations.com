# Sep 20, 2025 – Cashier Weekend Warrior

Spent Saturday getting serious about billing. Pulled in Laravel Cashier, let Stripe own the subscriptions, and added the migrations so users carry real plan records instead of our homemade enums. The new `BillingManager` handles checkout sessions, customer portal links, and even the webhook handshake that flips `plan` and `plan_renews_at` automatically.

```php
public function handleSubscriptionCreated(Event $event): void
{
    $customer = $this->users->findByStripeId($event->customer);
    $customer->markAsSubscribed($event->subscription, $event->currentPeriodEnd);
}
```

On the Expo side, the account screen now launches hosted checkout and the portal, updates state when you bounce back, and shows a friendly status pill. Tests cover the happy path end-to-end, so the next step is wiring plan gating and migrating the staging users into Stripe. Not bad for a weekend sprint.
