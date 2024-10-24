<template>
  <div class="card task-card">
    <div class="card-body">
      <div class="button-group">
        <button class="btn btn-warning mx-2" @click="updateTask">
          Cập nhật
        </button>
        <button class="btn btn-danger" @click="deleteTask">Xóa</button>
      </div>
      <h5 class="card-title task-title">{{ task.title }}</h5>
      <hr />
      <p class="card-text task-description">{{ task.description }}</p>
      <hr />
      <div class="container task-details">
        <div class="row">
          <div class="col-6 text-right">
            <strong>Ngày tạo công việc:</strong>
            {{ formatDate(task.createdDate) }}
          </div>
          <div class="col-6 text-right">
            <strong>Ngày hoàn thành:</strong> {{ formatDate(task.date) }}
          </div>
          <div class="col-6 text-right">
            <strong>Lần cuối cập nhật:</strong>
            {{ formatDate(task.updatedDate) }}
          </div>

          <div class="col-6 text-left">
            <strong>Chịu trách nhiệm:</strong> {{ task.userName }}
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-12 text-center">
            <span class="badge" :class="taskBadges(task.status)">{{
              task.status
            }}</span>
          </div>
        </div>
      </div>
      <hr />

      <!-- Comment Form -->
      <div class="comment-form">
        <h5>Đăng bình luận</h5>
        <textarea
          v-model="newComment"
          class="form-control"
          placeholder="Nhập bình luận của bạn..."
        ></textarea>
        <button class="btn btn-primary mt-2" @click="postComment">Gửi</button>
      </div>

      <hr />

      <!-- Display Comments -->
      <div class="comments-section">
        <h5>Bình luận</h5>
        <p v-if="comments.length === 0">Chưa có bình luận nào.</p>
        <div
          v-else
          v-for="comment in comments"
          :key="comment.id"
          class="comment"
        >
          <p>
            <strong>{{ comment.userName }}:</strong> {{ comment.content }}
          </p>
          <p class="text-muted">{{ formatDateTime(comment.date) }}</p>
          <hr />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from "../api/Api";

export default {
  name: "TaskDetail",
  data() {
    return {
      task: {},
      comments: [],
      newComment: "",
    };
  },
  created() {
    this.fetchTask();
    this.fetchComments();
  },
  methods: {
    async fetchTask() {
      try {
        const res = await api.get(`/admin/task/${this.$route.params.taskId}`);
        this.task = res.data.data;
      } catch (error) {
        console.error(error);
        this.$toast.error(
          error.response?.data?.message || "An unexpected error occurred."
        );
      }
    },
    async fetchComments() {
      try {
        const res = await api.get(`/comment/task/${this.$route.params.taskId}`);
        this.comments = res.data.data.map((comment) => ({
          id: comment.id,
          content: comment.content,
          date: comment.createdDate,
          userId: comment.userId,
          userName: comment.userName,
          taskTitle: comment.taskTitle,
          taskId: comment.taskId,
        }));
      } catch (error) {
        console.error(error);
        this.$toast.error("Failed to load comments.");
      }
    },
    async postComment() {
      if (!this.newComment.trim()) return;

      try {
        const res = await api.post(
          `/comment/task/${this.$route.params.taskId}`,
          {
            content: this.newComment,
            userId: this.userId,
          }
        );
        console.log(res);
        const newComment = res.data.data;
        this.comments.push({
          id: newComment.id,
          content: newComment.content,
          date: newComment.createdDate,
          userName: newComment.userName,
          userId: newComment.userId,
          taskId: newComment.taskId,
        });
        this.newComment = "";

        this.$toast.success(res.data.message);
      } catch (error) {
        const message = error.response?.data?.message || error;
        this.$toast.error(message);
      }
    },
    async updateTask() {
      this.$router.push({ name: "EditTask", params: { id: this.task.id } });
    },
    async deleteTask() {
      const confirmed = confirm("Are you sure you want to delete this task?");
      if (!confirmed) {
        return;
      }
      try {
        await api.delete(`/admin/task/${this.task.id}`);
        this.$toast.success("Task deleted successfully!");
        this.$router.replace({ name: "Tasks" }); // Redirect after deletion
      } catch (error) {
        console.log(error);
        this.$toast.error(error.response.data.message);
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    formatDateTime(date) {
      return new Date(date).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    },
    taskBadges(status) {
      return {
        "badge-success": status === "COMPLETED",
        "badge-warning": status === "PENDING",
        "badge-danger": status === "CANCELED",
        "badge-info": status === "IN_PROGRESS",
      };
    },
  },
  computed: {
    userId() {
      return this.$authStore.userId;
    },
  },
};
</script>

<style scoped>
* {
  font-size: 1.2rem;
}

.task-card {
  margin: 20px 0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden; /* Ensure corners are rounded */
}

.task-title {
  font-weight: bold;
}

.button-group {
  display: flex;
  justify-content: flex-end; /* Align buttons to the right */
  margin-bottom: 15px;
}

.comment-form {
  margin-top: 20px;
}

.comments-section {
  margin-top: 20px;
}

.badge {
  padding: 0.5em 1em; /* Add padding for badge */
  font-size: 1.1rem; /* Slightly larger font for badge */
}
</style>
