import axiosClient, { axiosNotToken } from "./axiosClient";

const module = "users";

const usersApi = {
  register: (body) => {
    const url = `${process.env.REACT_APP_API_URL}/${module}/register`;
    return axiosNotToken.post(url, body);
  },
  login: (body) => {
    const url = `${process.env.REACT_APP_API_URL}/${module}/login`;
    return axiosNotToken.post(url, body);
  },
};

export default usersApi;
