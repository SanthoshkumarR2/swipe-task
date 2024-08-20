import { nanoid } from "@reduxjs/toolkit";

const generateRandomId = () => {
  const randomId = nanoid(7);

  return randomId;
};

export default generateRandomId;