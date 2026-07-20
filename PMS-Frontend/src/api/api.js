import axiosInstance from "./axiosInstance";

// Login API
export const loginUser = async (data) => {
  const response = await axiosInstance.post("/user/login", data);
  return response.data;
};

// Register API (optional)
export const registerUser = async (data) => {
  const response = await axiosInstance.post("/user/register", data);
  return response.data;
};

export default axiosInstance;
