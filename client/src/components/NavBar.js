import React, { useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "../style2.css";
import { startShowUser } from "../actions/userAction";

const NavBar = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(startShowUser());
  }, [dispatch]);

  const userData = useSelector((state) => {
    return state.userData;
  });

  const handleLogout = () => {
    localStorage.clear();
    props.history.push(`/user/login/${"ex"}`);
  };

  return (
    <div>
      <nav className="nav">
        <>
          <svg
            style={{ marginLeft: "-3rem" }}
            id="logo-38"
            width="78"
            height="32"
            viewBox="0 0 78 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z"
              className="ccustom"
              fill="#FF7A00"
            ></path>
            <path
              d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"
              className="ccompli1"
              fill="#FF9736"
            ></path>
            <path
              d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z"
              className="ccompli2"
              fill="#FFBC7D"
            ></path>
          </svg>
        </>
        <div style={{ marginRight: "-2rem" }}>
          <ul className="navbar">
            <li>
              <Link
                className="link"
                to={`/user/${userData._id}/dashboard/home`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                className="link"
                to={`/user/${userData._id}/dashboard/settings`}
              >
                Setting
              </Link>
            </li>
            <li>
              <Link
                className="link"
                to={`/user/${userData._id}/dashboard/profile`}
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                className="logout"
                to="/user/login/:status"
                onClick={handleLogout}
              >
                Log Out
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default withRouter(NavBar);
