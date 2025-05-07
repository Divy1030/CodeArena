// Use the environment variable for the API base URL with fallback
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://code-arena-backend.onrender.com';

// Log the API URL for debugging
console.log('Using API base URL:', API_BASE_URL);

const endpoints = {
  auth: {
    register: `${API_BASE_URL}/api/v1/auth/register`,

    googleLogin: `${API_BASE_URL}/api/v1/auth/google`,

    login: `${API_BASE_URL}/api/v1/auth/login`,
    logout: `${API_BASE_URL}/api/v1/auth/logout`,
    verifyOtp: `${API_BASE_URL}/api/v1/auth/v`,
    forgotPassword: `${API_BASE_URL}/api/v1/auth/forgot-password`,
    verifyResetPasswordOtp: `${API_BASE_URL}/api/v1/auth/verify-reset-password-otp`,
    updatePassword: `${API_BASE_URL}/api/v1/auth/update-password`,
    refreshToken: `${API_BASE_URL}/api/v1/auth/refresh-token`,
  },
  admin: {
    register: `${API_BASE_URL}/api/v1/admin/register`,
    login: `${API_BASE_URL}/api/v1/admin/login`,
    getAdminInfo: `${API_BASE_URL}/api/v1/admin/get-admin`,
  },
  contest: {
    createContest: `${API_BASE_URL}/api/v1/contest/create-contest`,
    getAllContests: `${API_BASE_URL}/api/v1/contest/getAllContests`,
    joinContest: `${API_BASE_URL}/api/v1/contest/join-contest`,
  },
  user: {
    profile: `${API_BASE_URL}/api/v1/user/profile`,

  },
  // Add other endpoints as needed
};

export default endpoints;