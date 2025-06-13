    import { createRouter, createWebHistory } from 'vue-router';
    import LoginView from '../components/LoginView.vue';
    import RegisterUserView from '../components/user/RegisterUserView.vue';
    import UserList from '../components/user/UserList.vue';
    import UserView from '../components/user/UserDetails.vue';
    import UpdateUserView from "../components/user/UpdateUserView.vue";

    const routes = [
        { path: '/', redirect: '/login' },
        { path: '/login', name: 'login', component: LoginView },
        { path: '/create-users', name: 'create-users', component: RegisterUserView },
        { path: '/users', name: 'users', component: UserList },
        { path: '/managers', name: 'managers', component: UserList, props: { filterRole: 'MANAGER' } },
        { path: '/users/:id', name: 'user-details', component: UserView, props: true },
        { path: '/users/:id/edit', name: 'edit-user', component: UpdateUserView, props: true },
        { path: '/all-tasks', name: 'all-tasks', component: () => import('../components/task/TaskList.vue') },
        { path: '/tasks-create', name: 'tasks-create', component: () => import('../components/task/TaskCreateView.vue') },
        { path: '/tasks/:id', name: 'view-task', component: () => import('../components/task/TaskView.vue'), props: true,},
        { path: '/tasks/:id/edit', name: 'update-task', component: () => import('../components/task/TaskUpdateView.vue'), props: true,
        }
    ];

    const router = createRouter({
        history: createWebHistory(),
        routes,
    });

    router.beforeEach((to, from, next) => {
        const publicPages = ['/login'];
        const authRequired = !publicPages.includes(to.path);
        const loggedIn = !!localStorage.getItem('token');

        if (authRequired && !loggedIn) {
            return next('/login');
        }
        next();
    });

    export default router;
