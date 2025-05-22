import { createRouter, createWebHistory } from 'vue-router'
import UserList from "../components/user/UserList.vue";
import ManagerList from "../components/user/ManagerList.vue";
import App from "../App.vue";


const routes = [
    {
      path: '/',redirect: 'LoginView'
    },
    {
        path: '/users',
        component: UserList,
        meta: {requiresAuth: true},
    },
    {
        path: '/managers',
        component: ManagerList,
        meta: {requiresAuth: true},
     }//,{
    //  path:'tasks',
    //  component:'TaskList.vue',
    //  meta: {requiresAuth: true},
    // },

]
const router = createRouter({
    history: createWebHistory(),
    routes,
})
export default router