import { combineReducers } from "@reduxjs/toolkit";
import invoicesReducer from "./invoicesSlice"; // Import your other reducers
import productsReducer from "./productsSlice";
import currencyExchangeReducer from "./currencyExchangeSlice";

const rootReducer = combineReducers({
  invoices: invoicesReducer,
  products: productsReducer,
  currencyExchange: currencyExchangeReducer,
});

export default rootReducer;