import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NotFound } from "./pages/NotFound/NotFound";
import HomePage from "./components/HomePage/HomePage";
import * as ROUTES from "./constants/routes/routes";
import Login from "./components/Users/Login/Login";
import Register from "./components/Users/Register/Register";
import { Navbar } from "./components/Navigation/Navbar";
import { CategoryList } from "./components/Categories/CategoryList";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          <Route exact path={ROUTES.CATEGORY_LIST} element={<CategoryList />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
