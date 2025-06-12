import { NextRequest, NextResponse } from 'next/server';
import { createRazorpayOrder } from '@/lib/razorpay';

export async function POST(req: NextRequest) {
  try {
    const { amount, plan, billingCycle } = await req.json();
    
    if (!amount || !plan || !billingCycle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const order = await createRazorpayOrder(amount, 'INR');
    
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}