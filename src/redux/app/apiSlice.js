import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:5001',
        credentials: 'include',
        prepareHeaders: (headers, { getState }) => {
            const token = getState()?.auth?.token || localStorage.getItem('shopsy_token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['User', 'Products', 'Categories', 'Cart', 'Orders'],
    endpoints: () => ({}),
});
