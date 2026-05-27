import React from 'react';
import { StudentProvider, useStudents } from './context/StudentContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { StudentList } from './components/StudentList';
import { ClassManager } from './components/ClassManager';
import { Login } from './components/Login';
import { StudentProfileView } from './components/StudentProfileView';

const MainAppContent: React.FC = () => {
  const { currentUser } = useAuth();
  const { activeTab } = useStudents();

  if (!currentUser) {
    return <Login />;
  }

  const renderActiveTab = () => {
    if (currentUser.role === 'student') {
      return <StudentProfileView />;
    }

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
    <div className="flex min-h-screen bg-bg-primary text-text-primary transition-colors duration-300">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Panel */}
      <main className="flex-1 flex flex-col min-h-screen ml-[260px] max-[992px]:ml-[80px] max-[576px]:ml-0 p-6 md:p-8 max-[576px]:pt-[80px] transition-[margin] duration-300">
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
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </StudentProvider>
  );
}

export default App;
