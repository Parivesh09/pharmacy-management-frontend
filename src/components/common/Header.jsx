import { useSelector, useDispatch } from "react-redux";
import { logout as logoutAction } from "../../services/userSlice";
import { useNavigate } from "react-router-dom";
import { User, LogOut, HelpCircle, Menu, Bell, Settings, Sun, Moon, Palette } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Button from "./Button";
import Card from "./Card";
import IconButton from "./IconButton";
import Logo from "./Logo";
import { useLogoutMutation } from "../../services/authApi";
import { setTheme } from "../../services/userSlice";
import { generateThemeFromPrimary } from "../../utils/themeManager";

export default function DefaultHeader({ title, onMenuClick }) {
  const user = useSelector((state) => state.user.user);
  const { currentCompany } = useSelector((state) => state.user);
  const theme = useSelector((state) => state.user.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cardOpen, setCardOpen] = useState(false);
  const cardRef = useRef(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef(null);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const toggleDarkMode = () => {
    const newMode = theme.mode === 'dark' ? 'light' : 'dark';
    const newTheme = generateThemeFromPrimary(theme.primaryColor, newMode);
    dispatch(setTheme(newTheme));
  };

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

  const isDark = theme.mode === 'dark';

  return (
    <header className="sticky top-0 z-50 px-4 border-b flex items-center justify-between w-full min-h-[56px] transition-colors duration-300"
      style={{ 
        backgroundColor: 'var(--header-bg)',
        borderColor: 'var(--sidebar-border)',
        color: 'var(--header-text)'
      }}
    >
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        <button
          className="rounded-md flex-shrink-0 cursor-pointer p-2 transition-colors"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
          style={{ 
            color: 'var(--header-text)',
            backgroundColor: 'transparent'
          }}
        >
          <Menu className="w-6 h-6" />
        </button>
        <Logo />
        <div className="font-bold text-base md:text-lg truncate max-w-[120px] sm:max-w-[200px] md:max-w-[300px] lg:max-w-none">
          <span className="truncate block" style={{ color: 'var(--header-text)' }}>{currentCompany?.companyName}</span>
        </div>
      </div>

      <div className="flex-1 flex justify-center items-center min-w-0"></div>

      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
        <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 py-1 rounded truncate max-w-[120px] md:max-w-none border"
          style={{ 
            color: 'var(--header-text)',
            backgroundColor: 'var(--button-secondary-bg)',
            borderColor: 'var(--sidebar-border)',
            opacity: 0.9
          }}
        >
          <span className="hidden sm:inline" style={{ color: 'var(--text-muted)' }}>FY:</span>
          <span className="font-semibold truncate" style={{ color: 'var(--header-text)' }}>
            {currentCompany?.financialYearFrom} - {currentCompany?.financialYearTo}
          </span>
        </div>

        <IconButton
          icon={theme.mode === 'dark' ? Sun : Moon}
          variant="ghost"
          size="sm"
          title={theme.mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="text-white hover:bg-white/10"
          onClick={toggleDarkMode}
        />

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
            <div className="absolute right-0 mt-3 w-44 rounded-xl shadow-2xl z-50 p-2 animate-fade-in flex flex-col gap-2"
              style={{ 
                backgroundColor: 'var(--modal-bg)',
                borderColor: 'var(--modal-border)',
                borderWidth: '1px',
                borderStyle: 'solid'
              }}
            >
              <button
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-sidebar-hover transition text-sidebar-text"
                onClick={() => navigate('/settings/theme')}
              >
                <Palette className="w-5 h-5" style={{ color: 'var(--primary-color)' }} /> Theme
              </button>
              <button
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-sidebar-hover transition text-sidebar-text"
              >
                <HelpCircle className="w-5 h-5" style={{ color: 'var(--primary-color)' }} /> Help
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
            className="shadow"
            style={{
              backgroundColor: 'var(--primary-color)',
              color: 'var(--button-primary-text)',
              borderColor: 'var(--primary-color)'
            }}
          />
          {cardOpen && (
            <Card className="absolute right-0 mt-3 w-72 md:w-80 rounded-xl shadow-2xl z-50 p-0 animate-fade-in"
              style={{ 
                backgroundColor: 'var(--modal-bg)',
                borderColor: 'var(--modal-border)',
                borderWidth: '1px',
                borderStyle: 'solid'
              }}
            >
              <div className="flex flex-col items-center p-6 pb-4 border-b"
                style={{ borderColor: 'var(--card-border)' }}
              >
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-2"
                  style={{ backgroundColor: 'var(--primary-color)' }}
                >
                  <User className="w-10 h-10" style={{ color: 'var(--button-primary-text)' }} />
                </div>
                <div className="font-semibold text-lg mb-1 truncate w-full text-center" style={{ color: 'var(--text-main)' }}>
                  {user?.username || "-"}
                </div>
                <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Demo Licence</div>
                <div className="text-center font-bold text-lg mb-1 truncate w-full" style={{ color: 'var(--text-main)' }}>
                  {currentCompany?.companyName || "-"}
                </div>
                <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                  FY: {currentCompany?.financialYearFrom} to {currentCompany?.financialYearTo}
                </div>
                <div className="text-xs text-center text-muted mb-2 w-full" style={{ color: 'var(--text-muted)' }}>
                  {currentCompany?.address} {currentCompany?.state} {currentCompany?.country} {currentCompany?.pinCode}
                </div>
                <Button
                  onClick={() => navigate("/company-list")}
                  className="mt-2 mb-2 px-6 py-2 rounded shadow transition cursor-pointer"
                  style={{
                    backgroundColor: 'var(--primary-color)',
                    color: 'var(--button-primary-text)'
                  }}
                >
                  Switch Company
                </Button>
              </div>
              <div className="flex flex-col items-center p-4">
                <Button
                  variant="danger"
                  className="flex items-center gap-2 font-semibold px-4 py-2 rounded cursor-pointer w-full justify-center"
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