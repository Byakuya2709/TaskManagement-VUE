<template>
  <div class="container">
    <div class="user-info">
      <img
        :src="
          user.base64Image
            ? 'data:image/png;base64,' + user.base64Image
            : 'src/assets/data/img/deafaultAvatar.png'
        "
        alt="User Avatar"
        class="avatar"
      />
      <h1>{{ user.fullname }}</h1>
      <p><strong>Địa chỉ:</strong> {{ user.address }}</p>
      <p><strong>Ngày sinh:</strong> {{ formatDate(user.birth) }}</p>
      <p><strong>Giới tính:</strong> {{ translateGender(user.gender) }}</p>
      <p><strong>Thông tin chi tiết:</strong> {{ user.detail }}</p>
    </div>

    <div class="tasks">
      <h2>Tác vụ:</h2>
      <div v-if="tasks.length === 0" class="no-tasks">
        <p>Không có tác vụ nào được phân công.</p>
      </div>
      <div
        @click="goToTaskDetail(task.id)"
        v-for="task in tasks"
        :key="task.id"
        class="task"
      >
        <h5>{{ task.title }}</h5>
        <p>{{ task.description }}</p>
        <!-- <p><strong>Nhân viên:</strong> {{ task.userName }}</p> -->
        <p><strong>Ngày hoàn thành:</strong> {{ formatDate(task.date) }}</p>
        <span class="badge" :class="taskBadges(task)">{{ task.status }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from "../api/Api";

export default {
  data() {
    return {
      user: {},
      tasks: [],
    };
  },
  created() {
    this.fetchUser();
  },
  watch: {
    "$route.params.userId": "fetchUser",
  },
  methods: {
    async fetchUser() {
      try {
        const userId = this.$route.params.userId;
        const res = await api.get(`/user/${userId}`);
        this.user = res.data.data;
        await this.fetchTask();
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    },
    async fetchTask() {
      try {
        const userId = this.$route.params.userId;
        const res = await api.get(`/user/${userId}/tasks`);
        this.tasks = res.data.data;
      } catch (error) {
        console.error("Error fetching user tasks:", error);
      }
    },
    goToTaskDetail(taskId) {
      this.$router.replace({
        name: "TaskDetail",
        params: { taskId: taskId },
      });
    },
    formatDate(dateString) {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
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
    taskBadges(task) {
      return {
        "badge-success": task.status === "COMPLETED",
        "badge-warning": task.status === "PENDING",
        "badge-danger": task.status === "CANCELED",
        "badge-info": task.status === "IN_PROGRESS",
      };
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-info {
  flex: 1;
  margin-right: 20px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tasks {
  flex: 2;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid #007bff; /* Thêm đường viền màu xanh */
  margin-bottom: 15px;
  object-fit: cover; /* Đảm bảo ảnh không bị méo */
}

h1,
h2 {
  color: #343a40;
}

.task {
  margin-bottom: 15px;
  padding: 10px; /* Thêm khoảng cách bên trong */
  border: 1px solid #dee2e6; /* Thêm đường viền cho từng task */
  border-radius: 4px; /* Làm tròn các góc */
}

.no-tasks {
  text-align: center;
  color: #6c757d;
}
</style>
