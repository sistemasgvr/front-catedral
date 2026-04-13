import { createRouter, createWebHistory } from 'vue-router'
import { isTokenValid, clearSession } from '../utils/auth'
import requestRoutes from '../modules/request/router/index'
import adminRoutes from '../modules/admin/router/index'
import { useUserStore } from '../modules/admin/stores/user.store'
import { isAdminRole, isPathAllowedForOperador } from '../modules/admin/auth/roles'

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
    const userStore = useUserStore()
    userStore.loadFromStorage()
    const dest = isAdminRole(userStore.user?.rol) ? 'Dashboard' : 'Misas'
    return next({ name: dest })
  }

  if (requiresAuth && valid) {
    const userStore = useUserStore()
    userStore.loadFromStorage()
    if (!isAdminRole(userStore.user?.rol) && !isPathAllowedForOperador(to.path)) {
      return next({ name: 'Misas' })
    }
  }

  next()
})

export default router