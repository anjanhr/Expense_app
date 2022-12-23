const initialState = [];

const expenseReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_EXPENSE": {
      return [...action.payload];
    }
    default: {
      return state;
    }
  }
};

export default expenseReducer;
