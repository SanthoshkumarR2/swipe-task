import { createSlice } from "@reduxjs/toolkit";

import generateRandomId from "../utils/generateRandomId";

const formatInvoice = (invoice) => {
  const itemsAndQuantity = invoice.items
    .filter((item) => item.id !== 0)
    .map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));

  const formattedInvoice = {
    ...invoice,
    items: itemsAndQuantity,
  };
  return formattedInvoice;
};

const invoicesSlice = createSlice({
  name: "invoices",
  initialState: [],
  reducers: {
    addInvoice: (state, action) => {
      state.push({ ...formatInvoice(action.payload), id: generateRandomId() });
    },
    deleteInvoice: (state, action) => {
      return state.filter((invoice) => invoice.id !== action.payload);
    },
    updateInvoice: (state, action) => {
      const index = state.findIndex((invoice) => {
        return invoice.id === action.payload.id;
      });
      if (index !== -1) {
        state[index] = formatInvoice(action.payload.updatedInvoice);
      }
    },
  },
});

export const { addInvoice, deleteInvoice, updateInvoice } =
  invoicesSlice.actions;

export const selectInvoiceList = (state) => state.invoices;

export default invoicesSlice.reducer;