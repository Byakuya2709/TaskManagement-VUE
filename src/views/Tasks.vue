<template>
  <div class="task-list container">
    <h2 class="text-center">Danh sách công việc</h2>

    <!-- Task List -->
    <div class="row">
      <!-- Iterate over tasks and pass each task to TaskComponent -->
      <div v-for="task in tasks" :key="task.title" class="col-md-4 mb-3">
        <TaskComponent
          :task="task"
          @deleteTask="handleDeleteTask"
          @editTask="handleEditTask"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TaskComponent from "../components/Task.vue"; // Adjust the import path as needed
import { api } from "../api/Api";

export default {
  components: {
    TaskComponent,
  },
  data() {
    return {
      tasks: [],
    };
  },
  created() {
    this.fetchTasks();
  },
  methods: {
    // Fetch tasks from the API
    async fetchTasks() {
      try {
        const res = await api.get("/admin/task/all");
        this.tasks = res.data.data;
      } catch (error) {
        console.log(error);
        this.$toast.error(error.response.data.message); // Use toast for error messages
      }
    },

    // Handle edit task
    handleEditTask(task) {
      this.$router.push({ name: "EditTask", params: { id: task.id } });
    },

    // Handle delete task
    async handleDeleteTask(task) {
      const confirmed = confirm("Are you sure you want to delete this task?");
      if (!confirmed) {
        // If the user does not confirm, stop the delete process
        return;
      }
      try {
        await api.delete(`/admin/task/${task.id}`);
        // Remove the task from the list
        this.tasks = this.tasks.filter((t) => t.id !== task.id);
        this.$toast.success("Task deleted successfully!"); // Use toast for success messages
      } catch (error) {
        console.log(error);
        this.$toast.error(error.response.data.message); // Use toast for error messages
      }
    },
  },
};
</script>

<style scoped>
.task-list {
  margin-top: 20px;
}

.text-center {
  text-align: center;
}
</style>
