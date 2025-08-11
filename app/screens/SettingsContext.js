import { createContext } from "react";

const SettingsContext = createContext({
  core: "Softcore",
  setCore: () => {},
  ladder: "Ladder",
  setLadder: () => {},
});

export default SettingsContext;
