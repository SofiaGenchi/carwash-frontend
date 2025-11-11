// Component to display services in an admin view

const ServicesView = ({ services, openEditModal }) => (
  <div className="admin-table-container">
    <h3>Servicios Disponibles</h3>
    {services.length === 0 ? (
      <p>No hay servicios registrados</p>
    ) : (
      <table className="admin-table">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {services.map(service => (
            <tr key={service._id}>
              <td>
                {service.image && (
                  <img
                    src={service.image}
                    alt={service.name}
                    className="take-appointment-service-img-el"
                    loading="lazy"
                  />
                )}
              </td>
              <td>{service.name || service.nombre}</td>
              <td>{service.description || service.descripcion}</td>
              <td>${service.price ?? service.precio}</td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => openEditModal('service', service)}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

export default ServicesView;