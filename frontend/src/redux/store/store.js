import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../slices/users/usersSlice";
import categoriesReducer from "../slices/category/categorySlice";
import postsReducer from "../slices/posts/postsSlices";
import locationsReducer from "../slices/location/locationSlices";
import commentsReducer from "../slices/comments/commentSlices";
import roomReducer from "../slices/rooms/roomsSlices";
import xomtroReducer from "../slices/xomtros/xomtrosSlices";
import selectReducer from "../slices/selectedSlices";
import invoiceReducer from "../slices/invoices/invoicesSlices";
import renterReducer from "../slices/renters/rentersSlices";

const store = configureStore({
  reducer: {
    users: usersReducer,
    categories: categoriesReducer,
    posts: postsReducer,
    locations: locationsReducer,
    comments: commentsReducer,
    rooms: roomReducer,
    xomtros: xomtroReducer,
    selects: selectReducer,
    invoices: invoiceReducer,
    renters: renterReducer,
  },
});

export default store;
