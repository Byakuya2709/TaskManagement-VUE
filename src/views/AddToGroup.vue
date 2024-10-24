<template>
  <form @submit.prevent="addUserToGroup">
    <div class="mb-3">
      <label for="groupName" class="form-label">Tên nhóm:</label>
      <input
        type="text"
        class="form-control"
        id="groupName"
        v-model="group.name"
        readonly
      />
    </div>

    <div class="mb-3">
      <label for="description" class="form-label">Mô tả:</label>
      <textarea
        class="form-control"
        id="description"
        v-model="group.description"
        :class="{
          'is-invalid':
            !validate.description && group.description !== undefined,
        }"
        @input="validateDescription"
      ></textarea>
      <div
        v-if="!validate.description && group.description !== undefined"
        class="invalid-feedback"
      >
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
        Nhân viên không được bỏ trống.
      </div>
    </div>

    <button
      type="submit"
      class="btn btn-primary"
      :disabled="!isValidated || isLoading"
    >
      Thêm nhân viên vào nhóm
    </button>

    <div v-if="isLoading" class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </form>
</template>

<script>
import { api } from "../api/Api";

export default {
  name: "AddUserToGroup",
  data() {
    return {
      group: {
        description: "", // Thêm mô tả vào group
      },
      userId: "",
      users: [],
      validate: {
        user: false,
        description: true, // Mặc định là true vì không cần validation khi fetch
      },
      isLoading: false,
    };
  },
  computed: {
    isValidated() {
      return Object.values(this.validate).every((v) => v);
    },
  },
  methods: {
    async fetchGroupById(groupId) {
      this.isLoading = true;
      try {
        const res = await api.get(`/admin/group/${groupId}`);
        this.group = res.data.data;
      } catch (error) {
        this.showToastError(error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchAllUsers() {
      this.isLoading = true;
      try {
        const res = await api.get("/admin/user/no-group");
        this.users = res.data.data;
      } catch (error) {
        this.showToastError(error);
      } finally {
        this.isLoading = false;
      }
    },
    async addUserToGroup() {
      if (!this.isValidated) return;

      const requestData = {
        groupId: this.$route.params.id,
        userId: this.userId,
        description: this.group.description, // Gửi mô tả trong yêu cầu
      };
      this.isLoading = true;
      try {
        const res = await api.put("/admin/group/add-user", requestData);
        this.$toast.success(res.data.message);
      } catch (error) {
        this.showToastError(error);
      } finally {
        this.isLoading = false;
      }
    },
    validateUserId(value) {
      this.validate.user = !!value;
    },
    validateDescription() {
      // Chỉ cần kiểm tra khi mô tả đã được cập nhật và không rỗng
      this.validate.description = !!this.group.description.trim();
    },
    showToastError(error) {
      console.error("Error:", error);
      this.$toast.error(error.response?.data?.message || error.message);
    },
    resetForm() {
      this.userId = "";
      this.group.description = ""; // Reset mô tả
      this.validate.user = true;
      this.validate.description = true; // Reset validation mô tả
    },
  },
  created() {
    const groupId = this.$route.params.id;
    this.fetchGroupById(groupId);
    this.fetchAllUsers();
  },
};
</script>
