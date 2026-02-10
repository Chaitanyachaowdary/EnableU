import { useState, useCallback } from 'react';
import api from '../services/api.service';

/**
 * Senior Best Practice: Custom hook for API management
 * Handles loading, error, and data states uniformly.
 */
export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (method, url, data = null, options = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api({
                method,
                url,
                data,
                ...options
            });
            return response.data;
        } catch (err) {
            const message = err.response?.data?.message || err.message || 'An unexpected error occurred';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, error, request };
};
