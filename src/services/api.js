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
  const response = await fetch('/api/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(appointmentData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al crear el turno');
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

  return response.json();
}

export async function fetchAllAppointments() {
  const token = localStorage.getItem('accessToken');
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

  return response.json();
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

  return response.json();
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
