<template>
    <div class="task-list container">
      <!-- Alert Component -->
      <Alert
        :show="alert.show"
        :type="alert.type"
        :message="alert.message"
        @close-alert="hideAlert"
      />
  
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
  import Alert from "../components/Alert.vue";
  
  export default {
    components: {
      TaskComponent,
      Alert,
    },
    data() {
      return {
        tasks: [],
        alert: {
          show: false,
          type: "",
          message: "",
        },
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
          this.showAlert("Error", error.response.data.message);
        }
      },
  
      // Handle edit task
      handleEditTask(task) {
        console.log("Editing task: ", task);
        // Your edit logic here
      },
  
      // Handle delete task
      async handleDeleteTask(task) {
        try {
          await api.delete(`/admin/task/${task.id}`);
          // Remove the task from the list
          this.tasks = this.tasks.filter((t) => t.id !== task.id);
          this.showAlert("Success", "Task deleted successfully!");
        } catch (error) {
          console.log(error);
          this.showAlert("Error", error.response.data.message);
        }
      },
  
      // Show alert
      showAlert(type, message) {
        this.alert = {
          show: true,
          type: type,
          message: message,
        };
      },
  
      // Hide alert
      hideAlert() {
        this.alert.show = false;
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
  