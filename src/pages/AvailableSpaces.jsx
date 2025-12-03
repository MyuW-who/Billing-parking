import { useState } from 'react';
import { useParkingContext } from '../context/ParkingContext';
import './AvailableSpaces.css';

const AvailableSpaces = () => {
  const { parkingSpaces, parkVehicle } = useParkingContext();
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    vehicleNumber: '',
    parkingType: 'daily',
    monthlyStartDate: '',
    monthlyEndDate: '',
    customAmount: '',
    useCustomAmount: false,
  });

  const availableSpaces = parkingSpaces.filter(space => !space.isOccupied);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedSpace) {
      parkVehicle(selectedSpace.id, formData);
      setSelectedSpace(null);
      setFormData({
        customerName: '',
        phoneNumber: '',
        vehicleNumber: '',
        parkingType: 'daily',
        monthlyStartDate: '',
        monthlyEndDate: '',
        customAmount: '',
        useCustomAmount: false,
      });
    }
  };

  const openModal = (space) => {
    setSelectedSpace(space);
  };

  const closeModal = () => {
    setSelectedSpace(null);
    setFormData({
      customerName: '',
      phoneNumber: '',
      vehicleNumber: '',
      parkingType: 'daily',
      monthlyStartDate: '',
      monthlyEndDate: '',
      customAmount: '',
      useCustomAmount: false,
    });
  };

  return (
    <div className="available-spaces">
      <h1>Available Parking Spaces</h1>
      <p className="space-count">
        {availableSpaces.length} spaces available out of {parkingSpaces.length}
      </p>

      <div className="spaces-grid">
        {availableSpaces.map(space => (
          <div
            key={space.id}
            className="space-card available"
            onClick={() => openModal(space)}
          >
            <div className="space-number">{space.spaceNumber}</div>
            <div className="space-status">Available</div>
          </div>
        ))}
      </div>

      {selectedSpace && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Park Vehicle - Space {selectedSpace.spaceNumber}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Customer Name *</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Vehicle Number *</label>
                <input
                  type="text"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Parking Type *</label>
                <select
                  name="parkingType"
                  value={formData.parkingType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="daily">Daily ($5/hour, max $50/day)</option>
                  <option value="monthly">Monthly ($300/month)</option>
                </select>
              </div>

              {formData.parkingType === 'monthly' && (
                <>
                  <div className="form-group">
                    <label>Start Date *</label>
                    <input
                      type="date"
                      name="monthlyStartDate"
                      value={formData.monthlyStartDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>End Date *</label>
                    <input
                      type="date"
                      name="monthlyEndDate"
                      value={formData.monthlyEndDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </>
              )}

              <div className="form-group custom-amount-section">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="useCustomAmount"
                    checked={formData.useCustomAmount}
                    onChange={handleInputChange}
                  />
                  <span>Set Custom Amount</span>
                </label>
              </div>

              {formData.useCustomAmount && (
                <div className="form-group">
                  <label>Custom Amount ($) *</label>
                  <input
                    type="number"
                    name="customAmount"
                    value={formData.customAmount}
                    onChange={handleInputChange}
                    placeholder="Enter custom amount"
                    min="0"
                    step="0.01"
                    required
                  />
                  <small className="form-hint">This will override the standard pricing</small>
                </div>
              )}

              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  Park Vehicle
                </button>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailableSpaces;
