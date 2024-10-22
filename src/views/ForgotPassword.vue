<template>
  <div class="email-verification bg-light">
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="bg-white p-4 border border-dark">
        <h1 class="text-dark text-center mb-4">Thay đổi mật khẩu</h1>

        <!-- Step 1: Email Input Form -->
        <form v-if="step === 1" @submit.prevent="sendOtp">
          <div class="mb-3">
            <label for="email" class="form-label">Nhập vào Email</label>
            <input type="email" v-model="email" class="form-control" required />
            <p v-if="errorMessage" class="text-danger mt-2">
              {{ errorMessage }}
            </p>
          </div>
          <button type="submit" class="btn btn-primary">Gửi Mã OTP</button>
        </form>

        <!-- Step 2: OTP Input Form -->
        <form v-else-if="step === 2" @submit.prevent="verifyOtp">
          <div class="mb-3">
            <label for="otp" class="form-label">Nhập Mã OTP</label>
            <input type="text" v-model="otp" class="form-control" required />
            <p v-if="errorMessage" class="text-danger mt-2">
              {{ errorMessage }}
            </p>
          </div>
          <button type="submit" class="btn btn-primary">Xác Thực Mã OTP</button>
        </form>

        <!-- Step 3: New Password Form -->
        <form v-else-if="step === 3" @submit.prevent="resetPassword">
          <div class="mb-3">
            <label for="newPassword" class="form-label"
              >Nhập Mật Khẩu Mới</label
            >
            <input
              type="password"
              v-model="newPassword"
              class="form-control"
              required
            />
            <p v-if="errorMessage" class="text-danger mt-2">
              {{ errorMessage }}
            </p>
          </div>
          <button type="submit" class="btn btn-primary">Đổi Mật Khẩu</button>
        </form>

        <p v-if="successMessage" class="text-success mt-2">
          {{ successMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from "../api/Api"; // Đường dẫn API

export default {
  name: "EmailVerification",
  data() {
    return {
      step: 1,
      email: "",
      otp: "",
      newPassword: "",
      successMessage: "",
      errorMessage: "",
    };
  },
  methods: {
    async sendOtp() {
      try {
        const response = await api.post("/auth/account/check", {
          email: this.email,
        });
        this.successMessage = response.data.message;
        this.errorMessage = "";
        this.step = 2; // Chuyển sang bước nhập OTP
      } catch (error) {
        this.errorMessage =
          error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
        this.successMessage = "";
      }
    },
    async verifyOtp() {
      try {
        const response = await api.post("/auth/account/verify", {
          email: this.email,
          code: this.otp,
        });
        this.successMessage = response.data.message;
        this.errorMessage = "";
        this.step = 3; // Chuyển sang bước nhập mật khẩu mới
      } catch (error) {
        this.errorMessage =
          error.response?.data?.message || "Mã OTP không hợp lệ.";
        this.successMessage = "";
      }
    },
    async resetPassword() {
      try {
        const response = await api.post("/auth/account/resetpassword", {
          email: this.email,
          newPassword: this.newPassword,
        });
        this.successMessage = response.data.message;
        this.errorMessage = "";
      } catch (error) {
        this.errorMessage =
          error.response?.data?.message || "Đã xảy ra lỗi khi đổi mật khẩu.";
        this.successMessage = "";
      }
    },
  },
};
</script>
