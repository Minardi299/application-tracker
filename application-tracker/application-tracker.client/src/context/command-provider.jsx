import React, { createContext, useContext, useState } from "react";

const CommandDialogContext = createContext({
  open: false,
  setOpen: () => {},
});

export function CommandDialogProvider({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <CommandDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </CommandDialogContext.Provider>
  );
}

export function useCommandDialog() {
  return useContext(CommandDialogContext);
}
