<script setup lang="ts">
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
    const user = await userStore.fetchUserById(userId);
    Object.assign(userData, user);
  } catch (error) {
    errorMessage.value = 'Failed to load user data.';
  }
}

function validateForm() {
  errors.username = userData.username.length >= 8 ? '' : 'Username must be at least 8 characters.';
  errors.password = userData.password.length >= 8 ? '' : 'Password must be at least 8 characters.';
  errors.email = userData.email.includes('@') ? '' : 'Valid email is required.';
  return !Object.values(errors).some(e => e);
}

async function updateUser() {
  if (!validateForm()) return;

  try {
    await userStore.updateUser({ ...userData }); // ✅ Full user DTO passed here
    successMessage.value = 'User updated successfully!';
    setTimeout(() => router.push('/users'), 1500);
  } catch (error) {
    errorMessage.value = 'Update failed. Try again.';
  }
}

onMounted(loadUser);
</script>

<template>
  <div class="container">
    <h2>Update User</h2>
    <form @submit.prevent="updateUser">
      <div class="form-group">
        <label>Username:</label>
        <input v-model="userData.username" type="text" class="form-control" />
        <small v-if="errors.username" class="text-danger">{{ errors.username }}</small>
      </div>

      <div class="form-group">
        <label>Password:</label>
        <input v-model="userData.password" type="password" class="form-control" />
        <small v-if="errors.password" class="text-danger">{{ errors.password }}</small>
      </div>

      <div class="form-group">
        <label>Email:</label>
        <input v-model="userData.email" type="email" class="form-control" />
        <small v-if="errors.email" class="text-danger">{{ errors.email }}</small>
      </div>

      <button class="btn btn-primary mt-3" type="submit">Update User</button>
    </form>

    <p v-if="successMessage" class="text-success mt-2">{{ successMessage }}</p>
    <p v-if="errorMessage" class="text-danger mt-2">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
.container {
  max-width: 500px;
  margin: auto;
}
</style>
