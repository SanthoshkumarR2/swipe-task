import React, { useState } from "react";
import { Button, Card, Col, Row, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidPencil, BiTrash } from "react-icons/bi";
import { BsEyeFill } from "react-icons/bs";
import InvoiceModal from "../components/InvoiceModal";
import { useCurrencyExchangeRates, useInvoiceListData } from "../redux/hooks";
import { useDispatch } from "react-redux";
import { deleteInvoice } from "../redux/invoicesSlice";
import { convertPrice } from "../utils/currencyCoverter";
import { newCurrencySymbol } from "../utils/newCurrencySymbol";

const InvoiceList = () => {
  const { invoiceList, getOneInvoice } = useInvoiceListData();
  const isListEmpty = invoiceList.length === 0;
  const [copyId, setCopyId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCopyClick = () => {
    if (!copyId) {
      alert("Please enter a valid invoice ID.");
      return;
    }
    const invoice = getOneInvoice(copyId);
    if (invoice) {
      navigate(`/create/${copyId}`);
    } else {
      alert("Invoice ID not found.");
    }
  };

  const handleEditClick = (id) => {
    navigate(`/edit/${id}`);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      dispatch(deleteInvoice(id));
    }
  };

  const openModal = (invoice) => {
    setSelectedInvoice(invoice);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedInvoice(null);
  };

  return (
    <div className="App d-flex justify-content-center flex-column">
      <Row>
        <Col className="mx-auto" xs={12} md={8} lg={9}>
          <h3 className="fw-bold pb-2 pb-md-4 text-center">Swipe Assignment</h3>
          <Card className="d-flex p-3 p-md-4 my-3 my-md-4">
            {isListEmpty ? (
              <div className="d-flex flex-column align-items-center">
                <h3 className="fw-bold pb-2 pb-md-4">No invoices present</h3>
                <Link to="/create">
                  <Button variant="primary">Create Invoice</Button>
                </Link>
              </div>
            ) : (
              <div className="d-flex flex-column">
                <div className="d-flex flex-row align-items-center justify-content-between">
                  <h3 className="fw-bold pb-2 pb-md-4">Invoice List</h3>
                  <div className="d-flex gap-2">
                    <Link to="/create">
                      <Button variant="primary mb-2 mb-md-4">Create Invoice</Button>
                    </Link>
                    <Button
                      variant="dark mb-2 mb-md-4"
                      onClick={handleCopyClick}
                    >
                      Copy Invoice
                    </Button>
                    <input
                      type="text"
                      value={copyId}
                      onChange={(e) => setCopyId(e.target.value)}
                      placeholder="Enter Invoice ID to copy"
                      className="bg-white border"
                      style={{ height: "50px" }}
                      aria-label="Invoice ID to copy"
                    />
                  </div>
                </div>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Invoice No.</th>
                      <th>Invoice ID</th>
                      <th>Bill To</th>
                      <th>Due Date</th>
                      <th>Total Amt.</th>
                      <th className="d-flex justify-content-evenly">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceList.map((invoice) => (
                      <InvoiceRow
                        key={invoice.id}
                        invoice={invoice}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                        onView={openModal}
                      />
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card>
          {selectedInvoice && (
            <InvoiceModal
              showModal={showModal}
              closeModal={closeModal}
              info={selectedInvoice}
              items={selectedInvoice.items}
              currency={selectedInvoice.currency}
              subTotal={selectedInvoice.subTotal}
              taxAmount={selectedInvoice.taxAmount}
              discountAmount={selectedInvoice.discountAmount}
              total={selectedInvoice.total}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

const InvoiceRow = ({ invoice, onEdit, onDelete, onView }) => {
  const { rates, current } = useCurrencyExchangeRates();

  return (
    <tr>
      <td>{invoice.invoiceNumber}</td>
      <td>{invoice.id}</td>
      <td className="fw-normal">{invoice.billTo}</td>
      <td className="fw-normal">{invoice.dateOfIssue}</td>
      <td className="fw-normal">
        {current === "USD" ? (
          <div>
            {newCurrencySymbol(current)}
            {invoice.total || 0}
          </div>
        ) : (
          <div>
            {newCurrencySymbol(current)}
            {convertPrice(invoice.total || 0, current, rates)}
          </div>
        )}
      </td>
      <td className="d-flex justify-content-evenly">
        <BiSolidPencil
          onClick={() => onEdit(invoice.id)}
          style={{ height: "33px", width: "33px", padding: "7.5px" }}
          className="text-primary mt-1 btn btn-outline-primary"
          aria-label={`Edit invoice ${invoice.id}`}
        />
        <BiTrash
          onClick={() => onDelete(invoice.id)}
          style={{ height: "33px", width: "33px", padding: "7.5px" }}
          className="text-white mt-1 btn btn-danger"
          aria-label={`Delete invoice ${invoice.id}`}
        />
        <BsEyeFill
          onClick={() => onView(invoice)}
          style={{ height: "33px", width: "33px", padding: "7.5px" }}
          className="text-white mt-1 btn btn-secondary"
          aria-label={`View details of invoice ${invoice.id}`}
        />
      </td>
    </tr>
  );
};

export default InvoiceList;
