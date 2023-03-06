import axiosClient from "./axiosClient";

const module = "location";

const locationApi = {
//   getAll: (params) => {
//     const url = `/${module}/search`;
//     return axiosClient.get(url, { params });
//   },
  getCity: () => {
    const url = `/${module}/getCity`;
    return axiosClient.get(url);
  },
  getDistrict: (id) => {
    const url = `/${module}/getDistrict/${id}`;
    return axiosClient.get(url);
  },
  getWard: (params) => {
    const url = `/${module}/getWard`;
    return axiosClient.get(url, {params});
  },
};

export default locationApi;
