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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">ASR</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">ASR Pharmacy</h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Login
            </label>
            {renderLoginInput()}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (default: password)"
              />
              <Button
                type="icon"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 p-1 text-blue-600 bg-blue-50 rounded focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </Button>
            </div>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-60"
            loading={isLoading}
          >
            Login
          </Button>
        </form>
        {/* 
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700 text-center">
            <strong>Demo Application:</strong> You can login with username, email, or phone number.
            Different roles display different menu items and permissions.
          </p>
          <div className="mt-2 text-xs text-blue-600">
            <p><strong>Demo Credentials:</strong></p>
            <p>• Username: admin, user, manager</p>
            <p>• Email: admin@example.com, user@example.com</p>
            <p>• Phone: +1234567890</p>
            <p>• Password: password</p>
          </div>
        </div> */}

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium underline"
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
