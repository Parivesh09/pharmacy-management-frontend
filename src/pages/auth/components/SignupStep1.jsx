import { CheckCircle, Phone } from "lucide-react";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";

const RenderStep1 = ({
  formData,
  handleChange,
  errors,
  sendingOTP,
  countdown,
  otpSent,
  handleSendOTP,
  verifyingOTP,
  handleVerifyOTP,
  phoneVerified,
}) => (
  <div className="space-y-4">
    <div className="text-center mb-6">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Phone className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900">
        Verify Your Phone Number
      </h3>
      <p className="text-gray-600">
        We'll send you a verification code via SMS
      </p>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Phone Number <span className="text-red-500">*</span>
      </label>
      <div className="flex gap-2">
        <Input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
          error={errors.phone}
          fullWidth
        />
        <Button
          type="button"
          onClick={handleSendOTP}
          className="px-6 w-full max-w-fit min-w-[50px]"
        >
          {sendingOTP
            ? "Sending..."
            : countdown > 0
            ? `${countdown}s`
            : "Send OTP"}
        </Button>
      </div>
    </div>

    {otpSent && (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Verification Code <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <Input
            type="text"
            name="otp"
            value={formData.otp}
            onChange={handleChange}
            placeholder="Enter 6-digit code"
            className="flex-1"
            error={errors.otp}
            maxLength={6}
          />
          <Button type="button" onClick={handleVerifyOTP} className="px-6">
            {verifyingOTP ? "Verifying..." : "Verify"}
          </Button>
        </div>
      </div>
    )}

    {phoneVerified && (
      <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
        <CheckCircle className="w-5 h-5" />
        <span className="text-sm font-medium">
          Phone number verified successfully!
        </span>
      </div>
    )}
  </div>
);

export default RenderStep1;
