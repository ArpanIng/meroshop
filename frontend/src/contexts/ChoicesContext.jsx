import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchProductStatusChoices } from "../services/api/productApi";
import { fetchVendorStatusChoices } from "../services/api/vendorApi";

const ChoicesContext = createContext();

function ChoicesProvider({ children }) {
  const [productStatusChoices, setProductStatusChoices] = useState([]);
  const [vendorStatusChoices, setVendorStatusChoices] = useState([]);
  const [productStatusLoading, setProductStatusLoading] = useState(true);
  const [vendorStatusLoading, setvendorStatusLoading] = useState(true);

  const getProductStatusChoices = async () => {
    try {
      const data = await fetchProductStatusChoices();
      setProductStatusChoices(data.choices);
    } catch (error) {
      throw error;
    } finally {
      setProductStatusLoading(false);
    }
  };
  const getVendorStatusChoices = async () => {
    try {
      const data = await fetchVendorStatusChoices();
      setVendorStatusChoices(data.choices);
    } catch (error) {
      throw error;
    } finally {
      setvendorStatusLoading(false);
    }
  };

  useEffect(() => {
    getProductStatusChoices();
    getVendorStatusChoices();
  }, []);

  return (
    <ChoicesContext.Provider
      value={{ productStatusChoices, vendorStatusChoices }}
    >
      {children}
    </ChoicesContext.Provider>
  );
}

export default ChoicesProvider;

export const useChoices = () => {
  return useContext(ChoicesContext);
};
