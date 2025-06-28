// Use the environment variable for the API base URL with fallback
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://code-arena-backend.onrender.com';
const API_BASE_URL = 'http://localhost:8000';

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
    
    submitSolution: `${API_BASE_URL}/api/v1/contest/submit-solution`,
    // Updated endpoints for problem management
    getProblems: `${API_BASE_URL}/api/v1/contest/get-problems`,
    updateProblem: `${API_BASE_URL}/api/v1/contest/update-problem`,
    deleteProblem: `${API_BASE_URL}/api/v1/contest/delete-problem`,
    // Add this new endpoint for updateContestDetails
    updateContestDetails: `${API_BASE_URL}/api/v1/contest/update-contest-details`,
    
    // Moderator management
    addModerators: `${API_BASE_URL}/api/v1/contest/add-moderators`,
    moderators: `${API_BASE_URL}/api/v1/contest/moderators`,
    editModerator: `${API_BASE_URL}/api/v1/contest/moderators`,
    deleteModerator: `${API_BASE_URL}/api/v1/contest/moderators`,
    getContestParticipants: `${API_BASE_URL}/api/v1/contest`, // We'll append contestId in the route
    uploadBackground: `${API_BASE_URL}/api/v1/contest/background`,
  },
  user: {
    getUserData: `${API_BASE_URL}/api/v1/auth/get-user-data`,
    changePassword: `${API_BASE_URL}/api/v1/auth/change-password`,
    getManageableContests: `${API_BASE_URL}/api/v1/auth/manageable-contests`,
    uploadProfilePicture: `${API_BASE_URL}/api/v1/auth/profile-picture`,
    getUserById: `${API_BASE_URL}/api/v1/auth`,
    
    // Fix these endpoints to match backend routes
    followUnfollow: `${API_BASE_URL}/api/v1/auth/follow`,
    searchFriends: `${API_BASE_URL}/api/v1/auth/search-friends`,
    suggestedUsers: `${API_BASE_URL}/api/v1/auth/suggested-users`,
    getUserProfile: `${API_BASE_URL}/api/v1/auth/profile`,
  },
  problem: {
    submit: `${API_BASE_URL}/api/v1/problem/submit-solution`,
    run: `${API_BASE_URL}/api/v1/code/run`,
    getProblemById: `${API_BASE_URL}/api/v1/problem/get-problem`,
  },
  code: {
    run: `${API_BASE_URL}/api/v1/code/execute`,
    runAllTestCases: `${API_BASE_URL}/api/v1/code/execute-all`,
  }
};

export default endpoints;