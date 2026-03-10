import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  try {
    // Try to retrieve your specific price
    const price = await stripe.prices.retrieve('price_1T8DrgK4pbczNClLKiT9Jv3o');
    
    res.status(200).json({ 
      success: true, 
      price: {
        id: price.id,
        product: price.product,
        amount: price.unit_amount,
        currency: price.currency
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      type: error.type 
    });
  }
}