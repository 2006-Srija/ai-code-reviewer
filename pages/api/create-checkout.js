import Stripe from 'stripe';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ error: 'Please login first' });
    }

    const { priceId } = req.body;
    
    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }

    console.log('Creating checkout session for:', { priceId, userId: session.user.id });

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ 
        price: priceId, 
        quantity: 1 
      }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing`,
      metadata: { 
        userId: session.user.id 
      },
    });

    console.log('Checkout session created:', checkoutSession.id);
    console.log('Checkout URL:', checkoutSession.url);
    
    // Send back both ID and URL
    res.status(200).json({ 
      sessionId: checkoutSession.id,
      url: checkoutSession.url
    });
    
  } catch (error) {
    console.error('Stripe error details:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      message: error.message 
    });
  }
}