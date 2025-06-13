<script setup>
import { reactive, ref, computed } from "vue";
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

const allPossibleRoles = ["USER", "MANAGER"];

const availableRoles = computed(() => {
  if (userStore.currentUser && userStore.currentUser.role === 'ADMIN') {
    return allPossibleRoles;
  } else if (userStore.currentUser && userStore.currentUser.role === 'MANAGER') {
    return ["USER"];
  }
  return ["USER"];
});

const errors = reactive({
  username: '',
  password: '',
  email: '',
  role: ''
});

const successMessage = ref('');

function validateForm() {
  Object.keys(errors).forEach(key => (errors[key] = ''));

  errors.username = registerUser.username.length >= 8 ? '' : 'Username must be at least 8 characters.';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  errors.email = emailRegex.test(registerUser.email) ? '' : 'Enter a valid email address.';
  errors.password = registerUser.password.length >= 8 ? '' : 'Password must be at least 8 characters.';
  errors.role = registerUser.role ? '' : 'Role is required.';

  return !Object.values(errors).some(e => e);
}

async function register() {
  if (!registerUser.role && availableRoles.value.length > 0) {
    registerUser.role = availableRoles.value[0];
  }

  if (!validateForm()) return;

  try {
    if (userStore.currentUser && userStore.currentUser.role === 'MANAGER' && registerUser.role === 'MANAGER') {
      errors.role = 'Managers cannot register other managers.';
      return;
    }

    if (registerUser.role === 'MANAGER') {
      await userStore.registerManager(registerUser);
    } else {
      await userStore.registerUser(registerUser);
    }

    successMessage.value = 'User registered successfully! Redirecting...';
    setTimeout(() => router.push({ name: 'all-tasks' }), 1500);
  } catch (error) {
    console.error("Registration error:", error);
    successMessage.value = '';
    errors.username = userStore.error || "Failed to register user.";
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
        <option v-for="role in availableRoles" :value="role" :key="role">{{ role }}</option>
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
form {
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
