<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTaskStore } from "../../stores/taskStore";
import { useUserStore } from "../../stores/userStore";
const route = useRoute();
const router = useRouter();

const taskStore = useTaskStore();
const userStore = useUserStore();

const taskId = Number(route.params.id);

const isLoading = computed(() => taskStore.loading);
const error = computed(() => taskStore.error);
const task = computed(() => taskStore.currentTask);

const canDelete = computed(() => {
  if (!task.value || !userStore.currentUser) return false;
  return task.value.createdBy?.id === userStore.currentUser.id;
});

const loadTask = async () => {
  await taskStore.getTaskById(taskId);
};

const deleteTask = async () => {
  if (!task.value) return;
  if (!confirm("Are you sure you want to delete this task?")) return;

  await taskStore.deleteTask(task.value.id);
  router.push("/tasks");  // redirect after delete
};

const updateTask = () => {
  router.push({ name: "TaskEdit", params: { id: taskId } });
};

onMounted(() => {
  loadTask();
});
</script>

<template>
  <div class="container mt-4">
    <div v-if="isLoading" class="text-center">
      <div class="spinner-border" role="status"></div>
      <p>Loading...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <div v-else-if="task">
      <h2>{{ task.title }}</h2>
      <p><strong>Description:</strong> {{ task.description }}</p>
      <p><strong>Deadline:</strong> {{ task.deadline }}</p>
      <p><strong>Priority:</strong> {{ task.priority }}</p>
      <p><strong>Status:</strong> {{ task.status }}</p>
      <p><strong>Assigned To:</strong> {{ task.username }}</p>
      <p><strong>Created By:</strong> {{ task.createdBy?.name }} ({{ task.createdBy?.email }})</p>

      <button class="btn btn-primary me-2" @click="updateTask">Update</button>

      <button
          v-if="canDelete"
          class="btn btn-danger"
          @click="deleteTask"
      >
        Delete
      </button>
    </div>

    <div v-else>
      <p class="text-danger">Task not found.</p>
    </div>
  </div>
</template>

<style scoped>
/* You can add custom styling here if needed */
</style>
