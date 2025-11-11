// Cancel an appointment by ID
export async function cancelAppointment(appointmentId) {
  const token = localStorage.getItem('accessToken');
  console.log('cancelAppointment - Token available:', !!token);
  console.log('cancelAppointment - Cancelling appointment ID:', appointmentId);
  const response = await fetch(
    `/api/appointments/${appointmentId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    }
  );
  console.log('cancelAppointment - Response status:', response.status);
  if (!response.ok) {
    let errorData = {};
    try { errorData = await response.json(); } catch {}
    console.error('cancelAppointment - Error data:', errorData);
    throw new Error(errorData.message || 'Error al cancelar el turno');
  }
  const result = await response.json();
  console.log('cancelAppointment - Success result:', result);
  return result;
}

// Fetch generic data
export async function fetchData() {
  const response = await fetch('/api/data');
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
}

// Fetch appointments for the logged-in user
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
  
  // Handle different API response structures
  let appointmentsArray = [];
  if (Array.isArray(data)) {
    appointmentsArray = data;
  } else if (data.appointments && Array.isArray(data.appointments)) {
    appointmentsArray = data.appointments;
  } else if (data.data && Array.isArray(data.data)) {
    appointmentsArray = data.data;
  } else {
    console.warn('Estructura de respuesta inesperada:', data);
    return [];
  }

  // Fetch services to populate appointment.service
  try {
    const servicesResponse = await fetch('/api/services', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const servicesData = await servicesResponse.json();
    const servicesArray = Array.isArray(servicesData) ? servicesData : servicesData.services || [];
    const servicesMap = servicesArray.reduce((map, service) => {
      map[service._id] = service;
      return map;
    }, {});

    // Enrich appointments with service data
    const enrichedAppointments = appointmentsArray.map(appointment => ({
      ...appointment,
      service: servicesMap[appointment.service] || { name: 'Servicio no encontrado', price: 0 }
    }));

    console.log('fetchAppointments - Enriched appointments:', enrichedAppointments);
    return enrichedAppointments;
  } catch (error) {
    console.error('Error fetching services for appointments:', error);
    // Return appointments without enrichment if services fetch fails
    return appointmentsArray;
  }
}

// Create a new appointment
export async function createAppointment(appointmentData) {
  const token = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  console.log('Token available:', !!token);
  console.log('Token length:', token ? token.length : 0);
  console.log('User info:', user);
  console.log('Sending appointment data:', appointmentData);
  
  // Validate required data
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

// Fetch all users (Admin)
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
  
  // Handle response structure: {users: [...]} or direct array
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

// Fetch all appointments (Admin)
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
  
  // Always return consistent structure {appointments: [...]} 
  if (Array.isArray(data)) {
    return { appointments: data };
  } else if (data.appointments && Array.isArray(data.appointments)) {
    return data;
  } else {
    console.warn('Unexpected appointments response structure:', data);
    return { appointments: [] };
  }
}

// Fetch all services
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
  
  // Handle response structure: {services: [...]} or direct array
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

// Update user details (Admin)
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

// Update appointment details
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

// Update service details
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

// Request password recovery email
export const forgotPassword = async (email) => {
  console.log('forgotPassword called with email:', email);
  
  try {
    const res = await fetch('/api/users/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    console.log('forgotPassword response status:', res.status);
    const data = await res.json();
    console.log('forgotPassword response data:', data);
    
    if (!res.ok) {
      throw new Error(data.message || 'Error en forgot password');
    }
    
    return data;
  } catch (error) {
    console.error('forgotPassword error:', error);
    throw error;
  }
};

// Reset user password
export const resetPassword = async (token, password) => {
  const res = await fetch('/api/users/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword: password })
  });
  return res.json();
};
