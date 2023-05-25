import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        username: "",
        userRole: ""
    },
    reducers: {
        login: (state, action) => {
            state.username = action.payload
        },
        logout: (state) => {
            state.username = ""
            state.userRole = ""
        },
        setRole: (state, action) => {
            state.userRole = action.payload
        },
        unSetRole: (state, action) => {
            state.userRole = ""
        }
    }
})

export const { login, logout, setRole, unSetRole } = userSlice.actions

export default userSlice.reducer