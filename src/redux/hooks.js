import { useSelector } from "react-redux";
import { selectInvoiceList } from "./invoicesSlice";
import { selectProductList } from "./productsSlice";
import {
  selectCurrentCurrency,
  selectExchangeRates,
} from "./currencyExchangeSlice";

// Populate item ids with corresponding products
const populateInvoiceWithProducts = (invoice, productsList) => {
  const productsInInvoice = [];
  const idQuantity = {}; // For O(1) data access

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
  return { ...invoice, items: productsInInvoice };
};

export const useInvoiceListData = () => {
  const invoices = useSelector(selectInvoiceList);
  const productsList = useSelector(selectProductList);

  const getOneInvoice = (receivedId) => {
    const invoice =
      invoiceList.find(
        (invoice) => invoice.id.toString() === receivedId.toString()
      ) || null;

    return populateInvoiceWithProducts(invoice, productsList);
  };

  const invoiceList = invoices.map((invoice) =>
    populateInvoiceWithProducts(invoice, productsList)
  );

  const listSize = invoiceList.length;

  return {
    invoiceList,
    getOneInvoice,
    listSize,
  };
};

export const useProductsListData = () => {
  const productsList = useSelector(selectProductList);

  return {
    productsList,
  };
};

export const useCurrencyExchangeRates = () => {
  const current = useSelector(selectCurrentCurrency);
  const rates = useSelector(selectExchangeRates);
  return { current, rates };
};