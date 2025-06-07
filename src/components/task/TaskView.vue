<script setup lang="ts">
import { onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTaskStore } from "../../stores/taskStore";
import { useAuthStore } from "../../stores/authStore"; // ✅ use authStore

const route = useRoute();
const router = useRouter();

const taskStore = useTaskStore();
const authStore = useAuthStore();

const taskId = Number(route.params.id);

const isLoading = computed(() => taskStore.loading);
const error = computed(() => taskStore.error);
const task = computed(() => taskStore.currentTask);

const canDelete = computed(() => {
  const user = authStore.loggedInUser;
  return user?.role === 'ADMIN' || task.value?.createdBy?.id === user?.id;
});

const canEdit = computed(() => {
  const user = authStore.loggedInUser;
  return user?.role === 'ADMIN' || task.value?.createdBy?.id === user?.id;
});

const loadTask = async () => {
  await taskStore.getTaskById(taskId);
};

const deleteTask = async () => {
  if (!task.value) return;
  if (!confirm("Are you sure you want to delete this task?")) return;

  await taskStore.deleteTask(task.value.id);
  await router.push("/tasks");
};

const updateTask = () => {
  router.push({ name: "TaskEdit", params: { id: taskId } });
};

onMounted(() => {
  loadTask();
  console.log("Logged in user:", authStore.loggedInUser);
  console.log('tasks:', taskStore.tasks);
});

watch(task, (newVal) => {
  console.log("Loaded task:", newVal);
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
      <p><strong>Assigned To:</strong> {{ task.assignedTo?.username }}</p>
      <p><strong>Created By:</strong> {{ task.createdBy?.username }} ({{ task.createdBy?.email }})</p>


    <button
          v-if="canEdit"
          class="btn btn-primary me-2"
          @click="updateTask"
      >
        Edit
      </button>

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
