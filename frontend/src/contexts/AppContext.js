import { createContext } from "react";

const AppContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});

export default AppContext;
