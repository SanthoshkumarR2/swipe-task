import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Container from "react-bootstrap/Container";
import { Route, Routes } from "react-router-dom";
import Invoice from "./pages/Invoice";
import InvoiceList from "./pages/InvoiceList";
import { useDispatch } from "react-redux";
import { updateExchangeRates } from "./redux/currencyExchangeSlice";
import { convertCurrency } from "./utils/currencyCoverter";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const data = await convertCurrency(); // Wait for the promise to resolve

        // Ensure data and rates are valid before dispatching
        if (data && data.rates) {
          dispatch(updateExchangeRates(data.rates));
          console.log("Exchange rates:", data.rates);
        } else {
          console.error("Invalid data structure:", data);
        }
      } catch (error) {
        console.error("Failed to fetch exchange rates:", error);
      }
    };

    fetchExchangeRates();
  }, [dispatch]);

  return (
    <div className="App">
      <Container>
        <Routes>
          <Route path="/" element={<InvoiceList />} />
          <Route path="/create" element={<Invoice />} />
          <Route path="/create/:id" element={<Invoice />} />
          <Route path="/edit/:id" element={<Invoice />} />
        </Routes>
      </Container>
    </div>
  );
};

export default App;
