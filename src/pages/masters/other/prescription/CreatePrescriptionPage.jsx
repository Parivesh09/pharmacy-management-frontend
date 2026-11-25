import React, { useState } from "react";
import Input from "../../../../components/common/Input";
import Button from "../../../../components/common/Button";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import {
  useCreatePrescriptionMutation,
  useUpdatePrescriptionMutation,
} from "../../../../services/prescriptionApi";
import PatientListModal from "./PatientListModal";
import DoctorListModal from "../doctor/DoctorListModal";

const initialForm = {
  presNo: "",
  presDate: "",
  days: "",
  patient: {},
  doctor: {},
  admissionDate: "",
  dischargeDate: "",
  diagnosis: "",
  oldHistory: "",
  items: [],
};

const patientFields = [
  { label: "Code", name: "patient.code", readOnly: true },
  { label: "Name", name: "patient.name", readOnly: true },
  { label: "Address", name: "patient.address", readOnly: true },
  {
    label: "Contact No.",
    name: "patient.contact",
    readOnly: true,
    prefix: "+91",
  },
  { label: "Type", name: "patient.type", readOnly: true },
];

const doctorFields = [
  { label: "Code", name: "doctor.code", readOnly: true },
  { label: "Reg. No.", name: "doctor.registrationNo", readOnly: true },
  { label: "Name", name: "doctor.name", readOnly: true },
  { label: "Address", name: "doctor.address", readOnly: true },
  {
    label: "Contact No.",
    name: "doctor.mobileNo",
    readOnly: true,
    prefix: "+91",
  },
];

const otherDetails = [
  { label: "Date of Admission", name: "admissionDate", type: "date" },
  { label: "Date of Discharge", name: "dischargeDate", type: "date" },
  { label: "Diagnosis", name: "diagnosis" },
  { label: "Old History", name: "oldHistory" },
];

