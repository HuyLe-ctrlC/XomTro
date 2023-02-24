import React from "react";
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
            path={ROUTES.CREATE_POST}
            element={
              <PrivateProtectRoute userAuth={userAuth}>
                <CreatePost />
              </PrivateProtectRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
