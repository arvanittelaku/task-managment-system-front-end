<script setup>
import { computed, watch } from "vue";
import { useTaskStore } from "../../stores/taskStore";
import { useAuthStore } from "../../stores/authStore";

const authStore = useAuthStore();
const taskStore = useTaskStore();

const role = computed(() => authStore.role);
const isReadyToFetchTasks = computed(() => !!role.value && !authStore.loading);

watch(isReadyToFetchTasks, async (ready) => {
  if (ready) {
    await taskStore.getTasks();
  }
}, { immediate: true });

const statusTitles = {
  pending: "PENDING",
  inProgress: "IN_PROGRESS",
  completed: "COMPLETED",
  canceled: "CANCELED",
};

const statusOptions = [
  { value: "PENDING", label: "PENDING" },
  { value: "IN_PROGRESS", label: "IN_PROGRESS" },
  { value: "COMPLETED", label: "COMPLETED" },
  { value: "CANCELED", label: "CANCELED" },
];

const tasksByStatus = computed(() => ({
  pending: taskStore.tasks.filter((t) => t.status === "PENDING"),
  inProgress: taskStore.tasks.filter((t) => t.status === "IN_PROGRESS"),
  completed: taskStore.tasks.filter((t) => t.status === "COMPLETED"),
  canceled: taskStore.tasks.filter((t) => t.status === "CANCELED"),
}));

function canChangeStatus(currentStatus, newStatus) {
  if (currentStatus === newStatus) return false;

  switch (currentStatus) {
    case "PENDING":
      return ["IN_PROGRESS", "COMPLETED", "CANCELED"].includes(newStatus);
    case "IN_PROGRESS":
      return ["COMPLETED", "CANCELED"].includes(newStatus);
    default:
      return false;
  }
}

async function changeStatus(task, newStatus) {
  if (!canChangeStatus(task.status, newStatus)) {
    alert(`Cannot change status from ${task.status} to ${newStatus}`);
    return;
  }

  try {
    await taskStore.updateTaskStatus(task.id, newStatus);
  } catch (error) {
    console.error(error);
    alert("Failed to update task status");
  }
}
</script>

<template>
  <div v-if="authStore.loading || taskStore.loading">
    <div class="container mt-4 text-center">
      <span class="spinner-border text-primary" role="status" />
      <p v-if="authStore.loading">Loading user session...</p>
      <p v-else-if="taskStore.loading">Loading tasks...</p>
    </div>
  </div>

  <div v-else-if="isReadyToFetchTasks && !taskStore.loading">
    <div v-if="role === 'ADMIN'" class="container mt-4">
      <h2 class="mb-3">All Tasks</h2>
      <ul class="list-group">
        <li v-for="task in taskStore.tasks" :key="task.id" class="list-group-item">
          <router-link :to="{ name: 'view-task', params: { id: task.id } }">{{ task.title }}</router-link>
          <br />
          <small class="text-muted">Assigned to: {{ task.assignedTo?.username || "Unassigned" }}</small>
          <br />
          <small class="text-muted">Status: {{ task.status }}</small>
        </li>
      </ul>
    </div>

    <div v-else-if="role === 'MANAGER'" class="container mt-4">
      <h2 class="mb-3">Tasks You Created</h2>
      <div class="row">
        <div class="col-md-3" v-for="(tasks, statusKey) in tasksByStatus" :key="statusKey">
          <h4>{{ statusTitles[statusKey] }}</h4>
          <ul class="list-group">
            <li v-if="tasks.length === 0" class="list-group-item text-muted">No {{ statusTitles[statusKey].toLowerCase() }} tasks</li>
            <li
                v-for="task in tasks"
                :key="task.id"
                class="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <router-link :to="{ name: 'view-task', params: { id: task.id } }" class="fw-bold">{{ task.title }}</router-link>
                <br />
                <small class="text-muted">{{ task.assignedTo?.username || "Unassigned" }}</small>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div v-else-if="role === 'USER'" class="container mt-4">
      <h2 class="mb-3">Tasks Assigned to You</h2>
      <div class="row">
        <div class="col-md-3" v-for="(tasks, statusKey) in tasksByStatus" :key="statusKey">
          <h4>{{ statusTitles[statusKey] }}</h4>
          <ul class="list-group">
            <li v-if="tasks.length === 0" class="list-group-item text-muted">No {{ statusTitles[statusKey].toLowerCase() }} tasks</li>
            <li
                v-for="task in tasks"
                :key="task.id"
                class="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <router-link :to="{ name: 'view-task', params: { id: task.id } }" class="fw-bold">{{ task.title }}</router-link>
                <br />
                <small class="text-muted">{{ task.assignedTo?.username || "Unassigned" }}</small>
              </div>
              <select
                  class="form-select form-select-sm w-auto ms-2"
                  :value="task.status"
                  @change="changeStatus(task, $event.target.value)"
              >
                <option
                    v-for="statusOption in statusOptions"
                    :key="statusOption.value"
                    :value="statusOption.value"
                    :disabled="!canChangeStatus(task.status, statusOption.value)"
                >
                  {{ statusOption.label }}
                </option>
              </select>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h4 {
  margin-bottom: 15px;
}
</style>