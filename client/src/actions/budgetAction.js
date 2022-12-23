import axios from "axios";
import cogoToast from "cogo-toast";

export const startGetBudget = () => {
  return (dispatch) => {
    axios
      .get("/api/user/budgets", {
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
          dispatch(getBudget(response.data));
        }
      })
      .catch((error) => {
        cogoToast.error(error.message);
      });
  };
};

const getBudget = (budgetData) => {
  return {
    type: "GET_BUDGET",
    payload: budgetData,
  };
};

export const startPutBudget = (id, formData) => {
  return (dispatch, getState) => {
    axios
      .put(`/api/user/budgets/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
      .then((response) => {
        if (response.data.error) {
          cogoToast.error(response.data.error); // token altered
        } else if (response.data.notice) {
          cogoToast.error(response.data.notice); // token not given
        } else if (response.data.numberError) {
          cogoToast.error(response.data.numberError); // number error
        } else if (response.data.mainError) {
          cogoToast.error(response.data.mainError); // any error
        } else {
          const responseData = response.data;
          const prevState = getState().budgetData;
          const newBudgetData = prevState.map((ele) => {
            if (ele._id === responseData._id) {
              return { ...ele, ...responseData };
            } else {
              return { ...ele };
            }
          });
          dispatch(putBudget(newBudgetData));
        }
      })
      .catch((error) => {
        cogoToast.error(error.message);
      });
  };
};

const putBudget = (newBudgetData) => {
  return {
    type: "PUT_BUDGET",
    payload: newBudgetData,
  };
};
