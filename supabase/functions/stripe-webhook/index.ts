// Supabase Edge Function (Deno). Receives Stripe subscription lifecycle events and
// keeps the `subscriptions` table (the RLS gate for Cross PC Sync) in sync.
//
// Register this function's URL as a Stripe webhook endpoint for these events:
//   checkout.session.completed, customer.subscription.updated, customer.subscription.deleted
//
// Required secrets: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_URL,
// SUPABASE_SERVICE_ROLE_KEY (see create-checkout-session for how to set these).

import Stripe from 'npm:stripe@17';
import { createClient } from 'npm:@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2024-06-20',
});
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';

const admin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

Deno.serve(async (req: Request) => {
  const signature = req.headers.get('stripe-signature');
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature ?? '', webhookSecret);
  } catch (err) {
    return new Response(`Webhook signature verification failed: ${(err as Error).message}`, {
      status: 400,
    });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;
      if (userId && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        await admin.from('subscriptions').upsert({
          user_id: userId,
          status: subscription.status,
          stripe_customer_id: subscription.customer as string,
          stripe_subscription_id: subscription.id,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
      break;
    }
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      await admin
        .from('subscriptions')
        .update({
          status: subscription.status,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id);
      break;
    }
    default:
      break;
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
