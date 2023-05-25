import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../features/user/userSlice";
import { combineReducers } from "redux";

const combinedReducer = combineReducers(
    {
        user: userSlice
    }
)

export default configureStore({
    reducer: combinedReducer
})