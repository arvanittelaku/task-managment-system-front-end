<script setup lang="ts">
defineProps({
  isLoading:{
    type: Boolean,
    default: false
  }
});
</script>

<template>
<button type="button" disabled v-if="isLoading" v-bind="$attrs">
  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  <slot/>
</button>
<button v-else v-bind="$attrs">
  <slot/>
</button>
</template>

<style scoped>

</style>