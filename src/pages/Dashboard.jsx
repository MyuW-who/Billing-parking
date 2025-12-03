import { useParkingContext } from '../context/ParkingContext';
import './Dashboard.css';

const Dashboard = () => {
  const { getStatistics, billingHistory } = useParkingContext();
  const stats = getStatistics();

  const todayRevenue = billingHistory
    .filter(bill => {
      const billDate = new Date(bill.date);
      const today = new Date();
      return billDate.toDateString() === today.toDateString();
    })
    .reduce((sum, bill) => sum + (bill.amount || 0), 0);

  const monthlyRevenue = billingHistory
    .filter(bill => {
      const billDate = new Date(bill.date);
      const now = new Date();
      return (
        billDate.getMonth() === now.getMonth() &&
        billDate.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, bill) => sum + (bill.amount || 0), 0);

  return (
    <div className="dashboard">
      <h1>Parking Management Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card total">
          <h3>Total Spaces</h3>
          <div className="stat-number">{stats.total}</div>
        </div>
        
        <div className="stat-card available">
          <h3>Available Spaces</h3>
          <div className="stat-number">{stats.available}</div>
        </div>
        
        <div className="stat-card occupied">
          <h3>Occupied Spaces</h3>
          <div className="stat-number">{stats.occupied}</div>
        </div>
        
        <div className="stat-card daily">
          <h3>Daily Parking</h3>
          <div className="stat-number">{stats.daily}</div>
        </div>
        
        <div className="stat-card monthly">
          <h3>Monthly Parking</h3>
          <div className="stat-number">{stats.monthly}</div>
        </div>
        
        <div className="stat-card revenue">
          <h3>Today's Revenue</h3>
          <div className="stat-number">${todayRevenue.toFixed(2)}</div>
        </div>
        
        <div className="stat-card revenue-month">
          <h3>Monthly Revenue</h3>
          <div className="stat-number">${monthlyRevenue.toFixed(2)}</div>
        </div>
        
        <div className="stat-card occupancy">
          <h3>Occupancy Rate</h3>
          <div className="stat-number">
            {stats.total > 0 ? ((stats.occupied / stats.total) * 100).toFixed(1) : 0}%
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Transactions</h2>
        <div className="activity-list">
          {billingHistory.slice(0, 5).map(bill => (
            <div key={bill.id} className="activity-item">
              <div className="activity-info">
                <strong>{bill.spaceNumber}</strong> - {bill.customerName}
                <br />
                <small>{bill.vehicleNumber} ({bill.parkingType})</small>
              </div>
              <div className="activity-amount">${(bill.amount || 0).toFixed(2)}</div>
              <div className="activity-date">
                {new Date(bill.date).toLocaleString()}
              </div>
            </div>
          ))}
          {billingHistory.length === 0 && (
            <p className="no-data">No transactions yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
