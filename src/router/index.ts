import { createRouter, createWebHistory } from 'vue-router'
import { isTokenValid, clearSession } from '../utils/auth'
import requestRoutes from '../modules/request/router/index'
import adminRoutes from '../modules/admin/router/index'

const routes = [...requestRoutes, ...adminRoutes]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, _from, next) => {
  const requiresAuth = to.meta.requiresAuth
  const isPublic = to.meta.public

  const valid = await isTokenValid()

  if (requiresAuth && !valid) {
    await clearSession()
    return next({ name: 'Login' })
  }

  if (isPublic && valid) {
    return next({ name: 'Dashboard' })
  }

  next()
})

export default router