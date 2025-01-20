import axios from 'axios';
import  backendUrl  from '../App';
const axiosInstance = axios.create({
  baseURL: `${backendUrl}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
