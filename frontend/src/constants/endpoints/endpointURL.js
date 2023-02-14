const API_BASE_URL_DEVELOPMENT = "http://localhost:5000";

const ENDPOINTS = {
  REGISTER: "api/users/register",
  LOGIN: "api/users/login",
  CREATE_CATEGORY: "api/category",
};

const DEVELOPMENT = {
  API_URL_REGISTER: `${API_BASE_URL_DEVELOPMENT}/${ENDPOINTS.REGISTER}`,
  API_URL_LOGIN: `${API_BASE_URL_DEVELOPMENT}/${ENDPOINTS.LOGIN}`,
  API_URL_CREATE_CATEGORY: `${API_BASE_URL_DEVELOPMENT}/${ENDPOINTS.CREATE_CATEGORY}`,
};

const Constants = DEVELOPMENT;

export default Constants;
