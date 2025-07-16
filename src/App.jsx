// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashbboard from './pages/Dashbboard';
import AdminDashboard from './pages/AdminDashboard';


function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login />} /> {/* fallback */}
      <Route path="/dashboard" element={<Dashbboard/>} />
     

<Route path="/admin" element={<AdminDashboard />} />


    </Routes>
  );
}

export default App;
