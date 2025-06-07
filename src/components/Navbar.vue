<script setup lang="ts">
import { useAuthStore } from '../stores/authStore';
import { computed } from "vue";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const user = computed(() => authStore.loggedInUser);
const isLoggedIn = computed(() => authStore.isLoggedIn);

const logout = () => {
  authStore.logout();
  router.push('/login');
}
</script>

<template>
  <nav v-if="isLoggedIn" class="navbar navbar-expand-lg navbar-light bg-light px-4 ">
    <div class="navbar-brand me-auto">Task Managment System</div>

    <div class="d-flex gap-2 ms-2">
      <router-link v-if="user && user?.role === 'ADMIN'" :to="{ name: 'create-users' }" class="btn btn-outline-primary">Create Managers</router-link>
      <router-link v-if="user && user?.role === 'ADMIN'" :to="{ name: 'managers' }" class="btn btn-outline-primary">Managers</router-link>
      <router-link v-if="user && user?.role === 'ADMIN'" :to="{ name: 'create-users' }" class="btn btn-outline-primary">Create Users</router-link>
      <router-link v-if="user && user?.role === 'ADMIN'" :to="{ name: 'users' }" class="btn btn-outline-primary">All Users</router-link>
      <router-link v-if="user && user?.role === 'ADMIN'" :to="{ name: 'all-tasks' }" class="btn btn-outline-primary">Tasks</router-link>

      <!-- MANAGER -->
      <router-link v-if="user && user?.role === 'MANAGER'" :to="{ name: 'create-users' }" class="btn btn-outline-primary">Users</router-link>
      <router-link v-if="user && user?.role === 'MANAGER'" :to="{ name: 'users' }" class="btn btn-outline-primary">Users</router-link>
      <router-link v-if="user && user?.role === 'MANAGER'" :to="{ name: 'tasks-create' }" class="btn btn-outline-success">Create Task</router-link>

      <!-- COMMON -->
      <router-link v-if="user && user?.role === 'USER'" :to="{ name: 'tasks' }" class="btn btn-outline-info">Tasks</router-link>

      <button @click="logout" class="btn btn-outline-danger">Logout</button>
    </div>
  </nav>
</template>
