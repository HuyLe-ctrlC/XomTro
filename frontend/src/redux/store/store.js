import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../slices/users/usersSlice";
import categoriesReducer from "../slices/category/categorySlice";

const store = configureStore({
  reducer: { users: usersReducer, categories: categoriesReducer },
});

export default store;
