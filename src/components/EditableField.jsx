import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form, InputGroup, OverlayTrigger, Tooltip } from "react-bootstrap";

const EditableField = ({ cellData, onItemizedItemEdit, onProductChange }) => {
  const renderTooltip = (message) => (
    <Tooltip id="disabled-tooltip">{message}</Tooltip>
  );

  return (
    <InputGroup className="flex-nowrap">
      {cellData.leading != null && (
        <InputGroup.Text className="bg-light fw-bold border-0 text-secondary px-2">
          <span
            className="border border-2 border-secondary rounded-circle d-flex align-items-center justify-content-center small"
            style={{ width: "20px", height: "20px" }}
          >
            {cellData.leading}
          </span>
        </InputGroup.Text>
      )}
      {cellData.disabled ? (
        <OverlayTrigger
          placement="top"
          overlay={renderTooltip(
            "Rates can only be added in USD, please change the currency to USD to add or change rates"
          )}
        >
          <Form.Control
            plaintext
            readOnly
            className={cellData.textAlign}
            type={cellData.type}
            placeholder={cellData.placeholder}
            min={cellData.min}
            name={cellData.name}
            id={cellData.id}
            value={cellData.value}
            step={cellData.step}
            aria-label={cellData.name}
            onChange={onItemizedItemEdit || onProductChange}
            required
          />
        </OverlayTrigger>
      ) : (
        <Form.Control
          className={cellData.textAlign}
          type={cellData.type}
          placeholder={cellData.placeholder}
          min={cellData.min}
          name={cellData.name}
          id={cellData.id}
          value={cellData.value}
          step={cellData.step}
          aria-label={cellData.name}
          onChange={onItemizedItemEdit || onProductChange}
          required
        />
      )}
    </InputGroup>
  );
};

export default EditableField;
