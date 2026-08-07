import { frappeCall } from '@/utils/call'

export function useGuestCheckout() {
  // otp_channel: 'Email' | 'SMS'
  async function requestCheckoutOtp(otp_channel, recipient) {
    return frappeCall.postMethod('zenvora.api.guest_checkout.request_checkout_otp', {
      otp_channel,
      recipient,
    })
  }

  // -> same shape as auth login/register: { access_token, refresh_token, expires_in, user }
  async function verifyCheckoutOtp(otp_channel, recipient, otp_code) {
    return frappeCall.postMethod('zenvora.api.guest_checkout.verify_checkout_otp', {
      otp_channel,
      recipient,
      otp_code,
    })
  }

  return { requestCheckoutOtp, verifyCheckoutOtp }
}
