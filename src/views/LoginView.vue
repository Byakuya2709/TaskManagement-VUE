<template>
  <div class="login bg-light">
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="d-flex max-w-4xl mt-5">
        <div class="bg-white p-4 border border-dark">
          <h1 class="text-dark text-center mb-4">Đăng Nhập</h1>
          <form @submit.prevent="onCaptchaClick">
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input
                type="email"
                placeholder="Email"
                v-model="email"
                class="form-control"
              />
              <p v-if="!validated.email" class="text-danger mt-1">
                Vui lòng nhập email hợp lệ.
              </p>
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Mật Khẩu</label>
              <input
                autocomplete="off"
                required
                type="password"
                placeholder="Password"
                v-model="password"
                class="form-control"
              />
              <p v-if="!validated.password" class="text-danger mt-1">
                Mật khẩu phải gồm ít nhất chữ thường, số và không được dưới 8 kí
                tự.
              </p>
            </div>
            <div class="mb-3">
              <input
                type="checkbox"
                v-model="isCaptchaChecked"
                id="captchaCheck"
              />
              <label for="captchaCheck" class="form-check-label">
                Tôi đã xác minh CAPTCHA
              </label>
            </div>

            <div class="mb-3 d-flex justify-content-center align-items-center">
              <input
                type="submit"
                value="Login"
                class="btn btn-primary w-50"
                :disabled="!isValidated || !isCaptchaChecked"
              />
            </div>
            <div class="text-center mt-3">
              <router-link to="/forgot-password" class="text-secondary">
                Quên mật khẩu?
              </router-link>
            </div>
          </form>
          <p v-if="captchaError" class="text-danger mt-1">
            Vui lòng xác minh CAPTCHA.
          </p>
        </div>
        <div class="form-img">
          <router-link to="/">
            <img src="/src/assets/data/img/sign/logo.png" alt="" />
          </router-link>
          <router-link title="Sign-up" to="/signup" class="sign-link mt-3">
            Đăng Ký
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { api } from "../api/Api";
import { useAuthStore } from "../stores/pina";
import config from "@/composable/config";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      validated: {},
      captchaError: false,
      isCaptchaChecked: false, // Biến để theo dõi trạng thái checkbox
    };
  },
  watch: {
    email(value) {
      this.validateEmail(value);
    },
    password(value) {
      this.validatePassword(value);
    },
  },
  computed: {
    isValidated() {
      return this.validated.email && this.validated.password;
    },
  },
  methods: {
    onCaptchaClick() {
      if (typeof grecaptcha !== "undefined") {
        grecaptcha.ready(() => {
          grecaptcha
            .execute("6LeN92gqAAAAAOrMZ62v0Cs1T1WBSm6hKFKMS8y9", {
              action: "login",
            })
            .then((token) => {
              this.loginUser(token);
            })
            .catch(() => {
              this.captchaError = true; // Hiển thị thông báo lỗi nếu CAPTCHA không thành công
            });
        });
      } else {
        this.captchaError = true; // Hiển thị thông báo lỗi nếu grecaptcha không được tải
      }
    },
    async loginUser(recaptchaToken) {
      if (!this.isValidated || !recaptchaToken) {
        this.$toast.error(
          "Vui lòng điền đầy đủ thông tin yêu cầu và xác minh CAPTCHA."
        );
        return;
      }
      try {
        const user = {
          email: this.email,
          password: this.password,
          recaptchaToken: recaptchaToken,
        };
        const authStore = useAuthStore();

        const res = await authStore.login(user);
        if (res.status === 200) {
          this.$toast.success(res.data.message);
          setTimeout(() => {
            this.$router.push("/admin").then(() => window.location.reload());
          }, 2000);
        } else {
          this.$toast.warning(res.data.message);
        }
      } catch (error) {
        this.$toast.error(error.response?.data?.message || "Đã xảy ra lỗi");
      }
    },
    validateEmail(value) {
      this.validated.email = /.+@.+\.(com|vn)$/.test(value);
    },
    validatePassword(value) {
      this.validated.password = /^(?=.*[a-z])(?=.*\d).{8,}$/.test(value);
    },
  },
};
</script>

<style>
.form-img {
  justify-content: center;
}
</style>
