import React from "react";
import "./style.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NotFound } from "./pages/NotFound/NotFound";
import HomePage from "./components/HomePage/HomePage";
import * as ROUTES from "./constants/routes/routes";
import Login from "./components/Users/Login/Login";
import Register from "./components/Users/Register/Register";
import { Navbar } from "./components/Navigation/Navbar";
import { Category } from "./components/Categories";
//Protect Router
import PrivateProtectRoute from "./utils/ProtectRoutes/PrivateProtectRoute";
import { useSelector } from "react-redux";
import { selectUser } from "./redux/slices/users/usersSlice";
import AdminProtectRoute from "./utils/ProtectRoutes/AdminProtectRoute";
import CreatePost from "./components/Posts";
import PostsList from "./components/frontend/Posts/PostList";
import PostDetails from "./components/frontend/Posts/PostDetails";
import Profile from "./components/Users/Profile";
import AccountVerified from "./components/Users/AccountVerified";
import { UserList } from "./components/Users/UserList";
function App() {
  const user = useSelector(selectUser);
  const userAuth = user?.userAuth;
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          <Route
            path={ROUTES.CATEGORY_LIST}
            element={
              <AdminProtectRoute userAuth={userAuth}>
                <Category />
              </AdminProtectRoute>
            }
          />
          <Route
            path={ROUTES.USERS_MANAGEMENT}
            element={
              <AdminProtectRoute userAuth={userAuth}>
                <UserList />
              </AdminProtectRoute>
            }
          />
          <Route
            path={ROUTES.CREATE_POST}
            element={
              <PrivateProtectRoute userAuth={userAuth}>
                <CreatePost />
              </PrivateProtectRoute>
            }
          />
          <Route
            path={ROUTES.PROFILE}
            element={
              <PrivateProtectRoute userAuth={userAuth}>
                <Profile />
              </PrivateProtectRoute>
            }
          />
          <Route
            path={ROUTES.VERIFIED_ACCOUNT}
            element={
              <PrivateProtectRoute userAuth={userAuth}>
                <AccountVerified />
              </PrivateProtectRoute>
            }
          />
          <Route path={ROUTES.POSTS} element={<PostsList />} />
          <Route path="/posts/:postId" element={<PostDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
