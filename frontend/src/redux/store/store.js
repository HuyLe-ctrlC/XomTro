import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../slices/users/usersSlice";
import categoriesReducer from "../slices/category/categorySlice";
import postsReducer from "../slices/posts/postsSlices";
import locationsReducer from "../slices/location/locationSlices";
import commentsReducer from "../slices/comments/commentSlices";
import roomReducer from "../slices/rooms/roomsSlices";
import xomtroReducer from "../slices/xomtros/xomtrosSlices";

const store = configureStore({
  reducer: {
    users: usersReducer,
    categories: categoriesReducer,
    posts: postsReducer,
    locations: locationsReducer,
    comments: commentsReducer,
    rooms: roomReducer,
    xomtros: xomtroReducer
  },
});

export default store;
