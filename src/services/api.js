export async function cancelAppointment(appointmentId) {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`/api/appointments/${appointmentId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    let errorData = {};
    try { errorData = await response.json(); } catch {}
    throw new Error(errorData.message || 'Error al cancelar el turno');
  }
  return response.json();
}

export async function fetchData() {
  const response = await fetch('/api/data');
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
}

export async function fetchAppointments() {
  const token = localStorage.getItem('accessToken');
  
  console.log('fetchAppointments - Token available:', !!token);
  if (!token) {
    console.warn('No authentication token available');
    return [];
  }
  
  console.log('fetchAppointments - Making request to /api/appointments');
  const response = await fetch('/api/appointments', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error fetching appointments');
  }

  const data = await response.json();
  
  // Manejar diferentes estructuras de respuesta de la API
  if (Array.isArray(data)) {
    return data;
  } else if (data.appointments && Array.isArray(data.appointments)) {
    return data.appointments;
  } else if (data.data && Array.isArray(data.data)) {
    return data.data;
  } else {
    console.warn('Estructura de respuesta inesperada:', data);
    return [];
  }
}

export async function createAppointment(appointmentData) {
  const token = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  console.log('Token available:', !!token);
  console.log('Token length:', token ? token.length : 0);
  console.log('User info:', user);
  console.log('Sending appointment data:', appointmentData);
  
  // Validar que tengamos los datos necesarios
  if (!token) {
    throw new Error('No hay token de autenticación. Por favor, inicia sesión nuevamente.');
  }
  
  if (!appointmentData.serviceId || !appointmentData.date || !appointmentData.time) {
    throw new Error('Datos incompletos: se requieren serviceId, date y time.');
  }
  
  const response = await fetch('/api/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(appointmentData),
  });

  console.log('Response status:', response.status);

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
    }
    console.error('API Error:', errorData);
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// Admin API functions
export async function fetchAllUsers() {
  const token = localStorage.getItem('accessToken');
  const response = await fetch('/api/users', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error fetching users');
  }

  const data = await response.json();
  console.log('fetchAllUsers raw response:', data);
  
  // Manejar estructura de respuesta: {users: [...]} o array directo
  if (Array.isArray(data)) {
    console.log('fetchAllUsers returning array directly:', data);
    return data;
  } else if (data.users && Array.isArray(data.users)) {
    console.log('fetchAllUsers returning data.users:', data.users);
    return data.users;
  } else {
    console.warn('Unexpected users response structure:', data);
    return [];
  }
}

export async function fetchAllAppointments() {
  const token = localStorage.getItem('accessToken');
  const response = await fetch('/api/appointments/all', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error fetching appointments');
  }

  const data = await response.json();
  console.log('Raw appointments API response:', data);
  
  // Siempre devolver estructura consistente {appointments: [...]}
  if (Array.isArray(data)) {
    return { appointments: data };
  } else if (data.appointments && Array.isArray(data.appointments)) {
    return data;
  } else {
    console.warn('Unexpected appointments response structure:', data);
    return { appointments: [] };
  }
}

export async function fetchAllServices() {
  const response = await fetch('/api/services', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error fetching services');
  }

  const data = await response.json();
  console.log('fetchAllServices raw response:', data);
  
  // Manejar estructura de respuesta: {services: [...]} o array directo
  if (Array.isArray(data)) {
    console.log('fetchAllServices returning array directly:', data);
    return data;
  } else if (data.services && Array.isArray(data.services)) {
    return data.services;
  } else {
    console.warn('Unexpected services response structure:', data);
    return [];
  }
}

// Admin Edit/Update functions
export async function updateUser(userId, userData) {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`/api/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error updating user');
  }

  return response.json();
}

export async function updateAppointment(appointmentId, appointmentData) {
  const token = localStorage.getItem('accessToken');
  
  console.log('updateAppointment called with:', {
    appointmentId,
    appointmentData,
    stringifiedData: JSON.stringify(appointmentData)
  });
  
  const response = await fetch(`/api/appointments/${appointmentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(appointmentData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error updating appointment');
  }

  return response.json();
}

export async function updateService(serviceId, serviceData) {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`/api/services/${serviceId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(serviceData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error updating service');
  }

  return response.json();
}

export const forgotPassword = async (email) => {
  const res = await fetch('/api/users/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  return res.json();
};

export const resetPassword = async (token, password) => {
  const res = await fetch('/api/users/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password })
  });
  return res.json();
};
