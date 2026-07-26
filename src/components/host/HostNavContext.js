import { createContext } from "react";

export const HostNavContext = createContext({
  onNext: null,
  onBack: null,
  inWizard: false,
  index: 0,
  total: 1,
});
