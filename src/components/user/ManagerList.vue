<script setup lang="ts">
import { useUserStore } from '../../stores/userStore';
import {onMounted} from "vue";

const userStore = useUserStore();
onMounted(() => {
  userStore.getAllManagers();
})
</script>

<template>
  <div class="container my-4">
    <h2 class="text-center mb-4">All Managers</h2>
    <ul class="list-group">
      <li
          v-for="user in userStore.users"
          :key="user.id"
          class="list-group-item d-flex justify-content-between align-items-center">
        {{ user.username }}
      </li>

    </ul>
  </div>
</template>

<style scoped>

</style>