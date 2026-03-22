import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./global.css";
import App from "./App.tsx";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/700.css";
import {AuthProvider} from "@/store/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
  </AuthProvider>
);
