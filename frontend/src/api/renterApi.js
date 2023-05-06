import axiosClient, { axiosUpload } from "./axiosClient";

const module = "renter";

const renterApi = {
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
};

export default renterApi;
