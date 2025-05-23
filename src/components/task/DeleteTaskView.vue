<script setup lang="ts">
import { useTaskStore } from '../../stores/taskStore';
import { useRoute, useRouter } from 'vue-router';
import AppButton from "../ui/AppButton.vue";
const taskStore = useTaskStore();
const route = useRoute();
const router = useRouter();
const taskId = Number(route.params.id);
const task = taskStore.getTaskById(taskId);
const deleteTask = async () => {
  if (!task) return;
  if (!confirm("Are you sure you want to delete this task?")) return;
  await taskStore.deleteTask(taskId);
  await router.push({name: 'tasks'});
};




</script>

<template>
  <h1>Delete task</h1>
  <app-button v-if="task" class="btn btn-danger" @click="deleteTask">Delete</app-button>
</template>

<style scoped>

</style>