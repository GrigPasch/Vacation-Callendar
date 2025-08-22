import React, { useState } from 'react';
import { Calendar, Users, Clock, Shield, LogOut } from 'lucide-react';
import CalendarView from './CalendarView';
import RequestsView from './RequestsView';
import TeamView from './TeamView';
import ApprovalsView from './ApprovalsView';
import UserInfoBar from './UserInfoBar';
import RequestModal from './RequestModal';
import { getUsedDays } from '../utils/vacationUtils';

const Dashboard = ({ 
  currentUser, 
  vacationRequests, 
  userDatabase,
  departments,
  onLogout, 
  onRequestSubmit, 
  onRequestDecision 
}) => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [showRequestForm, setShowRequestForm] = useState(false);

  const usedDays = getUsedDays(currentUser.id, vacationRequests);
  const remainingDays = currentUser.totalDays - usedDays;
  
  const pendingApprovals = currentUser.role === 'manager' 
    ? vacationRequests.filter(req => {
        const user = userDatabase.find(u => u.id === (req.user_id || req.user_id));
        return user && user.manager_id === currentUser.id && req.status === 'pending';
      })
    : [];

  const handleRequestSubmit = async (requestData) => {
    const result = await onRequestSubmit(requestData);
    if (result.success) {
      setShowRequestForm(false);
    } else {
      alert(result.error || 'Failed to submit request');
    }
  };

  const handleRequestDecision = async (requestId, decision) => {
    const result = await onRequestDecision(requestId, decision);
    if (!result.success) {
      alert(result.error || 'Failed to update request');
    }
  };

  const tabs = [
    { id: 'calendar', label: 'View Calendar', icon: Calendar },
    { id: 'requests', label: 'My Requests', icon: Clock },
    { id: 'team', label: 'Team Leave Overview', icon: Users },
    ...(currentUser.role === 'manager' 
      ? [{ id: 'approvals', label: `Approvals ${pendingApprovals.length > 0 ? `(${pendingApprovals.length})` : ''}`, icon: Shield }]
      : []
    )
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'calendar':
        return (
          <CalendarView 
            vacationRequests={vacationRequests}
            userDatabase={userDatabase}
            departments={departments}
            onRequestTimeOff={() => setShowRequestForm(true)}
          />
        );
      case 'requests':
        return (
          <RequestsView 
            currentUser={currentUser}
            vacationRequests={vacationRequests}
            userDatabase={userDatabase}
            departments={departments}
          />
        );
      case 'team':
        return (
          <TeamView 
            userDatabase={userDatabase}
            vacationRequests={vacationRequests}
            departments={departments}
          />
        );
      case 'approvals':
        return (
          <ApprovalsView 
            currentUser={currentUser}
            pendingRequests={pendingApprovals}
            userDatabase={userDatabase}
            departments={departments}
            onRequestDecision={handleRequestDecision}
          />
        );
      default:
        return null;
    }
  };

  const userDepartment = departments.find(dept => dept.id === currentUser.departmentId);

  return (
    <div className="min-h-screen bg-calm-blue-gradient">
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-calm-green-gradient p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="h-8 w-8 text-black" />
                <div>
                  <h1 className="text-2xl text-black font-bold">Vacation Calendar</h1>
                  <p className="opacity-90 text-black">Manage your time off.</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {currentUser.role === 'manager' && <Shield className="h-4 w-4 text-black" />}
                  <div className="text-right">
                    <p className="font-medium text-black">{currentUser.name}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs text-black opacity-75">
                        {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                      </p>
                      {userDepartment && (
                        <>
                          <span className="text-xs text-black opacity-75">•</span>
                          <div className="flex items-center space-x-1">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: userDepartment.color }}
                            ></div>
                            <p className="text-xs text-black opacity-75">{userDepartment.name}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center border-2 border-black space-x-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4 text-black" />
                  <span className='text-black'>Logout</span>
                </button>
              </div>
            </div>
          </div>
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                    activeTab === id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
          <div className="p-6">
            <UserInfoBar
              currentUser={currentUser}
              usedDays={usedDays}
              remainingDays={remainingDays}
              department={userDepartment}
            />
            {renderActiveTab()}
          </div>
        </div>
        {showRequestForm && (
          <RequestModal
            currentUser={currentUser}
            existingRequests={vacationRequests}
            onSubmit={handleRequestSubmit}
            onClose={() => setShowRequestForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;