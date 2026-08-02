import axios from "axios";

const apiOrigin = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "");

export async function ensureCsrfCookie() {
  await axios.get(`${apiOrigin}/sanctum/csrf-cookie`, {
    withCredentials: true,
  });
}
