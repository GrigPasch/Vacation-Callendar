/*
import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';

const API_BASE_URL = 'http://localhost:3001/api';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [vacationRequests, setVacationRequests] = useState([]);
  const [userDatabase, setUserDatabase] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initApp = async () => {
      try {
        console.log('Loading application data...');
        await loadDepartments();
        await loadUsers();
        await loadVacationRequests();
        console.log('App initialized successfully');
        setLoading(false);
      } catch (err) {
        console.error('Failed to initialize app:', err);
        setError(`Failed to initialize application: ${err.message}`);
        setLoading(false);
      }
    };

    initApp();
  }, []);

  const loadDepartments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/departments`);
      if (!response.ok) throw new Error('Failed to fetch departments');
      const depts = await response.json();
      console.log('Departments loaded:', depts.length);
      setDepartments(depts);
    } catch (err) {
      console.error('Failed to load departments:', err);
      throw new Error('Could not load departments');
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) throw new Error('Failed to fetch users');
      const users = await response.json();
      console.log('Users loaded:', users.length);
      setUserDatabase(users);
    } catch (err) {
      console.error('Failed to load users:', err);
      throw new Error('Could not load users');
    }
  };

  const loadVacationRequests = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/vacation-requests`);
      if (!response.ok) throw new Error('Failed to fetch vacation requests');
      const requests = await response.json();
      console.log('Vacation requests loaded:', requests.length);
      setVacationRequests(requests);
    } catch (err) {
      console.error('Failed to load vacation requests:', err);
      throw new Error('Could not load vacation requests');
    }
  };

  const handleLogin = async (username, password) => {
    try {
      console.log('Attempting login for:', username);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('User authenticated successfully:', result.user.name);
        setCurrentUser(result.user);
        setIsLoggedIn(true);
        return { success: true };
      } else {
        console.log('Authentication failed for:', username);
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error('Login failed:', err);
      return { success: false, error: 'Σφάλμα σύνδεσης. Παρακαλώ δοκιμάστε ξανά.' };
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    console.log('User logged out');
  };

  const handleRequestSubmit = async (requestData) => {
    try {
      console.log('Submitting vacation request:', requestData);
      const response = await fetch(`${API_BASE_URL}/vacation-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id,
          startDate: requestData.startDate,
          endDate: requestData.endDate,
          reason: requestData.reason,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('Vacation request created with ID:', result.requestId);
        await loadVacationRequests();
        return { success: true, requestId: result.requestId };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error('Failed to submit vacation request:', err);
      return { success: false, error: 'Αποτυχία υποβολής αίτησης. Παρακαλώ δοκιμάστε ξανά.' };
    }
  };

  const handleRequestDecision = async (requestId, decision) => {
    try {
      console.log('Updating request decision:', requestId, decision);
      const response = await fetch(`${API_BASE_URL}/vacation-requests/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: decision,
          reviewerId: currentUser.id,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('Request decision updated successfully');
        await loadVacationRequests();
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error('Failed to update vacation request:', err);
      return { success: false, error: 'Αποτυχία ενημέρωσης αίτησης. Παρακαλώ δοκιμάστε ξανά.' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-calm-blue-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Φόρτωση Εφαρμογής...</h2>
          <p className="text-gray-600">Σύνδεση με API Server</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-calm-blue-gradient flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-xl max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Σφάλμα Φόρτωσης</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="text-sm text-gray-500 mb-4">
            Βεβαιωθείτε ότι:
            <ul className="list-disc list-inside mt-2 text-left">
              <li>Το backend API server εκτελείται (port 3001)</li>
              <li>Η MySQL υπηρεσία εκτελείται</li>
              <li>Η βάση δεδομένων 'vacation_system' υπάρχει</li>
              <li>Οι πίνακες έχουν δημιουργηθεί σωστά</li>
            </ul>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ανανέωση Σελίδας
          </button>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <Dashboard
      currentUser={currentUser}
      vacationRequests={vacationRequests}
      userDatabase={userDatabase}
      departments={departments}
      onLogout={handleLogout}
      onRequestSubmit={handleRequestSubmit}
      onRequestDecision={handleRequestDecision}
    />
  );
};

export default App;
*/

