import axios from 'axios';
import {SERVER_URL} from '../utils/consts'

const $host = axios.create({
    baseURL: SERVER_URL,
    // withCredentials: true,
});

const $authHost = axios.create({
    baseURL: SERVER_URL,
    // withCredentials: true,
});

const authInterceptor = (config) => {
    config.headers.authorization = `Bearer ${localStorage.getItem(
        'accessToken',
    )}`;
    return config;
};

$authHost.interceptors.request.use(authInterceptor);

export { $host, $authHost };
