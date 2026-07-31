import { frappeCall } from '@/utils/call'

export function useDashboard() {
  async function getDashboardSummary() {
    return frappeCall.method('zenvora.api.dashboard.get_dashboard_summary')
  }

  return { getDashboardSummary }
}
