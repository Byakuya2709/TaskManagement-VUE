<template>
  <form @submit.prevent="createGroup">
    <div class="mb-3">
      <label for="name" class="form-label">Tên nhóm:</label>
      <input
        type="text"
        class="form-control"
        id="name"
        v-model="name"
        :class="{ 'is-invalid': !validate.name }"
        @input="validateName(name)"
      />
      <div v-if="!validate.name" class="invalid-feedback">
        Tên nhóm phải có ít nhất 6 ký tự.
      </div>
    </div>

    <div class="mb-3">
      <label for="description" class="form-label">Mô tả:</label>
      <textarea
        class="form-control"
        id="description"
        v-model="description"
        :class="{ 'is-invalid': !validate.description }"
        @input="validateDescription(description)"
      ></textarea>
      <div v-if="!validate.description" class="invalid-feedback">
        Mô tả không được bỏ trống.
      </div>
    </div>

    <div class="mb-3">
      <label for="userId" class="form-label">Nhân viên:</label>
      <select
        class="form-select"
        id="userId"
        v-model="userId"
        :class="{ 'is-invalid': !validate.user }"
        @change="validateUserId(userId)"
      >
        <option value="" disabled>Chọn một nhân viên</option>
        <option v-for="user in users" :key="user.id" :value="user.id">
          {{ user.fullname }}
        </option>
      </select>
      <div v-if="!validate.user" class="invalid-feedback">
        Nhân viên thực hiện tác vụ không được bỏ trống.
      </div>
    </div>

    <button type="submit" class="btn btn-primary" :disabled="!isValidated">
      Tạo nhóm
    </button>
  </form>
</template>

<script>
import { api } from "../api/Api";

export default {
  name: "NewGroup",
  data() {
    return {
      name: "",
      description: "",
      userId: "",
      users: [],
      validate: {
        name: false,
        description: false,
        user: false,
      },
    };
  },
  computed: {
    isValidated() {
      return Object.values(this.validate).every((v) => v);
    },
  },
  methods: {
    async fetchAllUser() {
      try {
        const res = await api.get("/admin/user/no-group");
        this.users = res.data.data;
      } catch (error) {
        this.showToastError(error);
      }
    },
    async createGroup() {
      if (!this.isValidated) return;

      const groupData = {
        name: this.name,
        description: this.description,
        userId: this.userId,
      };

      try {
        const res = await api.post("/admin/group/create", groupData);
        this.$toast.success(res.data.message);
        this.resetForm();
      } catch (error) {
        this.showToastError(error);
      }
    },
    validateName(value) {
      this.validate.name = value.length >= 6;
    },
    validateDescription(value) {
      this.validate.description = !!value.trim();
    },
    validateUserId(value) {
      this.validate.user = !!value;
    },
    showToastError(error) {
      this.$toast.error(error.response?.data?.message || error.message);
    },
    resetForm() {
      this.name = "";
      this.description = "";
      this.userId = "";
      this.validate = {
        name: true,
        description: true,
        user: true,
      };
    },
  },
  created() {
    this.fetchAllUser();
  },
};
</script>
