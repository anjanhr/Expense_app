const initialState = true;

const homeReducer = (state = initialState, action) => {
  switch (action.type) {
    case "HOME_DATA": {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};

export default homeReducer;
