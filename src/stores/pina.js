import { defineStore } from 'pinia';
import { api } from '../api/Api'; 
import { removeAuthorization, setAuthorization } from "../api/Api";
export const useAuthStore = defineStore('auth', {
    state: () => ({
      user: null,
      token: null,
      error: null,
    }),
    actions: {
      async login(user) {
        try {
          const response = await api.post('/auth/login',user);
          console.log(response)
          this.token = response.data.token;
          localStorage.setItem('token', this.token);
          setAuthorization(this.token);
          this.error = null;
          return response
        } catch (err) {
            console.log(err)
        //   this.error = err.response.data.error || 'An error occurred';
        }
      },
      logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
      },
    },
    getters: {
      isAuthenticated: (state) => !!state.token,
    },
  });