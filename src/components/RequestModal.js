import React, { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { enUS } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { X, Check } from 'lucide-react';

registerLocale('en', enUS);

const RequestModal = ({ onSubmit, onClose, currentUser, existingRequests = [] }) => {

  console.log('RequestModal props:', { currentUser, existingRequests });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reason, setReason] = useState('');

  const checkDateOverlap = (newStartDate, newEndDate) => {
    if (!existingRequests || !Array.isArray(existingRequests) || !currentUser) {
      return { hasOverlap: false };
    }

    const userRequests = existingRequests.filter(req => 
      req.user_id === currentUser.id && 
      (req.status === 'approved' || req.status === 'pending')
    );

    const newStart = new Date(newStartDate);
    const newEnd = new Date(newEndDate);

    for (let request of userRequests) {
      const existingStart = new Date(request.start_date);
      const existingEnd = new Date(request.end_date);
      if (
        (newStart >= existingStart && newStart <= existingEnd) ||
        (newEnd >= existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      ) {
        return {
          hasOverlap: true,
          conflictingRequest: request
        };
      }
    }

    return { hasOverlap: false };
  };

  const handleSubmit = () => {
    if (!startDate || !endDate || !reason) {
      alert('Please, fill out all fields!');
      return;
    }

    if (!currentUser) {
      console.error('currentUser is undefined:', currentUser);
      alert('Error: User not found. Please refresh the page.');
      return;
    }

    if (!currentUser.id || currentUser.totalDays === undefined) {
      console.error('currentUser is missing required properties:', currentUser);
      alert('Error: Incomplete user information. Please refresh the page.');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start < today) {
      alert('The start date of the vacation cannot be before today.');
      return;
    }

    if (end < start) {
      alert('The end date cannot be before the start date.');
      return;
    }

    const overlapCheck = checkDateOverlap(start, end);

    if (overlapCheck.hasOverlap) {
      const conflictRequest = overlapCheck.conflictingRequest;
      const conflictStart = new Date(conflictRequest.start_date).toLocaleDateString('en-US');
      const conflictEnd = new Date(conflictRequest.end_date).toLocaleDateString('en-US');
      const statusText = conflictRequest.status === 'approved' ? 'approved' : 'pending';

      alert(
        `The selected dates overlap with an existing ${statusText} vacation request ` +
        `(${conflictStart} - ${conflictEnd}). Please select different dates.`
      );
      return;
    }

    const diffTime = Math.abs(end - start);
    const totalDaysRequested = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const usedDays = (existingRequests || [])
      .filter(req => req.user_id === currentUser.id && req.status === 'approved')
      .reduce((total, req) => {
        const reqStart = new Date(req.start_date);
        const reqEnd = new Date(req.end_date);
        const reqDiffTime = Math.abs(reqEnd - reqStart);
        const reqDays = Math.ceil(reqDiffTime / (1000 * 60 * 60 * 24)) + 1;
        return total + reqDays;
      }, 0);

    const remainingDays = (currentUser?.totalDays || 0) - usedDays;

    if (totalDaysRequested > remainingDays) {
      alert(
        `Not enough vacation days. You are requesting ${totalDaysRequested} days, ` +
        `but you only have ${remainingDays} days available.`
      );
      return;
    }

    onSubmit({
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      reason,
    });

    setStartDate(null);
    setEndDate(null);
    setReason('');
  };

  const getDisabledDates = () => {
    const disabledDates = [];
    
    if (!existingRequests || !Array.isArray(existingRequests) || !currentUser) {
      return disabledDates;
    }

    const userRequests = existingRequests.filter(req => 
      req.user_id === currentUser.id && 
      (req.status === 'approved' || req.status === 'pending')
    );

    userRequests.forEach(request => {
      const start = new Date(request.start_date);
      const end = new Date(request.end_date);

      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        disabledDates.push(new Date(date));
      }
    });

    return disabledDates;
  };

  const disabledDates = getDisabledDates();

  const calculateRemainingDays = () => {
    if (!currentUser || !existingRequests || !Array.isArray(existingRequests)) {
      return currentUser?.totalDays || 0;
    }

    const usedDays = existingRequests
      .filter(req => req.user_id === currentUser.id && req.status === 'approved')
      .reduce((total, req) => {
        const start = new Date(req.start_date);
        const end = new Date(req.end_date);
        const diffTime = Math.abs(end - start);
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return total + days;
      }, 0);

    return currentUser.totalDays - usedDays;
  };

  if (!currentUser) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Request Time Off</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5 text-black" />
            </button>
          </div>
          <div className="text-center py-8">
            <div className="text-gray-500">Loading user information...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Request Time Off</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              locale="en"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholderText="Choose a start date"
              minDate={new Date()}
              excludeDates={disabledDates}
              highlightDates={[
                {
                  "react-datepicker__day--highlighted-custom-1": disabledDates
                }
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
              locale="en"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholderText="Choose an end date"
              minDate={startDate || new Date()}
              excludeDates={disabledDates}
              highlightDates={[
                {
                  "react-datepicker__day--highlighted-custom-1": disabledDates
                }
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Request Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide the reason for your time off request..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20 resize-none"
            />
          </div>
          {currentUser && (
            <div className="bg-calm-green-gradient border border-blue-200 rounded-lg p-3">
              <div className="flex justify-between text-sm">
                <span className="text-black-700 font-semibold">Available Time Off Days:</span>
                <span className="font-bold text-black-800">
                  {calculateRemainingDays()} / {currentUser.totalDays}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-calm-green-gradient text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Check className="h-4 w-4 text-black font-semibold" />
            <span className='text-black font-semibold'>Submit Request</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestModal;