import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Dashboard from "@/pages/Dashboard.tsx";
import Premium from "@/pages/Premium.tsx";
import Subscribe from "@/pages/Subscribe.tsx";
import Features from "@/pages/Features.tsx";

export default function App() {
  return (
    <main className="bg-background min-h-screen w-full">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/subscribe" element={<Subscribe />} />
        <Route path="/features" element={<Features />} />
      </Routes>
    </main>
  );
}
