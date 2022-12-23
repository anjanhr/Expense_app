import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import userReducer from "../reducers/userReducer";
import homeReducer from "../reducers/homeReducer";
import budgetReducer from "../reducers/budgetReducer";
import categoryReducer from "../reducers/categoryReducer";
import expenseReducer from "../reducers/expenseReducer";

const storeSetup = () => {
  const store = createStore(
    combineReducers({
      userData: userReducer,
      homeData: homeReducer,
      budgetData: budgetReducer,
      categoryData: categoryReducer,
      expenseData: expenseReducer,
    }),
    applyMiddleware(thunk)
  );
  return store;
};

export default storeSetup;
