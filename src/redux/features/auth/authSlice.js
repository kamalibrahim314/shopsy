import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('shopsy_token') || null;
let initialUser = null;
try {
    initialUser = JSON.parse(localStorage.getItem('shopsy_user') || 'null');
} catch {
    initialUser = null;
}

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: initialUser,
        token,
        isAuthenticated: !!token,
    },
    reducers: {
        setCredentials: (state, action) => {
            const { user, token } = action.payload;
            state.user = user;
            if (token !== undefined) {
                state.token = token;
                state.isAuthenticated = !!token;
                if (token) localStorage.setItem('shopsy_token', token);
                else localStorage.removeItem('shopsy_token');
            }
            if (user) localStorage.setItem('shopsy_user', JSON.stringify(user));
        },
        logOut: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('shopsy_token');
            localStorage.removeItem('shopsy_user');
        },
    },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;
