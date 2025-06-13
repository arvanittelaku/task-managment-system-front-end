<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../../stores/userStore';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const userId = route.params.id;
const userDetails = ref(null);

const fetchUserDetails = async () => {
  await userStore.loadCurrentUser(); // Load current user first
  if (userId) {
    try {
      userDetails.value = await userStore.getUserById(Number(userId));
      if (!userDetails.value) {
        router.push('/users');
      }
    } catch {
      alert('Failed to load user details: ' + (userStore.error || 'Unknown error'));
      router.push('/users');
    }
  }
};

onMounted(fetchUserDetails);

const canPerformAction = computed(() => {
  return userDetails.value ? userStore.canModifyUser(userDetails.value) : false;
});

const deleteUser = async () => {
  if (confirm(`Are you sure you want to delete user ${userDetails.value.username}?`)) {
    try {
      await userStore.deleteUserById(userDetails.value.id);
      alert('User deleted successfully!');
      router.push('/users');
    } catch {
      alert('Failed to delete user: ' + (userStore.error || 'Unknown error'));
    }
  }
};

const editUser = () => {
  router.push({ name: 'edit-user', params: { id: userDetails.value.id } });
};
</script>

<template>
  <div class="container mt-4">
    <div v-if="userStore.loading" class="text-center text-secondary fs-5 py-5">
      Loading user details...
    </div>

    <div v-else-if="userStore.error" class="text-center text-danger fs-5 fw-semibold py-5">
      {{ userStore.error }}
    </div>

    <div v-else-if="userDetails" class="card mx-auto" style="max-width: 600px;">
      <div class="card-body">
        <h2 class="card-title text-center display-5 fw-bold text-dark mb-4">
          {{ userDetails.username }}
        </h2>

        <ul class="list-group list-group-flush mb-4 fs-5 text-dark">
          <li class="list-group-item"><strong>ID:</strong> {{ userDetails.id }}</li>
          <li class="list-group-item"><strong>Email:</strong> {{ userDetails.email }}</li>
          <li class="list-group-item text-capitalize"><strong>Role:</strong> {{ userDetails.role }}</li>
          <li
              v-if="userDetails.createdByManagerId"
              class="list-group-item fst-italic text-muted"
          >
            Created by Manager ID: {{ userDetails.createdByManagerId }}
          </li>
        </ul>

        <div class="d-flex justify-content-center gap-3">
          <button
              v-if="canPerformAction"
              @click="editUser"
              class="btn btn-primary rounded-3"
              aria-label="Edit User"
          >
            Edit
          </button>
          <button
              v-if="canPerformAction"
              @click="deleteUser"
              class="btn btn-danger rounded-3"
              aria-label="Delete User"
          >
            Delete
          </button>
        </div>

        <div class="text-center mt-4">
          <button
              @click="router.back()"
              class="btn btn-secondary rounded-3"
          >
            ← Back to User List
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-secondary fs-5 fw-medium py-5">
      User not found.
    </div>
  </div>
</template>
