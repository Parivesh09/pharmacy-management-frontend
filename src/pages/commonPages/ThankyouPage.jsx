import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CheckCircle,
  Mail,
  Phone,
  Download,
  Calendar,
  ShoppingCart,
  User,
  FileText,
  Home,
  ArrowRight,
  Clock,
  Gift,
} from "lucide-react";
import Button from "../../components/common/Button";

const ThankyouPage = ({
  title,
  subtitle,
  message,

  icon: CustomIcon,
  iconColor = "text-green-500",
  bgGradient = "from-green-50 to-blue-50",

  primaryAction,
  secondaryAction,
  additionalActions = [],

  showOrderDetails = false,
  orderDetails = {},
  showNextSteps = false,
  nextSteps = [],
  showContactInfo = false,
  contactInfo = {},

  autoRedirect = false,
  redirectTo = "/",
  redirectDelay = 10000,

  children,

  showFooter = true,
  footerText,
  footerLinks = [],
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = React.useState(
    Math.ceil(redirectDelay / 1000)
  );

  const locationState = location.state || {};
  const mergedOrderDetails = { ...orderDetails, ...locationState.orderDetails };
  const mergedContactInfo = { ...contactInfo, ...locationState.contactInfo };

  React.useEffect(() => {
    if (autoRedirect && redirectTo) {
      const interval = setInterval(() => {
        setCountdown((prev) => (prev > 1 ? prev - 1 : 1));
      }, 1000);

      const timer = setTimeout(() => {
        navigate(redirectTo, { replace: true });
      }, redirectDelay);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [autoRedirect, redirectTo, redirectDelay, navigate]);

  const getDefaultIcon = () => {
    if (CustomIcon) return CustomIcon;

    const path = location.pathname.toLowerCase();
    if (path.includes("order") || path.includes("purchase"))
      return ShoppingCart;
    if (path.includes("appointment") || path.includes("booking"))
      return Calendar;
    if (path.includes("registration") || path.includes("signup")) return User;
    if (path.includes("contact") || path.includes("message")) return Mail;
    if (path.includes("download")) return Download;

    return CheckCircle;
  };

  const IconComponent = getDefaultIcon();

  const formatOrderDetails = () => {
    if (!showOrderDetails || !Object.keys(mergedOrderDetails).length)
      return null;

    return (
      <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
        <div className="space-y-2">
          {mergedOrderDetails.orderId && (
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-medium">{mergedOrderDetails.orderId}</span>
            </div>
          )}
          {mergedOrderDetails.total && (
            <div className="flex justify-between">
              <span className="text-gray-600">Total:</span>
              <span className="font-medium text-green-600">
                {mergedOrderDetails.total}
              </span>
            </div>
          )}
          {mergedOrderDetails.items && (
            <div className="pt-2">
              <span className="text-gray-600">Items:</span>
              <ul className="mt-1 space-y-1">
                {mergedOrderDetails.items.map((item, index) => (
                  <li key={index} className="flex justify-between text-sm">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {mergedOrderDetails.deliveryDate && (
            <div className="flex justify-between">
              <span className="text-gray-600">Expected Delivery:</span>
              <span className="font-medium">
                {mergedOrderDetails.deliveryDate}
              </span>
            </div>
          )}
          {mergedOrderDetails.trackingNumber && (
            <div className="flex justify-between">
              <span className="text-gray-600">Tracking Number:</span>
              <span className="font-medium font-mono text-sm">
                {mergedOrderDetails.trackingNumber}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const formatNextSteps = () => {
    if (!showNextSteps || !nextSteps.length) return null;

    return (
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="mr-2" size={20} />
          What's Next?
        </h3>
        <div className="space-y-3">
          {nextSteps.map((step, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="text-gray-700">{step.text}</p>
                {step.eta && (
                  <p className="text-sm text-gray-500 mt-1">ETA: {step.eta}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const formatContactInfo = () => {
    if (!showContactInfo) return null;

    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
        <div className="space-y-3">
          {mergedContactInfo.email && (
            <div className="flex items-center space-x-3">
              <Mail className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-600">Email us at:</p>
                <a
                  href={`mailto:${mergedContactInfo.email}`}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {mergedContactInfo.email}
                </a>
              </div>
            </div>
          )}
          {mergedContactInfo.phone && (
            <div className="flex items-center space-x-3">
              <Phone className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-600">Call us at:</p>
                <a
                  href={`tel:${mergedContactInfo.phone}`}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {mergedContactInfo.phone}
                </a>
              </div>
            </div>
          )}
          {mergedContactInfo.hours && (
            <div className="flex items-center space-x-3">
              <Clock className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-600">Support Hours:</p>
                <p className="font-medium">{mergedContactInfo.hours}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${bgGradient} flex items-center justify-center p-4`}
    >
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-8">
        {/* Header Section */}
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div
              className={`w-20 h-20 ${iconColor} bg-opacity-10 rounded-full flex items-center justify-center`}
            >
              <IconComponent size={40} className={iconColor} />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {title || "Thank You!"}
          </h1>

          {subtitle && (
            <h2 className="text-xl text-gray-600 mb-2">{subtitle}</h2>
          )}

          <p className="text-gray-600 leading-relaxed mb-2">
            {message ||
              "Your request has been processed successfully. We appreciate your business!"}
          </p>

          {/* Countdown placed here */}
          {autoRedirect && (
            <a className="text-sm text-red-500 mt-2">
              click here to go to login page. Redirecting automatically in {countdown}{" "}
              secs{" "}
            </a>
          )}
        </div>

        {/* Custom Content */}
        {children && <div className="mb-8">{children}</div>}

        {/* Content Sections */}
        <div className="space-y-6 mb-8">
          {formatOrderDetails()}
          {/* {formatNextSteps()} */}
          {formatContactInfo()}
        </div>

        {/* Actions */}
        <div className="space-y-4">
          {/* Primary Action */}
          {primaryAction && (
            <Button
              onClick={
                primaryAction.onClick ||
                (() => navigate(primaryAction.href || "/"))
              }
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
            >
              <span>{primaryAction.text}</span>
              {primaryAction.icon && <primaryAction.icon size={20} />}
            </Button>
          )}

          {/* Secondary Action */}
          {secondaryAction && (
            <Button
              onClick={
                secondaryAction.onClick ||
                (() => navigate(secondaryAction.href || "/"))
              }
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
            >
              <span>{secondaryAction.text}</span>
              {secondaryAction.icon && <secondaryAction.icon size={20} />}
            </Button>
          )}

          {/* Additional Actions */}
          {additionalActions.length > 0 && (
            <div className="flex flex-wrap gap-3 justify-center">
              {additionalActions.map((action, index) => (
                <Button
                  key={index}
                  variant="primary"
                  onClick={
                    action.onClick || (() => navigate(action.href || "/"))
                  }
                >
                  {action.icon && <action.icon size={16} />}
                  <span>{action.text}</span>
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Auto Redirect Indicator */}
        {autoRedirect && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Redirecting automatically in {Math.ceil(redirectDelay / 1000)}{" "}
              seconds...
            </p>
          </div>
        )}

        {/* Footer */}
        {showFooter && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              {footerText && (
                <p className="text-sm text-gray-600 mb-3">{footerText}</p>
              )}
              {footerLinks.length > 0 && (
                <div className="flex flex-wrap justify-center gap-4">
                  {footerLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      onClick={link.onClick}
                      className="text-sm text-blue-600 hover:text-blue-700 underline"
                    >
                      {link.text}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThankyouPage;
