import { X } from "lucide-react";
import React from "react";
import Button from "./Button";

const GlobalEditableTable = ({
  columns = [],
  rows = [],
  setRows = () => {},
  minRows = 1,
  showAddRow = false,
}) => {
  const handleCellChange = (rowIdx, key, value) => {
    const updatedRows = rows.map((row, idx) =>
      idx === rowIdx ? { ...row, [key]: value } : row
    );
    setRows(updatedRows);
  };

  const handleAddRow = () => {
    const emptyRow = columns.reduce((acc, col) => {
      acc[col.key] = "";
      return acc;
    }, {});
    setRows([...rows, emptyRow]);
  };

  const handleRemoveRow = (rowIdx) => {
    if (rows.length > minRows) {
      setRows(rows.filter((_, idx) => idx !== rowIdx));
    }
  };

  const renderInput = (col, value, rowIdx) => {
    switch (col.type) {
      case "number":
        return (
          <input
            type="number"
            className="w-full h-full px-1 py-0.5 text-xs border border-gray-300 focus:outline-none focus:ring-0"
            value={value}
            onChange={(e) => handleCellChange(rowIdx, col.key, e.target.value)}
          />
        );
      case "date":
        return (
          <input
            type="date"
            className="w-full h-full px-1 py-0.5 text-xs border border-gray-300 focus:outline-none focus:ring-0"
            value={value}
            onChange={(e) => handleCellChange(rowIdx, col.key, e.target.value)}
          />
        );
      case "select":
        return (
          <select
            className="w-full h-full px-1 py-0.5 text-xs border border-gray-300 focus:outline-none focus:ring-0"
            value={value}
            onChange={(e) => handleCellChange(rowIdx, col.key, e.target.value)}
          >
            {(col.options || []).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <input
            type="text"
            className="w-full h-full px-1 py-0.5 text-xs border border-gray-300 focus:outline-none focus:ring-0"
            value={value}
            onChange={(e) => handleCellChange(rowIdx, col.key, e.target.value)}
          />
        );
    }
  };

  const displayRows =
    rows.length >= minRows
      ? rows
      : [
          ...rows,
          ...Array(minRows - rows.length)
            .fill(0)
            .map(() =>
              columns.reduce((acc, col) => ({ ...acc, [col.key]: "" }), {})
            ),
        ];

  return (
    <div className="border border-gray-300 overflow-auto rounded-sm">
      <table className="w-full text-sm table-fixed">
        <thead className="bg-blue-500 text-white">
          <tr>
            {columns.map((col, i) => (
              <th
                key={col.key || i}
                className="border border-gray-300 px-1 py-1 font-semibold text-center"
              >
                {col.label}
              </th>
            ))}
            <th className="border border-gray-300 px-1 py-1 font-semibold text-center w-8">
              {" "}
            </th>
          </tr>
        </thead>
        <tbody>
          {displayRows.map((row, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-gray-100">
              {columns.map((col, colIdx) => (
                <td
                  key={col.key || colIdx}
                  className="border border-gray-200 p-0"
                >
                  {renderInput(col, row[col.key], rowIdx)}
                </td>
              ))}
              <td className="border border-gray-200 p-0 text-center align-middle">
                {rows.length > minRows && rowIdx < rows.length ? (
                  <Button
                    isIcon={true}
                    variant="danger"
                    onClick={() => handleRemoveRow(rowIdx)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showAddRow && (
        <button
          type="button"
          className="mt-2 px-2 py-1 bg-teal-600 text-white rounded text-xs"
          onClick={handleAddRow}
        >
          + Add Row
        </button>
      )}
    </div>
  );
};

export default GlobalEditableTable;
