<template>
  <div>
    <form @submit.prevent="createTask">
      <div class="mb-3">
        <label for="title" class="form-label">Tiêu đề:</label>
        <input
          type="text"
          class="form-control"
          id="title"
          v-model="title"
          :class="{ 'is-invalid': !validate.title }"
        />
        <div v-if="!validate.title && !title" class="invalid-feedback">
          Tiêu đề không được ít hơn 6 kí tự.
        </div>
      </div>

      <div class="mb-3">
        <label for="description" class="form-label">Mô tả:</label>
        <textarea
          class="form-control"
          id="description"
          v-model="description"
          :class="{ 'is-invalid': !validate.description }"
        ></textarea>
        <div
          v-if="!validate.description && !description"
          class="invalid-feedback"
        >
          Mô tả không được ít hơn 10 kí tự.
        </div>
      </div>

      <div class="mb-3">
        <label for="date" class="form-label">Ngày hoàn thành:</label>
        <input
          type="date"
          class="form-control"
          id="date"
          v-model="date"
          :class="{ 'is-invalid': !validate.date && !date }"
        />
        <div v-if="!validate.date" class="invalid-feedback">
          Ngày hoàn thành không được bỏ trống.
        </div>
      </div>

      <div class="mb-3">
        <label for="taskAssignment" class="form-label">Phân công cho:</label>
        <div>
          <input
            type="radio"
            id="assignUser"
            value="user"
            v-model="assignmentType"
          />
          <label for="assignUser">Nhân viên</label>

          <input
            type="radio"
            id="assignGroup"
            value="group"
            v-model="assignmentType"
          />
          <label for="assignGroup">Nhóm</label>
        </div>
      </div>

      <div v-if="assignmentType === 'user'" class="mb-3">
        <label for="userId" class="form-label">Nhân viên:</label>
        <select
          class="form-select"
          id="userId"
          v-model="userId"
          :class="{ 'is-invalid': !validate.user }"
        >
          <option value="" disabled>Select a user</option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.fullname }}
          </option>
        </select>
        <div v-if="!validate.user && !userId" class="invalid-feedback">
          Nhân viên thực hiện tác vụ không được bỏ trống.
        </div>
      </div>

      <div v-if="assignmentType === 'group'" class="mb-3">
        <label for="groupId" class="form-label">Nhóm:</label>
        <select
          class="form-select"
          id="groupId"
          v-model="groupId"
          :class="{ 'is-invalid': !validate.group }"
        >
          <option value="" disabled>Select a group</option>
          <option v-for="group in groups" :key="group.id" :value="group.id">
            {{ group.name }}
          </option>
        </select>
        <div v-if="!validate.group && !groupId" class="invalid-feedback">
          Nhóm thực hiện tác vụ không được bỏ trống.
        </div>
      </div>

      <div class="mb-3">
        <label for="status" class="form-label">Trạng thái:</label>
        <select
          class="form-select"
          id="status"
          v-model="status"
          :class="{ 'is-invalid': !validate.status }"
        >
          <option value="" disabled>Select status</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="CANCELED">Canceled</option>
        </select>
        <div v-if="!validate.status && !status" class="invalid-feedback">
          Trạng thái tác vụ không được bỏ trống.
        </div>
      </div>

      <button type="submit" class="btn btn-primary" :disabled="!isValidated">
        Tạo Tác Vụ
      </button>
    </form>
  </div>
</template>

<script>
import { api } from "../api/Api";

export default {
  name: "SetNewTask",
  data() {
    return {
      users: [],
      groups: [], // Danh sách nhóm
      title: "",
      description: "",
      date: "",
      status: "",
      userId: "",
      groupId: "", // ID nhóm được chọn
      assignmentType: "user", // Phân công cho nhân viên hoặc nhóm

      validate: {
        title: false,
        description: false,
        date: false,
        status: false,
        user: false,
        group: false,
      },
    };
  },
  created() {
    this.fetchAllUser();
    this.fetchAllGroups(); // Gọi API để tải danh sách nhóm
    this.setUserIdFromParam();
  },
  methods: {
    async fetchAllUser() {
      try {
        const res = await api.get("/admin/user/all");
        this.users = res.data.data;
      } catch (error) {
        this.$toast.error(error.response.data.message); // Use toast for error messages
      }
    },
    async fetchAllGroups() {
      try {
        const res = await api.get("/admin/group/all"); // Thay đổi API phù hợp
        this.groups = res.data.data; // Giả định 'data' chứa danh sách nhóm
      } catch (error) {
        this.$toast.error(error.response.data.message); // Use toast for error messages
      }
    },
    setUserIdFromParam() {
      const userId = this.$route.params.id;

      if (userId) {
        this.userId = userId;
        this.validateUser(userId);
      }
    },
    async createTask() {
      if (!this.isValidated) {
        this.$toast.error("Please fill out all required fields."); // Use toast for error messages
        return;
      }

      try {
        const formData = {
          title: this.title,
          description: this.description,
          date: this.date,
          status: this.status,
          userId:
            this.assignmentType === "group"
              ? this.getLeaderIdFromGroup(this.groupId)
              : this.userId, // Sử dụng ID của leader nếu là nhóm
        };

        console.log("Form Data:", formData); // Log dữ liệu để kiểm tra

        const res = await api.post("/admin/task/new", formData);
        console.log("Response:", res.data); // Log phản hồi để kiểm tra

        this.$toast.success(res.data.message); // Use toast for success messages
      } catch (error) {
        console.error("Error:", error); // Log lỗi để kiểm tra
        this.$toast.error(
          error.response ? error.response.data.message : "An error occurred."
        ); // Cập nhật thông báo lỗi
      }
    },
    getLeaderIdFromGroup(groupId) {
      const group = this.groups.find((group) => group.id === groupId);
      return group ? group.leader.leaderId : null; // Trả về ID của leader hoặc null nếu không tìm thấy
    },
    validateTitle(value) {
      this.validate.title = value.length >= 6;
    },
    validateDescription(value) {
      this.validate.description = value.length >= 10;
    },
    validateDate(value) {
      this.validate.date = !!value;
    },
    validateStatus(value) {
      this.validate.status = !!value;
    },
    validateUser(value) {
      this.validate.user = !!value;
    },
    validateGroup(value) {
      this.validate.group = !!value;
    },
  },
  watch: {
    title(value) {
      this.validateTitle(value);
    },
    description(value) {
      this.validateDescription(value);
    },
    date(value) {
      this.validateDate(value);
    },
    status(value) {
      this.validateStatus(value);
    },
    userId(value) {
      this.validateUser(value);
    },
    groupId(value) {
      this.validateGroup(value);
    },
  },
  computed: {
    isValidated() {
      return (
        this.validate.title &&
        this.validate.description &&
        this.validate.date &&
        this.validate.status &&
        (this.assignmentType === "user"
          ? this.validate.user
          : this.validate.group) // Kiểm tra xác thực dựa trên kiểu phân công
      );
    },
  },
};
</script>
