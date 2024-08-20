import { useSelector } from "react-redux";
import { selectInvoiceList } from "./invoicesSlice";
import { selectProductsList } from "./productsSlice";
import {
  selectCurrentCurrency,
  selectExchangeRates,
} from "./currencyExchangeSlice";

// Populate item ids with corresponding products
const populateInvoiceWithProducts = (invoice, productsList) => {
  const productsInInvoice = [];
  const idQuantity = {}; // For O(1) data access

  if (invoice && invoice.items) {
    invoice.items.forEach((item) => {
      idQuantity[item.id] = item.quantity;
    });

    productsList.forEach((product) => {
      if (idQuantity.hasOwnProperty(product.id)) {
        productsInInvoice.push({
          ...product,
          quantity: idQuantity[product.id],
        });
      }
    });
  }

  return { ...invoice, items: productsInInvoice };
};

export const useInvoiceListData = () => {
  const invoices = useSelector(selectInvoiceList);
  const productsList = useSelector(selectProductsList);

  const getOneInvoice = (receivedId) => {
    if (!receivedId) {
      console.error("Received ID is undefined or null");
      return null;
    }

    const invoice = invoices.find(
      (invoice) => invoice.id.toString() === receivedId.toString()
    );

    if (!invoice) {
      console.error(`Invoice with ID ${receivedId} not found`);
      return null;
    }

    return populateInvoiceWithProducts(invoice, productsList);
  };

  const populatedInvoiceList = invoices.map((invoice) =>
    populateInvoiceWithProducts(invoice, productsList)
  );

  const listSize = populatedInvoiceList.length;

  return {
    invoiceList: populatedInvoiceList,
    getOneInvoice,
    listSize,
  };
};

export const useProductsListData = () => {
  const productsList = useSelector(selectProductsList);

  return {
    productsList,
  };
};

export const useCurrencyExchangeRates = () => {
  const current = useSelector(selectCurrentCurrency);
  const rates = useSelector(selectExchangeRates);
  return { current, rates };
};
