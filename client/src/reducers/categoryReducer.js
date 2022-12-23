const initialState = [];

const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_CATEGORY": {
      return [...action.payload];
    }
    case "NEW_SET_CATEGORY": {
      return [...action.payload];
    }
    default: {
      return state;
    }
  }
};

export default categoryReducer;
