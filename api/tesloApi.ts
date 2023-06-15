import axios from 'axios';

const testloApi = axios.create({
    baseURL: '/api'
});

export default testloApi;