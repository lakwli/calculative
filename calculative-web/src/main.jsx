import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { I18nextProvider } from 'react-i18next';
import { SimulProvider } from "./contexts/SimulContext";
import i18n from './locales/i18n'; // Import the i18n object

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SimulProvider>
    <I18nextProvider i18n={i18n}>
      <App />
      </I18nextProvider>
    </SimulProvider>
  </React.StrictMode>
);
