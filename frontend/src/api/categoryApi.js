import axiosClient from "./axiosClient";

const module = "category";

const categoryApi = {
  getAll: () => {
    const url = `/${module}`;
    return axiosClient.get(url);
  },
  getById: (id) => {
    const url = `/${module}/getbyid/${id}`;
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
    const url = `/${module}/delete/${id}`;
    return axiosClient.delete(url);
  },
  status: (id, body) => {
    const url = `/${module}/update-publish/${id}`;
    return axiosClient.put(url, body);
  },
};

export default categoryApi;
