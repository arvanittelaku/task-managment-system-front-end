<script setup lang="ts">

</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <router-link :to="{name: 'users'}" class="btn btn-primary">Users</router-link>
      <router-link :to="{name: 'managers'}" class="btn btn-primary">Managers</router-link>
    </div>
  </nav>

  <router-view />
</template>


<style scoped>

</style>