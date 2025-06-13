<script setup lang="ts">
import { reactive } from "vue";
import { useAuthStore } from "../stores/authStore";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();

const loginUser = reactive({
  email: "",
  password: "",
});

const errors = reactive<{ email?: string; password?: string; login?: string }>({});


function validateForm() {
  errors.login = "";
  errors.email = loginUser.email.trim() ? "" : "Email is required!";
  errors.password = loginUser.password.trim() ? "" : "Password is required!";
  return !errors.email && !errors.password;
}

async function login() {
  if (!validateForm()) return;

  try {
    await authStore.login(loginUser);
    await router.push("/all-tasks");
  } catch (error) {
    console.error("Login failed:", error);
    errors.login = 'Wrong email or password. Please try again!'
  }
}
</script>

<template>
  <div class="container d-flex justify-content-center align-items-center min-vh-100">
    <form @submit.prevent="login" class="w-100" style="max-width: 400px;">
      <div class="card p-4 shadow-sm">
        <h3 class="text-center mb-4">Login</h3>

        <div class="mb-3">
          <label for="email" class="form-label">Email:</label>
          <input
              type="text"
              id="email"
              class="form-control"
              v-model="loginUser.email"
              autocomplete="email"
          />
          <div v-if="errors.email" class="text-danger small mt-1">{{ errors.email }}</div>
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Password:</label>
          <input
              type="password"
              id="password"
              class="form-control"
              v-model="loginUser.password"
              autocomplete="current-password"
          />
          <div v-if="errors.password" class="text-danger small mt-1">{{ errors.password }}</div>
          <div v-if="errors.login" class="text-danger small mt-1">{{ errors.login }}</div>
        </div>

        <button type="submit" class="btn btn-primary w-100">Login</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Bootstrap handles styling */
</style>
