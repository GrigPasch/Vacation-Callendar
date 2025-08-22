import React from 'react';

const UserInfoBar = ({ currentUser, usedDays, remainingDays, department }) => {
  return (
    <div className="mb-6 p-4 bg-calm-green-gradient-25 rounded-lg border">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div 
            className="h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold"
            style={{ backgroundColor: department?.color || '#3B82F6' }}
          >
            {currentUser.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{currentUser.name}</h3>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-600">{currentUser.department}</p>
              {department && (
                <>
                  <span className="text-sm text-gray-400">•</span>
                  <div className="flex items-center space-x-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: department.color }}
                    ></div>
                    <span className="text-sm text-gray-500">{department.name}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex space-x-6">
            <div>
              <p className="text-sm text-gray-600">Total Days</p>
              <p className="text-2xl font-bold text-red-600">{currentUser.totalDays}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Used</p>
              <p className="text-2xl font-bold text-blue-600">{usedDays}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Available Days</p>
              <p className="text-2xl font-bold text-green-600">{remainingDays}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoBar;