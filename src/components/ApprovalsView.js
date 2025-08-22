import React from 'react';
import { Shield } from 'lucide-react';

const ApprovalsView = ({ currentUser, pendingRequests, userDatabase, departments, onRequestDecision }) => {
  if (currentUser.role !== 'manager') {
    return null;
  }

  const getDepartmentByUserId = (userId) => {
    const user = userDatabase.find(u => u.id === userId);
    if (!user) return null;
    const departmentId = user.department_id || user.departmentId;
    return departments.find(dept => dept.id === departmentId);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Pending Requests</h2>
      <div className="space-y-4">
        {pendingRequests.map(request => {
          const employee = userDatabase.find(u => u.id === (request.user_id || request.user_id));
          const department = getDepartmentByUserId(request.user_id || request.user_id);
          
          return (
            <div key={request.id} className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div 
                      className="h-8 w-8 rounded-full flex items-center justify-center text-white font-semibold text-xs"
                      style={{ backgroundColor: department?.color || '#3B82F6' }}
                    >
                      {(employee?.name || '').split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{employee?.name}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>{employee?.department || employee?.department_name}</span>
                        {department && (
                          <>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: department.color }}
                              ></div>
                              <span>{department.name}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium">Dates:</span> {new Date(request.start_date || request.start_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} - {new Date(request.end_date || request.end_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p><span className="font-medium">Reason:</span> {request.reason}</p>
                    <p><span className="font-medium">Submission Date:</span> {new Date(request.submitted_date || request.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => onRequestDecision(request.id, 'approved')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => onRequestDecision(request.id, 'rejected')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        
        {pendingRequests.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No Pending Requests</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalsView;