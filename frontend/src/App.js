import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './screens/auth/Login';
import AdminDashboard from './screens/admin/Dashboard';
import CreateExecutive from './screens/admin/CreateExecutive';
import Executive1Dashboard from './screens/executive/Ex1dashboard';
import Executive2Dashboard from './screens/executive/Ex2dashboard';
import Executive3Dashboard from './screens/executive/Ex3dashboard';
import LeadProspecting from './screens/bd/LeadProspecting';
import OutreachManagement from './screens/bd/OutreachManagement';
import DiscoveryCall from './screens/operations/DiscoveryCall';
import Navbar from './screens/component/Navbar';
import { Box } from '@mui/material';
import ExReport from './screens/executive/ExReport';

function App() {
  const name = sessionStorage.getItem('name');

  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/create-executive" element={<CreateExecutive />} />
        <Route path="/admin/ex-report" element={ <>
        <Navbar title="Executive Report" showSidebar={false} />
        <Box sx={{ p: 3 }}>
        <ExReport />
        </Box>
        </>}/>

        {/* Executive 1: Lead Prospecting */}
        <Route path="/bd1/dashboard" element={<Executive1Dashboard />} />
        <Route
          path="/executive1/lead-prospecting/:leadId?"
          element={
            <>
              <Navbar title="My Leads" showSidebar={false} />
              <Box sx={{ p: 3 }}>
                <LeadProspecting />
              </Box>
            </>
          }
        />

        {/* Executive 2: Dashboard & Outreach */}
        <Route path="/bd2/dashboard" element={<Executive2Dashboard />} />
        <Route path="/executive2/outreach" element={<Executive2Dashboard />} />
        <Route
          path="/executive2/outreach/:leadId"
          element={
            <>
              <Navbar title="My Outreach" showSidebar={false} />
              <Box sx={{ p: 3 }}>
                <OutreachManagement />
              </Box>
            </>
          }
        />

        {/* Executive 3: Dashboard & Discovery */}
        <Route path="/bd3/dashboard" element={<Executive3Dashboard />} />
        {/* renamed to `/executive3/calls` */}
        <Route path="/executive3/calls" element={<Executive3Dashboard />} />
        <Route
          path="/executive3/discovery/:leadId"
          element={
            <>
              <Navbar title="My Calls & Deals" showSidebar={false} />
              <Box sx={{ p: 3 }}>
                <DiscoveryCall />
              </Box>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
