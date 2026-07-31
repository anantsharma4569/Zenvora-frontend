import { frappeCall } from '@/utils/call'

export function useOrders() {
  // items: [{ item_code, qty, rate }, ...], address_name?, coupon_code? -> { name, grand_total, currency, ... }
  async function createSalesOrder(items, address_name, coupon_code) {
    return frappeCall.postMethod('zenvora.api.orders.create_sales_order', {
      items,
      address_name: address_name || undefined,
      coupon_code: coupon_code || undefined,
    })
  }

  // Website Users only ever see their own orders — Frappe's User Permission
  // engine scopes this to the Customer linked to their account.
  async function fetchOrders({ status, limitStart = 0, limitPageLength = 10 } = {}) {
    return frappeCall.method('zenvora.api.orders.fetch_orders', {
      status,
      limit_start: limitStart,
      limit_page_length: limitPageLength,
    })
  }

  // Richer than a plain doc read: bundles payment status, tracking
  // timestamps, and shipping address in one call.
  async function getOrderDetail(name) {
    return frappeCall.method('zenvora.api.orders.get_order_detail', { name })
  }

  async function buyAgain(salesOrder) {
    return frappeCall.postMethod('zenvora.api.orders.buy_again', { sales_order: salesOrder })
  }

  async function requestReturn(salesOrder, reason) {
    return frappeCall.postMethod('zenvora.api.orders.request_return', {
      sales_order: salesOrder,
      reason,
    })
  }

  async function listReturns() {
    return frappeCall.method('zenvora.api.orders.list_returns')
  }

  return { createSalesOrder, fetchOrders, getOrderDetail, buyAgain, requestReturn, listReturns }
}
