const initialState = [];

const budgetReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_BUDGET": {
      return [...action.payload];
    }
    case "PUT_BUDGET": {
      return [...action.payload];
    }
    default: {
      return state;
    }
  }
};

export default budgetReducer;
