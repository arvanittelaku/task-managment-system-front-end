import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import taskRouter from "./routers/taskRouter.js"; // Adjust the path if needed

// Import Bootstrap CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Optional: custom styles
import './style.css';

const app = createApp(App);

// 🧠 Register Pinia and Router
app.use(createPinia());
app.use(taskRouter);

app.mount('#app');
