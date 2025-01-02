import React from 'react';
import useAdminTrips from '../hooks/useAdminTrips';
import useAdminBuses from '../hooks/useAdminBuses';
import useAdminTickets from '../hooks/useAdminTickets';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const { trips, loading: tripsLoading } = useAdminTrips();
  const { buses, loading: busesLoading } = useAdminBuses();
  const { tickets, loading: ticketsLoading } = useAdminTickets();
  console.log(tickets)
  if (tripsLoading || busesLoading || ticketsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const totalTrips = trips.length;
  const totalBuses = buses.length;
  const totalTickets = tickets.length;
  const totalRevenue = tickets.reduce((sum, ticket) => {
    const bus = buses.find(b => b.bus_id === ticket.bus_id);
    return sum + (bus ? bus.price : 0);
  }, 0);

  // Rota istatistikleri
  const routeStats = trips.reduce((acc, trip) => {
    const route = `${trip.departure_city} - ${trip.arrival_city}`;
    acc[route] = (acc[route] || 0) + 1;
    return acc;
  }, {});

  const popularRoutes = Object.entries(routeStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Doughnut chart verisi
  const routeChartData = {
    labels: popularRoutes.map(([route]) => route),
    datasets: [
      {
        data: popularRoutes.map(([, count]) => count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Aylık gelir hesaplama
  const calculateMonthlyRevenue = () => {
    return tickets.reduce((acc, ticket) => {
      const bus = buses.find(b => b.bus_id === ticket.bus_id);
      const trip = trips.find(t => t.trip_id === ticket.trip_id);
      
      if (!bus || !trip) return acc;

      const date = new Date(trip.date_);
      const monthYear = date.toLocaleString('tr-TR', { month: 'long', year: 'numeric' });
      
      if (!acc[monthYear]) {
        acc[monthYear] = {
          total: 0,
          count: 0
        };
      }
      
      acc[monthYear].total += bus.price;
      acc[monthYear].count += 1;
      return acc;
    }, {});
  };

  const monthlyStats = calculateMonthlyRevenue();
  const sortedMonths = Object.entries(monthlyStats)
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .slice(-6);

  const revenueData = {
    labels: sortedMonths.map(([month]) => month),
    datasets: [{
      label: 'Aylık Gelir (₺)',
      data: sortedMonths.map(([, data]) => data.total),
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.3,
      pointBackgroundColor: 'rgb(75, 192, 192)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 6,
      pointHoverRadius: 8,
    }]
  };

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Genel Bilgiler</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-gray-500 text-sm font-medium">Toplam Sefer</h3>
          <p className="text-2xl font-bold text-indigo-600">{totalTrips}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-gray-500 text-sm font-medium">Toplam Otobüs</h3>
          <p className="text-2xl font-bold text-blue-600">{totalBuses}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-gray-500 text-sm font-medium">Satılan Bilet</h3>
          <p className="text-2xl font-bold text-green-600">{totalTickets}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-gray-500 text-sm font-medium">Toplam Gelir</h3>
          <p className="text-2xl font-bold text-purple-600">{totalRevenue.toFixed(2)} ₺</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Popüler Rotalar</h2>
          <div className="h-[300px]">
            <Doughnut 
              data={routeChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Aylık Gelir Grafiği</h2>
          <div className="h-[300px]">
            <Line 
              data={revenueData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top'
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `${context.parsed.y.toLocaleString('tr-TR')} ₺`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return `${value.toLocaleString('tr-TR')} ₺`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Son Satılan Biletler</h2>
        <div className="space-y-4">
          {tickets.slice(0,5).map((ticket) => {
            const bus = buses.find(b => b.bus_id === ticket.bus_id);
            const trip = trips.find(t => t.trip_id === ticket.trip_id);
            return (
              <div key={ticket.ticket_id} className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-lg transition-colors duration-150">
                <div>
                  <p className="font-medium text-gray-800">{ticket.user_name}</p>
                  <p className="text-sm text-gray-500">
                    {trip ? `${trip.departure_city} - ${trip.arrival_city}` : 'N/A'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {trip ? new Date(trip.date_).toLocaleDateString('tr-TR') : ''}
                  </p>
                </div>
                <span className="text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                  {bus ? `${bus.price.toFixed(2)} ₺` : 'N/A'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;