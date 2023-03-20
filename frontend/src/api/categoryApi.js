import axiosClient, {  axiosNotToken } from "./axiosClient";
const module = "category";

const categoryApi = {
  getAll: (params) => {
    const url = `/${module}/search`;
    return axiosNotToken.get(url, { params });
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
};

export default categoryApi;
