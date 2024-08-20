import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import { BiPaperPlane, BiCloudDownload } from "react-icons/bi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useCurrencyExchangeRates } from "../redux/hooks";
import { newCurrencySymbol } from "../utils/newCurrencySymbol";
import { convertPrice } from "../utils/currencyCoverter";

const exportToPDF = () => {
  html2canvas(document.querySelector("#invoiceCapture")).then((canvas) => {
    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: [612, 792],
    });
    pdf.internal.scaleFactor = 1;
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("invoice-001.pdf");
  });
};

const InvoiceModal = ({ showModal, closeModal, info, items, total, taxAmount, discountAmount }) => {
  const { rates, current } = useCurrencyExchangeRates();

  const handleExport = () => {
    exportToPDF();
  };

  return (
    <div>
      <Modal show={showModal} onHide={closeModal} size="lg" centered>
        <Modal.Body>
          <div id="invoiceCapture">
            <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
              <div className="w-100">
                <h6 className="fw-bold text-secondary mb-1">Invoice ID: {info.id || ""}</h6>
                <h4 className="fw-bold my-2">{info.billFrom || "John Uberbacher"}</h4>
                <h6 className="fw-bold text-secondary mb-1">Invoice No.: {info.invoiceNumber || ""}</h6>
              </div>
              <div className="text-end ms-4">
                <h6 className="fw-bold mt-1 mb-2">Amount Due:</h6>
                <h5 className="fw-bold text-secondary">
                  {newCurrencySymbol(current)}
                  {current === "USD" ? total || 0 : convertPrice(total || 0, current, rates)}
                </h5>
              </div>
            </div>
            <div className="p-4">
              <Row className="mb-4">
                <Col md={4}>
                  <div className="fw-bold">Billed to:</div>
                  <div>{info.billTo || ""}</div>
                  <div>{info.billToAddress || ""}</div>
                  <div>{info.billToEmail || ""}</div>
                </Col>
                <Col md={4}>
                  <div className="fw-bold">Billed From:</div>
                  <div>{info.billFrom || ""}</div>
                  <div>{info.billFromAddress || ""}</div>
                  <div>{info.billFromEmail || ""}</div>
                </Col>
                <Col md={4}>
                  <div className="fw-bold mt-2">Date Of Issue:</div>
                  <div>{info.dateOfIssue || ""}</div>
                </Col>
              </Row>
              <Table className="mb-0">
                <thead>
                  <tr>
                    <th>Qty</th>
                    <th>Description</th>
                    <th className="text-end">Price</th>
                    <th className="text-end">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i}>
                      <td style={{ width: "70px" }}>{item.quantity}</td>
                      <td>{item.name} - {item.description}</td>
                      <td className="text-end" style={{ width: "100px" }}>
                        {newCurrencySymbol(current)}
                        {current === "USD" ? item.rate : convertPrice(item.rate, current, rates)}
                      </td>
                      <td className="text-end" style={{ width: "100px" }}>
                        {newCurrencySymbol(current)}
                        {current === "USD" ? item.rate * item.quantity : convertPrice(item.rate * item.quantity, current, rates)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Table>
                <tbody>
                  <tr>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold" style={{ width: "100px" }}>Tax</td>
                    <td className="text-end" style={{ width: "100px" }}>
                      {newCurrencySymbol(current)}
                      {current === "USD" ? taxAmount || 0 : convertPrice(taxAmount || 0, current, rates)}
                    </td>
                  </tr>
                  {discountAmount !== 0.0 && (
                    <tr className="text-end">
                      <td></td>
                      <td className="fw-bold" style={{ width: "100px" }}>Discount</td>
                      <td className="text-end" style={{ width: "100px" }}>
                        {newCurrencySymbol(current)}
                        {current === "USD" ? discountAmount || 0 : convertPrice(discountAmount || 0, current, rates)}
                      </td>
                    </tr>
                  )}
                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold" style={{ width: "100px" }}>Total</td>
                    <td className="text-end" style={{ width: "100px" }}>
                      {newCurrencySymbol(current)}
                      {current === "USD" ? total || 0 : convertPrice(total || 0, current, rates)}
                    </td>
                  </tr>
                </tbody>
              </Table>
              {info.notes && (
                <div className="bg-light py-3 px-4 rounded">
                  {info.notes}
                </div>
              )}
            </div>
          </div>
          <div className="pb-4 px-4">
            <Row>
              <Col md={6}>
                <Button variant="primary" className="d-block w-100" onClick={handleExport}>
                  <BiPaperPlane style={{ width: "15px", height: "15px", marginTop: "-3px" }} className="me-2" />
                  Send Invoice
                </Button>
              </Col>
              <Col md={6}>
                <Button variant="outline-primary" className="d-block w-100 mt-3 mt-md-0" onClick={handleExport}>
                  <BiCloudDownload style={{ width: "16px", height: "16px", marginTop: "-3px" }} className="me-2" />
                  Download Copy
                </Button>
              </Col>
            </Row>
          </div>
        </Modal.Body>
      </Modal>
      <hr className="mt-4 mb-3" />
    </div>
  );
};

export default InvoiceModal;
