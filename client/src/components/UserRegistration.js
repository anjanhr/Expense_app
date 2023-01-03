import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { startRegisterUser } from "../actions/userAction";
import "../style.css";
import ParticlesBg from "particles-bg";
import { useFormik } from "formik";
import * as yup from "yup";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

const UserRegistration = (props) => {
  const dispatch = useDispatch();
  const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  // const [success, setSuccess] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");

  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Please enter a valid email address")
      .required()
      .min(10, "Email is too Short!")
      .max(30, "Email is too Long!"),
    password: yup
      .string()
      .matches(PASSWORD_REGEX, "Please enter a strong password")
      .required()
      .min(10, "Password is too Short!")
      .max(30, "Password is too Long!"),
  });

  const onSubmit = (values) => {
    const { ...data } = values;
    dispatch(startRegisterUser(data, reDirectSuccess, reDirectError));
    function reDirectSuccess() {
      props.history.push(`/user/login/${"new"}`);
      formik.resetForm();
    }
    function reDirectError(message) {
      setIsOpen(true);
      setError(message);
      setTimeout(() => {
        setIsOpen(false);
        setError(null);
      }, 10000);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validateOnBlur: true,
    validationSchema: validationSchema,
    onSubmit,
  });

  return (
    <>
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
      </>
      <hr />
      <br />
      {isOpen && (
        <Stack spacing={2}>
          <Alert
            sx={{
              width: "40%",
              margin: "auto",
              textAlign: "center",
              backgroundColor: "rgb(255, 110, 84, 0.9)",
            }}
            variant="filled"
            severity="error"
          >
            {error}
          </Alert>
        </Stack>
      )}

      <div className="reg">
        {/* {!error && <h3>{success ? success : ""}</h3>}
        {!success && <h3>{error ? error : ""}</h3>} */}
        <h1 style={{ letterSpacing: "0.03rem" }}> Register Here </h1>
        <form onSubmit={formik.handleSubmit}>
          <label style={{ color: "red" }}>
            {formik.touched.email && formik.errors.email ? (
              <span>
                {formik.errors.email} <br />
              </span>
            ) : (
              ""
            )}
          </label>
          <input
            className="inputstyle"
            style={{ marginTop: "1rem", letterSpacing: "0.01rem" }}
            type="text"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Your Mail"
          />
          <br /> <br />
          <label style={{ color: "red" }}>
            {formik.touched.password && formik.errors.password ? (
              <span>
                {formik.errors.password} <br />
              </span>
            ) : (
              ""
            )}
          </label>
          <input
            className="inputstyle"
            style={{ marginTop: "1rem", letterSpacing: "0.01rem" }}
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Your Password"
          />
          <br />
          <input
            style={{ marginTop: "2rem", width: "10%" }}
            className="regcolor1"
            type="submit"
            value="Register"
          />
          <h4 style={{ marginTop: "1rem", fontSize: "18px" }}>
            Already a user? <Link to={`/user/login/${"ex"}`}>Login</Link>
          </h4>
        </form>
      </div>
    </>
  );
};

export default UserRegistration;
