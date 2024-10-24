<template>
  <div>
    <form @submit.prevent="editTask">
      <div class="mb-3">
        <label for="title" class="form-label">Tiêu đề:</label>
        <input
          type="text"
          class="form-control"
          id="title"
          v-model="title"
          disabled
          :class="{ 'is-invalid': !validate.title }"
        />
        <div v-if="!validate.title" class="invalid-feedback">
          <!-- Title is required and should be at least 6 characters. -->
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
        <div v-if="!validate.description" class="invalid-feedback">
          <!-- Description is required and should be at least 10 characters.  -->
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
          :class="{ 'is-invalid': !validate.date }"
        />
        <div v-if="!validate.date" class="invalid-feedback">
          Ngày hoàn thành không được bỏ trống.
        </div>
      </div>

      <div class="mb-3">
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
        <div v-if="!validate.user" class="invalid-feedback">
          Nhân viên thực hiện tác vụ không được bỏ trống.
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
          <option value="COMPLETED">Completed</option>
          <option value="CANCELED">Canceled</option>
        </select>
        <div v-if="!validate.status" class="invalid-feedback">
          Trạng thái tác vụ không được bỏ trống.
        </div>
      </div>

      <button type="submit" class="btn btn-primary" :disabled="!isValidated">
        Cập nhật
      </button>
    </form>
  </div>
</template>

<script>
import { api } from "../api/Api";

export default {
  name: "EditTask",
  data() {
    return {
      users: [],
      task: null,
      title: "",
      description: "",
      date: "",
      status: "",
      userId: "",

      validate: {
        title: false,
        description: false,
        date: false,
        status: false,
        user: false,
      },
    };
  },
  async created() {
    await this.fetchAllUser();
    await this.fetchTask();
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
    async fetchTask() {
      try {
        const res = await api.get(`/admin/task/${this.$route.params.id}`);
        const task = res.data.data;

        this.task = task;
        this.title = task.title;
        this.description = task.description;
        this.date = task.date.split("T")[0];
        this.status = task.status;
        this.userId = task.userId;

        // Validate fields after loading data
        this.validateTitle(this.title);
        this.validateDescription(this.description);
        this.validateDate(this.date);
        this.validateStatus(this.status);
        this.validateUser(this.userId);
      } catch (error) {
        console.log(error);
        const message = error.response?.data?.message || error;
        this.$toast.error(message); // Use toast for error messages
      }
    },
    async editTask() {
      if (!this.isValidated) {
        this.$toast.error("Please fill out all required fields."); // Use toast for validation errors
        return;
      }

      try {
        const formData = {
          title: this.title,
          description: this.description,
          date: this.date,
          status: this.status,
          userId: this.userId,
        };
        const res = await api.put(
          `/admin/task/update/${this.task.id}`,
          formData
        );
        this.$toast.success(res.data.message); // Use toast for success messages
        setTimeout(() => {
          this.$router.push("/admin/manage/tasks");
        }, 2000);
      } catch (error) {
        this.$toast.error(error.response.data.message); // Use toast for error messages
      }
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
  },
  computed: {
    isValidated() {
      return (
        this.validate.title &&
        this.validate.description &&
        this.validate.date &&
        this.validate.status &&
        this.validate.user
      );
    },
  },
};
</script>
