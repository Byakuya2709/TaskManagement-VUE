<template>
  <div class="dashboard" id="dashboard">
    <h1><i class="fas fa-tachometer-alt"></i> Dashboard</h1>

    <div class="stats-container">
      <section class="task-stats">
        <h2><i class="fas fa-tasks"></i> Thống kê nhiệm vụ</h2>
        <div class="stat-card-group">
          <div class="stat-card">
            <h3><i class="fas fa-check-circle"></i> Hoàn thành</h3>
            <p class="stat-number">{{ taskStats.COMPLETED }}</p>
          </div>
          <div class="stat-card">
            <h3><i class="fas fa-spinner"></i> Đang thực hiện</h3>
            <p class="stat-number">{{ taskStats.IN_PROGRESS }}</p>
          </div>
          <div class="stat-card">
            <h3><i class="fas fa-hourglass-start"></i> Đang chờ</h3>
            <p class="stat-number">{{ taskStats.PENDING }}</p>
          </div>
          <div class="stat-card">
            <h3><i class="fas fa-times-circle"></i> Bị hủy</h3>
            <p class="stat-number">{{ taskStats.CANCELED }}</p>
          </div>
        </div>
      </section>

      <section class="employee-stats">
        <h2><i class="fas fa-users"></i> Thống kê nhân viên</h2>
        <div class="stat-card-group">
          <div class="stat-card">
            <h3><i class="fas fa-users"></i> Tổng số nhân viên</h3>
            <p class="stat-number">{{ employeeStats.TOTAL }}</p>
          </div>
          <div class="stat-card">
            <h3><i class="fas fa-user-check"></i> Đang hoạt động</h3>
            <p class="stat-number">{{ employeeStats.ACTIVE }}</p>
          </div>
          <div class="stat-card">
            <h3><i class="fas fa-user-slash"></i> Không hoạt động</h3>
            <p class="stat-number">{{ employeeStats.INACTIVE }}</p>
          </div>
        </div>
      </section>
    </div>

    <div class="charts-container">
      <div class="chart-container">
        <h2>Thống kê nhiệm vụ</h2>
        <BarChart :data="taskChartData" class="chart" />
      </div>

      <div class="chart-container">
        <h2>Thống kê nhân viên</h2>
        <BarChart :data="employeeChartData" class="chart" />
      </div>
    </div>

    <div v-if="error" class="error-message">{{ error }}</div>

    <button @click="downloadPDF" class="pdf-button">
      <i class="fas fa-file-pdf"></i> Xuất PDF
    </button>
  </div>
</template>

<script>
import { api } from "../api/Api";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Register the components globally
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default {
  name: "Dashboard",
  components: {
    BarChart: Bar,
  },
  data() {
    return {
      taskStats: {
        COMPLETED: 0,
        IN_PROGRESS: 0,
        PENDING: 0,
        CANCELED: 0,
      },
      employeeStats: {
        TOTAL: 0,
        ACTIVE: 0,
        INACTIVE: 0,
      },
      error: null,
    };
  },
  computed: {
    totalTasks() {
      return Object.values(this.taskStats).reduce(
        (sum, count) => sum + count,
        0
      );
    },
    taskChartData() {
      return {
        labels: ["Hoàn thành", "Đang thực hiện", "Đang chờ", "Bị hủy"],
        datasets: [
          {
            label: "Số lượng nhiệm vụ",
            backgroundColor: "#42A5F5",
            data: [
              this.taskStats.COMPLETED,
              this.taskStats.IN_PROGRESS,
              this.taskStats.PENDING,
              this.taskStats.CANCELED,
            ],
          },
        ],
      };
    },
    employeeChartData() {
      return {
        labels: ["Tổng số", "Đang hoạt động", "Không hoạt động"],
        datasets: [
          {
            label: "Số lượng nhân viên",
            backgroundColor: "#66BB6A",
            data: [
              this.employeeStats.TOTAL,
              this.employeeStats.ACTIVE,
              this.employeeStats.INACTIVE,
            ],
          },
        ],
      };
    },
  },
  mounted() {
    this.fetchTaskStats();
    this.fetchEmployeeStats();
  },
  methods: {
    async fetchTaskStats() {
      try {
        const response = await api.get("/api/analyst/tasks/stats/status");
        this.taskStats.COMPLETED = response.data.data.COMPLETED || 0;
        this.taskStats.IN_PROGRESS = response.data.data.IN_PROGRESS || 0;
        this.taskStats.PENDING = response.data.data.PENDING || 0;
        this.taskStats.CANCELED = response.data.data.CANCELED || 0;
        this.error = null;
      } catch (error) {
        this.$toast.error(
          "Không thể tải thông tin nhiệm vụ. Vui lòng thử lại sau." + error
        );
        this.error = "Không thể tải thông tin nhiệm vụ. Vui lòng thử lại sau.";
      }
    },
    async fetchEmployeeStats() {
      try {
        const response = await api.get("/api/analyst/users/stats");
        this.employeeStats.TOTAL = response.data.data.totalUsers || 0;
        this.employeeStats.ACTIVE = response.data.data.activeUsers || 0;
        this.employeeStats.INACTIVE =
          this.employeeStats.TOTAL - this.employeeStats.ACTIVE; // Assuming inactive is total - active
      } catch (error) {
        this.$toast.error(
          "Không thể tải thông tin nhân viên. Vui lòng thử lại sau." + error
        );
        this.error = "Không thể tải thông tin nhân viên. Vui lòng thử lại sau.";
      }
    },
    async downloadPDF() {
      const dashboard = document.getElementById("dashboard");
      const canvas = await html2canvas(dashboard);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF(this.selectedFormat === "a4" ? "p" : "l"); // Chọn kiểu PDF dựa trên tùy chọn
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      pdf.save("dashboard.pdf");
    },
  },
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
  background-color: #f4f7fa;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1,
h2 {
  text-align: center;
  color: #333;
}

.stats-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 20px;
}

.task-stats,
.employee-stats {
  flex: 1 1 calc(50% - 10px); /* Điều chỉnh kích thước cho các section */
  margin: 5px;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-card-group {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.stat-card {
  flex: 1 1 calc(25% - 10px);
  margin: 5px;
  text-align: center;
}

.stat-number {
  font-size: 2em;
  font-weight: bold;
  color: #333;
}

.employee-info {
  margin-top: 20px;
}

.employee-table {
  width: 100%;
  border-collapse: collapse;
}

.employee-table th,
.employee-table td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}

.charts-container {
  margin-top: 40px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.error-message {
  color: red;
  margin-top: 20px;
  text-align: center;
}

.pdf-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.pdf-button:hover {
  background-color: #218838;
}
.charts-container {
  margin-top: 40px;
  display: flex;
  justify-content: space-between; /* Đặt các biểu đồ bên cạnh nhau */
  flex-wrap: wrap;
}

.chart-container {
  flex: 1 1 calc(45% - 20px); /* Đặt chiều rộng cho mỗi biểu đồ */
  margin: 10px; /* Thêm khoảng cách giữa các biểu đồ */
}

.chart {
  max-width: 100%; /* Đảm bảo biểu đồ không vượt quá kích thước của phần chứa */
}
</style>
