<template>
  <div class="login bg-light">
    
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
          <router-link to="/"
            ><img src="/src/assets/data/img/sign/logo.png" alt=""
          /></router-link>
          <router-link title="Sign-up" to="/signup" class="sign-link mt-3"
            >Đăng Ký</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import { api } from "../api/Api";
import { useAuthStore } from "../stores/pina";
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      validated: [],
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
      if (!this.isValidated) {
        this.$toast.error("Please fill out all required fields.");
        return;
      }
      try {
        const user = {
          email: this.email,
          password: this.password,
        };
        const authStore = useAuthStore();

        const res = await authStore.login(user);
        console.log(res);
        if (res.status === 200) {
      this.$toast.success(res.data.message);
      setTimeout(() => {
        this.$router.push("/admin").then(()=>   window.location.reload())
      }, 2000);
    } else {
      this.$toast.warning(res.data.message);
    }
      } catch (error) {
        console.log(error)
        this.$toast.error(error.response?.data?.message || "An error occurred");
      }
    },
    validateEmail(value) {
      this.validated["email"] = /.+@.+\.(com|vn)$/.test(value);
      console.log(this.validated["email"]);
    },
    validatePassword(value) {
      this.validated["password"] = /^(?=.*[a-z])(?=.*\d).{8,}$/.test(value);
    },
  },
};
</script>

<style>
.form-img {
  justify-content: center;
}
</style>
