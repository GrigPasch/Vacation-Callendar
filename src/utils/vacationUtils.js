export const getUsedDays = (userId, vacationRequests) => {
  return vacationRequests
    .filter(req => req.user_id === userId && req.status === 'approved')
    .reduce((total, req) => {
      const start = new Date(req.start_date);
      const end = new Date(req.end_date);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return total + diffDays;
    }, 0);
};

export const getSubordinates = (managerId, userDatabase) => {
  return userDatabase.filter(user => user.managerId === managerId);
};

export const getPendingRequestsForApproval = (managerId, vacationRequests, userDatabase) => {
  const subordinateIds = getSubordinates(managerId, userDatabase).map(sub => sub.id);
  return vacationRequests.filter(req => 
    subordinateIds.includes(req.user_id) && req.status === 'pending'
  );
};

export const calculateDaysBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

export const hasEnoughVacationDays = (userId, startDate, endDate, userDatabase, vacationRequests) => {
  const user = userDatabase.find(u => u.id === userId);
  if (!user) return false;
  
  const usedDays = getUsedDays(userId, vacationRequests);
  const requestedDays = calculateDaysBetween(startDate, endDate);
  const remainingDays = user.totalDays - usedDays;
  
  return remainingDays >= requestedDays;
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};