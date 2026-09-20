import { apiSlice } from '../../app/apiSlice';

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProfile: builder.query({
            query: () => '/users/profile',
            providesTags: ['User'],
        }),
        updateProfile: builder.mutation({
            query: (profileData) => ({
                url: '/users/profile',
                method: 'PUT',
                body: profileData,
            }),
            invalidatesTags: ['User'],
        }),
        getAddresses: builder.query({
            query: () => '/users/addresses',
            providesTags: ['User'],
        }),
        createAddress: builder.mutation({
            query: (addressData) => ({
                url: '/users/addresses',
                method: 'POST',
                body: addressData,
            }),
            invalidatesTags: ['User'],
        }),
        updateAddress: builder.mutation({
            query: ({ id, data }) => ({
                url: `/users/addresses/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
        deleteAddress: builder.mutation({
            query: (id) => ({
                url: `/users/addresses/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User'],
        }),
        setDefaultAddress: builder.mutation({
            query: (id) => ({
                url: `/users/addresses/${id}/default`,
                method: 'PATCH',
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const {
    useGetProfileQuery,
    useUpdateProfileMutation,
    useGetAddressesQuery,
    useCreateAddressMutation,
    useUpdateAddressMutation,
    useDeleteAddressMutation,
    useSetDefaultAddressMutation,
} = usersApiSlice;
