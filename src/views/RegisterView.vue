<template>
  <div class="register bg-light">
    <Alert :show="alert.show" :type="alert.type" :message="alert.message" @close-alert="hideAlert" />

    <!-- Modal to enter OTP -->
    <div v-if="showOtpModal" class="modal" style="display: block; background-color: rgba(0, 0, 0, 0.5);">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Nhập mã OTP</h5>
        <button type="button" class="close" @click="closeModal">&times;</button>
      </div>
      <div class="modal-body">
        <input v-model="otp" type="text" class="form-control" placeholder="Nhập mã xác thực" />
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" @click="verifyOtp">Xác nhận</button>
        <button type="button" class="btn btn-secondary" @click="closeModal">Đóng</button>
      </div>
    </div>
  </div>
</div>
    <!-- End Modal -->

    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="d-flex mt-5 mb-5 w-100">
        <div class="bg-white w-100 p-4 border border-dark">
          <h1 class="text-dark text-center mb-4">Đăng Ký</h1>
          <form @submit.prevent="registerUser" ref="registerForm">
            <div class="mb-3">
              <label for="fullname" class="form-label">Họ và Tên</label>
              <input
                required
                id="fullname"
                type="text"
                placeholder="Tên đầy đủ..."
                v-model="fullname"
                class="form-control"
              />
              <p v-if="!validated.fullname" class="text-danger mt-1">Tên người dùng không được dưới 6 kí tự.</p>
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input
                id="email"
                required
                type="email"
                placeholder="Email"
                v-model="email"
                autocomplete="off"
                class="form-control"
              />
              <p v-if="!validated.email" class="text-danger mt-1">Vui lòng nhập email hợp lệ.</p>
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Mật khẩu</label>
              <input
                id="password"
                required
                type="password"
                placeholder="Mật khẩu..."
                v-model="password"
                class="form-control"
              />
              <p v-if="!validated.password" class="text-danger mt-1">Mật khẩu phải gồm ít nhất 8 kí tự bao gồm chữ thường/HOA và 1 số.</p>
            </div>
            <div class="mb-3">
              <label for="password_confirm" class="form-label">Nhập lại mật khẩu</label>
              <input
                id="password_confirm"
                required
                type="password"
                placeholder="Nhập lại mật khẩu"
                v-model="password_confirm"
                class="form-control"
                :disabled="!validated.password"
              />
              <div v-if="validated.password">
                <p v-if="!validated.passwordConfirm" class="text-danger mt-1">Vui lòng nhập đúng lại mật khẩu đã nhập.</p>
              </div>
            </div>
            <div class="row">
              <div class="mb-3 col-md-6">
                <label for="birth" class="form-label">Ngày/Tháng/Năm sinh</label>
                <input
                  id="birth"
                  required
                  type="date"
                  placeholder="Ngày sinh"
                  v-model="birth"
                  class="form-control"
                />
                <p v-if="!validated.birth" class="text-danger mt-1">Vui lòng nhập ngày sinh.</p>
              </div>
              <div class="mb-3 col-md-6">
                <label for="address" class="form-label">Địa chỉ</label>
                <input
                  required
                  id="address"
                  type="text"
                  placeholder="Địa chỉ"
                  v-model="address"
                  class="form-control"
                />
                <p v-if="!validated.address" class="text-danger mt-1">Địa chỉ không được dưới 6 kí tự</p>
              </div>
            </div>
            <div class="mb-3">
              <label for="gender" class="form-label">Giới tính</label>
              <select id="gender" v-model="gender" class="form-select">
                <option value="" disabled selected>Chọn giới tính</option>
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
              </select>
              <p v-if="!validated.gender" class="text-danger mt-1">Vui lòng chọn giới tính</p>
            </div>
            <div class="d-flex justify-content-center mb-3">
              <input
                type="submit"
                value="Đăng Ký"
                class="btn btn-primary w-50"
                :disabled="!isValidated"
              />
              <button type="button" @click="resetForm" class="btn btn-secondary ms-3">Xóa</button>
            </div>
          </form>
          <div class="d-flex justify-content-center">
            <p class="text-muted">Đã có tài khoản?</p>
            <router-link to="/login" class="text-primary ms-1">Đăng Nhập</router-link>
          </div>
        </div>
        <div class="custom-file">
              <label class="custom-file-label" for="imageUpload">Upload Image:</label>
              <input class="custom-file-input" type="file" id="imageUpload" @change="previewImage" accept="image/png, image/jpeg">
              <img :src="imagePreview" alt="Image Preview" v-if="imagePreview" style="max-height: 300px; margin-top: 10px;">
            </div>
      </div>
    </div>
  </div>
</template>

<script>
import Alert from '../components/Alert.vue'
import { api } from '../api/Api'; // Sử dụng named import

