import { createRouter, createWebHistory } from 'vue-router'
import UserList from "../components/user/UserList.vue";
import ManagerList from "../components/user/ManagerList.vue";
import UpdateUserView from "../components/user/UpdateUserView.vue";
import LoginView from "../components/LoginView.vue";
import TaskList from "../components/task/TaskList.vue";

const routes = [
    {
        path: '/',
        component: LoginView, // ✅ Now uses your real login page
        name: 'login',
        meta: { requiresAuth: false }
    },
    {
        path: '/users',
        component: UserList,
        name: 'users',
        meta: { requiresAuth: true }
    },
    {
        path: '/managers',
        component: ManagerList,
        name: 'managers',
        meta: { requiresAuth: true }
    },
    {
        path: '/users/update/:id',
        component: UpdateUserView,
        name: 'update-user',
        meta: { requiresAuth: true }
    },
    {
        path: '/tasks',
        component: TaskList,
        name: 'tasks',
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Optional: Navigation guard
router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token') // Replace with Pinia logic if needed
    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/')
    } else {
        next()
    }
})

export default router
