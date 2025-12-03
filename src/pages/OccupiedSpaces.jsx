import { useState } from 'react';
import { useParkingContext } from '../context/ParkingContext';
import './OccupiedSpaces.css';

const OccupiedSpaces = () => {
  const { parkingSpaces, calculateBill } = useParkingContext();
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [filterType, setFilterType] = useState('all');

  const occupiedSpaces = parkingSpaces.filter(space => space.isOccupied);

  const filteredSpaces = occupiedSpaces.filter(space => {
    if (filterType === 'all') return true;
    return space.parkingType === filterType;
  });

  const openModal = (space) => {
    setSelectedSpace(space);
  };

  const closeModal = () => {
    setSelectedSpace(null);
  };

  const formatDuration = (checkInTime) => {
    const checkIn = new Date(checkInTime);
    const now = new Date();
    const diff = now - checkIn;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="occupied-spaces">
      <h1>Occupied Parking Spaces</h1>
      
      <div className="filter-bar">
        <button
          className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
          onClick={() => setFilterType('all')}
        >
          All ({occupiedSpaces.length})
        </button>
        <button
          className={`filter-btn ${filterType === 'daily' ? 'active' : ''}`}
          onClick={() => setFilterType('daily')}
        >
          Daily ({occupiedSpaces.filter(s => s.parkingType === 'daily').length})
        </button>
        <button
          className={`filter-btn ${filterType === 'monthly' ? 'active' : ''}`}
          onClick={() => setFilterType('monthly')}
        >
          Monthly ({occupiedSpaces.filter(s => s.parkingType === 'monthly').length})
        </button>
      </div>

      <div className="spaces-grid">
        {filteredSpaces.map(space => (
          <div
            key={space.id}
            className={`space-card occupied ${space.parkingType}`}
            onClick={() => openModal(space)}
          >
            <div className="space-number">{space.spaceNumber}</div>
            <div className="space-type">{space.parkingType}</div>
            <div className="space-vehicle">{space.vehicleNumber}</div>
            <div className="space-customer">{space.customerName}</div>
          </div>
        ))}
        {filteredSpaces.length === 0 && (
          <p className="no-data">No occupied spaces found</p>
        )}
      </div>

      {selectedSpace && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Space Details - {selectedSpace.spaceNumber}</h2>
            <div className="details-grid">
              <div className="detail-item">
                <label>Customer Name:</label>
                <span>{selectedSpace.customerName}</span>
              </div>
              <div className="detail-item">
                <label>Phone Number:</label>
                <span>{selectedSpace.phoneNumber}</span>
              </div>
              <div className="detail-item">
                <label>Vehicle Number:</label>
                <span>{selectedSpace.vehicleNumber}</span>
              </div>
              <div className="detail-item">
                <label>Parking Type:</label>
                <span className="badge">{selectedSpace.parkingType}</span>
              </div>

              {selectedSpace.parkingType === 'daily' && (
                <>
                  <div className="detail-item">
                    <label>Check-in Time:</label>
                    <span>{new Date(selectedSpace.checkInTime).toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <label>Duration:</label>
                    <span>{formatDuration(selectedSpace.checkInTime)}</span>
                  </div>
                  {selectedSpace.customAmount ? (
                    <div className="detail-item">
                      <label>Custom Amount:</label>
                      <span className="amount">${parseFloat(selectedSpace.customAmount).toFixed(2)}</span>
                    </div>
                  ) : (
                    <div className="detail-item">
                      <label>Current Bill:</label>
                      <span className="amount">${calculateBill(selectedSpace).toFixed(2)}</span>
                    </div>
                  )}
                </>
              )}

              {selectedSpace.parkingType === 'monthly' && (
                <>
                  <div className="detail-item">
                    <label>Start Date:</label>
                    <span>{new Date(selectedSpace.monthlyStartDate).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <label>End Date:</label>
                    <span>{new Date(selectedSpace.monthlyEndDate).toLocaleDateString()}</span>
                  </div>
                  {selectedSpace.customAmount ? (
                    <div className="detail-item">
                      <label>Custom Amount:</label>
                      <span className="amount">${parseFloat(selectedSpace.customAmount).toFixed(2)}</span>
                    </div>
                  ) : (
                    <div className="detail-item">
                      <label>Monthly Fee:</label>
                      <span className="amount">${calculateBill(selectedSpace).toFixed(2)}</span>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OccupiedSpaces;
