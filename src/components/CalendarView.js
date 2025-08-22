import React, { useState } from 'react';
import DepartmentFilter from './DepartmentFilter';

const CalendarView = ({ 
  vacationRequests, 
  userDatabase, 
  departments,
  onRequestTimeOff 
}) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDepartments, setSelectedDepartments] = useState(
    departments.map(dept => dept.id)
  );

  const filteredVacationRequests = vacationRequests.filter(req => {
    const user = userDatabase.find(u => u.id === (req.user_id || req.user_id));
    return user && selectedDepartments.includes(user.department_id || user.departmentId);
  });

  const getCalendarData = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const vacationsOnThisDay = filteredVacationRequests.filter(req => {
        const startDate = new Date(req.start_date || req.start_date);
        const endDate = new Date(req.end_date || req.end_date);
        const currentDate = new Date(dateStr);
        return currentDate >= startDate && currentDate <= endDate && req.status === 'approved';
      });
      
      days.push({
        day,
        date: dateStr,
        vacations: vacationsOnThisDay
      });
    }
    
    return { 
      days, 
      monthName: firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) 
    };
  };

  const { days, monthName } = getCalendarData();
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prevYear => prevYear + 1);
    } else {
      setCurrentMonth(prevMonth => prevMonth + 1);
    }
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prevYear => prevYear - 1);
    } else {
      setCurrentMonth(prevMonth => prevMonth - 1);
    }
  };

  const getDepartmentByUserId = (userId) => {
    const user = userDatabase.find(u => u.id === userId);
    if (!user) return null;
    
    const departmentId = user.department_id || user.departmentId;
    return departments.find(dept => dept.id === departmentId);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={goToPreviousMonth}
            className="bg-calm-green-gradient-25 text-black font-semibold px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
          >
            {'<'} Previous Month
          </button>
          
          <h2 className="text-xl font-semibold text-gray-800">{monthName}</h2>

          <button
            onClick={goToNextMonth}
            className="bg-calm-green-gradient-25 text-black font-semibold px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Next Month {'>'}
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <DepartmentFilter
            departments={departments}
            selectedDepartments={selectedDepartments}
            onDepartmentChange={setSelectedDepartments}
            className="min-w-[200px]"
          />
          
          <button
            onClick={onRequestTimeOff}
            className="flex items-center space-x-2 bg-calm-green-gradient-25 text-black font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            <span>Request Time Off</span>
          </button>
        </div>
      </div>
      {selectedDepartments.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Departments:</h4>
          <div className="flex flex-wrap gap-2">
            {departments
              .filter(dept => selectedDepartments.includes(dept.id))
              .map(department => (
                <div
                  key={department.id}
                  className="flex items-center space-x-2 px-2 py-1 bg-white rounded border"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: department.color }}
                  ></div>
                  <span className="text-xs text-gray-600">{department.name}</span>
                </div>
              ))}
          </div>
        </div>
      )}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 bg-calm-green-gradient-25">
          {dayNames.map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day, index) => (
            <div key={index} className="min-h-[100px] p-2 border-r border-b border-gray-300 last:border-r-0">
              {day && (
                <>
                  <div className="font-medium text-gray-800 mb-1">{day.day}</div>
                  {day.vacations.map(vacation => {
                    const user = userDatabase.find(u => u.id === (vacation.userId || vacation.user_id));
                    const department = getDepartmentByUserId(vacation.userId || vacation.user_id);
                    
                    return (
                      <div
                        key={vacation.id}
                        className="text-xs px-2 py-1 rounded mb-1 truncate text-black"
                        style={{ 
                          backgroundColor: department?.color || '#3B82F6'
                        }}
                        title={`${user?.name || user?.user_name} - ${vacation.reason} (${department?.name})`}
                      >
                        {user?.name || user?.user_name}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-medium text-gray-700">Total Approved for {monthName}</h4>
          <p className="text-2xl font-bold text-green-600">
            {filteredVacationRequests.filter(req => {
              const date = new Date(req.start_date || req.start_date);
              return date.getMonth() === currentMonth && 
                     date.getFullYear() === currentYear && 
                     req.status === 'approved';
            }).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-medium text-gray-700">Pending Requests</h4>
          <p className="text-2xl font-bold text-yellow-600">
            {filteredVacationRequests.filter(req => req.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-medium text-gray-700">Active Employees</h4>
          <p className="text-2xl font-bold text-blue-600">
            {userDatabase.filter(user => 
              selectedDepartments.includes(user.department_id || user.departmentId)
            ).length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;