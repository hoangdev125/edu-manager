import React from 'react';
import { StudentProvider, useStudents } from './context/StudentContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { StudentList } from './components/StudentList';
import { ClassManager } from './components/ClassManager';
import './App.css';

const MainAppContent: React.FC = () => {
  const { activeTab } = useStudents();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'students':
        return <StudentList />;
      case 'classes':
        return <ClassManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Panel */}
      <main className="main-content">
        {/* Dynamic Header */}
        <Header />

        {/* Dynamic Section Contents */}
        {renderActiveTab()}
      </main>
    </div>
  );
};

function App() {
  return (
    <StudentProvider>
      <MainAppContent />
    </StudentProvider>
  );
}

export default App;
