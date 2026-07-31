export function statusClass(status) {
  if (status?.includes('Cancel')) return 'bg-red-50 text-red-600'
  if (status === 'Completed') return 'bg-pine-50 text-pine-700'
  return 'bg-stone-100 text-stone-600'
}