import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';

const mockDepartments = [
  { id: 1, name: 'IT', color: '#3B82F6' },
  { id: 2, name: 'Human Resources', color: '#10B981' },
  { id: 3, name: 'Sales', color: '#F59E0B' },
  { id: 4, name: 'Marketing', color: '#EF4444' }
];

const mockUsers = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@company.com',
    username: 'john.smith',
    password: 'password123',
    role: 'employee',
    department: 'IT',
    department_id: 1,
    departmentId: 1,
    totalDays: 25,
    manager_id: 2
  },
  {
    id: 2,
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    username: 'emily.davis',
    password: 'manager123',
    role: 'manager',
    department: 'Human Resources',
    department_id: 2,
    departmentId: 2,
    totalDays: 30,
    manager_id: null
  }
];

const mockVacationRequests = [
  {
    id: 1,
    user_id: 1,
    userId: 1,
    start_date: '2025-01-15',
    startDate: '2025-01-15',
    end_date: '2025-01-20',
    endDate: '2025-01-20',
    reason: 'Family obligations',
    status: 'approved',
    created_at: '2025-01-01',
    submittedDate: '2025-01-01',
    reviewed_by: 2,
    reviewedBy: 2,
    reviewed_date: '2025-01-02',
    reviewedDate: '2025-01-02'
  }
];

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [vacationRequests, setVacationRequests] = useState(mockVacationRequests);
  const [userDatabase, setUserDatabase] = useState(mockUsers);
  const [departments, setDepartments] = useState(mockDepartments);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (username, password) => {
    try {
      console.log('Attempting login for:', username);
      
      const user = mockUsers.find(u => u.username === username && u.password === password);
      
      if (user) {
        console.log('User authenticated successfully:', user.name);
        setCurrentUser(user);
        setIsLoggedIn(true);
        return { success: true };
      } else {
        console.log('Authentication failed for:', username);
        return { success: false, error: 'Wrong login credentials' };
      }
    } catch (err) {
      console.error('Login failed:', err);
      return { success: false, error: 'Connection error. Please try again.' };
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    console.log('User logged out');
  };

  const handleRequestSubmit = async (requestData) => {
    try {
      console.log('Submitting vacation request:', requestData);
      
      const newRequest = {
        id: Date.now(),
        user_id: currentUser.id,
        userId: currentUser.id,
        start_date: requestData.startDate,
        startDate: requestData.startDate,
        end_date: requestData.endDate,
        endDate: requestData.endDate,
        reason: requestData.reason,
        status: 'pending',
        created_at: new Date().toISOString(),
        submittedDate: new Date().toISOString(),
        reviewed_by: null,
        reviewedBy: null,
        reviewed_date: null,
        reviewedDate: null
      };
      
      setVacationRequests(prev => [...prev, newRequest]);
      
      return { success: true, requestId: newRequest.id };
    } catch (err) {
      console.error('Failed to submit vacation request:', err);
      return { success: false, error: 'Failed to submit vacation request. Please try again.' };
    }
  };

  const handleRequestDecision = async (requestId, decision) => {
    try {
      console.log('Updating request decision:', requestId, decision);
      
      setVacationRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { 
                ...req, 
                status: decision, 
                reviewed_by: currentUser.id,
                reviewedBy: currentUser.id,
                reviewed_date: new Date().toISOString(),
                reviewedDate: new Date().toISOString()
              }
            : req
        )
      );
      
      return { success: true };
    } catch (err) {
      console.error('Failed to update vacation request:', err);
      return { success: false, error: 'Failed to update vacation request. Please try again.' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-calm-blue-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading App...</h2>
          <p className="text-gray-600">Connecting to the Server</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-calm-blue-gradient flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-xl max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <Dashboard
      currentUser={currentUser}
      vacationRequests={vacationRequests}
      userDatabase={userDatabase}
      departments={departments}
      onLogout={handleLogout}
      onRequestSubmit={handleRequestSubmit}
      onRequestDecision={handleRequestDecision}
    />
  );
};

export default App;