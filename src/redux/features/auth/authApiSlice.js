import { apiSlice } from '../../app/apiSlice';
import { setCredentials, logOut } from './authSlice';

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: { ...credentials },
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCredentials({ user: data.user, token: data.token }));
                } catch (err) {
                    console.error('Login query failed:', err);
                }
            },
            invalidatesTags: ['User', 'Cart', 'Orders'],
        }),
        register: builder.mutation({
            query: (userData) => ({
                url: '/auth/register',
                method: 'POST',
                body: { ...userData },
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCredentials({ user: data.user, token: data.token }));
                } catch (err) {
                    console.error('Register query failed:', err);
                }
            },
            invalidatesTags: ['User', 'Cart', 'Orders'],
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(logOut());
                    dispatch(apiSlice.util.resetApiState());
                } catch (err) {
                    console.error('Logout failed:', err);
                    dispatch(logOut());
                }
            },
        }),
        getMe: builder.query({
            query: () => '/auth/me',
            providesTags: ['User'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data?.user) {
                        dispatch(setCredentials({ user: data.user }));
                    }
                } catch (err) {
                    // if unauthorized, clear auth state
                    if (err?.error?.status === 401) {
                        dispatch(logOut());
                    }
                }
            },
        }),
        updatePassword: builder.mutation({
            query: (passwords) => ({
                url: '/auth/update-password',
                method: 'PUT',
                body: passwords,
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useGetMeQuery,
    useUpdatePasswordMutation,
} = authApiSlice;
