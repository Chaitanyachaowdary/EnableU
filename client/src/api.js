import axios from 'axios';

const API_URL = '/api/tasks';

// Add token to requests
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401s
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Only redirect if not already on auth pages
            const path = window.location.pathname;
            if (!path.includes('/login') && !path.includes('/signup') && !path.includes('/forgot-password')) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const getTasks = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createTask = async (task) => {
    const response = await axios.post(API_URL, task);
    return response.data;
};

export const updateTask = async (id, updates) => {
    const response = await axios.put(`${API_URL}/${id}`, updates);
    return response.data;
};

export const deleteTask = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};

// --- Admin Endpoints ---

export const getAdminUsers = async () => {
    const response = await axios.get('/api/admin/users');
    return response.data;
};

export const updateUserRole = async (userId, role) => {
    const response = await axios.put(`/api/admin/users/${userId}/role`, { role });
    return response.data;
};

export const createQuiz = async (quizData) => {
    const response = await axios.post('/api/admin/quizzes', quizData);
    return response.data;
};

export const deleteQuiz = async (quizId) => {
    const response = await axios.delete(`/api/admin/quizzes/${quizId}`);
    return response.data;
};

export const getQuizzes = async () => {
    const response = await axios.get('/api/quizzes');
    return response.data;
};
