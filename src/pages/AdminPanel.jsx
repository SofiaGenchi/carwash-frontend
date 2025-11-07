import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  fetchAllUsers, 
  fetchAllAppointments, 
  fetchAllServices,
  updateUser,
  updateAppointment,
  updateService
} from '../services/api';
import UsersView from '../components/UsersView';
import AppointmentsView from '../components/AppointmentsView';
import ServicesView from '../components/ServicesView';

const AdminPanel = () => {
  const [activeView, setActiveView] = useState('users');
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Estados para el modo de edición
  const [editModal, setEditModal] = useState({ show: false, type: '', data: null });
  const [editForm, setEditForm] = useState({});
  const [updating, setUpdating] = useState(false);
  
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'admin') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);


  const fetchUsersData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAllUsers();
      console.log('Users data received:', data);
      
      // Extract users array from response
      const usersArray = Array.isArray(data?.users) 
        ? data.users 
        : Array.isArray(data) 
          ? data 
          : [];
      
      setUsers(usersArray);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const fetchAppointmentsData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch all data in parallel since backend populate doesn't work in microservices
      const [appointmentsResponse, usersResponse, servicesResponse] = await Promise.all([
        fetchAllAppointments(),
        fetchAllUsers(),
        fetchAllServices()
      ]);

      console.log('Appointments response:', appointmentsResponse);
      console.log('Users response:', usersResponse);
      console.log('Services response:', servicesResponse);

      // Extract arrays from responses
      const appointmentsArray = Array.isArray(appointmentsResponse?.appointments) 
        ? appointmentsResponse.appointments 
        : [];
      
      const usersArray = Array.isArray(usersResponse?.users) 
        ? usersResponse.users 
        : [];
      
      const servicesArray = Array.isArray(servicesResponse?.services) 
        ? servicesResponse.services 
        : [];

      console.log('Extracted arrays:', {
        appointments: appointmentsArray,
        users: usersArray,
        services: servicesArray
      });

      // Debug: Log specific IDs
      console.log('Appointment user IDs:', appointmentsArray.map(a => a.user));
      console.log('Appointment service IDs:', appointmentsArray.map(a => a.service));
      console.log('Available user IDs:', usersArray.map(u => u._id));
      console.log('Available service IDs:', servicesArray.map(s => s._id));
      
      // Check for exact matches
      appointmentsArray.forEach(appointment => {
        const userExists = usersArray.find(u => u._id === appointment.user);
        const serviceExists = servicesArray.find(s => s._id === appointment.service);
        console.log(`Appointment ${appointment._id}:`, {
          needsUser: appointment.user,
          userExists: !!userExists,
          userFound: userExists?._id,
          needsService: appointment.service, 
          serviceExists: !!serviceExists,
          serviceFound: serviceExists?._id
        });
      });

      // Create lookup maps
      const usersMap = usersArray.reduce((map, user) => {
        map[user._id] = user;
        return map;
      }, {});

      const servicesMap = servicesArray.reduce((map, service) => {
        map[service._id] = service;
        return map;
      }, {});

      console.log('Users map:', usersMap);
      console.log('Services map:', servicesMap);

      // Enrich appointments with user and service data
      const enrichedAppointments = appointmentsArray.map(appointment => {
        const user = usersMap[appointment.user];
        const service = servicesMap[appointment.service];
        
        console.log(`Mapping appointment ${appointment._id}:`, {
          userIdFromAppointment: appointment.user,
          foundUser: user,
          serviceIdFromAppointment: appointment.service,
          foundService: service
        });

        return {
          ...appointment,
          // Preservar IDs originales para edición, pero agregar datos completos para mostrar
          originalUserId: appointment.user, // ID original como string
          originalServiceId: appointment.service, // ID original como string
          user: user || { 
            name: `Usuario no encontrado (ID: ${appointment.user.substring(0,8)}...)`, 
            email: 'N/A' 
          },
          service: service || { 
            name: `Servicio no encontrado (ID: ${appointment.service.substring(0,8)}...)`, 
            price: 0 
          }
        };
      });
      
      console.log('Enriched appointments:', enrichedAppointments);
      setAppointments(enrichedAppointments);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const fetchServicesData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAllServices();
      console.log('Services data received:', data);
      
      // Extract services array from response
      const servicesArray = Array.isArray(data?.services) 
        ? data.services 
        : Array.isArray(data) 
          ? data 
          : [];
      
      setServices(servicesArray);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    switch (activeView) {
      case 'users':
        fetchUsersData();
        break;
      case 'appointments':
        fetchAppointmentsData();
        break;
      case 'services':
        fetchServicesData();
        break;
      default:
        break;
    }
  }, [activeView]);


  const openEditModal = (type, data) => {
    console.log('Opening edit modal with data:', data);
    
    setEditModal({ show: true, type, data });
    
    // Preparar los datos para el formulario
    let formData = { ...data };
    
    // Si es un appointment, convertir el time al formato correcto para input type="time"
    if (type === 'appointment' && formData.time) {
      // Convertir "10.00hs" a "10:00"
      const timeStr = formData.time.replace('hs', '').replace('.', ':');
      // Asegurar formato HH:MM
      const [hours, minutes] = timeStr.split(':');
      formData.time = `${hours.padStart(2, '0')}:${(minutes || '00').padStart(2, '0')}`;
    }
    
    setEditForm(formData);
  };

  const closeEditModal = () => {
    setEditModal({ show: false, type: '', data: null });
    setEditForm({});
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');

    try {
      const { type, data } = editModal;
      let payload = { ...editForm };

      // Seguridad: nunca enviar password si no se está cambiando
      if (type === 'user' && !payload.newPassword) {
        delete payload.password;
      }

      switch (type) {
        case 'user':
          await updateUser(data._id, payload);
          await fetchUsersData();
          break;
        case 'appointment':
          // Convertir el time de "10:00" a "10.00hs" para la API
          if (payload.time) {
            const [hours, minutes] = payload.time.split(':');
            payload.time = `${hours}.${minutes}hs`;
          }
          
          // Usar los IDs originales que preservamos en el enriquecimiento
          const appointmentPayload = {
            date: payload.date,
            time: payload.time,
            status: payload.status,
            notes: payload.notes || '',
            // Usar los IDs originales preservados
            user: editModal.data.originalUserId,
            service: editModal.data.originalServiceId
          };
          
          console.log('Appointment payload being sent:', appointmentPayload);
          console.log('Using preserved IDs:', {
            originalUserId: editModal.data.originalUserId,
            originalServiceId: editModal.data.originalServiceId
          });
          
          await updateAppointment(data._id, appointmentPayload);
          await fetchAppointmentsData();
          break;
        case 'service':
          await updateService(data._id, payload);
          await fetchServicesData();
          break;
      }
      
      closeEditModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleFormChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  if (!isAuthenticated || !user || user.role !== 'admin') {
    return null;
  }

  return (
    <>
      <Header />
      <div className="admin-panel">
        <div className="admin-header">
          <h1>Panel de Administración</h1>
          <p>Bienvenido, {user.nombre} {user.apellido}</p>
        </div>

      <div className="admin-navigation">
        <button 
          className={`admin-nav-btn ${activeView === 'users' ? 'active' : ''}`}
          onClick={() => setActiveView('users')}
        >
          Usuarios ({users.length})
        </button>
        <button 
          className={`admin-nav-btn ${activeView === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveView('appointments')}
        >
          Turnos ({appointments.length})
        </button>
        <button 
          className={`admin-nav-btn ${activeView === 'services' ? 'active' : ''}`}
          onClick={() => setActiveView('services')}
        >
          Servicios ({services.length})
        </button>
      </div>

      <div className="admin-content">
        {loading && (
          <div className="admin-loading">
            <div className="loading-spinner"></div>
            <p>Cargando...</p>
          </div>
        )}

        {error && (
          <div className="admin-error">
            <p>Error: {error}</p>
            <button onClick={() => window.location.reload()}>Reintentar</button>
          </div>
        )}

        {!loading && !error && (
          <div>
            {activeView === 'users' && (
              <UsersView users={users} openEditModal={openEditModal} />
            )}
            {activeView === 'appointments' && (
              <AppointmentsView appointments={appointments} openEditModal={openEditModal} />
            )}
            {activeView === 'services' && (
              <ServicesView services={services} openEditModal={openEditModal} />
            )}
          </div>
        )}
      </div>

      {/* Modal de Edición */}
      {editModal.show && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Editar {editModal.type === 'user' ? 'Usuario' : editModal.type === 'appointment' ? 'Turno' : 'Servicio'}</h3>
              <button className="modal-close" onClick={closeEditModal}>×</button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="edit-form">
              {editModal.type === 'user' && (
                <>
                  <div className="form-group">
                    <label>Nombre:</label>
                    <input
                      type="text"
                      value={editForm.nombre || ''}
                      onChange={(e) => handleFormChange('nombre', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Apellido:</label>
                    <input
                      type="text"
                      value={editForm.apellido || ''}
                      onChange={(e) => handleFormChange('apellido', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      value={editForm.email || ''}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Teléfono:</label>
                    <input
                      type="text"
                      value={editForm.telefono || ''}
                      onChange={(e) => handleFormChange('telefono', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Rol:</label>
                    <select
                      value={editForm.role || 'user'}
                      onChange={(e) => handleFormChange('role', e.target.value)}
                    >
                      <option value="user">Usuario</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </>
              )}

              {editModal.type === 'appointment' && (
                <>
                  <div className="form-group">
                    <label>Fecha:</label>
                    <input
                      type="date"
                      value={editForm.date ? new Date(editForm.date).toISOString().split('T')[0] : ''}
                      onChange={(e) => handleFormChange('date', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Hora:</label>
                    <input
                      type="time"
                      value={editForm.time || ''}
                      onChange={(e) => handleFormChange('time', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Estado:</label>
                    <select
                      value={editForm.status || 'pending'}
                      onChange={(e) => handleFormChange('status', e.target.value)}
                    >
                      <option value="pending">Pendiente</option>
                      <option value="confirmed">Confirmado</option>
                      <option value="cancelled">Cancelado</option>
                      <option value="completed">Completado</option>
                    </select>
                  </div>
                </>
              )}

              {editModal.type === 'service' && (
                <>
                  <div className="form-group">
                    <label>Nombre:</label>
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Descripción:</label>
                    <textarea
                      value={editForm.description || ''}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      required
                      rows="3"
                    />
                  </div>
                  <div className="form-group">
                    <label>Precio:</label>
                    <input
                      type="number"
                      value={editForm.price || ''}
                      onChange={(e) => handleFormChange('price', parseInt(e.target.value))}
                      required
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label>Duración (minutos):</label>
                    <input
                      type="number"
                      value={editForm.duration || ''}
                      onChange={(e) => handleFormChange('duration', parseInt(e.target.value))}
                      required
                      min="1"
                    />
                  </div>
                  <div className="form-group">
                    <label>Estado:</label>
                    <select
                      value={editForm.isActive !== undefined ? editForm.isActive : true}
                      onChange={(e) => handleFormChange('isActive', e.target.value === 'true')}
                    >
                      <option value="true">Activo</option>
                      <option value="false">Inactivo</option>
                    </select>
                  </div>
                </>
              )}

              {error && <div className="error-message">{error}</div>}

              <div className="modal-actions">
                <button type="button" onClick={closeEditModal} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" disabled={updating} className="btn-save">
                  {updating ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
      <Footer />
    </>
  );
};

export default AdminPanel;