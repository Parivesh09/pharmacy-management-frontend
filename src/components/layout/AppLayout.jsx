import Sidebar from "../common/Sidebar";
import AppRoutes from "../../routes/Routes";
import Header from "../common/Header";
import { useState } from "react";

const AppLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    if (window.matchMedia('(max-width: 1023px)').matches) {
      setMobileSidebarOpen(true);
    } else {
      setIsCollapsed((prev) => !prev);
    }
  };

  return (
    <div className="flex h-full">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        mobileOpen={isMobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />
      <main className="flex-1 overflow-y-auto">
        <Header
          isCollapsed={isCollapsed}
          onMenuClick={handleMenuClick}
        />
        <AppRoutes />
      </main>
    </div>
  );
};

export default AppLayout;
