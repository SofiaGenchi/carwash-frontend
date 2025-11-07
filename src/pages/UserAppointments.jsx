import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import AppointmentsList from '../components/AppointmentsList';
import { useState as useReactState } from 'react';
import TakeAppointmentFlow from '../components/TakeAppointmentFlow';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { fetchAppointments, cancelAppointment } from '../services/api';

const UserAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useReactState({ service: '', date: '', time: '' });
  const [takeError, setTakeError] = useReactState('');
  const [takeLoading, setTakeLoading] = useReactState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('UserAppointments mounted');

    // Bloquear acceso si no está autenticado
    if (!isAuthenticated) {
      console.log('Usuario no autenticado, redirigiendo al login');
      localStorage.setItem('loginRedirect', '/user-appointments');
      navigate('/login');
      return;
    }

    const fetchUserAppointments = async () => {
      try {
        console.log('Fetching appointments from backend...');
        const data = await fetchAppointments();
        console.log('Appointments fetched:', data);
        console.log('Data type:', typeof data);
        console.log('Is array:', Array.isArray(data));

        setAppointments(data);
      } catch (error) {
        console.error('Error al obtener los turnos:', error);
        setError('Error al obtener los turnos. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAppointments();

    // Si hay un hash en la URL, hacer scroll a la sección correspondiente
    if (location.hash === '#turnos') {
      const turnosSection = document.getElementById('turnos');
      if (turnosSection) {
        turnosSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [navigate, isAuthenticated, location.hash]);

  if (loading) {
    return (
      <div>
        <Header />
        <main style={{ marginTop: 80, padding: 20, textAlign: 'center' }}>
          <p>Cargando tus turnos...</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Cancelar turno y refrescar lista
  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('¿Estás seguro de cancelar este turno?')) {
      setLoading(true);
      try {
        await cancelAppointment(appointmentId);
        const updated = await fetchAppointments();
        setAppointments(updated);
      } catch (err) {
        alert('Error al cancelar el turno');
      } finally {
        setLoading(false);
      }
    }
  };

  // Mostrar siempre la lista de turnos y el formulario para tomar turno
  return (
    <div>
      <Header />
      <main style={{ marginTop: 80, padding: 20 }}>
        <AppointmentsList appointments={appointments} onCancelAppointment={handleCancelAppointment} />
        <section style={{ marginTop: 40 }}>
          <TakeAppointmentFlow onAppointmentCreated={() => {
            setLoading(true);
            fetchAppointments().then(data => {
              setAppointments(data);
              setLoading(false);
            });
          }} />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default UserAppointments;
