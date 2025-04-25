import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './screens/auth/Login';
import AdminDashboard from './screens/admin/Dashboard';
import CreateExecutive from './screens/admin/CreateExecutive';
import Executive1Dashboard from './screens/executive/Ex1dashboard';
import Executive2Dashboard from './screens/executive/Ex2dashboard';
import Executive3Dashboard from './screens/executive/Ex3dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/create-executive" element={<CreateExecutive />} />
        <Route path="/bd1/dashboard" element={<Executive1Dashboard />} />
        <Route path="/bd2/dashboard" element={<Executive2Dashboard />} />
        <Route path="/bd3/dashboard" element={<Executive3Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
