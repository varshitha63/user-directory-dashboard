import axios from 'axios';

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
});

export const getUsers = () => api.get('/users');
export const getUserById = (id: number | string) => api.get(`/users/${id}`);

export default api;
