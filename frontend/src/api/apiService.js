import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/orders';

export const createOrder = async (order) => {
    try {
        const response = await axios.post(API_BASE_URL, order);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getOrder = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
