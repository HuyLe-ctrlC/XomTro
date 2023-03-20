import axiosClient, { axiosNotToken } from "./axiosClient";

const module = "comments";

const commentApi = {
  //   getAll: (params) => {
  //     const url = `/${module}/search`;
  //     return axiosClient.get(url, { params });
  //   },
  getById: (id) => {
    const url = `/${module}/${id}`;
    return axiosNotToken.get(url);
  },
  getByIdDetail: (id) => {
    const url = `/${module}/getDetail/${id}`;
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

export default commentApi;
