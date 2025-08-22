import React, { useState } from 'react';
import { Filter, ChevronDown } from 'lucide-react';

const DepartmentFilter = ({ departments, selectedDepartments, onDepartmentChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDepartmentToggle = (departmentId) => {
    const updatedSelected = selectedDepartments.includes(departmentId)
      ? selectedDepartments.filter(id => id !== departmentId)
      : [...selectedDepartments, departmentId];
    
    onDepartmentChange(updatedSelected);
  };

  const handleSelectAll = () => {
    if (selectedDepartments.length === departments.length) {
      onDepartmentChange([]);
    } else {
      onDepartmentChange(departments.map(dept => dept.id));
    }
  };

  const getSelectedDepartmentNames = () => {
    if (selectedDepartments.length === 0) return 'All Departments';
    if (selectedDepartments.length === departments.length) return 'All Departments';
    if (selectedDepartments.length === 1) {
      const dept = departments.find(d => d.id === selectedDepartments[0]);
      return dept ? dept.name : '';
    }
    return `${selectedDepartments.length} departments selected`;
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span>{getSelectedDepartmentNames()}</span>
        </div>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="p-2">
            <button
              onClick={handleSelectAll}
              className="w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 rounded"
            >
              {selectedDepartments.length === departments.length ? 'Diselect All' : 'Select All'}
            </button>
            <div className="h-px bg-gray-200 my-1"></div>
            {departments.map(department => (
              <label
                key={department.id}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedDepartments.includes(department.id)}
                  onChange={() => handleDepartmentToggle(department.id)}
                  className="mr-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: department.color }}
                  ></div>
                  <span>{department.name}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentFilter;