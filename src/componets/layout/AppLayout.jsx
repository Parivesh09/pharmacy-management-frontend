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
    <div className="flex h-screen">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        mobileOpen={isMobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />
      <div className="flex-1 flex flex-col h-full">
        <Header
          isCollapsed={isCollapsed}
          onMenuClick={handleMenuClick}
        />
        <main className="flex-1 overflow-y-auto pt-14">
          <AppRoutes />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
