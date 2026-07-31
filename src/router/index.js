import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const routes = [
  { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
  { path: '/shop', name: 'shop', component: () => import('@/views/ShopView.vue') },
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
    meta: { requiresAuth: true },
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('@/views/CheckoutView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('@/views/AccountView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/orders',
    name: 'orders',
    component: () => import('@/views/OrdersView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/orders/:id',
    name: 'order-detail',
    component: () => import('@/views/OrderDetailView.vue'),
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/wishlist',
    name: 'wishlist',
    component: () => import('@/views/WishlistView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/addresses',
    name: 'addresses',
    component: () => import('@/views/AddressesView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/wallet',
    name: 'wallet',
    component: () => import('@/views/WalletView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/coupons',
    name: 'coupons',
    component: () => import('@/views/CouponsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/payment-methods',
    name: 'payment-methods',
    component: () => import('@/views/PaymentMethodsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/returns',
    name: 'returns',
    component: () => import('@/views/ReturnsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('@/views/NotificationsView.vue'),
    meta: { requiresAuth: true },
  },
  { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue') },
  { path: '/register', name: 'register', component: () => import('@/views/RegisterView.vue') },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue') },
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

export default router
