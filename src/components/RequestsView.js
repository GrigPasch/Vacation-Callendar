import React from 'react';
import { Calendar } from 'lucide-react';

const RequestsView = ({ currentUser, vacationRequests, userDatabase, departments }) => {
  const userRequests = vacationRequests.filter(req => (req.user_id || req.user_id) === currentUser.id);

  const getDepartmentByUserId = (userId) => {
    const user = userDatabase.find(u => u.id === userId);
    if (!user) return null;
    const departmentId = user.department_id || user.departmentId;
    return departments.find(dept => dept.id === departmentId);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">My Requests.</h2>
      <div className="space-y-4">
        {userRequests.map(request => {
          const reviewer = (request.reviewed_by || request.reviewed_by) 
            ? userDatabase.find(u => u.id === (request.reviewed_by || request.reviewed_by)) 
            : null;
          const reviewerDepartment = reviewer ? getDepartmentByUserId(reviewer.id) : null;
          
          return (
            <div key={request.id} className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="font-medium">
                      {new Date(request.start_date || request.start_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })} - {new Date(request.end_date || request.end_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      request.status === 'approved' 
                        ? 'bg-green-100 text-green-800'
                        : request.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {
                        request.status === 'approved' 
                        ? 'Approved'
                        : request.status === 'pending'
                        ? 'Pending'
                        : 'Rejected'
                      }
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{request.reason}</p>
                  <div className="text-xs text-gray-500">
                    <p className='font-semibold text-gray-600'>
                      Submitted on: {new Date(request.submitted_date || request.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    {reviewer && (
                      <div className="flex items-center space-x-2 mt-1">
                        <span className='font-semibold text-gray-600'>Reviewed by:</span>
                        <div className="flex items-center space-x-2">
                          {reviewerDepartment && (
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: reviewerDepartment.color }}
                            ></div>
                          )}
                          <span className='font-semibold text-gray-600'>
                            {reviewer.name} on {new Date(request.reviewed_date || request.reviewed_date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {userRequests.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>There are no Vacation Requests.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestsView;