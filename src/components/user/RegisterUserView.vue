<script setup lang="ts">
import { reactive, ref } from "vue";
import { useUserStore } from "../../stores/userStore";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const registerUser = reactive({
  username: '',
  password: '',
  email: '',
  role: ''
});

const roles = ["USER", "MANAGER"];

const errors = reactive({
  username: '',
  password: '',
  email: '',
  role: ''
});

const successMessage = ref('');

function validateForm() {
  // Reset previous errors
  Object.keys(errors).forEach(key => (errors[key as keyof typeof errors] = ''));

  // Validation logic
  errors.username = registerUser.username.length >= 8 ? '' : 'Username must be at least 8 characters.';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  errors.email = emailRegex.test(registerUser.email) ? '' : 'Enter a valid email address.';
  errors.password = registerUser.password.length >= 8 ? '' : 'Password must be at least 8 characters.';
  errors.role = registerUser.role ? '' : 'Role is required.';

  return !Object.values(errors).some(e => e);
}

async function register() {
  if (!validateForm()) {
    return;
  }

  try {
    await userStore.registerUser(registerUser);
    successMessage.value = 'User registered successfully! Redirecting...';
    setTimeout(() => {
      router.push({ name: 'tasks' });
    }, 1500);
  } catch (error: any) {
    console.error(error);
    successMessage.value = '';
    if (error.response?.data?.message) {
      errors.username = error.response.data.message;
    }
  }
}
</script>

<template>
  <form @submit.prevent="register">
    <div class="form-group">
      <label for="username">Username:</label>
      <input
          type="text"
          id="username"
          v-model="registerUser.username"
          class="form-control"
          autocomplete="username"
          minlength="8"
          required
      />
      <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
    </div>

    <div class="form-group">
      <label for="password">Password:</label>
      <input
          type="password"
          id="password"
          v-model="registerUser.password"
          class="form-control"
          autocomplete="new-password"
          required
      />
      <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
    </div>

    <div class="form-group">
      <label for="email">Email:</label>
      <input
          type="email"
          id="email"
          v-model="registerUser.email"
          class="form-control"
          autocomplete="email"
          required
      />
      <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
    </div>

    <div class="form-group">
      <label for="role">Role:</label>
      <select id="role" v-model="registerUser.role" class="form-control" required>
        <option value="" disabled>Select a role</option>
        <option v-for="role in roles" :value="role" :key="role">{{ role }}</option>
      </select>
      <div v-if="errors.role" class="text-danger">{{ errors.role }}</div>
    </div>

    <button type="submit" class="btn btn-primary mt-2">Register</button>

    <div v-if="successMessage" class="text-success mt-2">{{ successMessage }}</div>
  </form>
</template>

<style scoped>
.text-danger {
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.text-success {
  font-size: 0.9rem;
  font-weight: bold;
}

.form-group {
  margin-bottom: 1rem;
}
</style>
