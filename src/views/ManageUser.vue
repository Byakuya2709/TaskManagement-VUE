<template>
  <div class="user-list">
    <h2>Danh Sách Nhân Viên</h2>

    <!-- Filter by Status -->
    <div class="filter-container mb-3">
      <label for="status-filter">Lọc theo trạng thái:</label>
      <select id="status-filter" v-model="selectedStatus" @change="filterUsers">
        <option value="">Tất cả</option>
        <option value="ACTIVE">Hoạt động</option>
        <option value="INACTIVE">Không hoạt động</option>
      </select>
    </div>

    <div v-for="user in filteredUsers" :key="user.id" class="user-card">
      <div class="d-flex align-items-center">
        <img
          :src="'data:image/png;base64,' + user.base64Image"
          alt="User Avatar"
          class="avatar"
        />
        <div class="user-body">
          <h3>{{ user.fullname }}</h3>
          <p><strong>Địa chỉ:</strong> {{ user.address }}</p>
          <p><strong>Ngày sinh:</strong> {{ formatDate(user.birth) }}</p>
          <p><strong>Giới tính:</strong> {{ translateGender(user.gender) }}</p>
          <!-- <p><strong>Detail:</strong> {{ user.detail }}</p>
          <p><strong>Status:</strong> {{ user.status }}</p> -->
          <p><strong>Nhóm:</strong> {{ user.groupName }}</p>
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
      selectedStatus: this.$route.query.status || "", // Trạng thái được chọn để lọc
    };
  },
  computed: {
    // Tạo một mảng người dùng đã được lọc dựa trên trạng thái đã chọn
    filteredUsers() {
      if (!this.selectedStatus) {
        return this.users; // Nếu không có trạng thái nào được chọn, trả về tất cả người dùng
      }
      return this.users.filter((user) => user.status === this.selectedStatus);
    },
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
        params: { userId: user.id },
      });
    },
    assignTask(user) {
      this.$router.replace({
        path: `/admin/newtask/${user.id}`,
      });
    },
    formatDate(dateString) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    // Phương thức lọc (có thể không cần nếu đã dùng computed)
    filterUsers() {
      if (this.selectedStatus) {
        this.$router.push({ query: { status: this.selectedStatus } });
      } else {
        this.$router.push({ query: null });
      }
    },
    translateGender(gender) {
      switch (gender) {
        case "FEMALE":
          return "Nữ";
        case "MALE":
          return "Nam";
        default:
          return "Không rõ"; // Trả về "Không rõ" nếu không phải là "FEMALE" hoặc "MALE"
      }
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

.filter-container {
  margin-bottom: 20px;
}

.user-card {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-body {
  margin-left: 4rem;
  flex-grow: 1;
}

.management-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
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
