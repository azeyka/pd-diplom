import React from "react";
import ReactDOM from "react-dom";
import { StoreProvider } from "./store/useStore";
import App from "./App";

function Main() {
  return (
    <StoreProvider>
      <App />
    </StoreProvider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Main />, rootElement);