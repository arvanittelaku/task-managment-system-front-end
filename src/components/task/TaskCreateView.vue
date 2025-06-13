<script setup lang="ts">
import { reactive, ref } from "vue";
import AppButton from "../ui/AppButton.vue";
import { useTaskStore } from "../../stores/taskStore";
import userService from "../../services/userService.js"; // import userService
import { useAuthStore } from "../../stores/authStore";
import {useRouter} from "vue-router";

const taskStore = useTaskStore();
const authStore = useAuthStore();
const router = useRouter();
const task = reactive({
  title: '',
  description: '',
  deadline: '',
  priority: '',
  username: '', // assigned user username input
});

const errors = reactive({
  title: '',
  description: '',
  deadline: '',
  priority: '',
  username: '',
});

const isLoading = ref(false);
const priorities = ['LOW', 'MEDIUM', 'HIGH'];

const validateForm = () => {
  let isValid = true;
  errors.title = task.title ? '' : 'Title is required';
  errors.description = task.description ? '' : 'Description is required';
  errors.deadline = task.deadline ? '' : 'Deadline is required';
  errors.priority = task.priority ? '' : 'Priority is required';
  errors.username = task.username ? '' : 'Username is required';
  return Object.values(errors).every(e => !e);
};

const submitForm = async () => {
  if (!validateForm()) return;

  isLoading.value = true;
  try {
    const assignedUser = await userService.getUserByUsername(task.username.trim());
    const createTaskDto = {
      title: task.title,
      description: task.description,
      deadline: task.deadline,
      priority: task.priority,
      assignedToId: assignedUser.id,
    };

    await taskStore.createTask(createTaskDto);
    router.push({ name: 'all-tasks' });

    Object.assign(task, {
      title: '',
      description: '',
      deadline: '',
      priority: '',
      username: '',
    });
  } catch (error) {
    console.error("Failed to create task:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="task-card">
    <h2>Create New Task</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="title">Title:</label>
        <input type="text" id="title" v-model="task.title" :class="{ error: errors.title }" placeholder="Enter task title" />
        <span v-if="errors.title" class="error-msg">{{ errors.title }}</span>
      </div>

      <div class="form-group">
        <label for="description">Description:</label>
        <textarea id="description" v-model="task.description" :class="{ error: errors.description }" placeholder="Enter task description"></textarea>
        <span v-if="errors.description" class="error-msg">{{ errors.description }}</span>
      </div>

      <div class="form-group">
        <label for="deadline">Deadline:</label>
        <input type="date" id="deadline" v-model="task.deadline" :class="{ error: errors.deadline }" />
        <span v-if="errors.deadline" class="error-msg">{{ errors.deadline }}</span>
      </div>

      <div class="form-group">
        <label for="priority">Priority:</label>
        <select id="priority" v-model="task.priority" :class="{ error: errors.priority }">
          <option disabled value="">Select priority</option>
          <option v-for="option in priorities" :key="option" :value="option">{{ option }}</option>
        </select>
        <span v-if="errors.priority" class="error-msg">{{ errors.priority }}</span>
      </div>

      <div class="form-group">
        <label for="username">Assign To (username):</label>
        <input id="username" v-model="task.username" type="text" placeholder="Enter assignee's username" :class="{ error: errors.username }" />
        <span v-if="errors.username" class="error-msg">{{ errors.username }}</span>
      </div>

      <app-button class="btn btn-primary" :is-loading="isLoading" type="submit">Submit</app-button>
    </form>
  </div>
</template>


<style scoped>
.task-card {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 12px;
  background: #f9f9f9;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
}

form .form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.3rem;
}

input,
select,
textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

input.error,
select.error,
textarea.error {
  border-color: #dc3545;
}

.error-msg {
  color: #dc3545;
  font-size: 0.9rem;
  margin-top: 0.3rem;
  display: block;
}
</style>
