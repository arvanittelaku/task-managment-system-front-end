<script setup lang="ts">
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';
import { reactive } from "vue";

const router = useRouter();
const authStore = useAuthStore();

const loginUser = reactive({
  username: '',
  password: ''
});

const errors = reactive<{ username?: string; password?: string }>({});

function validateForm() {
  errors.username = loginUser.username.trim() ? '' : 'Username is required';
  errors.password = loginUser.password.trim() ? '' : 'Password is required';
  return !errors.username && !errors.password;
}

async function login() {
  if (!validateForm()) {
    return;
  } else {
    try {
      await authStore.login(loginUser);
      await router.push('/tasks');
    } catch (error) {
      console.error(error);
    }
  }
}
</script>

<template>
  <form @submit.prevent="login" class="login-form">
    <div class="form-group">
      <label for="username">Username:</label>
      <input
          type="text"
          id="username"
          v-model="loginUser.username"
          autocomplete="username"
      />
      <p v-if="errors.username" style="color: red; margin: 0;">{{ errors.username }}</p>
    </div>

    <div class="form-group">
      <label for="password">Password:</label>
      <input
          type="password"
          id="password"
          v-model="loginUser.password"
          autocomplete="current-password"
      />
      <p v-if="errors.password" style="color: red; margin: 0;">{{ errors.password }}</p>
    </div>

    <button type="submit">Login</button>
  </form>
</template>

<style scoped>
/* Optional: add some styling */
.form-group {
  margin-bottom: 1rem;
}
</style>
