import { defineStore } from 'pinia';
import { api } from '../api/Api';
import { removeAuthorization, setAuthorization } from "../api/Api";
import { jwtDecode } from 'jwt-decode';
import { useToast } from "vue-toastification";
import router from "@/router/index";

const toast = useToast();

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {
      id: null,
      name: '',
      email: ''
    },
    token: null,
    error: null,
    role: null,
    avatar: null, // avatar khởi tạo là null
  }),
  actions: {
    async hydrate() {
      const token = localStorage.getItem('token');
      if (token) {
        this.token = token;
        setAuthorization(token);
        const decodedToken = jwtDecode(token);
        this.$patch({
          role: decodedToken.role,
          user: {
            id: decodedToken.userId,
            name: decodedToken.userName,
            email: decodedToken.sub
          },
          avatar: localStorage.getItem('avatar')
        });
      }
    },
    async login(user) {
      try {
        const response = await api.post('/auth/login', user);
        const res = response.data;

        // // Ghi log dữ liệu trả về từ API
        // console.log('Dữ liệu trả về từ API:', res);

        this.token = res.data.token;
        const decodedToken = jwtDecode(this.token);
        this.role = decodedToken.role;

        const avatar = res.data.avatar ? `data:image/png;base64,${res.data.avatar}` : null;
        localStorage.setItem('avatar', avatar);

        // Cập nhật state
        this.$patch({
          user: {
            id: res.data.userId,
            name: res.data.userName,
            email: decodedToken.sub
          },
          role: decodedToken.role,
          token: this.token,
        });


        localStorage.setItem('token', this.token);
        setAuthorization(this.token);

        this.error = null; // Reset error
        return response;
      } catch (err) {
        console.log(err);
        localStorage.removeItem('token'); // Xóa token khi lỗi
        removeAuthorization();
        this.error = err.response?.data?.message || 'An error occurred';
        throw new Error(this.error);
      }
    },
    async logout() {
      try {
        const response = await api.post('/logout');
        if (response.status === 200) {
          toast.success(response.data.message);
        }

        // Cập nhật lại state khi đăng xuất
        this.$patch({
          token: null,
          user: { id: null, name: '', email: '' },
          role: null,
          avatar: null, // Reset avatar khi đăng xuất
        });

        localStorage.removeItem('token');
        localStorage.removeItem('avatar');
        localStorage.removeItem('_grecaptcha');
        removeAuthorization();
        toast.info("Đang chuyển sang trang đăng nhập")
        setTimeout(() => {
          router.replace('/login').then(() => {
            window.location.reload(); // Reload after navigating to the login page
          });
        }, 2000);
      } catch (err) {
        toast.error(err.response.data.message);
        this.error = "Đăng xuất không thành công. Vui lòng thử lại.";
      }
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.role && state.role.replace('ROLE_', '') === 'ADMIN',
    userId: (state) => state.user.id,
    userName: (state) => state.user.name,
    email: (state) => state.user.email,
  },
});
