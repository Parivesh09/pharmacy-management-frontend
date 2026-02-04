
import { Package } from "lucide-react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const GenericPage = (props) => {
  const user = useSelector((state) => state.user.user);
  const location = useLocation();

  if (location.pathname === "/profile") {
    return (
      <div className="p-8 max-w-2xl mx-auto animate-fade-in mt-12">
        <div className="bg-(--card-bg) rounded-3xl shadow-2xl p-10 border border-gray-100 dark:border-white/5 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-(--primary-color)/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div className="flex items-center gap-6 mb-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-(--primary-color) to-emerald-500 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-(--primary-color)/20">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-black italic tracking-tighter text-(--text-main) uppercase leading-none">User Profile</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 px-1">Identity & Access Credentials</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-(--sidebar-active-bg)/30 border border-gray-50 dark:border-white/5">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Authenticated Account</span>
              <div className="font-black text-(--text-main) text-lg">{user?.username}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-(--sidebar-active-bg)/30 border border-gray-50 dark:border-white/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Access Tier (Role)</span>
                <div className="font-black text-(--primary-color) uppercase tracking-wider">{user?.role}</div>
              </div>
              <div className="p-4 rounded-2xl bg-(--sidebar-active-bg)/30 border border-gray-50 dark:border-white/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">System Identifier</span>
                <div className="font-mono text-xs text-gray-500 font-bold">{user?.id}</div>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-(--sidebar-active-bg)/30 border border-gray-50 dark:border-white/5">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Authorized Modules</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {user?.module?.map(mod => (
                  <span key={mod} className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-black text-[9px] uppercase tracking-widest border border-emerald-500/20">{mod}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (location.pathname === "/help") {
    return (
      <div className="p-8 max-w-2xl mx-auto animate-fade-in mt-12">
        <h1 className="text-3xl font-black italic tracking-tighter text-(--text-main) mb-8 uppercase px-4">HELPDESK & DOCUMENTATION</h1>
        <div className="space-y-4">
          {[
            { q: "OPERATIONAL GUIDANCE", a: "Navigate the ecosystem using the terminal sidebar. Authorization is strictly role-based. For escalated privileges, consult the system administrator." },
            { q: "SESSION TERMINATION", a: "Access the user matrix via the avatar in the command header and select 'Logout' to securely terminate your administrative session." },
            { q: "TECHNICAL ASSISTANCE", a: "Direct all critical inquiries and system anomalies to our core support infrastructure at: support@asrpharmacy.com" }
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-(--card-bg) border border-gray-100 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-(--primary-color) mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-(--primary-color)"></span>
                {item.q}
              </h2>
              <p className="text-sm font-bold text-(--text-main) leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="p-8 max-w-2xl mx-auto animate-fade-in mt-12">
      <div className="bg-(--card-bg) rounded-3xl shadow-2xl p-10 border border-gray-100 dark:border-white/5">
        <h1 className="text-3xl font-black italic tracking-tighter text-(--text-main) mb-4 uppercase">{props.title}</h1>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
          The requested operational module [{props.title}] at node [{props.path}] is currently under development or maintenance.
        </p>
      </div>
    </div>
  );
};

export default GenericPage;