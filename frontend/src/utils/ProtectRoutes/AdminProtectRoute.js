import React from "react";
import { Navigate } from "react-router-dom";

import * as ROUTES from "../../constants/routes/routes";

function AdminProtectRoute({ userAuth, children }) {
  if (!userAuth?.isAdmin) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return children;
}

export default AdminProtectRoute;
