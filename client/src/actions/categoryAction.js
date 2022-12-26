import axios from "axios";
import cogoToast from "cogo-toast";

export const startGetCategory = () => {
  return (dispatch) => {
    axios
      .get("/api/user/categories", {
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
          dispatch(getCategory(response.data));
        }
      })
      .catch((error) => {
        cogoToast.error(error.message);
      });
  };
};

const getCategory = (categoryData) => {
  return {
    type: "GET_CATEGORY",
    payload: categoryData,
  };
};

export const startPostCategory = (formData, reDirect) => {
  return (dispatch) => {
    axios
      .post("/api/user/categories", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
      .then((response) => {
        if (response.data.error) {
          cogoToast.error(response.data.error); // token altered
        } else if (response.data.notice) {
          cogoToast.error(response.data.notice); // token not given
        } else if (response.data.stringError) {
          cogoToast.error(response.data.stringError); // only string error
        } else if (response.data.duplicateError) {
          cogoToast.error(response.data.duplicateError); // categoey already exist
        } else if (response.data.mainError) {
          cogoToast.error(response.data.mainError); // any error
        } else {
          cogoToast.success("Added Category Successful");
          reDirect();
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  };
};

export const startDeleteCategory = (id, reDirect) => {
  return (dispatch) => {
    axios
      .delete(`/api/user/categories/${id}`, {
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
          cogoToast.success("category is soft deleted");
          dispatch(getNewSetCategory(response.data));
        }
      })
      .catch((error) => {
        cogoToast.error(error.message);
      });
  };
};

const getNewSetCategory = (newSetCategoryData) => {
  return {
    type: "NEW_SET_CATEGORY",
    payload: newSetCategoryData,
  };
};

export const startUndoCategoryDelete = (data, reDirect) => {
  return (dispatch) => {
    axios
      .put(`/api/user/categories/undodeleted`, data, {
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
          cogoToast.success("category is restored");
          reDirect();
        }
      })
      .catch((error) => {
        cogoToast.error(error.message);
      });
  };
};

export const startcategoryWiseSplit = (reDirect) => {
  return (dispatch) => {
    axios
      .get("/api/user/categories/splitData", {
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
          reDirect(response.data);
        }
      })
      .catch((error) => {
        cogoToast.error(error.message);
      });
  };
};
