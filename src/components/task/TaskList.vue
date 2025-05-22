<script setup lang="ts">
import {computed,onMounted} from "vue";
import { useTaskStore } from "../../stores/taskStore";

const taskStore = useTaskStore();

onMounted(() => {
  taskStore.getTasks();
});
const statusTitles = {
  pending: 'PENDING',
  inProgress: 'IN_PROGRESS',
  completed: 'COMPLETED',
  canceled: 'CANCELED',
};
const statusOptions = [
  { value: 'pending', label: 'PENDING' },
  { value: 'inProgress', label: 'IN_PROGRESS' },
  { value: 'completed', label: 'COMPLETED' },
  { value: 'canceled', label: 'CANCELED' },
];

const tasksByStatus = computed(() => {
  return{
    pending: taskStore.tasks.filter(task => task.status === 'PENDING'),
    inProgress: taskStore.tasks.filter(task => task.status === 'IN_PROGRESS'),
    completed: taskStore.tasks.filter(task => task.status === 'COMPLETED'),
    canceled: taskStore.tasks.filter(task => task.status === 'CANCELED'),
  }
});

const changeStatus = async(task, newStatus) =>{
  if (task.status === newStatus) return;

  try{
    const updatedTask = { ...task, status: newStatus };
    await taskStore.updateTask(updatedTask);
    await taskStore.getTasks();
  }catch(error){
    console.error(error);
  }
};
</script>

<template>
  <div class="container mt-4">
    <h2 class="mb-3">Tasks by Status</h2>
    <div class="row">
      <div class="col-md-3" v-for="(tasks, statusKey) in tasksByStatus" :key="statusKey">
        <h4>{{ statusTitles[statusKey] }}</h4>
        <ul class="list-group">
          <li v-for="task in tasks" :key="task.id" class="list-group-item d-flex justify-content-between align-items-center">
            <div>{{ task.title }}</div>
            <select
                class="form-select form-select-sm w-auto"
                :value="task.status"
                @change="changeStatus(task, $event.target.value)"
            >
              <option v-for="statusOption in statusOptions" :key="statusOption.value" :value="statusOption.value">
                {{ statusOption.label }}
              </option>
            </select>
          </li>
          <li v-if="tasks.length === 0" class="list-group-item text-muted">No {{ statusTitles[statusKey].toLowerCase() }} tasks</li>
        </ul>
      </div>
    </div>
  </div>
</template>


<style scoped>
h4 {
  margin-bottom: 15px;
}
</style>