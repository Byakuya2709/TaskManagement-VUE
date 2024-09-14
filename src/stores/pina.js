import { defineStore } from 'pinia';
import { api } from '../api/Api';
import { removeAuthorization, setAuthorization } from "../api/Api";
import { jwtDecode } from 'jwt-decode';  
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {},
    token: null,
    error: null,
    role: null,
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
          token: this.token
        });
      }
    },
    async login(user) {

      try {

        await this.logout();
        const response = await api.post('/auth/login', user);
        const res = response.data;
        this.token = res.data.token;
        const decodedToken = jwtDecode(this.token);
        console.log(decodedToken)
        this.role = decodedToken.role;


        this.$patch({
          role: decodedToken.role,
          user: {
            id: res.data.userId,
            name: res.data.userName,
            email: decodedToken.sub
          },
          token: this.token
        });

        localStorage.setItem('token', this.token);
        setAuthorization(this.token);

        console.log('Token:', this.token);
        console.log('Role:', this.role);
        console.log('isAuthenticated:', !!this.token);


        this.error = null;
        console.log(res)
        return response;
      } catch (err) {
        console.log(err)
        localStorage.removeItem('token');
        removeAuthorization();
        this.error = err.response?.data?.message || 'An error occurred';
        throw new Error(this.error);
      }
    },
    async logout() {
      try {
        await api.post('/logout');
        // Xóa các thông tin xác thực và người dùng
        this.$patch({
          token: null,
          user: {}, // Keep it as an empty object instead of null
          role: null,
        });
        // Xóa token khỏi localStorage và API header
        localStorage.removeItem('token');
        removeAuthorization();
  
        console.log("Logged out successfully");
      } catch (err) {
        console.error("Logout error:", err);
        this.error = "Đăng xuất không thành công. Vui lòng thử lại.";
      }
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.role && state.role.replace('ROLE_', '') === 'ADMIN',
    userId: (state) => state.user.id,
  },
});