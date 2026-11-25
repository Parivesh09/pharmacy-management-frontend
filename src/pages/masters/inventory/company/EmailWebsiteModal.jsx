import Modal from "../../../../components/common/Modal";
import Input from "../../../../components/common/Input";
import Button from "../../../../components/common/Button";
import { Save } from "lucide-react";
import { useState, useEffect } from "react";
import { showToast } from "../../../../components/common/Toast";

export default function EmailWebsiteModal({ open, onClose, onSave, initialData }) {
  const [fields, setFields] = useState({ main: "", cc: "", bcc: "", url: "" });

  useEffect(() => {
    if (initialData) setFields(initialData);
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(fields);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="E-Mails & Website">
      <form onSubmit={handleSubmit} className="p-2 min-w-[350px]">
        <div className="mb-2">
          <div className="font-semibold text-sm mb-1">Email Details</div>
          <Input
            className="mb-2 bg-yellow-100"
            name="main"
            placeholder="Main"
            value={fields.main}
            onChange={handleChange}
          />
          <Input
            className="mb-2"
            name="cc"
            placeholder="CC"
            value={fields.cc}
            onChange={handleChange}
          />
          <Input
            className="mb-2"
            name="bcc"
            placeholder="BCC"
            value={fields.bcc}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <div className="font-semibold text-sm mb-1">Website</div>
          <Input
            name="url"
            placeholder="www.example.com"
            value={fields.url}
            onChange={handleChange}
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            type="submit"
            variant="primary"
            buttonType={"save"}
          >
            Update
          </Button>
        </div>
      </form>
    </Modal>
  );
} 