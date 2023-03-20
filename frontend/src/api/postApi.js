import axiosClient, { axiosUpload, axiosNotToken } from "./axiosClient";

const module = "posts";

const postsApi = {
  getAll: (params) => {
    const url = `/${module}/search`;
    return axiosNotToken.get(url, { params });
  },
  getById: (id) => {
    const url = `/${module}/${id}`;
    return axiosNotToken.get(url);
  },
  getByUser: (params) => {
    const url = `/${module}/getByUser`;
    return axiosClient.get(url, { params });
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
  status: (id, body) => {
    const url = `/${module}/update-publish/${id}`;
    return axiosClient.put(url, body);
  },
};

export default postsApi;
