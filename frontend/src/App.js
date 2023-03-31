import React from "react";
import "./style.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NotFound } from "./pages/NotFound/NotFound";
import HomePage from "./pages/HomePage";
import * as ROUTES from "./constants/routes/routes";
import Login from "./pages/Users/Login/Login";
import Register from "./pages/Users/Register/Register";
import { Navbar } from "./components/Navigation/Navbar";
import { Category } from "./pages/Categories";
//Protect Router
import PrivateProtectRoute from "./utils/ProtectRoutes/PrivateProtectRoute";
import { useSelector } from "react-redux";
import { selectUser } from "./redux/slices/users/usersSlice";
import AdminProtectRoute from "./utils/ProtectRoutes/AdminProtectRoute";
import CreatePost from "./pages/Posts";
import PostsList from "./pages/frontend/Posts/PostList";
import PostDetails from "./pages/frontend/Posts/PostDetails";
import Profile from "./pages/Users/Profile";
import AccountVerified from "./pages/Users/AccountVerified";
import { UserList } from "./pages/Users/UserList";
import { UpdatePassword } from "./pages/Users/PasswordManagement/UpdatePassword";
import { ResetPasswordForm } from "./pages/Users/PasswordManagement/ResetPasswordForm";
import { ResetPassword } from "./pages/Users/PasswordManagement/ResetPassword";
import UtilityManagement from "./pages/Xomtro/UtilityManagement";
import Xomtro from "./pages/Xomtro";
function App() {
  const user = useSelector(selectUser);
  const userAuth = user?.userAuth;
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          {/* Admin routes */}
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
          {/* User routes */}
          <Route
            path={ROUTES.UPDATE_PASSWORD}
            element={
              <PrivateProtectRoute userAuth={userAuth}>
                <UpdatePassword />
              </PrivateProtectRoute>
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
          {/* Xomtro route */}
          <Route
            path={ROUTES.XOMTRO}
            element={
              <PrivateProtectRoute userAuth={userAuth}>
                <Xomtro />
              </PrivateProtectRoute>
            }
          />
          <Route
            path={ROUTES.UTILITY_MANAGEMENT}
            element={
              <PrivateProtectRoute userAuth={userAuth}>
                <UtilityManagement />
              </PrivateProtectRoute>
            }
          />
          {/* public routes */}
          <Route path={ROUTES.POSTS} element={<PostsList />} />
          <Route
            path={ROUTES.RESET_PASSWORD_TOKEN}
            element={<ResetPasswordForm />}
          />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
          <Route path={ROUTES.POSTS_DETAIL} element={<PostDetails />} />
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
