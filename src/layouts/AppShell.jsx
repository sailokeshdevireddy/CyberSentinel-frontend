import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import PageContainer from './PageContainer';
import './Layout.css';

const AppShell = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      <div className="main-content">
        <TopNav 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
        />
        <PageContainer>
          <Outlet />
        </PageContainer>
      </div>
    </div>
  );
};

export default AppShell;
