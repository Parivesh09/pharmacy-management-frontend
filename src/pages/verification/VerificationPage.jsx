import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useVerifyEmailMutation } from "../../services/authApi";

const VerificationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const verificationCode = searchParams.get("code");

  const [verifyEmail, { isLoading, isSuccess, isError, error }] =
    useVerifyEmailMutation();

  useEffect(() => {
    if (verificationCode && !isError) {
      verifyEmail({ code: verificationCode });
    }
  }, [verificationCode, verifyEmail]);

  useEffect(() => {
    if (isError) {
      navigate("/login", { replace: true });
      console.error("Email verification failed:", error);
    }
  }, [isError, navigate, error]);

  return (
    <div className="h-screen flex items-center justify-center bg-(--bg-main) p-6">
      <div className="max-w-md w-full bg-(--card-bg) px-8 py-12 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/5 text-center transition-all duration-500">
        {isLoading && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 border-4 border-(--primary-color)/20 border-t-(--primary-color) rounded-full animate-spin"></div>
            </div>
            <p className="text-xl font-black italic tracking-tighter text-(--text-main) uppercase">
              Authenticating Credentials...
            </p>
          </div>
        )}

        {isSuccess && (
          <div className="animate-fade-in shadow-xl shadow-(--primary-color)/5">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
              <span className="text-4xl">✅</span>
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter text-(--text-main) mb-3 uppercase">Email Secured</h1>
            <p className="text-sm text-(--text-main)/60 font-bold uppercase tracking-widest mb-10">
              Identity verified. Your account is now active.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-4 bg-(--primary-color) text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-(--primary-color)/30 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Access Dashboard
            </button>
          </div>
        )}

        {isError && (
          <div className="animate-fade-in">
             <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
              <span className="text-4xl">❌</span>
            </div>
            <p className="text-sm font-black text-red-600 uppercase tracking-widest">
              {error?.data?.message || "AUTHENTICATION_FAILED"}
            </p>
            <button
              onClick={() => navigate("/login")}
              className="mt-8 text-[10px] font-black uppercase tracking-widest text-(--primary-color) border-b-2 border-(--primary-color)/30 pb-1"
            >
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationPage;
