import { useEffect, useState } from "react";
import { useLoginMutation } from "../../services/authApi";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../services/userSlice";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Phone, User } from "lucide-react";
import Input from "../../componets/common/Input";
import Button from "../../componets/common/Button";
import { validateEmail, validatePhone } from "../../utils/inputValidation";
import { showToast } from "../../componets/common/Toast";
import Logo from "../../componets/common/Logo";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const [error, setError] = useState("");

  const { user } = useSelector((state) => state.user);
  const { currentCompany } = useSelector((state) => state.user);

  useEffect(() => {
    if (user && user.id) {
      if (currentCompany) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/company-list", { replace: true });
      }
    }
  }, [user, currentCompany, navigate]);

  const determineLoginType = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;

    if (emailRegex.test(input)) return "email";
    if (phoneRegex.test(input.replace(/\s+/g, ""))) return "phone";
    return "username";
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (loginInput.trim() === "") {
        showToast("Please enter your username, email, or phone", "error");
        return;
      }

      if (password.trim() === "") {
        showToast("Please enter your password", "error");
        return;
      }

      const loginType = determineLoginType(loginInput);

      if (loginType === "email") {
        const { isValid, message } = validateEmail(loginInput);
        if (!isValid) {
          showToast(message, "error");
          return;
        }
      }

      if (loginType === "phone") {
        const { isValid, message } = validatePhone(loginInput);
        if (!isValid) {
          showToast(message, "error");
          return;
        }
      }

      const credentials = {
        [loginType === "username" ? "uname" : loginType]: loginInput,
        pwd: password,
        loginType: loginType,
      };

      const response = await login(credentials).unwrap();

      const userData = response.data.user;

      const user = {
        id: userData.id,
        role: userData.role,
        module: userData.module,
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
        userCompanies: userData.companies || [],
        currentCompany: userData.currentCompany || null,
      };

      dispatch(setUser({ user, token: response.data.accessToken }));
      localStorage.setItem("token", response.data.accessToken);
      if (response.data.refreshToken) {
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }
      localStorage.setItem("user", JSON.stringify(user));

      const primaryCompany = user.userCompanies.find(
        (company) => company.isPrimary === true
      );

      if (user.userCompanies.length === 0) {
        showToast("Please add a company", "info");
        navigate("/create-company", { replace: true });
      } else if (!primaryCompany && user.userCompanies.length > 0) {
        showToast("Select company", "warning");
        navigate("/company-list", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      showToast(err?.data?.message || "Login failed", "error");
    }
  };

  const renderLoginInput = () => {
    const loginType = determineLoginType(loginInput);
    let IconComponent = User;
    
    if (loginType === "email") IconComponent = Mail;
    else if (loginType === "phone") IconComponent = Phone;

    return (
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <IconComponent size={20} />
        </div>
        <Input
          type="text"
          value={loginInput}
          onChange={(e) => setLoginInput(e.target.value)}
          placeholder="Username, email, or phone number"
          className="pl-10"
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-(--bg-main) flex items-center justify-center p-4">
      <div className="bg-(--card-bg) p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-700 animate-fade-in">
        <div className="text-center mb-10">
          <div className="mx-auto mb-4 flex justify-center">
            <Logo
              className="w-16 h-16 rounded-2xl shadow-xl shadow-(--primary-color)/20" 
              bgClass="!bg-(--primary-color)"
              textColor="text-white"
              textClassName="text-2xl" 
            />
          </div>
          <h2 className="text-3xl font-bold text-(--text-main) tracking-tight">ASR Pharmacy</h2>
          <p className="text-(--text-main) opacity-60 mt-2 text-sm">Sign in to your account</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-xs font-bold text-(--text-main) opacity-80 mb-2 uppercase tracking-wider">
              Login
            </label>
            {renderLoginInput()}
          </div>

          <div>
            <label className="block text-xs font-bold text-(--text-main) opacity-80 mb-2 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-(--primary-color) transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/20">{error}</div>}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-(--primary-color) text-white rounded-xl hover:bg-(--primary-dark) transition-all duration-300 font-bold shadow-lg shadow-(--primary-color)/30 disabled:opacity-60"
            loading={isLoading}
          >
            Sign In
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-(--text-main) opacity-60">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-(--primary-color) hover:text-(--primary-dark) cursor-pointer font-bold underline-offset-4 hover:underline transition-all"
            >
              Start for free
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
