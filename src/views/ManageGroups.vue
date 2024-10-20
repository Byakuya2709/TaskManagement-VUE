<template>
  <div class="group-list">
    <h2>Danh sách nhóm làm việc</h2>

    <div v-for="group in groups" :key="group.id" class="group-card">
      <div class="group-header" @click="toggleGroupDetails(group.id)">
        <div class="leader-info">
          <div class="leader-details">
            <h3>{{ group.name }}</h3>
            <p><strong>Description:</strong> {{ group.description }}</p>
            <div class="d-flex">
              <img
                v-if="group.leader.leaderAvatar"
                :src="'data:image/png;base64,' + group.leader.leaderAvatar"
                alt="Leader Avatar"
                class="avatar"
              />
              <img
                v-else
                src="../../src/assets/data/img/deafaultAvatar.png"
                alt="Placeholder Leader Avatar"
                class="avatar"
              />
              <div class="leader-avatar">
                <p><strong>Leader:</strong> {{ group.leader.leaderName }}</p>
                <p><strong>ID:</strong>{{ group.leader.leaderId }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Show user details only when group is expanded -->
      <div v-if="expandedGroupId === group.id" class="user-list">
        <h4>Thành viên</h4>
        <div
          v-for="user in group.listUser"
          :key="user.userId"
          class="user-card"
        >
          <img
            v-if="user.userAvatar"
            :src="'data:image/png;base64,' + user.userAvatar"
            alt="User Avatar"
            class="avatar"
          />
          <img
            v-else
            src="../../src/assets/data/img/deafaultAvatar.png"
            alt="Placeholder Leader Avatar"
            class="avatar"
          />
          <div class="user-body">
            <h5>{{ user.userFullname }}</h5>
            <p><strong>User ID:</strong> {{ user.userId }}</p>
          </div>
          <div class="management-btn">
            <button
              class="btn btn-custom btn-info mb-2"
              @click="viewUserInfo(user)"
            >
              Thông tin
            </button>
            <button class="btn btn-custom btn-danger" @click="assignTask(user)">
              Giao việc
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from "../api/Api";

export default {
  data() {
    return {
      groups: [],
      expandedGroupId: null, // Track the currently expanded group
    };
  },
  created() {
    this.fetchAllGroups();
  },
  methods: {
    async fetchAllGroups() {
      try {
        const res = await api.get(`/admin/group/all`);
        this.groups = res.data.data; // Assuming 'data' contains the list of groups
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    },
    toggleGroupDetails(groupId) {
      // Toggle the visibility of the group's details
      this.expandedGroupId = this.expandedGroupId === groupId ? null : groupId;
    },
    viewUserInfo(user) {
      this.$router.replace({
        name: "UserProfile",
        params: { userId: user.userId },
      });
    },
    assignTask(user) {
      this.$router.replace({
        path: `/admin/newtask/${user.userId}`,
      });
    },
  },
};
</script>

<style>
.group-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.group-card {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.leader-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.leader-details {
  flex-grow: 1;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.user-list {
  margin-top: 10px;
  border-top: 1px solid #ddd;
  padding-top: 10px;
}

.user-card {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
}

.user-body {
  flex-grow: 1;
  margin-left: 2rem;
}

.management-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.btn-custom {
  width: 140px;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 25px;
  color: white;
}
.leader-avatar {
  margin-left: 1rem;
}
</style>
