import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '../../../lib/stripe';
import { auth } from '@/lib/auth';

export async function POST(req) {
  try {
    const headersList = await headers();
    const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000";

    const userSession = await auth.api.getSession({
      headers: headersList,
    });

    const user = userSession?.user;
    if (!user) {
      return NextResponse.redirect(`${origin}/signin`, 303);
    }

    const formData = await req.formData();
    const tier = formData.get("tier"); // "premium" or "pro"
    
    let PRICE_ID = "";
    if (tier === "premium") {
      PRICE_ID = "price_1TkQD9FMJJEHpxBR4qnTHMOs"; // Example Stripe Price ID for Premium
    } else if (tier === "pro") {
      PRICE_ID = "price_1TkQD9FMJJEHpxBR4qnTHMOs"; // Example Stripe Price ID for Pro
    } else {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price: PRICE_ID,
          quantity: 1,
        },
      ],
      metadata: {
        tier: tier,
        userId: user.id,
      },
      mode: 'subscription',
      success_url: `${origin}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
    });
    
    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    console.error("Stripe error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    );
  }
}