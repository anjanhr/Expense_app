import React from "react";
import { Link, Route } from "react-router-dom";
import "../style.css";
import UserRegistration from "./UserRegistration";
import UserLogin from "./UserLogin";
import { useSelector } from "react-redux";
import Settings from "./Settings";
import Home from "./Home";
import UserProfile from "./UserProfile";
import ParticlesBg from "particles-bg";

const UserContainer = (props) => {
  const homeData = useSelector((state) => {
    return state.homeData;
  });

  return (
    <div>
      {homeData && (
        <>
          <ParticlesBg type="cobweb" bg={true} />
          {/* ball, circle, cobweb, square, fountain, random */}
          <h1 style={{ letterSpacing: "1rem", marginLeft: "23.4rem" }}>
            Expense Manager App
            <Link
              to="/"
              style={{
                fontSize: "17px",
                color: "purple",
                marginLeft: "12.8rem",
                letterSpacing: "0.02rem",
              }}
            >
              Register
            </Link>
            <Link
              to={`/user/login/${"ex"}`}
              style={{
                marginLeft: "1rem",
                fontSize: "17px",
                color: "purple",
                letterSpacing: "0.02rem",
              }}
            >
              Login
            </Link>
          </h1>
          <hr />
          <br />
          <UserRegistration />
        </>
      )}

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