const CreatePrescriptionPage = ({ isEdit = false, initialData = null }) => {
  const navigate = useNavigate();
  const [moreOption, setMoreOption] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [createPrescription] = useCreatePrescriptionMutation()
  const [updatePrescription] = useUpdatePrescriptionMutation()

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || initialForm,
  });

  const {
    fields: itemFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "items",
  });

  const handlePatientSearch = () => {};
  const handleDoctorSearch = () => {};

  const handlePatientSelect = (patient) => {
    setValue("patient.code", patient.id);
    setValue("patient.name", patient.name);
    setValue("patient.address", patient.address);
    setValue("patient.contact", patient.phone);
    setValue("patient.type", patient.patientType);
    setValue("patient.search", `${patient.name} (${patient.id})`);
  };

  const handleDoctorSelect = (doctor) => {
    console.log(doctor);
    
    setValue("doctor.code", doctor.id);
    setValue("doctor.name", doctor.name);
    setValue("doctor.registrationNo", doctor.registrationNo);
    setValue("doctor.address", doctor.address);
    setValue("doctor.mobileNo", doctor.mobileNo);
    setValue("doctor.search", `${doctor.name} (${doctor.id})`);
  };

  const onSubmit = async (data) => {
    setError("");
    setSuccess("");
    try {
      if (isEdit) {
        await updatePrescription(data.id, data);
        setSuccess("Prescription updated successfully!");
      } else {
        await createPrescription(data);
        setSuccess("Prescription created successfully!");
      }
      reset(initialForm);
      navigate("/masters/other/prescription");
    } catch (err) {
      setError(err?.message || "Failed to save prescription");
    }
  };

  const handleClear = () => {
    reset(initialForm);
  };

  const handleBack = () => navigate("/master/other/prescription");
  const handleClose = () => navigate("/master/other/prescription");

  return (
    <>
      <div className="flex flex-col overflow-auto no-scrollbar">
        <form className="flex-1 flex flex-col relative" onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded shadow p-2 md:p-4 transition-all duration-500">
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between sticky top-0 z-10 mb-2 md:mb-4 gap-2">
              <h1 className="text-lg md:text-xl font-bold">
                {isEdit
                  ? "Edit Prescription Master"
                  : "Create Prescription Master"}
              </h1>
              <Button type="button" variant="secondary" onClick={handleBack} className="w-full md:w-auto">
                &#8592; Back
              </Button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-2 md:mb-4">
              <Input
                label="Pres. No."
                name="presNo"
                {...register("presNo")}
                className="w-full md:w-36 text-xs"
                readOnly
              />
              <Input
                label="Pres. Date"
                name="presDate"
                type="date"
                {...register("presDate")}
                className="w-full md:w-44 text-xs"
              />
              <Input
                label="Pres. for Days"
                name="days"
                {...register("days")}
                className="w-full md:w-28 text-xs"
              />
              <label className="flex items-center gap-2 mt-2 md:mt-0">
                More Option
                <input
                  type="checkbox"
                  checked={moreOption}
                  onChange={(e) => setMoreOption(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
              </label>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-2 md:gap-4 mb-2 md:mb-4">
              
              <div className="flex-1 w-full lg:w-1/3 border border-gray-300 p-2 md:p-3 rounded min-w-0">
                <div className="font-semibold mb-2">Patient Details</div>
                <Input
                  label="Search"
                  name="patient.search"
                  value={watch("patient.search")}
                  onFocus={() => setShowPatientModal(true)}
                  readOnly
                  className="text-xs"
                />
                {patientFields.map((field) => (
                  <Input
                    key={field.name}
                    label={field.label}
                    className="text-xs"
                    readOnly={field.readOnly}
                    prefix={field.prefix}
                    {...register(field.name)}
                  />
                ))}
                <PatientListModal
                  open={showPatientModal}
                  onClose={() => setShowPatientModal(false)}
                  onSelectPatient={handlePatientSelect}
                />
              </div>

              
              <div className="flex-1 w-full lg:w-1/3 border border-gray-300 p-2 md:p-3 rounded min-w-0">
                <div className="font-semibold mb-2">Doctor Details</div>
                <Input
                  label="Search"
                  name="doctor.search"
                  value={watch("doctor.search")}
                  onFocus={() => setShowDoctorModal(true)}
                  readOnly
                  className="text-xs"
                />
                {doctorFields.map((field) => (
                  <Input
                    key={field.name}
                    label={field.label}
                    className="text-xs"
                    readOnly={field.readOnly}
                    prefix={field.prefix}
                    {...register(field.name)}
                  />
                ))}
                <DoctorListModal
                  open={showDoctorModal}
                  onClose={() => setShowDoctorModal(false)}
                  onSelectDoctor={handleDoctorSelect}
                />
              </div>

              
              <div
                className={`prescription-more-details rounded transition-all duration-500 border-gray-300
          ${moreOption ? "lg:w-1/3 w-full p-2 md:p-3 border" : "lg:w-0 w-0"}
          overflow-hidden min-w-0`.trim()}
              >
                {moreOption && (
                  <div className="font-semibold mb-2">Other Details</div>
                )}
                {moreOption &&
                  otherDetails.map((field) => (
                    <Input
                      key={field.name}
                      label={field.label}
                      type={field.type || "text"}
                      className="text-xs"
                      {...register(field.name)}
                    />
                  ))}
              </div>
            </div>
            
            <div className="border border-blue-400 rounded mb-2 md:mb-4">
              <div className="bg-blue-200 font-bold p-2 rounded-t">
                Item Description
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="p-2">Item</th>
                      <th className="p-2">Pres. Days</th>
                      <th className="p-2">Dose/ML</th>
                      <th className="p-2">Quantity</th>
                      <th className="p-2">Unit</th>
                      <th className="p-2">*Days</th>
                      <th className="p-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemFields.map((item, idx) => (
                      <tr
                        key={item.id}
                        className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="p-1">
                          <Input
                            {...register(`items.${idx}.itemId`)}
                            className="text-xs w-full"
                          />
                        </td>
                        <td className="p-1">
                          <Input
                            {...register(`items.${idx}.presDays`)}
                            className="text-xs w-full"
                          />
                        </td>
                        <td className="p-1">
                          <Input
                            {...register(`items.${idx}.dose`)}
                            className="text-xs w-full"
                          />
                        </td>
                        <td className="p-1">
                          <Input
                            {...register(`items.${idx}.quantity`)}
                            className="text-xs w-full"
                          />
                        </td>
                        <td className="p-1">
                          <Input
                            {...register(`items.${idx}.unit`)}
                            className="text-xs w-full"
                          />
                        </td>
                        <td className="p-1">
                          <Input
                            {...register(`items.${idx}.isDays`)}
                            className="text-xs w-full"
                          />
                        </td>
                        <td className="p-1">
                          <Button
                            type="button"
                            onClick={() => remove(idx)}
                            variant="danger"
                            className="w-full"
                          >
                            -
                          </Button>
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={7} className="p-2">
                        <Button
                          type="button"
                          onClick={() =>
                            append({
                              itemId: "",
                              presDays: "",
                              dose: "",
                              quantity: "",
                              unit: "",
                              isDays: "Yes",
                            })
                          }
                          variant="primary"
                          className="w-full md:w-auto"
                        >
                          + Add Item
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-blue-200 p-2 rounded-b">
                Total : {itemFields.length} Product
              </div>
            </div>
            
            {error && <div className="text-red-500 mb-2">{error}</div>}
            {success && <div className="text-green-600 mb-2">{success}</div>}
            
            <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-6 justify-end">
              <Button buttonType={isEdit ? "update" : "save"} type="submit" variant="primary" className="w-full md:w-auto">
                Save
              </Button>
              <Button buttonType="clear" type="button" variant="secondary" onClick={handleClear} className="w-full md:w-auto">
                Clear
              </Button>
              <Button buttonType="close" type="button" variant="danger" onClick={handleClose} className="w-full md:w-auto">
                Close
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreatePrescriptionPage;
