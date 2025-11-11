// Admin panel page for managing users, appointments, and services
import { useState, useEffect } from 'react';
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
  
  // Modal state for editing
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

  // Fetch all users data
  const fetchUsersData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all appointments data
  const fetchAppointmentsData = async () => {
    setLoading(true);
    setError('');
    try {
      const [appointmentsResponse, usersResponse, servicesResponse] = await Promise.all([
        fetchAllAppointments(),
        fetchAllUsers(),
        fetchAllServices()
      ]);

      const appointmentsArray = Array.isArray(appointmentsResponse?.appointments) 
        ? appointmentsResponse.appointments 
        : [];
      
      const usersArray = Array.isArray(usersResponse) 
        ? usersResponse 
        : [];
      
      const servicesArray = Array.isArray(servicesResponse) 
        ? servicesResponse 
        : [];

      const usersMap = usersArray.reduce((map, user) => {
        map[user._id] = user;
        return map;
      }, {});

      const servicesMap = servicesArray.reduce((map, service) => {
        map[service._id] = service;
        return map;
      }, {});

      const enrichedAppointments = appointmentsArray.map(appointment => {
        const user = usersMap[appointment.user];
        const service = servicesMap[appointment.service];

        return {
          ...appointment,
          originalUserId: appointment.user,
          originalServiceId: appointment.service,
          user: user || { 
            name: `User not found (ID: ${appointment.user.substring(0,8)}...)`, 
            email: 'N/A' 
          },
          service: service || { 
            name: `Service not found (ID: ${appointment.service.substring(0,8)}...)`, 
            price: 0 
          }
        };
      });

      setAppointments(enrichedAppointments);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all services data
  const fetchServicesData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAllServices();
      setServices(Array.isArray(data) ? data : []);
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

  // Open the edit modal with the provided data
  const openEditModal = (type, data) => {
    setEditModal({ show: true, type, data });
    let formData = { ...data };

    if (type === 'appointment' && formData.time) {
      const timeStr = formData.time.replace('hs', '').replace('.', ':');
      const [hours, minutes] = timeStr.split(':');
      formData.time = `${hours.padStart(2, '0')}:${(minutes || '00').padStart(2, '0')}`;
    }

    setEditForm(formData);
  };

  // Close the edit modal
  const closeEditModal = () => {
    setEditModal({ show: false, type: '', data: null });
    setEditForm({});
  };

  // Handle the submission of the edit form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');

    try {
      const { type, data } = editModal;
      let payload = { ...editForm };

      if (type === 'user' && !payload.newPassword) {
        delete payload.password;
      }

      switch (type) {
        case 'user':
          await updateUser(data._id, payload);
          await fetchUsersData();
          break;
        case 'appointment':
          if (payload.time) {
            const [hours, minutes] = payload.time.split(':');
            payload.time = `${hours}.${minutes}hs`;
          }
          
          const appointmentPayload = {
            date: payload.date,
            time: payload.time,
            status: payload.status,
            notes: payload.notes || '',
            user: editModal.data.originalUserId,
            service: editModal.data.originalServiceId
          };
          
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
          <h1>Admin Panel</h1>
          <p>Welcome, {user.nombre} {user.apellido}</p>
        </div>

      <div className="admin-navigation">
        <button 
          className={`admin-nav-btn ${activeView === 'users' ? 'active' : ''}`}
          onClick={() => setActiveView('users')}
        >
          Users ({users.length})
        </button>
        <button 
          className={`admin-nav-btn ${activeView === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveView('appointments')}
        >
          Appointments ({appointments.length})
        </button>
        <button 
          className={`admin-nav-btn ${activeView === 'services' ? 'active' : ''}`}
          onClick={() => setActiveView('services')}
        >
          Services ({services.length})
        </button>
      </div>

      <div className="admin-content">
        {loading && (
          <div className="admin-loading">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        )}

        {error && (
          <div className="admin-error">
            <p>Error: {error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
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

      {/* Edit Modal */}
      {editModal.show && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit {editModal.type === 'user' ? 'User' : editModal.type === 'appointment' ? 'Appointment' : 'Service'}</h3>
              <button className="modal-close" onClick={closeEditModal}>×</button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="edit-form">
              {editModal.type === 'user' && (
                <>
                  <div className="form-group">
                    <label>First Name:</label>
                    <input
                      type="text"
                      value={editForm.nombre || ''}
                      onChange={(e) => handleFormChange('nombre', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name:</label>
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
                    <label>Phone:</label>
                    <input
                      type="text"
                      value={editForm.telefono || ''}
                      onChange={(e) => handleFormChange('telefono', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Role:</label>
                    <select
                      value={editForm.role || 'user'}
                      onChange={(e) => handleFormChange('role', e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </>
              )}

              {editModal.type === 'appointment' && (
                <>
                  <div className="form-group">
                    <label>Date:</label>
                    <input
                      type="date"
                      value={editForm.date ? new Date(editForm.date).toISOString().split('T')[0] : ''}
                      onChange={(e) => handleFormChange('date', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Time:</label>
                    <input
                      type="time"
                      value={editForm.time || ''}
                      onChange={(e) => handleFormChange('time', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Status:</label>
                    <select
                      value={editForm.status || 'pending'}
                      onChange={(e) => handleFormChange('status', e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </>
              )}

              {editModal.type === 'service' && (
                <>
                  <div className="form-group">
                    <label>Name:</label>
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description:</label>
                    <textarea
                      value={editForm.description || ''}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      required
                      rows="3"
                    />
                  </div>
                  <div className="form-group">
                    <label>Price:</label>
                    <input
                      type="number"
                      value={editForm.price || ''}
                      onChange={(e) => handleFormChange('price', parseInt(e.target.value))}
                      required
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label>Duration (minutes):</label>
                    <input
                      type="number"
                      value={editForm.duration || ''}
                      onChange={(e) => handleFormChange('duration', parseInt(e.target.value))}
                      required
                      min="1"
                    />
                  </div>
                  <div className="form-group">
                    <label>Status:</label>
                    <select
                      value={editForm.isActive !== undefined ? editForm.isActive : true}
                      onChange={(e) => handleFormChange('isActive', e.target.value === 'true')}
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </>
              )}

              {error && <div className="error-message">{error}</div>}

              <div className="modal-actions">
                <button type="button" onClick={closeEditModal} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" disabled={updating} className="btn-save">
                  {updating ? 'Saving...' : 'Save'}
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