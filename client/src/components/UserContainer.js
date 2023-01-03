import React from "react";
import { Route } from "react-router-dom";
import "../style.css";
import UserRegistration from "./UserRegistration";
import UserLogin from "./UserLogin";
import { useSelector } from "react-redux";
import Settings from "./Settings";
import Home from "./Home";
import UserProfile from "./UserProfile";

const UserContainer = (props) => {
  const homeData = useSelector((state) => {
    return state.homeData;
  });

  return (
    <div>
      <Route
        exact
        path="/"
        render={(props) => {
          return <UserRegistration {...props} />;
        }}
      />
      <Route
        exact
        path="/user/login/:status"
        render={(props) => {
          return <UserLogin {...props} />;
        }}
      />
      <Route
        exact
        path="/user/:id/dashboard/home"
        render={(props) => {
          return <Home {...props} />;
        }}
      />
      <Route
        exact
        path="/user/:id/dashboard/settings"
        render={(props) => {
          return <Settings {...props} />;
        }}
      />
      <Route
        exact
        path="/user/:id/dashboard/profile"
        render={(props) => {
          return <UserProfile {...props} />;
        }}
      />
    </div>
  );
};

export default UserContainer;
