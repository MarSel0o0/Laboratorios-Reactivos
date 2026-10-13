import axios from "axios";
 
// instancia de axios que envía la cookie con el JWT
// y agrega el token CSRF guardado en localStorage
const axiosSecure = axios.create({
  withCredentials: true,
});
 
axiosSecure.interceptors.request.use((config) => {
  const csrfToken = localStorage.getItem("csrfToken");
  if (csrfToken) {
    config.headers["X-CSRF-Token"] = csrfToken;
  }
  return config;
});
 
export default axiosSecure;