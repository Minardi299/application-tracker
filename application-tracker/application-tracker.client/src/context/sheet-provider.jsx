import React, { createContext, useCallback, useContext, useState } from "react";

const GlobalSheetContext = createContext();

export function GlobalSheetProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [render, setRender] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const openSheet = useCallback(({ render, title, description }) => {
    setRender(() => render);
    setTitle(title || "");
    setDescription(description || "");
    setIsOpen(true);
  }, []);

  const closeSheet = useCallback(() => {
    setIsOpen(false);
    setRender(null);
    setTitle("");
    setDescription("");
  }, []);

  return (
    <GlobalSheetContext.Provider value={{ isOpen, openSheet, closeSheet, render, title, description }}>
      {children}
    </GlobalSheetContext.Provider>
  );
}

export const useGlobalSheet = () => {
  const context = useContext(GlobalSheetContext);
  if (!context) throw new Error("useGlobalSheet must be used within GlobalSheetProvider");
  return context;
};