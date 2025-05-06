// Use the environment variable for the API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const endpoints = {
  auth: {
    login: `${API_BASE_URL}/api/v1/auth/login`,
    register: `${API_BASE_URL}/api/v1/auth/register`,
    googleLogin: `${API_BASE_URL}/api/v1/auth/google`,
  },
  code: {
    execute: `${API_BASE_URL}/api/v1/code/execute`,
  }
};

export default endpoints;