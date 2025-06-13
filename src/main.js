import "bootstrap/dist/css/bootstrap.min.css";
import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./routers/index.js";
import { useAuthStore } from "./stores/authStore";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

async function startApp() {
    const authStore = useAuthStore();
    await authStore.initialize(); // wait for auth state to load

    await router.isReady();
    app.mount("#app");
}

startApp();
