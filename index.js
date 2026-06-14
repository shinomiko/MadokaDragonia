import { createRouter, createWebHistory } from 'vue-router'

// Lazy-loading компонентов (как в уроке)
const HomeView = () => import('../views/HomeView.vue')
const RecipeView = () => import('../views/RecipeView.vue')
const AboutView = () => import('../views/AboutView.vue')
const NotFoundView = () => import('../views/NotFoundView.vue')

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/recipe/:id',       // динамический сегмент
    name: 'recipe',
    component: RecipeView,
    props: true                // передаём параметр id как prop
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
  {
    path: '/:pathMatch(.*)*',  // 404 – несуществующие пути
    name: 'not-found',
    component: NotFoundView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // имитация прокрутки при переходе (пример из курса)
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

// Простейший глобальный guard (логирование переходов)
router.beforeEach((to, from) => {
  console.log(`Переход с ${from.path} на ${to.path}`)
  // Здесь можно было бы проверять аутентификацию
  return true
})

export default router