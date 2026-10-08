import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import PageContainer from './PageContainer';
import './Layout.css';

const AppShell = () => {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <TopNav />
        <PageContainer>
          <Outlet />
        </PageContainer>
      </div>
    </div>
  );
};

export default AppShell;
