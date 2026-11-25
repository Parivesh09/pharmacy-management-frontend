import DashboardRight from "../components/DashboardComponenets/DashboardRight";
import DashboardMain from "../components/DashboardComponenets/DashboardMain";

const Dashboard = () => (
  <div className="flex flex-row gap-4 p-4 h-[calc(100vh-75px)]">
    <DashboardMain />
    <DashboardRight />
  </div>
);

export default Dashboard;
