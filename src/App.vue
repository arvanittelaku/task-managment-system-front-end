<script setup>
import { onMounted } from 'vue';
import { useUserStore } from './stores/userStore';
import { useAuthStore } from './stores/authStore';
import Navbar from './components/Navbar.vue';

const userStore = useUserStore();
const authStore = useAuthStore();

onMounted(() => {
  userStore.loadCurrentUser();

});
</script>

<template>
  <div>

    <Navbar v-if="authStore.isLoggedIn" />
    <main class="container mx-auto p-4">
      <router-view></router-view>
    </main>
  </div>
</template>

<style>


</style>