export default {
  name: "Register",
  components: { Alert },
  data() {
    return {

      //formdata
      fullname: "",
      email: "",
      birth: "",
      password: "",
      password_confirm: "",
      address: "",
      gender: "",
      imagePreview: "src/assets/data/img/deafaultAvatar.png", // URL của hình ảnh mặc định
      validated: {
        fullname: false,
        email: false,
        password: false,
        passwordConfirm: false,
        birth: false,
        address: false,
        gender: false,
      },
      //alert
      alert: {
        show: false,
        type: '',
        message: '',
      },
      //otp
      showOtpModal: false, // Controls modal visibility
      otp: "", // Stores the OTP entered by the user
    };
  },
  watch: {
    fullname(value) { this.validateFullname(value); },
    email(value) { this.validateEmail(value); },
    password(value) { this.validatePassword(value); },
    password_confirm(value) { this.validatePasswordConfirm(value); },
    birth(value) { this.validateBirth(value); },
    address(value) { this.validateAddress(value); },
    gender(value) { this.validateGender(value); }
  },
  computed: {
    isValidated() {
      return this.validated.fullname && this.validated.email && this.validated.password && this.validated.passwordConfirm && this.validated.birth && this.validated.address && this.validated.gender;
    },
  },
  methods: {
    async getVerificationCode (){
    const form = { email: this.email };
    try {
      const res = await api.post('/auth/generate', form);
      this.showAlert('Info', res.data.message);
      this.showOtpModal = true;
    } catch (error) {
      this.showAlert('Error', 'Không thể gửi mã OTP. Vui lòng thử lại.');
    }
    },
    async verifyOtp() {
      const form = { email: this.email, code: this.otp };
    try {
      const res = await api.post('/auth/verify', form);
      this.showAlert('Success', 'Xác thực mã OTP thành công!');
      this.showOtpModal = false;  
      await this.completeRegistration(); 
    } catch (error) {
      this.showAlert('Error', 'Mã OTP không chính xác. Vui lòng thử lại.');
    }
    },
    async completeRegistration() {
    try {
      const formData = new FormData();
      formData.append('account', new Blob([JSON.stringify({
        fullname: this.fullname,
        email: this.email,
        birth: this.birth,
        password: this.password,
        password_confirm: this.password_confirm,
        address: this.address,
        gender: this.gender
      })], { type: 'application/json' }));

      const imageInput = document.getElementById('imageUpload');
      if (imageInput.files[0]) {
          formData.append('image', imageInput.files[0]);
      }else{
        const defaultAvatarUrl = "src/assets/data/img/deafaultAvatar.png";
        const response = await fetch(defaultAvatarUrl);
        const blob = await response.blob();
        formData.append('image', blob, 'defaultAvatar.png');
      }

      const res = await api.post('/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.status === 'CREATED') {
        this.showAlert('Success', res.data.message + " . Đang chuyển sang trang đăng nhập");
        setTimeout(() => {
          this.$router.push('/login');
        }, 2000);
      } else {
        this.showAlert('Info', res.data.message);
      }
    } catch (error) {
      this.showAlert('Error', error.response.data.message);
    }
  },
    // async registerUser() {
     
    //   await this.getVerificationCode()
    //   await this.verifyOtp()

    //   try {
    //     const formData = new FormData();
    //     formData.append('account', new Blob([JSON.stringify({
    //       fullname: this.fullname,
    //       email: this.email,
    //       birth: this.birth,
    //       password: this.password,
    //       password_confirm: this.password_confirm,
    //       address: this.address,
    //       gender: this.gender
    //     })], { type: 'application/json' }));




      //   const imageInput = document.getElementById('imageUpload');
      // if (imageInput.files[0]) {
      //     formData.append('image', imageInput.files[0]);
      // }else{
      //   const defaultAvatarUrl = "src/assets/data/img/deafaultAvatar.png";
      //   const response = await fetch(defaultAvatarUrl);
      //   const blob = await response.blob();
      //   formData.append('image', blob, 'defaultAvatar.png');
      // }
      
    //     const res = await api.post('/auth/register', formData, {
    //       headers: {
    //         'Content-Type': 'multipart/form-data'
    //       }
    //     });
       


    //     const response = res.data
    //     console.log(response)
    //     if (response.status === 'CREATED') {
    //       this.showAlert('Success', response.message + " . Đang chuyển sang trang đăng nhập");
    //       setTimeout(() => {
    //         this.$router.push('/login');
    //       }, 2000);
    //     } else {
    //       this.showAlert('Info',response.message)
    //     }
    //   } catch (error) {
    //     this.showAlert('Error',error.response.data.message)
    //   }
    // },

  async registerUser() {
    await this.getVerificationCode();  // Gọi phương thức nhận OTP trước tiên
  },
    validateEmail(value) { this.validated.email = /.+@.+\.(com|vn)$/.test(value); },
    validatePassword(value) { this.validated.password = /^(?=.*[a-z])(?=.*\d).{8,}$/.test(value); },
    validatePasswordConfirm(value) { this.validated.passwordConfirm = this.password === value; },
    validateFullname(value) { this.validated.fullname = value.length >= 6; },
    validateBirth(value) { this.validated.birth = value !== ''; },
    validateAddress(value) { this.validated.address = value.length >= 6; },
    validateGender(value) { this.validated.gender = value !== ''; },
    showAlert(type, message) { this.alert = { show: true, type: type, message: message }; },
    hideAlert() { this.alert.show = false; },
    resetForm() {
      this.$refs.registerForm.reset();
      this.fullname = "";
      this.email = "";
      this.password = "";
      this.address = "";
      this.gender = "";
      this.password_confirm = "";
      this.birth = "";
      this.validated = {
        fullname: false,
        email: false,
        password: false,
        address: false,
        birth: false,
        gender: false,
        passwordConfirm: false,
      };
      this.imagePreview = "src/assets/data/img/deafaultAvatar.png"; // Đặt lại ảnh mặc định khi reset form
    },
    previewImage(event) {
      const file = event.target.files[0];
      if (file) {
        this.imagePreview = URL.createObjectURL(file);
      }
    },
    closeModal() {
      this.showOtpModal = false;
    },
  },
};
</script>

<style>
.form-img {
  justify-content: center;
}
</style>