import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        return localStorage.getItem("User_in") ? (
          <Component {...props} />
        ) : (
          <>
            {alert("You need to Login first, before accessing this Route")}
            <Redirect
              to={{
                pathname: "/",
              }}
            />
          </>
        );
      }}
    />
  );
};

export default PrivateRoute;
