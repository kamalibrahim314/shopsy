import { apiSlice } from '../../app/apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: (params = {}) => {
                const queryParams = new URLSearchParams();
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        queryParams.append(key, value);
                    }
                });
                const queryString = queryParams.toString();
                return `/products${queryString ? `?${queryString}` : ''}`;
            },
            providesTags: (result) =>
                result?.products
                    ? [
                          ...result.products.map(({ id }) => ({ type: 'Products', id })),
                          { type: 'Products', id: 'LIST' },
                      ]
                    : [{ type: 'Products', id: 'LIST' }],
        }),
        getProductById: builder.query({
            query: (idOrSlug) => `/products/${idOrSlug}`,
            providesTags: (result, error, idOrSlug) => [{ type: 'Products', id: idOrSlug }],
        }),
        getCategories: builder.query({
            query: () => '/categories',
            providesTags: [{ type: 'Categories', id: 'LIST' }],
        }),
        getCategoryById: builder.query({
            query: (idOrSlug) => `/categories/${idOrSlug}`,
            providesTags: (result, error, idOrSlug) => [{ type: 'Categories', id: idOrSlug }],
        }),
        createProduct: builder.mutation({
            query: (formData) => ({
                url: '/products',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: [{ type: 'Products', id: 'LIST' }],
        }),
        updateProduct: builder.mutation({
            query: ({ id, data }) => ({
                url: `/products/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Products', id },
                { type: 'Products', id: 'LIST' },
            ],
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Products', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductByIdQuery,
    useGetCategoriesQuery,
    useGetCategoryByIdQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productsApiSlice;
