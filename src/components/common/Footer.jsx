import Button from './Button';

export default function DefaultFooter({ onSave,onClear,onClose }) {
  return (
    <>
      <div className="bg-white border-t border-gray-200 px-4 py-1 flex items-center justify-end">
        <div className="flex items-center gap-3">
          <Button
            buttonType={"save"}
            onClick={onSave}
            className="flex items-center gap-2 px-6 py-1 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors duration-200 font-medium shadow-sm"
          >
            <span>Save</span>
          </Button>

          <Button onClick={onClear} buttonType={"clear"} className="flex items-center gap-2 px-4 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 font-medium">
            <span className="text-gray-700">Clear</span>
          </Button>

          <Button
            buttonType={"close"}
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 font-medium"
          >
            <span className="text-gray-700">Close</span>
          </Button>
        </div>
      </div>
    </>
  );
}
