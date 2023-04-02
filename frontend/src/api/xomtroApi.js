import axiosClient, { axiosNotToken } from "./axiosClient";

const module = "xomtro";

const xomtroApi = {
  getAll: (params) => {
    const url = `/${module}/search`;
    return axiosClient.get(url, { params });
  },
  getById: (id) => {
    const url = `/${module}/${id}`;
    return axiosClient.get(url);
  },
  add: (data) => {
    const url = `/${module}`;
    return axiosClient.post(url, data);
  },
  update: (id, body) => {
    const url = `/${module}/${id}`;
    return axiosClient.put(url, body);
  },
  delete: (id) => {
    const url = `/${module}/${id}`;
    return axiosClient.delete(url);
  },
  addUtility: (body) => {
    const url = `/${module}/add-utility`;
    return axiosClient.post(url, body);
  },
};

export default xomtroApi;
