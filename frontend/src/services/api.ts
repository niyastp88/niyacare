import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.23.197.249:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;