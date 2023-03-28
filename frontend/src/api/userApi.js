import axiosClient, { axiosNotToken, axiosUpload } from "./axiosClient";

const module = "users";

const usersApi = {
  register: (body) => {
    const url = `/${module}/register`;
    return axiosNotToken.post(url, body);
  },
  login: (body) => {
    const url = `/${module}/login`;
    return axiosNotToken.post(url, body);
  },
  profile: (id) => {
    const url = `/${module}/profile/${id}`;
    return axiosClient.get(url);
  },
  update: (id, body) => {
    const url = `/${module}/${id}`;
    return axiosUpload.put(url, body);
  },
  follow: (body) => {
    const url = `/${module}/follow`;
    return axiosClient.put(url, body);
  },
  unfollow: (body) => {
    const url = `/${module}/unfollow`;
    return axiosClient.put(url, body);
  },
  email: (body) => {
    const url = `/email`;
    return axiosClient.post(url, body);
  },
  verify: (body) => {
    const url = `/${module}/generate-verify-email-token`;
    return axiosClient.post(url, body);
  },
  verifiedAccount: (body) => {
    const url = `/${module}/verify-account`;
    return axiosClient.put(url, body);
  },
  getAll: (params) => {
    const url = `/${module}/search`;
    return axiosClient.get(url, { params });
  },
  status: (id, body) => {
    const url = `/${module}/update-publish/${id}`;
    return axiosClient.put(url, body);
  },
  adminRegister: (body) => {
    const url = `/${module}/admin-register`;
    return axiosUpload.post(url, body);
  },
  updatePassword: (body) => {
    const url = `/${module}/password`;
    return axiosClient.put(url, body);
  },
  forgetPasswordToken: (body) => {
    const url = `/${module}/forget-password-token`;
    return axiosNotToken.post(url, body);
  },
  resetPassword: (body) => {
    const url = `/${module}/reset-password`;
    return axiosNotToken.put(url, body);
  },
};

export default usersApi;
