import DashboardRight from "../componets/DashboardComponenets/DashboardRight";
import DashboardMain from "../componets/DashboardComponenets/DashboardMain";

const Dashboard = () => (
  <div className="flex flex-row gap-4 p-4 h-full min-h-0">
    <DashboardMain className="flex-1 min-h-0" />
    <DashboardRight className="h-full" />
  </div>
);

export default Dashboard;
