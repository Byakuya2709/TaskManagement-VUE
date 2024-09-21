<template>
  <Alert
    :show="alert.show"
    :type="alert.type"
    :message="alert.message"
    @close-alert="hideAlert"
  />
  <div class="card task-card">
    <div class="card-body">
      <h5 class="card-title task-title">{{ task.title }}</h5>
      <hr />
      <p class="card-text task-description">{{ task.description }}</p>
      <hr />
      <div class="container task-details">
        <div class="row">
          <div class="col-6 text-left">
            <strong>Nhân viên:</strong> {{ task.userName }}
          </div>
          <div class="col-6 text-right">
            <strong>Ngày tới hạn:</strong> {{ formatDate(task.date) }}
          </div>
        </div>
        <div class="row mt-3">
          <div class="col-12 text-center">
            <span class="badge">{{ task.status }}</span>
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
        <div v-else v-for="comment in comments" :key="comment.id" class="comment">
          <p>
            <strong> {{ comment.userName }} : </strong>
            {{ comment.content }}
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
import Alert from "../components/Alert.vue";

export default {
  name: "TaskDetail",
  components: { Alert },
  data() {
    return {
      task: {},
      comments: [],
      newComment: "",
      alert: {
        show: false,
        type: "",
        message: "",
      },
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
        this.showAlert("Error", error.response?.data?.message || "An unexpected error occurred.");
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
          userName :comment.userName,
          taskTitle: comment.taskTitle,
          taskId: comment.taskId,
        }));
      } catch (error) {
        console.error(error);
        this.showAlert("Error", "Failed to load comments.");
      }
    },
    async postComment() {
      if (!this.newComment.trim()) return;

      try {
        const res = await api.post(
          `/comment/task/${this.$route.params.taskId}`,
          {
            content: this.newComment,
            userId : this.userId 
          }
        );
        const newComment = res.data.data;
        console.log(newComment.createdDate);
        this.comments.push({
        id: newComment.id,
        content: newComment.content,
        date: newComment.createdDate,
        userName:newComment.userName,
        userId: newComment.userId,
        taskId: newComment.taskId,
      });
        this.newComment = ""; 
      } catch (error) {
        const message = error.response?.data?.message || error;
        this.showAlert("Error",message);
      }
    },
    showAlert(type, message) {
      this.alert.show = true;
      this.alert.type = type;
      this.alert.message = message;

      setTimeout(() => {
        this.alert.show = false;
      }, 3000);
    },
    hideAlert() {
      this.alert.show = false;
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    formatDateTime(date) {
    return new Date(date).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  },
  },
  computed:{
    userId() {
      return this.$authStore.userId;
    }
  }
};
</script>
<style scoped>
*{
    font-size: 1.2rem;
}
</style>

