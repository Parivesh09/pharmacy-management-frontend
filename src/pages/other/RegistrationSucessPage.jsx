import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ThankyouPage from '../commonPages/ThankyouPage';
import { User, Mail, RefreshCw, ArrowRight, Home, FileText } from 'lucide-react';

const RegistrationSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  
  const { userInfo, registrationId, verificationEmailSent } = location.state || {};
  
  useEffect(() => {
    if (!userInfo) {
      navigate('/signup', { replace: true });
    }
  }, [userInfo, navigate]);

  const handleResendVerification = async () => {
    setResendLoading(true);
    try {
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (error) {
      console.error('Failed to resend verification email:', error);
    } finally {
      setResendLoading(false);
    }
  };

  if (!userInfo) {
    return null; // or loading spinner
  }

  const nextSteps = [
    { 
      text: "Check your email inbox and spam folder", 
      eta: "Within 5 minutes" 
    },
    { 
      text: "Click the verification link in the email", 
      eta: "Required for account activation" 
    },
    { 
      text: "Complete your profile setup", 
      eta: "After email verification" 
    },
    { 
      text: "Start managing your pharmacy business", 
      eta: "Once profile is complete" 
    }
  ];

  const contactInfo = {
    email: "support@asrpharma.com",
    phone: "+1-800-ASR-HELP",
    hours: "Mon-Fri 9AM-6PM EST"
  };

  return (
    <ThankyouPage
      title="Welcome to ASR Pharma!"
      subtitle={`Hello ${userInfo.firstName}, your account has been created successfully`}
      message="We're excited to have you on board! To complete your registration and secure your account, please verify your email address."
      
      autoRedirect

      redirectTo='/login'
      icon={User}
      iconColor="text-blue-500"
      bgGradient="from-blue-50 to-purple-50"
      
      showNextSteps={true}
      nextSteps={nextSteps}
      
      showContactInfo={true}
      contactInfo={contactInfo}
      
      additionalActions={[
        { 
          text: "Go to Login", 
          href: "/login", 
          icon: ArrowRight 
        },
        { 
          text: "Back to Home", 
          href: "/", 
          icon: Home 
        }
      ]}
      
      footerText="Need help with verification? Our support team is here to assist you."
      footerLinks={[
        { text: "FAQ", href: "/faq" },
        { text: "Contact Support", href: "/contact" },
        { text: "Resend Instructions", onClick: handleResendVerification }
      ]}
    >
      {/* Custom registration details section */}
      <div className="bg-(--sidebar-active-bg)/30 border border-(--primary-color)/5 rounded-3xl p-8 mb-8 animate-fade-in shadow-xl">
        <h3 className="text-xl font-black italic tracking-tighter text-(--text-main) mb-6 flex items-center gap-3">
          <User className="text-(--primary-color)" size={24} />
          REGISTRATION PROFILE
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-white/5">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Owner Name</span>
            <span className="font-bold text-(--text-main)">{userInfo.firstName} {userInfo.lastName}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-white/5">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Account Email</span>
            <span className="font-bold text-(--text-main)">{userInfo.email}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-white/5">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone Number</span>
            <span className="font-bold text-(--text-main)">+91 {userInfo.phone}</span>
          </div>
          {registrationId && (
            <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-white/5">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">System Trace ID</span>
              <span className="font-bold font-mono text-sm text-(--primary-color)">{registrationId}</span>
            </div>
          )}
          <div className="flex justify-between items-center py-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Account Status</span>
            <span className="inline-flex items-center px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-orange-500/10 text-orange-600 border border-orange-500/20">
              Awaiting Verification
            </span>
          </div>
        </div>
      </div>

      {/* Email verification status */}
      <div className="bg-(--primary-color)/5 border border-(--primary-color)/10 rounded-3xl p-6 mb-8 shadow-inner">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-(--primary-color)/10 rounded-2xl">
            <Mail className="h-6 w-6 text-(--primary-color)" />
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-(--text-main) mb-2">
              Verification Action Required
            </h4>
            <p className="text-sm text-(--text-main)/60 leading-relaxed">
              We've dispatched a secure activation link to <strong className="text-(--text-main)">{userInfo.email}</strong>. 
              Please authenticate your identity by clicking the link to unlock your dashboard.
            </p>
            {resendSuccess && (
              <p className="mt-3 text-xs text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                Instructions resent successfully
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Important notes */}
      <div className="bg-(--sidebar-active-bg)/30 rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-lg">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 border-b border-gray-50 dark:border-white/5 pb-3">Safety & Process Guidelines</h4>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <li className="flex items-center gap-3 group">
            <div className="w-1.5 h-1.5 bg-(--primary-color) rounded-full shadow-[0_0_8px_var(--primary-color)] transition-all group-hover:scale-150"></div>
            <span className="text-xs font-bold text-(--text-main)/70 uppercase tracking-tight">Token validity: 24 Hours</span>
          </li>
          <li className="flex items-center gap-3 group">
            <div className="w-1.5 h-1.5 bg-(--primary-color) rounded-full shadow-[0_0_8px_var(--primary-color)] transition-all group-hover:scale-150"></div>
            <span className="text-xs font-bold text-(--text-main)/70 uppercase tracking-tight">Monitor Inbox & Junk folders</span>
          </li>
          <li className="flex items-center gap-3 group">
            <div className="w-1.5 h-1.5 bg-(--primary-color) rounded-full shadow-[0_0_8px_var(--primary-color)] transition-all group-hover:scale-150"></div>
            <span className="text-xs font-bold text-(--text-main)/70 uppercase tracking-tight">Manual resend supported</span>
          </li>
          <li className="flex items-center gap-3 group">
            <div className="w-1.5 h-1.5 bg-(--primary-color) rounded-full shadow-[0_0_8px_var(--primary-color)] transition-all group-hover:scale-150"></div>
            <span className="text-xs font-bold text-(--text-main)/70 uppercase tracking-tight">Full access post activation</span>
          </li>
        </ul>
      </div>
    </ThankyouPage>
  );
};

export default RegistrationSuccessPage;