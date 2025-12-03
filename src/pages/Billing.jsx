import { useState, useRef } from 'react';
import { useParkingContext } from '../context/ParkingContext';
import './Billing.css';

const Billing = () => {
  const { parkingSpaces, generateBill, removeVehicle, billingHistory, pricing } = useParkingContext();
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [generatedBill, setGeneratedBill] = useState(null);
  const printRef = useRef(null);

  const occupiedSpaces = parkingSpaces.filter(space => space.isOccupied);

  const handleGenerateBill = () => {
    if (selectedSpace) {
      const bill = generateBill(selectedSpace.id);
      setGeneratedBill(bill);
    }
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    const windowPrint = window.open('', '', 'width=800,height=600');
    windowPrint.document.write(`
      <html>
        <head>
          <title>Parking Bill</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            .print-bill {
              border: 2px solid #333;
              padding: 30px;
            }
            .bill-header {
              text-align: center;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
              margin-bottom: 20px;
            }
            .bill-header h1 {
              margin: 0;
              color: #333;
            }
            .bill-details {
              margin: 20px 0;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #ddd;
            }
            .detail-label {
              font-weight: bold;
              color: #555;
            }
            .bill-total {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 2px solid #333;
              text-align: right;
            }
            .bill-total .amount {
              font-size: 32px;
              font-weight: bold;
              color: #2c5f2d;
            }
            .bill-footer {
              margin-top: 40px;
              text-align: center;
              color: #777;
              font-size: 14px;
            }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    windowPrint.document.close();
    windowPrint.focus();
    windowPrint.print();
    windowPrint.close();
  };

  const handleCheckout = () => {
    if (selectedSpace) {
      removeVehicle(selectedSpace.id);
      setSelectedSpace(null);
      setGeneratedBill(null);
    }
  };

  const formatDuration = (checkInTime, checkOutTime) => {
    const checkIn = new Date(checkInTime);
    const checkOut = new Date(checkOutTime);
    const diff = checkOut - checkIn;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="billing-page">
      <h1>Billing & Checkout</h1>

      <div className="billing-container">
        <div className="checkout-section">
          <h2>Select Space to Checkout</h2>
          <div className="space-select-list">
            {occupiedSpaces.map(space => (
              <div
                key={space.id}
                className={`space-select-item ${selectedSpace?.id === space.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedSpace(space);
                  setGeneratedBill(null);
                }}
              >
                <div className="space-info">
                  <strong>{space.spaceNumber}</strong>
                  <span className="badge">{space.parkingType}</span>
                </div>
                <div className="space-details">
                  <div>{space.customerName}</div>
                  <div>{space.vehicleNumber}</div>
                </div>
              </div>
            ))}
            {occupiedSpaces.length === 0 && (
              <p className="no-data">No occupied spaces available for checkout</p>
            )}
          </div>
        </div>

        <div className="bill-section">
          {selectedSpace && !generatedBill && (
            <div className="bill-preview">
              <h2>Bill Preview</h2>
              <div className="preview-details">
                <div className="preview-row">
                  <span>Space:</span>
                  <strong>{selectedSpace.spaceNumber}</strong>
                </div>
                <div className="preview-row">
                  <span>Customer:</span>
                  <strong>{selectedSpace.customerName}</strong>
                </div>
                <div className="preview-row">
                  <span>Vehicle:</span>
                  <strong>{selectedSpace.vehicleNumber}</strong>
                </div>
                <div className="preview-row">
                  <span>Type:</span>
                  <strong>{selectedSpace.parkingType}</strong>
                </div>
                {selectedSpace.parkingType === 'daily' && (
                  <>
                    <div className="preview-row">
                      <span>Check-in:</span>
                      <strong>{new Date(selectedSpace.checkInTime).toLocaleString()}</strong>
                    </div>
                    <div className="preview-row">
                      <span>Duration:</span>
                      <strong>{formatDuration(selectedSpace.checkInTime, new Date().toISOString())}</strong>
                    </div>
                    {selectedSpace.customAmount ? (
                      <div className="preview-row">
                        <span>Custom Amount:</span>
                        <strong className="custom-badge">${parseFloat(selectedSpace.customAmount).toFixed(2)}</strong>
                      </div>
                    ) : (
                      <div className="preview-row">
                        <span>Rate:</span>
                        <strong>${pricing.daily.hourly}/hour (max ${pricing.daily.daily}/day)</strong>
                      </div>
                    )}
                  </>
                )}
                {selectedSpace.parkingType === 'monthly' && (
                  <>
                    <div className="preview-row">
                      <span>Period:</span>
                      <strong>
                        {new Date(selectedSpace.monthlyStartDate).toLocaleDateString()} - 
                        {new Date(selectedSpace.monthlyEndDate).toLocaleDateString()}
                      </strong>
                    </div>
                    {selectedSpace.customAmount ? (
                      <div className="preview-row">
                        <span>Custom Amount:</span>
                        <strong className="custom-badge">${parseFloat(selectedSpace.customAmount).toFixed(2)}</strong>
                      </div>
                    ) : (
                      <div className="preview-row">
                        <span>Rate:</span>
                        <strong>${pricing.monthly}/month</strong>
                      </div>
                    )}
                  </>
                )}
              </div>
              <button className="btn btn-primary" onClick={handleGenerateBill}>
                Generate Bill
              </button>
            </div>
          )}

          {generatedBill && (
            <div className="bill-generated">
              <div ref={printRef}>
                <div className="print-bill">
                  <div className="bill-header">
                    <h1>PARKING BILL</h1>
                    <p>Invoice #{generatedBill.id}</p>
                    <p>{new Date(generatedBill.date).toLocaleString()}</p>
                  </div>

                  <div className="bill-details">
                    <div className="detail-row">
                      <span className="detail-label">Parking Space:</span>
                      <span>{generatedBill.spaceNumber}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Customer Name:</span>
                      <span>{generatedBill.customerName}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Phone Number:</span>
                      <span>{generatedBill.phoneNumber}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Vehicle Number:</span>
                      <span>{generatedBill.vehicleNumber}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Parking Type:</span>
                      <span>{generatedBill.parkingType.toUpperCase()}</span>
                    </div>

                    {generatedBill.parkingType === 'daily' && (
                      <>
                        <div className="detail-row">
                          <span className="detail-label">Check-in Time:</span>
                          <span>{new Date(generatedBill.checkInTime).toLocaleString()}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Check-out Time:</span>
                          <span>{new Date(generatedBill.checkOutTime).toLocaleString()}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Duration:</span>
                          <span>{formatDuration(generatedBill.checkInTime, generatedBill.checkOutTime)}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Rate:</span>
                          <span>${pricing.daily.hourly}/hour (max ${pricing.daily.daily}/day)</span>
                        </div>
                      </>
                    )}

                    {generatedBill.parkingType === 'monthly' && (
                      <>
                        <div className="detail-row">
                          <span className="detail-label">Period:</span>
                          <span>
                            {new Date(generatedBill.monthlyStartDate).toLocaleDateString()} - 
                            {new Date(generatedBill.monthlyEndDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Monthly Rate:</span>
                          <span>${pricing.monthly}/month</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="bill-total">
                    <h2>Total Amount</h2>
                    <div className="amount">${generatedBill.amount.toFixed(2)}</div>
                  </div>

                  <div className="bill-footer">
                    <p>Thank you for using our parking facility!</p>
                    <p>Please keep this receipt for your records.</p>
                  </div>
                </div>
              </div>

              <div className="bill-actions">
                <button className="btn btn-print" onClick={handlePrint}>
                  Print Bill
                </button>
                <button className="btn btn-success" onClick={handleCheckout}>
                  Complete Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="billing-history">
        <h2>Billing History</h2>
        <div className="history-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Space</th>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {billingHistory.map(bill => (
                <tr key={bill.id}>
                  <td>{new Date(bill.date).toLocaleString()}</td>
                  <td>{bill.spaceNumber}</td>
                  <td>{bill.customerName}</td>
                  <td>{bill.vehicleNumber}</td>
                  <td>
                    <span className={`badge ${bill.parkingType}`}>
                      {bill.parkingType}
                    </span>
                  </td>
                  <td className="amount">${(bill.amount || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {billingHistory.length === 0 && (
            <p className="no-data">No billing history available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Billing;
