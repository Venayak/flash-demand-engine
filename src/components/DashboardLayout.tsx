import { ReactNode } from 'react';
import DashboardSidebar from './DashboardSidebar';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full">
      <DashboardSidebar />
      {/* Main content area offset by sidebar width; sidebar handles its own collapse */}
      <main className="flex-1 ml-16 lg:ml-60 transition-all duration-300">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
