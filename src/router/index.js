import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const routes = [
  { path: '/', name: 'home', component: () => import('@/views/HomeView.vue'), meta: { title: 'Considered Clothing' } },
  { path: '/shop', name: 'shop', component: () => import('@/views/ShopView.vue'), meta: { title: 'Shop' } },
  {
    path: '/product/:id',
    name: 'product-detail',
    component: () => import('@/views/ProductDetailView.vue'),
    props: true,
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/CartView.vue'),
    meta: { requiresAuth: true, title: 'Your Bag' },
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('@/views/CheckoutView.vue'),
    meta: { requiresAuth: true, title: 'Checkout' },
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('@/views/AccountView.vue'),
    meta: { requiresAuth: true, title: 'My Account' },
  },
  {
    path: '/orders',
    name: 'orders',
    component: () => import('@/views/OrdersView.vue'),
    meta: { requiresAuth: true, title: 'My Orders' },
  },
  {
    path: '/orders/:id',
    name: 'order-detail',
    component: () => import('@/views/OrderDetailView.vue'),
    props: true,
    meta: { requiresAuth: true, title: 'Order Details' },
  },
  {
    path: '/wishlist',
    name: 'wishlist',
    component: () => import('@/views/WishlistView.vue'),
    meta: { requiresAuth: true, title: 'Wishlist' },
  },
  {
    path: '/addresses',
    name: 'addresses',
    component: () => import('@/views/AddressesView.vue'),
    meta: { requiresAuth: true, title: 'Addresses' },
  },
  {
    path: '/wallet',
    name: 'wallet',
    component: () => import('@/views/WalletView.vue'),
    meta: { requiresAuth: true, title: 'Wallet' },
  },
  {
    path: '/coupons',
    name: 'coupons',
    component: () => import('@/views/CouponsView.vue'),
    meta: { requiresAuth: true, title: 'Coupons' },
  },
  {
    path: '/payment-methods',
    name: 'payment-methods',
    component: () => import('@/views/PaymentMethodsView.vue'),
    meta: { requiresAuth: true, title: 'Payment Methods' },
  },
  {
    path: '/returns',
    name: 'returns',
    component: () => import('@/views/ReturnsView.vue'),
    meta: { requiresAuth: true, title: 'Returns' },
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('@/views/NotificationsView.vue'),
    meta: { requiresAuth: true, title: 'Notifications' },
  },
  { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue'), meta: { title: 'Log In' } },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { title: 'Create Account' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Page Not Found' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !useAuthStore().isAuthenticated) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} — Zenvora` : 'Zenvora'
})

export default router
