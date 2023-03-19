import axiosClient, { axiosUpload } from "./axiosClient";

const module = "posts";

const postsApi = {
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
    return axiosUpload.post(url, data);
  },
  update: (id, body) => {
    const url = `/${module}/${id}`;
    return axiosUpload.put(url, body);
  },
  delete: (id) => {
    const url = `/${module}/${id}`;
    return axiosClient.delete(url);
  },
  like: (body) => {
    const url = `/${module}/likes`;
    return axiosClient.put(url, body);
  },
  disLike: (body) => {
    const url = `/${module}/dislikes`;
    return axiosClient.put(url, body);
  },
};

export default postsApi;
