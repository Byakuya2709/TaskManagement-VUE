<template>
  <div class="login bg-light">
    <Alert
      :show="alert.show"
      :type="alert.type"
      :message="alert.message"
      @close-alert="hideAlert"
    />
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="d-flex max-w-4xl mt-5">
        <div class="bg-white p-4 border border-dark">
          <h1 class="text-dark text-center mb-4">Đăng Nhập</h1>
          <form @submit.prevent="loginUser">
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
            <!-- <div class="mb-3 d-flex justify-content-between flex-column flex-lg-row">
                            <label><input type="checkbox" />Remember Me</label>
                            <a href="#" class="text-primary">Forgot Email or Password?</a>
                        </div> -->
            <div class="mb-3 d-flex justify-content-center align-items-center">
              <input
                type="submit"
                @submit="loginUser"
                value="Login"
                class="btn btn-primary w-50"
                :disabled="!isValidated"
              />
            </div>
          </form>
        </div>
        <div class="form-img">
          <a href="index.html"
            ><img src="/src/assets/data/img/sign/logo.png" alt=""
          /></a>
          <a title="Sign-up" href="signup.html" class="sign-link mt-3"
            >Đăng Ký</a
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Alert from "../components/Alert.vue";
import { api } from "../api/Api";
import { useAuthStore } from "../stores/pina";
export default {
  name: "Login",
  components: {
    Alert,
  },
  data() {
    return {
      email: "",
      password: "",
      validated: [],
      alert: {
        show: false,
        type: "",
        message: "",
      },
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
    //   ...mapActions(["login"]),
    async loginUser() {
      try {
        const user = {
          email: this.email,
          password: this.password,
        };
        const authStore = useAuthStore();

        const res = await authStore.login(user);
        if (res.data.status === "OK") {
          this.showAlert(
            "Success",
            res.data.message + " . Đang chuyển sang trang quản lý"
          );
          setTimeout(() => {
            this.$router.push("/manager/profile");
          }, 2000);
        } else {
          this.showAlert("Info", res.data.message);
        }
      } catch (error) {
        this.showAlert("Error", error.message || 'An unexpected error occurred');
      }
    },
    validateEmail(value) {
      this.validated["email"] = /.+@.+\.(com|vn)$/.test(value);
      console.log(this.validated["email"]);
    },
    validatePassword(value) {
      this.validated["password"] = /^(?=.*[a-z])(?=.*\d).{8,}$/.test(value);
    },
    showAlert(type, message) {
      this.alert = {
        show: true,
        type: type,
        message: message,
      };
    },
    hideAlert() {
      this.alert.show = false;
    },
  },
};
</script>

<style>
.form-img {
  justify-content: center;
}
</style>
