import axios from "axios";
import cogoToast from "cogo-toast";

export const startGetExpense = () => {
  return (dispatch) => {
    axios
      .get("http://localhost:4030/api/user/expenses", {
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
          dispatch(getExpense(response.data));
        }
      })
      .catch((error) => {
        cogoToast.error(error.message);
      });
  };
};

const getExpense = (expenseData) => {
  return {
    type: "GET_EXPENSE",
    payload: expenseData,
  };
};

export const startGetBudgetOverView = (reDirectTotal) => {
  return (dispatch) => {
    axios
      .get("http://localhost:4030/api/user/expenses/total", {
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
          reDirectTotal(response.data);
        }
      })
      .catch((error) => {
        cogoToast.error(error.message);
      });
  };
};

export const startPostExpense = (formData, reDirect) => {
  return (dispatch) => {
    axios
      .post("http://localhost:4030/api/user/expenses", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
      .then((response) => {
        if (response.data.error) {
          cogoToast.error(response.data.error); // token altered
        } else if (response.data.notice) {
          cogoToast.error(response.data.notice); // token not given
        } else if (response.data.expenseError) {
          cogoToast.error(response.data.expenseError); // Expenses already exists
        } else if (response.data.mainError) {
          cogoToast.error(response.data.mainError); // any error
        } else {
          cogoToast.success("Added Expense Successful");
          reDirect();
        }
      })
      .catch((error) => {
        cogoToast.error(error.message);
      });
  };
};

export const startPutExpense = (id, formData, reDirect) => {
  return () => {
    axios
      .put(`http://localhost:4030/api/user/expenses/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
      })
      .then((response) => {
        if (response.data.error) {
          cogoToast.error(response.data.error); // token altered
        } else if (response.data.notice) {
          cogoToast.error(response.data.notice); // token not given
        } else if (response.data.expenseError) {
          cogoToast.error(response.data.expenseError); // Expenses already exists
        } else if (response.data.mainError) {
          cogoToast.error(response.data.mainError); // any error
        } else {
          cogoToast.success("Update is Successful");
          reDirect();
        }
      })
      .catch((error) => {
        cogoToast.error(error.message);
      });
  };
};

export const startDeleteHard = (
  id,
  promptInput,
  reDirectError,
  reDirectSuccess
) => {
  return () => {
    axios
      .delete(`http://localhost:4030/api/user/expenses/${id}/harddelete`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("myToken")}`,
        },
        data: {
          promptInput,
        },
      })
      .then((response) => {
        if (response.data.error) {
          cogoToast.error(response.data.error); // token altered
        } else if (response.data.notice) {
          cogoToast.error(response.data.notice); // token not given
        } else if (response.data.passwordError) {
          reDirectError(); // Incorrect password
        } else if (response.data.mainError) {
          cogoToast.error(response.data.mainError); // any error
        } else {
          reDirectSuccess();
        }
      })
      .catch((error) => {
        cogoToast.error(error.message);
      });
  };
};
