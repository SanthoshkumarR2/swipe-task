import axios from "axios";

export const convertCurrency = () => {
  const apikey = process.env.SAN_API_KEY;
  const currencyConversionRates = axios.get("http://api.freecurrencyapi.com/v1/latest", {
      params: {
        apikey,
        base_currency: "USD",
        currencies: "USD,INR,GBP,JPY,CAD,AUD,SGD,CNY",
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => console.log(error));

  return {currencyConversionRates};
};

export const convertPrice = (priceUSD, current, rates) => {
  if (typeof priceUSD === 'number' && priceUSD >= 0 && current && rates && typeof rates[current] === 'number') {
    return (priceUSD * rates[current]).toFixed(2);
  }
  return '0.00'; // Return a default value if input is invalid
};


export const convertToUSD = (price, current, rates) => {
  return (price / rates[current]).toFixed(2);
};