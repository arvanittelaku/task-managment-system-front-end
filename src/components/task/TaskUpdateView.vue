<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import AppButton from "../ui/AppButton.vue";
import { useRoute, useRouter } from "vue-router";
import { useTaskStore } from "../../stores/taskStore";

const taskStore = useTaskStore();
const route = useRoute();
const router = useRouter();

const task = reactive({
  id: '',
  title: '',
  description: '',
  deadline: '',
  priority: '',
  createdBy: {
    name: '',
    email: '',
  },
  username: '',
});

const errors = reactive({
  title: '',
  description: '',
  deadline: '',
  priority: '',
  username: '',
});

const isLoading = ref(false);
const successMessage = ref('');
const priorities = ['LOW', 'MEDIUM', 'HIGH'];

const validateForm = () => {
  let isValid = true;

  if (!task.title) {
    errors.title = 'Title is required';
    isValid = false;
  } else {
    errors.title = '';
  }

  if (!task.description) {
    errors.description = 'Description is required';
    isValid = false;
  } else {
    errors.description = '';
  }

  if (!task.deadline) {
    errors.deadline = 'Deadline is required';
    isValid = false;
  } else {
    errors.deadline = '';
  }

  if (!task.priority) {
    errors.priority = 'Priority is required';
    isValid = false;
  } else {
    errors.priority = '';
  }

  if (!task.username) {
    errors.username = 'Username is required';
    isValid = false;
  } else {
    errors.username = '';
  }

  return isValid;
};

const loadTask = async () => {
  isLoading.value = true;
  try {
    const taskId = Number(route.params.id);
    await taskStore.getTaskById(taskId);

    if (taskStore.currentTask) {
      Object.assign(task, taskStore.currentTask);
    } else {
      console.error('Task not found');
    }
  } catch (error) {
    console.error('Failed to load task:', error);
  } finally {
    isLoading.value = false;
  }
};

const submitForm = async () => {
  if (!validateForm()) return;

  isLoading.value = true;
  successMessage.value = '';

  try {
    await taskStore.updateTask(task);
    successMessage.value = 'Task updated successfully! Redirecting...';
    setTimeout(() => {
      router.push({ name: 'all-tasks' });
    }, 1500);
  } catch (error) {
    console.error('Failed to update task:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadTask();
});
</script>

<template>
  <div class="container mt-4">
    <h2 class="mb-4">Update Task</h2>
    <form @submit.prevent="submitForm" novalidate>
      <div class="mb-3">
        <label for="title" class="form-label">Title:</label>
        <input
            type="text"
            id="title"
            v-model="task.title"
            :class="['form-control', errors.title ? 'is-invalid' : '']"
            placeholder="Enter task title"
            required
        />
        <div class="invalid-feedback">{{ errors.title }}</div>
      </div>

      <div class="mb-3">
        <label for="description" class="form-label">Description:</label>
        <textarea
            id="description"
            v-model="task.description"
            :class="['form-control', errors.description ? 'is-invalid' : '']"
            placeholder="Enter task description"
            required
        ></textarea>
        <div class="invalid-feedback">{{ errors.description }}</div>
      </div>

      <div class="mb-3">
        <label for="deadline" class="form-label">Deadline:</label>
        <input
            type="date"
            id="deadline"
            v-model="task.deadline"
            :class="['form-control', errors.deadline ? 'is-invalid' : '']"
            required
        />
        <div class="invalid-feedback">{{ errors.deadline }}</div>
      </div>

      <div class="mb-3">
        <label for="priority" class="form-label">Priority:</label>
        <select
            id="priority"
            v-model="task.priority"
            :class="['form-select', errors.priority ? 'is-invalid' : '']"
            required
        >
          <option disabled value="">Select priority</option>
          <option v-for="option in priorities" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
        <div class="invalid-feedback">{{ errors.priority }}</div>
      </div>

      <div class="mb-3">
        <label for="username" class="form-label">Username:</label>
        <input
            id="username"
            v-model="task.username"
            type="text"
            placeholder="Enter user's username"
            :class="['form-control', errors.username ? 'is-invalid' : '']"
            required
        />
        <div class="invalid-feedback">{{ errors.username }}</div>
      </div>

      <AppButton
          class="btn btn-primary"
          :is-loading="isLoading"
          type="submit"
      >
        Update Task
      </AppButton>
    </form>

    <div v-if="successMessage" class="alert alert-success mt-3" role="alert">
      {{ successMessage }}
    </div>
  </div>
</template>

<style scoped>
/* Optional styles */
</style>
