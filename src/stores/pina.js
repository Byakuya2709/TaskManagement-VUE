import { defineStore } from 'pinia';
import { api } from '../api/Api'; 
import { removeAuthorization, setAuthorization } from "../api/Api";
import {jwtDecode} from 'jwt-decode';  // Sử dụng thư viện jwt-decode
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    error: null,
    role: null,
  }),
  actions: {
    async login(user) {
      
      try {
   
         await this.logout();
        const response = await api.post('/auth/login', user);
        const res = response.data;
        this.token = res.data.token;

       
    
         const decodedToken = jwtDecode(this.token);
         console.log(decodedToken)
         this.role = decodedToken.role; 
        const email=decodedToken.sub;


         this.user = {
          id: res.data.userId,
          name: res.data.userName,
          email:email
        };
        
        localStorage.setItem('token', this.token);
        setAuthorization(this.token);
        
        console.log('Token:', this.token);
        console.log('Role:', this.role);
        console.log('isAuthenticated:', !!this.token);


        this.error = null;

        return response;
      } catch (err) {
        localStorage.removeItem('token');
        removeAuthorization();
        this.error = err.response?.data?.message || 'An error occurred';
        throw new Error(this.error);
      }
    },
    async logout() {
      try {
        await api.post('/logout');
        this.token = null;
        this.user = null;
        this.role = null;
        localStorage.removeItem('token');
        removeAuthorization();
      } catch (err) {
        console.error("Logout error:", err);
        // Có thể muốn thêm xử lý lỗi ở đây
      }
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.role && state.role.replace('ROLE_', '') === 'ADMIN',
  },
});