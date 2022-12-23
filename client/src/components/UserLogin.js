import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { startHomeAction } from "../actions/homeAction";
import { startLoginUser } from "../actions/userAction";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import ParticlesBg from "particles-bg";
import { useFormik } from "formik";
import * as yup from "yup";

const UserLogin = (props) => {
  const status = props.match.params.status;
  const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  const dispatch = useDispatch();
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(startHomeAction(false));
  }, [dispatch]);

  useEffect(() => {
    if (status === "new") {
      setIsSuccessOpen(true);
      setTimeout(() => {
        setIsSuccessOpen(false);
      }, 3000);
    }
  }, [dispatch, status]);

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

    dispatch(startLoginUser(data, reDirectSuccess, reDirectError));
    function reDirectSuccess(user) {
      props.history.push(`/user/${user._id}/dashboard/home`);
      formik.resetForm();
    }
    function reDirectError(message) {
      setIsErrorOpen(true);
      setError(message);
      setTimeout(() => {
        setIsErrorOpen(false);
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
      {isSuccessOpen && (
        <Stack spacing={2}>
          <Alert
            sx={{
              width: "40%",
              margin: "auto",
              textAlign: "center",
              backgroundColor: "rgb(37, 150, 190, 0.7)",
            }}
            variant="filled"
            severity="success"
          >
            Successfully Registered
          </Alert>
        </Stack>
      )}
      {isErrorOpen && (
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
      <div className="log">
        <h1 style={{ letterSpacing: "0.03rem" }}> Login Here </h1>
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
            value="Login"
          />
          <h4 style={{ marginTop: "1rem", fontSize: "18px" }}>
            Not registered yet? <Link to="/">Register</Link>
          </h4>
        </form>
      </div>
    </>
  );
};

export default UserLogin;
