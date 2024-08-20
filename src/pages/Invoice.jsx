import React from "react";
import InvoiceForm from "../components/InvoiceForm";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { BiArrowBack } from "react-icons/bi";
import { Link } from "react-router-dom";
import Products from "../components/Products";

/**
 * Contains two tabs - Invoice and Products
 */
const Invoice = () => {
  return (
    <div>
      <nav className="d-flex align-items-center mb-3">
        <BiArrowBack size={18} aria-label="Back" />
        <Link to="/" className="fw-bold mt-1 mx-2 text-decoration-none">
          <h5 className="mb-0">Go Back</h5>
        </Link>
      </nav>
      <Tabs defaultActiveKey="invoice" id="invoice-products-tabs" className="mb-3">
        <Tab eventKey="invoice" title="Invoice">
          <InvoiceForm />
        </Tab>
        <Tab eventKey="products" title="Products">
          <Products />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Invoice;