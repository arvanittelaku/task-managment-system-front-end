import {createRouter} from "vue-router";
import TaskList from "../components/task/TaskList.vue";
import TaskView from "../components/task/TaskView.vue";
import TaskUpdateView from "../components/task/TaskUpdateView.vue";
import TaskCreateView from "../components/task/TaskCreateView.vue";

const taskRouter = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/tasks',
            name: 'tasks',
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
            component: DeleteTask,
            meta: {
                requiresAuth: true
            }
        },



    ]
})
taskRouter.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isLoggedIn()) {
        next('/login');
    } else {
        next();
    }
});

export default taskRouter