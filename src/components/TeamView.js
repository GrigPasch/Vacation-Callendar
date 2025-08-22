import React, { useState } from 'react';
import { Shield, Users } from 'lucide-react';
import { getUsedDays } from '../utils/vacationUtils';
import DepartmentFilter from './DepartmentFilter';

const TeamView = ({ userDatabase, vacationRequests, departments }) => {
  const [selectedDepartments, setSelectedDepartments] = useState(
    departments.map(dept => dept.id)
  );
  const [sortBy, setSortBy] = useState('name');

  const filteredUsers = userDatabase.filter(user => 
    selectedDepartments.includes(user.department_id || user.departmentId)
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a.name || '').localeCompare(b.name || '');
      case 'department':
        const deptA = departments.find(d => d.id === (a.department_id || a.departmentId));
        const deptB = departments.find(d => d.id === (b.department_id || b.departmentId));
        return (deptA?.name || '').localeCompare(deptB?.name || '');
      case 'remaining_days':
        const remainingA = (a.totalDays || a.total_days) - getUsedDays(a.id, vacationRequests);
        const remainingB = (b.totalDays || b.total_days) - getUsedDays(b.id, vacationRequests);
        return remainingB - remainingA;
      case 'used_days':
        const usedA = getUsedDays(a.id, vacationRequests);
        const usedB = getUsedDays(b.id, vacationRequests);
        return usedB - usedA;
      default:
        return 0;
    }
  });

  const getDepartmentById = (departmentId) => {
    return departments.find(dept => dept.id === departmentId);
  };

  const usersByDepartment = selectedDepartments.map(deptId => {
    const department = getDepartmentById(deptId);
    const deptUsers = sortedUsers.filter(user => 
      (user.department_id || user.departmentId) === deptId
    );
    return {
      department,
      users: deptUsers
    };
  }).filter(group => group.users.length > 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Team Vacation Overview</h2>

        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="name">Order by Name</option>
            <option value="department">Order by Department</option>
            <option value="remaining_days">Order by Remaining Days</option>
            <option value="used_days">Order by Used Days</option>
          </select>

          <DepartmentFilter
            departments={departments}
            selectedDepartments={selectedDepartments}
            onDepartmentChange={setSelectedDepartments}
            className="min-w-[200px]"
          />
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-medium text-gray-700">Total Employees</h4>
          <p className="text-2xl font-bold text-blue-600">{sortedUsers.length}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-medium text-gray-700">Total Approvals</h4>
          <p className="text-2xl font-bold text-orange-600">
            {sortedUsers.reduce((sum, user) => sum + getUsedDays(user.id, vacationRequests), 0)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-medium text-gray-700">Departments</h4>
          <p className="text-2xl font-bold text-purple-600">{usersByDepartment.length}</p>
        </div>
      </div>

      {usersByDepartment.map(({ department, users }) => (
        <div key={department.id} className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: department.color }}
            ></div>
            <h3 className="text-lg font-semibold text-gray-800">{department.name}</h3>
            <span className="text-sm text-gray-500">({users.length} employees)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map(user => {
              const userUsedDays = getUsedDays(user.id, vacationRequests);
              const userTotalDays = user.totalDays || user.total_days;
              const userRemainingDays = userTotalDays - userUsedDays;
              const usagePercentage = (userUsedDays / userTotalDays) * 100;
              
              return (
                <div key={user.id} className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-3">
                    <div 
                      className="h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                      style={{ backgroundColor: department.color }}
                    >
                      {(user.name || '').split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-800">{user.name}</h4>
                        {user.role === 'manager' && <Shield className="h-3 w-3 text-blue-600" />}
                      </div>
                      <p className="text-xs text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-600">Total Days:</span>
                      <span className="font-bold text-red-600">{userTotalDays}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-600">Approved:</span>
                      <span className="font-bold text-blue-600">{userUsedDays}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-600">Remaining:</span>
                      <span className={`font-bold ${userRemainingDays <= 5 ? 'text-red-600' : 'text-green-600'}`}>
                        {userRemainingDays}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(usagePercentage, 100)}%`,
                          backgroundColor: usagePercentage > 80 ? '#EF4444' : 
                                         usagePercentage > 60 ? '#F59E0B' : 
                                         department.color
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 text-center">
                      {Math.round(usagePercentage)}% used
                    </div>
                  </div>

                  {userRemainingDays <= 5 && userRemainingDays > 0 && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                      ⚠️ Few Days Remaining
                    </div>
                  )}
                  
                  {userRemainingDays <= 0 && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                      🚫 No Days Available
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      
      {sortedUsers.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No Employees Found</h3>
          <p>No employees found in the selected departments.</p>
        </div>
      )}
    </div>
  );
};

export default TeamView;