import "server-only";

// Use the environment variable for the API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const endpoints = {
  auth: {
    login: `${API_BASE_URL}/auth/v1/login`,
    register: `${API_BASE_URL}/auth/v1/signup`,
  }
};

export default endpoints;