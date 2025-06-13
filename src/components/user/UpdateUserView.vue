<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../../stores/userStore';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const userId = Number(route.params.id);

const userData = reactive({
  id: userId,
  username: '',
  password: '',
  email: ''
});

const errors = reactive({
  username: '',
  password: '',
  email: ''
});

const successMessage = ref('');
const errorMessage = ref('');

async function loadUser() {
  try {
    const user = await userStore.getUserById(userId);
    if (!user) {
      errorMessage.value = 'User not found.';
      return;
    }
    // Fill reactive data with loaded user info
    userData.username = user.username || '';
    userData.email = user.email || '';
    userData.password = ''; // leave empty, user must enter if changing
  } catch (error) {
    errorMessage.value = 'Failed to load user data.';
  }
}

function validateForm() {
  errors.username = userData.username.length >= 8 ? '' : 'Username must be at least 8 characters.';
  // Password is optional on edit; validate only if filled
  errors.password = userData.password ? (userData.password.length >= 8 ? '' : 'Password must be at least 8 characters.') : '';
  errors.email = userData.email.includes('@') ? '' : 'Valid email is required.';
  return !Object.values(errors).some(e => e);
}

async function updateUser() {
  if (!validateForm()) return;

  try {
    // Prepare user object to update
    const updatedUser = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      ...(userData.password ? { password: userData.password } : {}) // only send password if changed
    };

    const res = await userStore.updateUser(updatedUser);
    if (res) {
      successMessage.value = 'User updated successfully!';
      setTimeout(() => router.push('/users'), 1500);
    } else {
      errorMessage.value = userStore.error || 'Update failed. Try again.';
    }
  } catch (error) {
    errorMessage.value = 'Update failed. Try again.';
  }
}

onMounted(loadUser);
</script>

<template>
  <div class="container mt-4" style="max-width: 500px;">
    <h2 class="mb-4">Update User</h2>
    <form @submit.prevent="updateUser" novalidate>
      <div class="mb-3">
        <label for="username" class="form-label">Username:</label>
        <input
            id="username"
            v-model="userData.username"
            type="text"
            class="form-control"
            required
            minlength="8"
        />
        <small v-if="errors.username" class="text-danger">{{ errors.username }}</small>
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Password (leave blank to keep unchanged):</label>
        <input
            id="password"
            v-model="userData.password"
            type="password"
            class="form-control"
            minlength="8"
        />
        <small v-if="errors.password" class="text-danger">{{ errors.password }}</small>
      </div>

      <div class="mb-3">
        <label for="email" class="form-label">Email:</label>
        <input
            id="email"
            v-model="userData.email"
            type="email"
            class="form-control"
            required
        />
        <small v-if="errors.email" class="text-danger">{{ errors.email }}</small>
      </div>

      <button class="btn btn-primary" type="submit">Update User</button>
      <button
          class="btn btn-secondary ms-2"
          type="button"
          @click="router.push('/users')"
      >
        Cancel
      </button>
    </form>

    <p v-if="successMessage" class="text-success mt-3">{{ successMessage }}</p>
    <p v-if="errorMessage" class="text-danger mt-3">{{ errorMessage }}</p>
  </div>
</template>
