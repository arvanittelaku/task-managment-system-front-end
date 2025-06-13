<script setup >
import { useAuthStore } from '../stores/authStore';
import { computed } from "vue";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const isLoggedIn = computed(() => authStore.isLoggedIn);
const role = computed(() => authStore.role);

const logout = () => {
  authStore.logout();
  router.push('/login');
}
</script>

<template>
  <nav v-if="isLoggedIn" class="navbar navbar-expand-lg navbar-light bg-light px-4">
    <div class="navbar-brand me-auto">Task Management System</div>

    <div class="d-flex gap-2 ms-2">
      <!-- ADMIN -->
      <router-link v-if="role === 'ADMIN'" :to="{ name: 'create-users' }" class="btn btn-outline-primary">Create Managers</router-link>
      <router-link v-if="role === 'ADMIN'" :to="{ name: 'managers' }" class="btn btn-outline-primary">Managers</router-link>
      <router-link v-if="role === 'ADMIN'" :to="{ name: 'create-users' }" class="btn btn-outline-primary">Create Users</router-link>
      <router-link v-if="role === 'ADMIN'" :to="{ name: 'users' }" class="btn btn-outline-primary">All Users</router-link>
      <router-link v-if="role === 'ADMIN'" :to="{ name: 'all-tasks' }" class="btn btn-outline-primary">Tasks</router-link>

      <!-- MANAGER -->
      <router-link v-if="role === 'MANAGER'" :to="{ name: 'create-users' }" class="btn btn-outline-primary">Create User</router-link>
      <router-link v-if="role === 'MANAGER'" :to="{ name: 'users' }" class="btn btn-outline-primary">Users</router-link>
      <router-link v-if="role === 'MANAGER'" :to="{ name: 'tasks-create' }" class="btn btn-outline-success">Create Task</router-link>




      <button @click="logout" class="btn btn-outline-danger">Logout</button>
    </div>
  </nav>
</template>
