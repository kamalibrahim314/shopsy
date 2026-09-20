import { apiSlice } from '../../app/apiSlice';

export const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (orderData) => ({
                url: '/orders',
                method: 'POST',
                body: orderData,
            }),
            invalidatesTags: ['Orders', 'Cart', 'Products'],
        }),
        getMyOrders: builder.query({
            query: () => '/orders/my',
            providesTags: ['Orders'],
        }),
        getOrderById: builder.query({
            query: (id) => `/orders/${id}`,
            providesTags: (result, error, id) => [{ type: 'Orders', id }],
        }),
        getAllOrders: builder.query({
            query: (params = {}) => {
                const queryParams = new URLSearchParams();
                if (params.status) queryParams.append('status', params.status);
                const str = queryParams.toString();
                return `/orders${str ? `?${str}` : ''}`;
            },
            providesTags: ['Orders'],
        }),
        updateOrderStatus: builder.mutation({
            query: ({ id, status, paymentStatus }) => ({
                url: `/orders/${id}/status`,
                method: 'PATCH',
                body: { status, paymentStatus },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Orders', id },
                { type: 'Orders', id: 'LIST' },
            ],
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetMyOrdersQuery,
    useGetOrderByIdQuery,
    useGetAllOrdersQuery,
    useUpdateOrderStatusMutation,
} = ordersApiSlice;
