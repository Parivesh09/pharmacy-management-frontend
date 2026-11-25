import { Mail } from "lucide-react";
import Input from "../../../components/common/Input";

const RenderStep2 = ({ formData, handleChange, errors }) => (
  <div className="space-y-4">
    <div className="text-center mb-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Mail className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900">
        Complete Your Profile
      </h3>
      <p className="text-gray-600">Fill in your personal details</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          First Name <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Enter your first name"
          error={errors.firstName}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Last Name <span className="text-red-500">*</span>
        </label>
        <Input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Enter your last name"
          error={errors.lastName}
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Email Address <span className="text-red-500">*</span>
      </label>
      <Input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter your email address"
        error={errors.email}
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        PIN Code (City) <span className="text-red-500">*</span>
      </label>
      <Input
        type="text"
        name="pin"
        value={formData.pin}
        onChange={handleChange}
        placeholder="Enter 6-digit PIN code"
        error={errors.pin}
        maxLength={6}
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Password <span className="text-red-500">*</span>
      </label>
      <Input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Create a strong password"
        error={errors.password}
      />
      <p className="text-xs text-gray-500 mt-1">
        Must contain at least 8 characters, one uppercase, one lowercase, one
        number, and one special character
      </p>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Confirm Password <span className="text-red-500">*</span>
      </label>
      <Input
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm your password"
        error={errors.confirmPassword}
      />
    </div>
  </div>
);

export default RenderStep2;
