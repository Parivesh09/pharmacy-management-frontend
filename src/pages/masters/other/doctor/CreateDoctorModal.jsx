import React, { useState } from "react";
import Modal from "../../../../componets/common/Modal";
import Input from "../../../../componets/common/Input";
import Select from "../../../../componets/common/Select";
import Button from "../../../../componets/common/Button";
import { PhoneIcon } from "lucide-react";

const specializationOptions = [
  { value: "", label: "---Blank---" },
  { value: "cardiology", label: "Cardiology" },
  { value: "dermatology", label: "Dermatology" },
  { value: "neurology", label: "Neurology" },

];

const CreateDoctorModal = ({ open, onClose, onSave }) => {
  const [form, setForm] = useState({
    mobileNo: "",
    id: "",
    regNo: "",
    name: "",
    hospital: "",
    specialization: "",
    commission: "0.00",
    locationCode: "",
    address: "",
    pin: "",
    phone: "",
    email: "",
    whatsapp: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (onSave) onSave(form);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="CREATE DOCTOR PROFILE"
      className="max-w-4xl"
    >
      <div className="flex flex-col md:flex-row gap-6 py-4">
        
        <div className="flex-1 bg-(--sidebar-active-bg)/30 border border-(--primary-color)/5 rounded-3xl p-6 space-y-4">
          <div className="text-[10px] font-black uppercase tracking-widest text-(--primary-color) border-b border-gray-50 dark:border-white/5 pb-3 mb-2">Professional Identity</div>
          <Input
            label="Mobile Number"
            name="mobileNo"
            prefix="+91"
            startIcon={<PhoneIcon className="w-4" />}
            value={form.mobileNo}
            onChange={handleChange}
            className="bg-transparent border-gray-200 dark:border-gray-700 font-bold"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Internal ID" name="id" value={form.id} onChange={handleChange} className="bg-transparent border-gray-200 dark:border-gray-700" />
            <Input
              label="Medical Registration No"
              name="regNo"
              value={form.regNo}
              onChange={handleChange}
              className="bg-transparent border-gray-200 dark:border-gray-700 font-mono text-xs uppercase"
            />
          </div>
          <Input
            label="Full Practitioner Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="bg-transparent border-gray-200 dark:border-gray-700 font-black h-12 text-lg"
          />
          <Input
            label="Associated Hospital / Clinic"
            name="hospital"
            value={form.hospital}
            onChange={handleChange}
            className="bg-transparent border-gray-200 dark:border-gray-700 font-bold"
          />
          <Select
            label="Medical Specialization"
            name="specialization"
            value={form.specialization}
            options={specializationOptions}
            onChange={(e) =>
              handleSelectChange("specialization", e.target.value)
            }
            className="bg-transparent border-gray-200 dark:border-gray-700 font-bold"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Standard Commission (%)"
              name="commission"
              value={form.commission}
              onChange={handleChange}
              className="bg-transparent border-gray-200 dark:border-gray-700 font-black text-(--primary-color)"
            />
            <Input
              label="Area Location Code"
              name="locationCode"
              value={form.locationCode}
              onChange={handleChange}
              className="bg-transparent border-gray-200 dark:border-gray-700"
            />
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-between">
          <div className="bg-(--sidebar-active-bg)/30 border border-(--primary-color)/5 rounded-3xl p-6 space-y-4">
            <div className="text-[10px] font-black uppercase tracking-widest text-(--primary-color) border-b border-gray-50 dark:border-white/5 pb-3 mb-2">Practice Locations</div>
            <Input
              label="Clinic / Office Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="bg-transparent border-gray-200 dark:border-gray-700"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Postal PIN"
                name="pin"
                value={form.pin}
                onChange={handleChange}
                className="bg-transparent border-gray-200 dark:border-gray-700 font-bold"
              />
              <Input
                label="Landline Phone"
                name="phone"
                startIcon={<PhoneIcon className="w-4" />}
                value={form.phone}
                onChange={handleChange}
                className="bg-transparent border-gray-200 dark:border-gray-700"
              />
            </div>
            <Input
              label="Official Email Contact"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="bg-transparent border-gray-200 dark:border-gray-700"
            />
            <Input
              label="WhatsApp Notification Number"
              name="whatsapp"
              prefix="+91"
              value={form.whatsapp}
              onChange={handleChange}
              className="bg-transparent border-gray-200 dark:border-gray-700 font-bold"
            />
          </div>

          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-50 dark:border-white/5 justify-end">
            <Button 
               onClick={onClose} 
               type="button" 
               variant="outline"
               className="flex-1"
            >
              Cancel
            </Button>
            <Button 
               onClick={handleSave} 
               type="button" 
               variant="primary"
               className="flex-1 shadow-xl shadow-(--primary-color)/20 font-black uppercase tracking-widest"
            >
              Save Profile
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateDoctorModal;
