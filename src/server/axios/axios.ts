import axios from "axios";
import {
  deleteFromStorage,
  getFromStorage,
  saveToStorage,
  storageKeys,
} from "../../utils/storage";
import { router } from "expo-router";

export const baseUrl = process.env.EXPO_PUBLIC_API_ENDPOINT;

// Public Axios Instance
export const publicAxiosInstance = axios.create({ baseURL: baseUrl });

// Private Axios Instance
export const privateAxiosInstance = axios.create({
  baseURL: baseUrl,
});
privateAxiosInstance.prototype.retryCount = 0;
privateAxiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error) => {
    if (privateAxiosInstance.prototype.retryCount > 2) {
      if (error.response.status === 401 || error.response.status === 403) {
        return;
      } else {
        return Promise.reject(error);
      }
    }
    privateAxiosInstance.prototype.retryCount++;
    if (error.response.status === 401 || error.response.status === 403) {
      console.log(
        `${error.response.status} error, assume as token staled and get another idtoken with refresh token`
      );
      const refresh_token = await getFromStorage(storageKeys.refreshToken);

      if (!refresh_token) {
        console.log("refresh token not exist");
        handleInvalidUserSession();
        throw Promise.reject(error);
      }
      try {
        const access_token = await refreshToken(refresh_token);
        const { url, params, data, method } = error.config;
        const res = await privateAxiosInstance({
          method,
          data,
          url,
          params,
          headers: { Authorization: `Bearer ${access_token}` },
        });
        return res;
      } catch (error: any) {
        console.log("failed to get token by refresh token");
        handleInvalidUserSession();
        return Promise.reject(error);
      }
    } else {
      return Promise.reject(error);
    }
  }
);

// Axios related functions
const handleInvalidUserSession = () => {
  deleteFromStorage(storageKeys.accessToken);
  deleteFromStorage(storageKeys.refreshToken);
  router.replace({ pathname: "/" });
};

export const refreshToken = async (refresh_token: string) => {
  const res = await axios.post(`${baseUrl}/token`, { refresh_token });
  const access_token = res.data.token;
  saveToStorage(storageKeys.accessToken, access_token);
  return access_token;
};

export const getJWTHeaderFromLocalStorage = async () => {
  const access_token = await getFromStorage("accessToken");

  if (access_token) {
    return { Authorization: `Bearer ${access_token}` };
  } else {
    console.log(
      `local storage에 인증토큰 ${storageKeys.accessToken}이 없습니다`
    );
    return {};
  }
};
