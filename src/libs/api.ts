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
    editContest: `${API_BASE_URL}/api/v1/contest/edit-contest`,
    enterContest: `${API_BASE_URL}/api/v1/contest/enter-contest`,
    startContest: `${API_BASE_URL}/api/v1/contest/start-contest`,
    getContestById: `${API_BASE_URL}/api/v1/contest/getContestById`,
    deleteContest: `${API_BASE_URL}/api/v1/contest/delete-contest`,
    addProblems: `${API_BASE_URL}/api/v1/contest/add-problems`,
  },
  user: {
    getUserData: `${API_BASE_URL}/api/v1/auth/get-user-data`, // This is correct based on controller
    changePassword: `${API_BASE_URL}/api/v1/auth/change-password`, // This is correct based on controller
  },
  problem: {
    submit: `${API_BASE_URL}/api/v1/code/submit`,
    run: `${API_BASE_URL}/api/v1/code/run`,
  },
};

export default endpoints;