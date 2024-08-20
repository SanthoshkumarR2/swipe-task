import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { BiTrash } from "react-icons/bi";
import EditableField from "./EditableField";
import { Form } from "react-bootstrap";
import { useCurrencyExchangeRates } from "../redux/hooks";
import { convertPrice } from "../utils/currencyCoverter";
import { newCurrencySymbol } from "../utils/newCurrencySymbol";

const InvoiceItem = ({
  onItemizedItemEdit,
  onOptionSelect,
  onRowAdd,
  onRowDelete,
  currency,
  items,
  options,
}) => {
  const { current, rates } = useCurrencyExchangeRates();

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price/Rate</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              onDelete={onRowDelete}
              onItemizedItemEdit={onItemizedItemEdit}
              currency={currency}
              products={options}
              onOptionSelect={onOptionSelect}
              currentCurrency={current}
              rates={rates}
            />
          ))}
        </tbody>
      </Table>
      <Button className="fw-bold" onClick={onRowAdd}>
        Add Item
      </Button>
    </div>
  );
};

const ItemRow = ({
  item,
  onDelete,
  onItemizedItemEdit,
  currency,
  products,
  onOptionSelect,
  currentCurrency,
  rates,
}) => {
  const handleSelect = (selected) => {
    onOptionSelect(item.id, selected);
  };

  return (
    <tr>
      <td>
        <Form.Select
          aria-label="Select Product"
          className="bg-light fw-bold border-0 text-secondary px-2"
          onChange={(e) => handleSelect(e.target.value)}
          value={item.productId || ""}
        >
          <option value="" disabled>
            Select a product
          </option>
          {products.map((option) => (
            <option value={option.id} key={option.id}>
              {`${option.name} - ${option.id}`}
            </option>
          ))}
        </Form.Select>
        <div className="my-1">
          <EditableField
            onItemizedItemEdit={(evt) => onItemizedItemEdit(evt, item.id)}
            cellData={{
              type: "text",
              name: "name",
              placeholder: "Item name",
              value: item.name,
              id: item.id,
            }}
          />
        </div>
        <EditableField
          onItemizedItemEdit={(evt) => onItemizedItemEdit(evt, item.id)}
          cellData={{
            type: "text",
            name: "description",
            placeholder: "Item description",
            value: item.description,
            id: item.id,
          }}
        />
      </td>
      <td>
        <EditableField
          onItemizedItemEdit={(evt) => onItemizedItemEdit(evt, item.id)}
          cellData={{
            type: "number",
            name: "quantity",
            min: 1,
            step: "1",
            value: item.quantity,
            id: item.id,
          }}
        />
      </td>
      <td>
        <EditableField
          onItemizedItemEdit={(evt) => onItemizedItemEdit(evt, item.id)}
          cellData={{
            leading: newCurrencySymbol(currentCurrency),
            type: "number",
            name: "rate",
            min: 1,
            step: "0.01",
            precision: 2,
            textAlign: "text-end",
            value: convertPrice(item.rate, currentCurrency, rates),
            id: item.id,
            disabled: currentCurrency !== "USD",
          }}
        />
      </td>
      <td className="text-center">
        <BiTrash
          onClick={() => onDelete(item.id)}
          style={{ height: "33px", width: "33px", padding: "7.5px" }}
          className="text-white mt-1 btn btn-danger"
        />
      </td>
    </tr>
  );
};

export default InvoiceItem;