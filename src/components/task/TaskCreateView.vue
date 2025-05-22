<script setup lang="ts">
import {reactive, ref} from "vue";
import AppButton from "../ui/AppButton.vue";

const task = reactive({
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
const priorities = ['Low', 'Medium', 'High'];
const validateForm = () => {
  let isValid = true;

  if (!task.title) {
    errors.title = 'Title is required';
    isValid = false;
  }

  if (!task.description) {
    errors.description = 'Description is required';
    isValid = false;
  }

  if (!task.deadline) {
    errors.deadline = 'Deadline is required';
    isValid = false;
  }

  if (!task.priority) {
    errors.priority = 'Priority is required';
    isValid = false;
  }

  if (!task.username) {
    errors.username = 'Username is required';
    isValid = false;
  }

  return isValid;
}
const submitForm = async () => {

  if (!validateForm()) {
    return;
  }

  isLoading.value = true;

  try {
    const response = await axios.post
  }

}
</script>

<template>
  <div class="task-card">
    <h2>Task Details</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="title">Title:</label>
        <input type="text"
               id="title"
               v-model="task.title"
               :class="{error:errors.title}"
               required
               placeholder="Enter task title" />
        <span v-if="errors.title" class="error-msg">{{ errors.title }}</span>
      </div>

      <div class="form-group">
        <label for="description">Description:</label>
        <textarea id="description"
                  v-model="task.description"
                  :class="{error:errors.description}"
                  required
                  placeholder="Enter task description"></textarea>
        <span v-if="errors.description" class="error-msg">{{ errors.description }}</span>
      </div>

      <div class="form-group">
        <label for="deadline">Deadline:</label>
        <input type="date"
               id="deadline"
               v-model="task.deadline"
               :class="{error:errors.deadline}"
               required />
        <span v-if="errors.deadline" class="error-msg">{{ errors.deadline }}</span>
      </div>

      <div class="form-group">
        <label for="priority">Priority:</label>
        <select id="priority"
                v-model="task.priority">
          <option disabled value="">Select priority</option>
          <option v-for="option in priorities" :key="option" :value="option">{{ option }}</option>
        </select>
        <span v-if="errors.priority" class="error-msg">{{ errors.priority }}</span>
      </div>

      <div class="form-group">
        <label for="username">Username:</label>
        <input
            id="username"
            v-model.number="task.username"
            type="text"
            placeholder="Enter user's username"
            :class="errors.username"
            required
        />
        <span v-if="errors.username" class="error-msg">{{ errors.username }}</span>
      </div>

      <div class="form-group">
        <label>Created By</label>
        <input
            type="text"
            :value="task.createdBy?.name || ''"
            readonly
        />
      </div>
      <app-button class="btn btn-primary" :is-loading="isLoading" type="submit">Submit</app-button>
    </form>
  </div>


</template>

<style scoped>

</style>