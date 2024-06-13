import axios from 'axios';

const { TIMEOUT } = process.env;

const createAxiosInstance = (baseUrl) => {
    return axios.create({
        baseURL: baseUrl,
        timeout: parseInt(TIMEOUT), // env by default string, so it needs to be parsed to int
    });
};

export default createAxiosInstance;