const initialState = {};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_USER": {
      return action.payload;
    }
    case "SHOW_USER": {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};

export default userReducer;
