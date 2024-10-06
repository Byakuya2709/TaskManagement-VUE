<template>
  <div class="user-list">
    <h2>User List</h2>
    <div v-for="user in users" :key="user.id" class="user-card">
      <div class="d-flex align-items-center">
        <img
          :src="'data:image/png;base64,' + user.base64Image"
          alt="User Avatar"
          class="avatar"
        />
        <div class="user-body">
          <h3>{{ user.fullname }}</h3>
          <p><strong>Address:</strong> {{ user.address }}</p>
          <p><strong>Birthdate:</strong> {{ formatDate(user.birth) }}</p>
          <p><strong>Gender:</strong> {{ user.gender }}</p>
          <p><strong>Detail:</strong> {{ user.detail }}</p>
        </div>
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
</template>
<script>
import { api } from "../api/Api";

export default {
  data() {
    return {
      users: [],
    };
  },
  created() {
    this.fetchAllUser();
  },
  methods: {
    async fetchAllUser() {
      try {
        const res = await api.get(`/admin/user/all`);
        this.users = res.data.data;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    viewUserInfo(user) {
      this.$router.replace({
        name: "UserProfile",
        params: { userId: user.id}
      });
    },
    assignTask(user) {
      alert(`Assigning task to ${user.fullname}`);
    },
    formatDate(dateString) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
  },
};
</script>

<style>
.user-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.user-card {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
  display: flex; /* Sử dụng flexbox cho card */
  justify-content: space-between; /* Để căn chỉnh phần tử */
  align-items: center; /* Căn giữa các phần tử theo chiều dọc */
}

.user-body {
  margin-left: 4rem; /* Khoảng cách giữa hình ảnh và thông tin người dùng */
  flex-grow: 1; /* Để phần thân người dùng chiếm không gian còn lại */
}

.management-btn {
  display: flex;
  flex-direction: column; /* Đặt các nút theo chiều dọc */
  align-items: center; /* Căn chỉnh các nút về bên phải */
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}
.btn-custom {
  width: 140px;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 25px;
  color: white;
}
</style>
