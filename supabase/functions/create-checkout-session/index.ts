// Supabase Edge Function (Deno). Deploy with the Supabase MCP tool `deploy_edge_function`
// once a project exists. Requires these function secrets to be set first (Supabase
// dashboard -> Project Settings -> Edge Functions -> Secrets), since only the account
// owner has the real Stripe keys:
//   STRIPE_SECRET_KEY, STRIPE_PRICE_ID, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL
//
// Called by the desktop app with the signed-in user's JWT in the Authorization header.
// Returns a Stripe Checkout URL that the app opens via shell.openExternal — the app
// itself never sees the Stripe secret key.

import Stripe from 'npm:stripe@17';
import { createClient } from 'npm:@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2024-06-20',
});

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const priceId = Deno.env.get('STRIPE_PRICE_ID') ?? '';

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const authHeader = req.headers.get('Authorization') ?? '';
  const jwt = authHeader.replace('Bearer ', '');
  if (!jwt) {
    return new Response(JSON.stringify({ error: 'Missing Authorization header' }), { status: 401 });
  }

  const userClient = createClient(supabaseUrl, serviceRoleKey);
  const { data: userData, error: userError } = await userClient.auth.getUser(jwt);
  if (userError || !userData.user) {
    return new Response(JSON.stringify({ error: 'Invalid session' }), { status: 401 });
  }
  const user = userData.user;

  const admin = createClient(supabaseUrl, serviceRoleKey);
  const { data: existing } = await admin
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .maybeSingle();

  let customerId = existing?.stripe_customer_id ?? undefined;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;
    await admin
      .from('subscriptions')
      .upsert({ user_id: user.id, stripe_customer_id: customerId, status: 'none' });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: user.id,
    success_url: 'https://crosspcai.app/checkout/success',
    cancel_url: 'https://crosspcai.app/checkout/cancel',
  });

  return new Response(JSON.stringify({ url: session.url }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
