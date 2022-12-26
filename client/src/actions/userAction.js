import axios from "axios";
import cogoToast from "cogo-toast";
// http://localhost:4030/

export const startRegisterUser = (formData, reDirectSuccess, reDirectError) => {
  return () => {
    axios
      .post("/api/user/register", formData)
      .then((response) => {
        if (response.data.emailError) {
          reDirectError(response.data.emailError); // email already exists
        } else if (response.data.mainError) {
          reDirectError(response.data.mainError); // any error
        } else {
          reDirectSuccess();
        }
      })
      .catch((error) => {
        reDirectError(error.message);
      });
  };
};

export const startLoginUser = (formData, reDirectSuccess, reDirectError) => {
  return (dispatch) => {
    axios
      .post("/api/user/login", formData)
      .then((response) => {
        if (response.data.mainError) {
          reDirectError(response.data.mainError); // invalid email or password
        } else {
          // generated token comes as -> response.data.token
          const token = response.data.token.split(" ")[1];
          localStorage.setItem("myToken", token);
          axios
            .get(`/api/user/account`, {
              headers: {
                Authorization: response.data.token,
              },
            })
            .then((response) => {
              if (response.data.error) {
                reDirectError(response.data.error); // token altered
              } else if (response.data.notice) {
                reDirectError(response.data.notice); // token not given
              } else {
                reDirectSuccess(response.data); // user data
                dispatch(getUser(response.data));
              }
            })
            .catch((error) => {
              reDirectError(error.message); // server error
            });
        }
      })
      .catch((error) => {
        reDirectError(error.message); //server error
      });
  };
};

const getUser = (userData) => {
  return {
    type: "GET_USER",
    payload: userData,
  };
};

export const startShowUser = () => {
  return (dispatch) => {
    axios
      .get(`/api/user/account`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
      .then((response) => {
        if (response.data.error) {
          cogoToast.error(response.data.error); // token altered
        } else if (response.data.notice) {
          cogoToast.error(response.data.notice); // token not given
        } else {
          dispatch(showUser(response.data));
        }
      })
      .catch((error) => {
        cogoToast.error(error.message);
      });
  };
};

const showUser = (userData) => {
  return {
    type: "SHOW_USER",
    payload: userData,
  };
};

export const startPostProfile = (formData, reDirect) => {
  return () => {
    axios
      .post(`/api/user/account`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
          "Content-Type": "multipart/form-data", // for other data along with image use multipart
        },
      })
      .then((response) => {
        if (response.data.error) {
          cogoToast.error(response.data.error); // token altered
        } else if (response.data.notice) {
          cogoToast.error(response.data.notice); // token not given
        } else if (response.data.lengthError) {
          cogoToast.error(response.data.lengthError); // length error
        } else if (response.data.amazonS3Error) {
          cogoToast.error(response.data.amazonS3Error); // amazon S3 error
        } else if (response.data.mainError) {
          cogoToast.error(response.data.mainError); // any error
        } else {
          cogoToast.success("Profile Updated");
          reDirect();
        }
      })
      .catch((error) => {
        cogoToast.error(error.message);
      });
  };
};

export const startDeleteProfile = (reDirect) => {
  return () => {
    axios
      .delete(`/api/user/account/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
      .then((response) => {
        if (response.data.error) {
          cogoToast.error(response.data.error); // token altered
        } else if (response.data.notice) {
          cogoToast.error(response.data.notice); // token not given
        } else if (response.data.mainError) {
          cogoToast.error(response.data.mainError); // any error
        } else {
          cogoToast.success("Deleted Profile Pic");
          reDirect();
        }
      })
      .catch((error) => {
        cogoToast.error(error.message);
      });
  };
};
