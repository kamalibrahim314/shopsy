import { apiSlice } from '../../app/apiSlice';

export const cartApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCart: builder.query({
            query: () => '/cart',
            providesTags: ['Cart'],
        }),
        addToCart: builder.mutation({
            query: ({ productId, quantity, size, color }) => ({
                url: '/cart/add',
                method: 'POST',
                body: { productId, quantity, size, color },
            }),
            invalidatesTags: ['Cart'],
        }),
        updateCartQuantity: builder.mutation({
            query: ({ itemId, quantity }) => ({
                url: `/cart/items/${itemId}`,
                method: 'PUT',
                body: { quantity },
            }),
            invalidatesTags: ['Cart'],
        }),
        removeFromCart: builder.mutation({
            query: (itemId) => ({
                url: `/cart/items/${itemId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Cart'],
        }),
        clearCart: builder.mutation({
            query: () => ({
                url: '/cart/clear',
                method: 'DELETE',
            }),
            invalidatesTags: ['Cart'],
        }),
        validateCartStock: builder.query({
            query: () => '/cart/validate',
        }),
    }),
});

export const {
    useGetCartQuery,
    useAddToCartMutation,
    useUpdateCartQuantityMutation,
    useRemoveFromCartMutation,
    useClearCartMutation,
    useLazyValidateCartStockQuery,
} = cartApiSlice;
