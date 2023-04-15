import axiosClient, { axiosNotToken } from "./axiosClient";

const module = "room";

const roomApi = {
  getAll: (params) => {
    const url = `/${module}/search`;
    return axiosClient.get(url, { params });
  },
  getById: (id) => {
    const url = `/${module}/${id}`;
    return axiosClient.get(url);
  },
  getByXomtroId: (params) => {
    const url = `/${module}/roomByXomtroId`;
    return axiosClient.get(url, { params });
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
  updateUtility: (body) => {
    const url = `/${module}/update-utility`;
    return axiosClient.put(url, body);
  },
  deleteUtility: (id, body) => {
    console.log("body", body);
    const url = `/${module}/delete-utility/${id}`;
    return axiosClient.put(url, body);
  },
  getUtility: (params) => {
    const url = `/${module}/get-utility`;
    return axiosClient.get(url, { params });
  },
};

export default roomApi;
