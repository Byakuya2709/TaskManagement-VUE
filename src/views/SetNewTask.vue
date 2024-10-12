<template>
  <div>
    <form @submit.prevent="createTask">
      <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input
          type="text"
          class="form-control"
          id="title"
          v-model="title"
          :class="{ 'is-invalid': !validate.title }"
        />
        <div v-if="!validate.title && !title" class="invalid-feedback">
          Title is required and should be at least 6 characters.
        </div>
      </div>

      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
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
          Description is required and should be at least 10 characters.
        </div>
      </div>

      <div class="mb-3">
        <label for="date" class="form-label">Date</label>
        <input
          type="date"
          class="form-control"
          id="date"
          v-model="date"
          :class="{ 'is-invalid': !validate.date && !date }"
        />
        <div v-if="!validate.date" class="invalid-feedback">
          Date is required.
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
        <div v-if="!validate.user && !userId" class="invalid-feedback">
          User is required.
        </div>
      </div>

      <div class="mb-3">
        <label for="status" class="form-label">Status</label>
        <select
          class="form-select"
          id="status"
          v-model="status"
          :class="{ 'is-invalid': !validate.status }"
        >
          <option value="" disabled>Select status</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <!-- <option value="COMPLETED">Completed</option> -->
          <option value="CANCELED">Canceled</option>
        </select>
        <div v-if="!validate.status && !status" class="invalid-feedback">
          Status is required.
        </div>
      </div>

      <button type="submit" class="btn btn-primary" :disabled="!isValidated">
        Create Task
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
  created() {
    this.fetchAllUser();
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
          userId: this.userId,
        };
        const res = await api.post("/admin/task/new", formData);
        this.$toast.success(res.data.message); // Use toast for success messages
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
