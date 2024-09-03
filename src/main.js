import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
library.add(fas, far, fab);
dom.watch();

import {jwtDecode} from 'jwt-decode';  // Sử dụng thư viện jwt-decode
import { removeAuthorization, setAuthorization } from "./api/Api";

// Kiểm tra token và xử lý khi ứng dụng khởi tạo
const app = createApp(App);
const token = localStorage.getItem('token');

if (token) {
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000); // Thời gian hiện tại (tính bằng giây)

    // Kiểm tra xem token đã hết hạn chưa
    if (decodedToken.exp < currentTime) {
      console.log("Token has expired. Logging out...");
      localStorage.removeItem('token');
      removeAuthorization();
      router.push('/login');
    } else {
      setAuthorization(token);
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    localStorage.removeItem('token');
    removeAuthorization();
    router.push('/login');
  }
}

app.use(createPinia());
app.use(router);

// Define the routes that require reload
// const reloadRoutes = ['/login', '/logout', '/admin'];



app.component("font-awesome-icon", FontAwesomeIcon);
app.mount('#app');
