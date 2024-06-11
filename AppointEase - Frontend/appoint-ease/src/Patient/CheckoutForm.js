import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51Ou9edP1OcrJcfnRPVuImvaSVyz9Ym5yL2eEk0lc2yEiTpENDRnNcwGvtuMp2mhxnA8zM7yNkeqIJHG24rEiGtzQ00Natit1al');

const CheckoutForm = () => {
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [formData, setFormData] = useState({
    amount: 2222,
    currency: 'usd',
    paymentMethodTypes: ['card'],
    paymentMethod: 'pm_card_visa',
    patientId: 'cus_QEMX8jjv6nK7SC'
  });

  const handlePaymentIntent = async () => {
    try {
      // Krijoni një kërkesë për të krijuar një intent pagese në server
      const response = await fetch('https://localhost:7207/Stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error('Kërkesa për krijuar intent pagese dështoi.');
      }
  
      const data = await response.json();
      setPaymentIntent(data.clientSecret);
      console.log("clientSecret", data.clientSecret);
    } catch (error) {
      console.error('Gabim gjatë krijimit të intentit të pagesës:', error.message);
    }
  };
  
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!paymentIntent) {
      console.error('clientSecret është null ose bosh.');
      return;
    }

    const stripe = await stripePromise;
    const result = await stripe.confirmCardPayment(paymentIntent, {
      payment_method: {
        card: {
          // Plotësoni informacionin e kartës nga forma e pagesës
          number: document.getElementById('card-number').value,
          exp_month: document.getElementById('card-expiry-month').value,
          exp_year: document.getElementById('card-expiry-year').value,
          cvc: document.getElementById('card-cvc').value
        },
      },
    });

    if (result.error) {
      console.error(result.error.message);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        // Pagesa u suksesua
        console.log('Pagesa u suksesua!');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Plotësoni formën e pagesës këtu */}
      <input type="text" id="card-number" placeholder="Numri i kartës" />
      <input type="text" id="card-expiry-month" placeholder="Muaji i skadimit (MM)" />
      <input type="text" id="card-expiry-year" placeholder="Viti i skadimit (YY)" />
      <input type="text" id="card-cvc" placeholder="CVV" />
      <button onClick={handlePaymentIntent}>Konfirmo Pagesën</button>
    </form>
  );
};

const StripeCheckout = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default StripeCheckout;
