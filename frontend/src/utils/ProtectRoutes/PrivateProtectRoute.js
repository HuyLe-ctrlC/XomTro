import React from "react";
import { Navigate } from "react-router-dom";

import * as ROUTES from "../../constants/routes/routes";

function PrivateProtectRoute({ userAuth, children }) {
  if (!userAuth) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return children;
}

export default PrivateProtectRoute;
