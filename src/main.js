import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import taskRouter from './routers/taskRouter.js'; // Adjust path as needed

const app = createApp(App);
app.use(createPinia());
app.use(taskRouter);
app.mount('#app');
