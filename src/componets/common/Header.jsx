import { useSelector, useDispatch } from "react-redux";
import { logout as logoutAction } from "../../services/userSlice";
import { useNavigate } from "react-router-dom";
import { User, LogOut, HelpCircle, Menu, Bell, Settings } from "lucide-react";
import { useState, useRef, useEffect, use } from "react";
import Button from "./Button";
import Card from "./Card";
import IconButton from "./IconButton";
import Logo from "./Logo";
import { useLogoutMutation } from "../../services/authApi";

export default function DefaultHeader({ title, onMenuClick }) {
  const user = useSelector((state) => state.user.user);
  const { currentCompany } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cardOpen, setCardOpen] = useState(false);
  const cardRef = useRef(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef(null);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setCardOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutsideSettings = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideSettings);
    return () =>
      document.removeEventListener("mousedown", handleClickOutsideSettings);
  }, []);

  const handleLogout = async () => {
    try {
      const data = await logout().unwrap();

      if (data.success) {
        dispatch(logoutAction());
        window.location.reload();
      }
    } catch (error) {
      dispatch(logoutAction());
      window.location.reload();
      console.error("Logout failed:", error);
    } finally {
      setCardOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-(--header-bg) p-4 border-b border-l border-white/10 flex items-center justify-between w-full min-h-[56px] text-white">
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        <button
          className="rounded-md hover:bg-white/10 flex-shrink-0 cursor-pointer p-1"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
        <Logo />
        <div className="font-bold text-base md:text-lg text-white truncate max-w-[120px] sm:max-w-[200px] md:max-w-[300px] lg:max-w-none">
          <span className="truncate block">{currentCompany?.companyName}</span>
        </div>
      </div>

      <div className="flex-1 flex justify-center items-center min-w-0"></div>

      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
        <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-white/90 bg-white/10 px-2 py-1 rounded truncate max-w-[120px] md:max-w-none border border-white/20">
          <span className="hidden sm:inline">Financial Year:</span>
          <span className="font-semibold text-white truncate">
             {currentCompany?.financialYearFrom} - {currentCompany?.financialYearTo}
          </span>
        </div>

        <div className="relative md:hidden" ref={settingsRef}>
          <IconButton
            icon={Settings}
            onClick={() => setSettingsOpen((prev) => !prev)}
            variant="ghost"
            size="sm"
            title="Settings"
            className="text-white hover:bg-white/10"
          />
          {settingsOpen && (
            <div className="absolute right-0 mt-3 w-44 bg-white rounded-xl shadow-2xl z-50 border border-gray-100 p-2 animate-fade-in flex flex-col gap-2">
              <button
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-teal-50 transition text-gray-700"
                onClick={() => navigate('/settings/theme')}
              >
                <Palette className="w-5 h-5 text-teal-500" /> Theme
              </button>
              <button
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-teal-50 transition text-gray-700"
              >
                <HelpCircle className="w-5 h-5 text-teal-500" /> Help
              </button>
            </div>
          )}
        </div>

        <IconButton
          icon={Settings}
          variant="ghost"
          size="sm"
          title="Theme Settings"
          className="text-white hover:bg-white/10 hidden md:inline-flex"
          onClick={() => navigate('/settings/theme')}
        />
        <IconButton
          icon={HelpCircle}
          variant="ghost"
          size="sm"
          title="Help"
          className="text-white hover:bg-white/10 hidden md:inline-flex"
        />
        <IconButton
          icon={Bell}
          variant="ghost"
          size="sm"
          title="Notifications"
          className="text-white hover:bg-white/10 hidden md:inline-flex"
        />

        <div className="relative" ref={cardRef}>
          <IconButton
            icon={User}
            onClick={() => setCardOpen((prev) => !prev)}
            variant="default"
            size="sm"
            title="User menu"
            className="bg-gray-300 border-2 border-white shadow hover:text-blue-600 hover:border-blue-600"
          />
          {cardOpen && (
            <Card className="absolute right-0 mt-3 w-72 md:w-80 bg-white rounded-xl shadow-2xl z-50 border border-gray-100 p-0 animate-fade-in">
              <div className="flex flex-col items-center p-6 pb-4 border-b border-gray-100">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full flex items-center justify-center mb-2">
                  <User className="w-10 h-10 text-gray-400" />
                </div>
                <div className="text-gray-800 font-semibold text-lg mb-1 truncate w-full text-center">
                  User Name: {user?.username || "-"}
                </div>
                <div className="text-xs text-gray-500 mb-2">Demo Licence</div>
                <div className="text-center font-bold text-lg text-gray-800 mb-1 truncate w-full">
                  {currentCompany?.companyName || "-"}
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  F.Y.: {currentCompany?.financialYearFrom} to{" "}
                  {currentCompany?.financialYearTo}
                </div>
                <div className="text-xs text-center  text-gray-500 mb-2 w-full">
                  {currentCompany?.address} {currentCompany?.state}{" "}
                  {currentCompany?.country} {currentCompany?.pinCode}
                </div>
                <Button
                  onClick={() => navigate("/company-list")}
                  className="mt-2 mb-2 px-6 py-2 bg-teal-600 text-white rounded shadow hover:bg-teal-700 transition cursor-pointer"
                >
                  Switch
                </Button>
              </div>
              <div className="flex flex-col items-center p-4">
                <Button
                  variant="danger"
                  className="flex items-center gap-2 font-semibold px-4 py-2 rounded cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5" /> Logout
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </header>
  );
}
