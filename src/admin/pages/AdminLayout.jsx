import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLayout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [tickets, setTickets] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const busResponse = await fetch('/api/buses');
        const routeResponse = await fetch('/api/routes');
        const ticketResponse = await fetch('/api/tickets');

        const busData = await busResponse.json();
        const routeData = await routeResponse.json();
        const ticketData = await ticketResponse.json();

        setBuses(busData);
        setRoutes(routeData);
        setTickets(ticketData);
      } catch (error) {
        console.error('Data fetching error:', error);
      }
    };

    fetchInitialData();
  }, []);

  const renderDashboard = () => (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-blue-100 p-4 rounded">
        <h2>Total Buses: {buses.length}</h2>
      </div>
      <div className="bg-green-100 p-4 rounded">
        <h2>Total Routes: {routes.length}</h2>
      </div>
      <div className="bg-red-100 p-4 rounded">
        <h2>Total Tickets: {tickets.length}</h2>
      </div>
    </div>
  );

  const renderBusManagement = () => (
    <div>
      <h2 className="text-2xl mb-4">Bus Management</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th>Bus ID</th>
            <th>Plate Number</th>
            <th>Capacity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {buses.map(bus => (
            <tr key={bus.id} className="text-center">
              <td>{bus.id}</td>
              <td>{bus.plateNumber}</td>
              <td>{bus.capacity}</td>
              <td>
                <button className="mr-2 bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
        Add New Bus
      </button>
    </div>
  );

  const renderRouteManagement = () => (
    <div>
      <h2 className="text-2xl mb-4">Route Management</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th>Route ID</th>
            <th>From</th>
            <th>To</th>
            <th>Distance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {routes.map(route => (
            <tr key={route.id} className="text-center">
              <td>{route.id}</td>
              <td>{route.from}</td>
              <td>{route.to}</td>
              <td>{route.distance} km</td>
              <td>
                <button className="mr-2 bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
        Add New Route
      </button>
    </div>
  );

  const renderTicketManagement = () => (
    <div>
      <h2 className="text-2xl mb-4">Ticket Management</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Passenger</th>
            <th>Route</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(ticket => (
            <tr key={ticket.id} className="text-center">
              <td>{ticket.id}</td>
              <td>{ticket.passengerName}</td>
              <td>{ticket.route}</td>
              <td>{ticket.date}</td>
              <td>{ticket.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard();
      case 'buses': return renderBusManagement();
      case 'routes': return renderRouteManagement();
      case 'tickets': return renderTicketManagement();
      default: return renderDashboard();
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-2xl mb-8">Admin Panel</h1>
        <nav>
          <ul>
            {['dashboard', 'buses', 'routes', 'tickets'].map(tab => (
              <li 
                key={tab} 
                className={`py-2 px-4 cursor-pointer ${activeTab === tab ? 'bg-gray-700' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </li>
            ))}
            <li 
              className="py-2 px-4 cursor-pointer mt-4"
              onClick={() => navigate('/')}
            >
              Logout
            </li>
          </ul>
        </nav>
      </div>

      <div className="flex-1 p-8 bg-gray-100 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminLayout;