<script setup>
import { onMounted, watch } from 'vue';
import { useUserStore } from '../../stores/userStore';
import { useRouter } from 'vue-router';

const props = defineProps({
  filterRole: {
    type: String,
    default: null
  }
});

const userStore = useUserStore();
const router = useRouter();

const fetchUsers = async () => {
  await userStore.loadCurrentUser(); // ensure current user loaded before fetching
  if (props.filterRole === 'MANAGER') {
    await userStore.getAllManagers();
  } else {
    await userStore.fetchUsersByRole('USER');
  }
};

onMounted(fetchUsers);
watch(() => props.filterRole, fetchUsers);

const viewUserDetails = (userId) => {
  router.push({ name: 'user-details', params: { id: userId } });
};

const deleteUser = async (userId) => {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      await userStore.deleteUserById(userId);
    } catch {
      alert('Failed to delete user: ' + (userStore.error || 'Unknown error'));
    }
  }
};

const editUser = (userId) => {
  router.push({ name: 'edit-user', params: { id: userId } });
};

const canPerformAction = (user) => userStore.canModifyUser(user);
</script>

<template>
  <div class="user-list-container p-6">
    <h2 class="text-3xl font-bold mb-6 text-center">
      {{ filterRole === 'MANAGER' ? 'All Managers' : 'All Users' }}
    </h2>

    <div v-if="userStore.loading" class="text-center text-gray-500">Loading users...</div>
    <div v-if="userStore.error" class="text-red-500 text-center">{{ userStore.error }}</div>

    <div v-if="userStore.users.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
          v-for="user in userStore.users"
          :key="user.id"
          class="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col justify-between h-full mb-4"
      >
        <div @click="viewUserDetails(user.id)" class="cursor-pointer">
          <p class="font-semibold text-xl mb-1">
            {{ user.username }}
            <span class="text-sm text-gray-500">({{ user.role }})</span>
          </p>
          <p class="text-gray-700 mb-1">{{ user.email }}</p>
          <p v-if="user.createdByManagerId" class="text-xs text-gray-400">
            Created by Manager ID: {{ user.createdByManagerId }}
          </p>
        </div>

        <div class="flex justify-end gap-2 mt-4">
          <button v-if="canPerformAction(user)" @click.stop="editUser(user.id)" class="btn btn-primary rounded-3 me-2">
            Edit
          </button>
          <button v-if="canPerformAction(user)" @click.stop="deleteUser(user.id)" class="btn btn-danger rounded-3">
            Delete
          </button>
        </div>
      </div>
    </div>

    <div v-else-if="!userStore.loading" class="text-center text-gray-500">No users found.</div>
  </div>
</template>
