// Use the environment variable for the API base URL with fallback
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.code-arena.tech';

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
    getProblems: `${API_BASE_URL}/api/v1/contest/get-problems`,
    updateProblem: `${API_BASE_URL}/api/v1/contest/update-problem`,
    deleteProblem: `${API_BASE_URL}/api/v1/contest/delete-problem`,
    updateContestDetails: `${API_BASE_URL}/api/v1/contest/update-contest-details`,
    addModerators: `${API_BASE_URL}/api/v1/contest/add-moderators`,
    moderators: `${API_BASE_URL}/api/v1/contest/moderators`,
    editModerator: `${API_BASE_URL}/api/v1/contest/moderators`,
    deleteModerator: `${API_BASE_URL}/api/v1/contest/moderators`,
    getContestParticipants: `${API_BASE_URL}/api/v1/contest`,
    uploadBackground: `${API_BASE_URL}/api/v1/contest/background`,
  },
  user: {
    getUserData: `${API_BASE_URL}/api/v1/auth/get-user-data`,
    changePassword: `${API_BASE_URL}/api/v1/auth/change-password`,
    createPassword: `${API_BASE_URL}/api/v1/auth/create-password`,
    getManageableContests: `${API_BASE_URL}/api/v1/auth/manageable-contests`,
    uploadProfilePicture: `${API_BASE_URL}/api/v1/auth/profile-picture`,
    getUserById: `${API_BASE_URL}/api/v1/auth`,
    followUnfollow: `${API_BASE_URL}/api/v1/auth/follow`,
    searchFriends: `${API_BASE_URL}/api/v1/auth/search-friends`,
    suggestedUsers: `${API_BASE_URL}/api/v1/auth/suggested-users`,
    getUserProfile: `${API_BASE_URL}/api/v1/auth/profile`,
  },
  problem: {
    getProblemById: `${API_BASE_URL}/api/v1/problem/get-problem`,
  },
  code: {
    run: `${API_BASE_URL}/api/v1/code/run`,
    submit: `${API_BASE_URL}/api/v1/code/submit`,
    getResult: (jobId: string) => `${API_BASE_URL}/api/v1/code/result/${jobId}`,
  },
  social: {
    suggestedUsers: `${API_BASE_URL}/api/v1/social/suggested-users`,
    searchUsers: `${API_BASE_URL}/api/v1/social/search-users`,
    followUser: `${API_BASE_URL}/api/v1/social/follow`,
    followers: `${API_BASE_URL}/api/v1/social/followers`,
    following: `${API_BASE_URL}/api/v1/social/following`,
  },
    duel: {
    socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL || 'https://api.code-arena.tech',
    getProblem: `/api/duel/problem`, // Next.js API route for fetching duel problems
  }
};

export default endpoints;