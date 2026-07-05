import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue')
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/owner',
    name: 'OwnerLayout',
    component: () => import('@/layouts/OwnerLayout.vue'),
    children: [
      { path: 'home', name: 'OwnerHome', component: () => import('@/views/owner/Home.vue') },
      { path: 'repair', name: 'OwnerRepair', component: () => import('@/views/owner/Repair.vue') },
      { path: 'repair/detail/:id', name: 'OwnerRepairDetail', component: () => import('@/views/owner/RepairDetail.vue') },
      { path: 'fee', name: 'OwnerFee', component: () => import('@/views/owner/Fee.vue') },
      { path: 'complaint', name: 'OwnerComplaint', component: () => import('@/views/owner/Complaint.vue') },
      { path: 'complaint/detail/:id', name: 'OwnerComplaintDetail', component: () => import('@/views/owner/ComplaintDetail.vue') },
      { path: 'messages', name: 'OwnerMessages', component: () => import('@/views/owner/Messages.vue') },
      { path: 'visitor', name: 'OwnerVisitor', component: () => import('@/views/owner/Visitor.vue') },
      { path: 'profile', name: 'OwnerProfile', component: () => import('@/views/owner/Profile.vue') },
    ]
  },
  {
    path: '/admin',
    name: 'AdminLayout',
    component: () => import('@/layouts/AdminLayout.vue'),
    children: [
      { path: 'dashboard', name: 'AdminDashboard', component: () => import('@/views/admin/Dashboard.vue') },
      { path: 'users', name: 'AdminUsers', component: () => import('@/views/admin/Users.vue') },
      { path: 'repair-orders', name: 'AdminRepairOrders', component: () => import('@/views/admin/RepairOrders.vue') },
      { path: 'complaints', name: 'AdminComplaints', component: () => import('@/views/admin/Complaints.vue') },
      { path: 'announcements', name: 'AdminAnnouncements', component: () => import('@/views/admin/Announcements.vue') },
      { path: 'ranking', name: 'AdminRanking', component: () => import('@/views/admin/Ranking.vue') },
      { path: 'parking', name: 'AdminParking', component: () => import('@/views/admin/Parking.vue') },
      { path: 'fees', name: 'AdminFees', component: () => import('@/views/admin/Fees.vue') },
    ]
  },
  {
    path: '/worker',
    name: 'WorkerLayout',
    component: () => import('@/layouts/WorkerLayout.vue'),
    children: [
      { path: 'dashboard', name: 'WorkerDashboard', component: () => import('@/views/worker/Dashboard.vue') },
      { path: 'pending', name: 'WorkerPending', component: () => import('@/views/worker/Pending.vue') },
      { path: 'completed', name: 'WorkerCompleted', component: () => import('@/views/worker/Completed.vue') },
      { path: 'profile', name: 'WorkerProfile', component: () => import('@/views/worker/Profile.vue') },
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  
  if (to.path === '/login' || to.path === '/register') {
    next()
    return
  }

  if (!userStore.token) {
    next('/login')
    return
  }

  if (!userStore.userInfo) {
    try {
      await userStore.getUserInfo()
    } catch {
      next('/login')
      return
    }
  }

  const roleHomeMap = {
    0: '/owner/home',
    1: '/admin/dashboard',
    2: '/worker/dashboard'
  }

  const expectedHome = roleHomeMap[userStore.userInfo?.role]
  const expectedPrefix = expectedHome?.split('/')[1]
  
  if (expectedPrefix && !to.path.startsWith(`/${expectedPrefix}`)) {
    next(expectedHome)
    return
  }

  next()
})

export default router
