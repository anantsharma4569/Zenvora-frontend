import { frappeCall } from '@/utils/call'

// Loaded globally via the <script> tag in index.html.
function getRazorpay() {
  if (typeof window.Razorpay === 'undefined') {
    throw new Error('Razorpay Checkout failed to load. Check your connection and try again.')
  }
  return window.Razorpay
}

export function useRazorpay() {
  async function createRazorpayOrder(salesOrderId) {
    return frappeCall.postMethod('zenvora.api.razorpay_payment.create_razorpay_order', {
      sales_order_id: salesOrderId,
    })
  }

  async function verifyPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
    return frappeCall.postMethod('zenvora.api.razorpay_payment.verify_razorpay_payment', {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    })
  }

  // Wraps the Razorpay Checkout modal in a Promise: resolves with the
  // {razorpay_order_id, razorpay_payment_id, razorpay_signature} response on
  // success, rejects on failure or if the user closes the modal.
  function openCheckout(orderData, prefill) {
    const Razorpay = getRazorpay()

    return new Promise((resolve, reject) => {
      const rzp = new Razorpay({
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.razorpay_order_id,
        name: 'Zenvora',
        description: 'Order payment',
        prefill,
        theme: { color: '#0F0F0E' },
        handler(response) {
          resolve(response)
        },
        modal: {
          ondismiss() {
            reject(new Error('Payment cancelled'))
          },
        },
      })

      rzp.on('payment.failed', (response) => {
        reject(new Error(response.error?.description || 'Payment failed'))
      })

      rzp.open()
    })
  }

  // Full flow: create the Razorpay order for an existing Sales Order, open
  // Checkout, and verify the result server-side once it succeeds.
  async function initiateRazorpayPayment(salesOrderId, prefill) {
    const orderData = await createRazorpayOrder(salesOrderId)
    const result = await openCheckout(orderData, prefill)
    return verifyPayment(result)
  }

  return { createRazorpayOrder, verifyPayment, openCheckout, initiateRazorpayPayment }
}
