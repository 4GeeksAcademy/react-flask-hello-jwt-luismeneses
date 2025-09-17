import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Private from "./pages/Private";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Signup/>} /> 
      <Route path="/login" element={<Login />} />
      <Route path="/private" element={<Private />} />
    </Routes>
  );
};

export default App;