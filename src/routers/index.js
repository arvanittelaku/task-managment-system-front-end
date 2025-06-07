import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

// User-related components
import UserList from '../components/user/UserList.vue';
import ManagerList from '../components/user/ManagerList.vue';
import UpdateUserView from '../components/user/UpdateUserView.vue';
import LoginView from '../components/LoginView.vue';

// Task-related components
import TaskList from '../components/task/TaskList.vue';
import TaskView from '../components/task/TaskView.vue';
import TaskUpdateView from '../components/task/TaskUpdateView.vue';
import TaskCreateView from '../components/task/TaskCreateView.vue';
import DeleteTaskView from '../components/task/DeleteTaskView.vue';
import RegisterUserView from "../components/user/RegisterUserView.vue";

const routes = [

    {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: { requiresAuth: false }
    },
    {
        path: '/',
        redirect: '/login',
    },


    {
        path: '/users',
        name: 'users',
        component: UserList,
        meta: { requiresAuth: true }
    },
    {
        path: '/users/create',
        name: 'create-users',
        component: RegisterUserView,
        meta: { requiresAuth: true }
    },
    {
        path: '/managers',
        name: 'managers',
        component: ManagerList,
        meta: { requiresAuth: true }
    },
    {
        path: '/users/update/:id',
        name: 'update-user',
        component: UpdateUserView,
        meta: { requiresAuth: true }
    },

    // Task Management Routes
    {
        path: '/tasks',
        name: 'all-tasks',
        component: TaskList,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/tasks/:id',
        name: 'view-task',
        component: TaskView,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/tasks/update/:id',
        name: 'update-task',
        component: TaskUpdateView,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/tasks/create',
        name: 'create-task',
        component: TaskCreateView,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/tasks/delete/:id',
        name: 'delete-task',
        component: DeleteTaskView,
        meta: {
            requiresAuth: true
        }
    },
    // Catch-all 404 route (optional but good practice)
    // {
    //     path: '/:pathMatch(.*)*', // Matches all undefined routes
    //     name: 'NotFound',
    //     // Make sure you have a NotFound.vue component in src/components/
    //     component: () => import('../components/NotFoundView.vue')
    // }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

// Global Navigation Guard
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore(); // Access the Pinia store

    // Check if the route requires authentication AND the user is not logged in
    if (to.meta.requiresAuth && !authStore.isLoggedIn) {
        next('/login'); // Redirect to login page
    } else if (!to.meta.requiresAuth && authStore.isLoggedIn && to.path === '/login') {
        // If user is logged in and tries to go to /login, redirect to a dashboard/tasks
        next('/tasks'); // Or whatever your main authenticated page is
    } else {
        next(); // Continue to the intended route
    }
});

export default router;