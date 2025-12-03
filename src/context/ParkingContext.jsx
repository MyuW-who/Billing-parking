import { createContext, useContext, useState, useEffect } from 'react';

const ParkingContext = createContext();

export const useParkingContext = () => {
  const context = useContext(ParkingContext);
  if (!context) {
    throw new Error('useParkingContext must be used within ParkingProvider');
  }
  return context;
};

export const ParkingProvider = ({ children }) => {
  // Initialize with some sample data
  const [parkingSpaces, setParkingSpaces] = useState(() => {
    const saved = localStorage.getItem('parkingSpaces');
    if (saved) {
      return JSON.parse(saved);
    }
    // Create 50 parking spaces
    return Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      spaceNumber: `A${String(i + 1).padStart(3, '0')}`,
      isOccupied: false,
      vehicle: null,
      customerName: null,
      phoneNumber: null,
      vehicleNumber: null,
      parkingType: null, // 'daily' or 'monthly'
      checkInTime: null,
      monthlyStartDate: null,
      monthlyEndDate: null,
      customAmount: null, // Manual custom amount
    }));
  });

  const [billingHistory, setBillingHistory] = useState(() => {
    const saved = localStorage.getItem('billingHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // Pricing configuration
  const pricing = {
    daily: {
      hourly: 5, // $5 per hour
      daily: 50, // $50 per day (max)
    },
    monthly: 300, // $300 per month
  };

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('parkingSpaces', JSON.stringify(parkingSpaces));
  }, [parkingSpaces]);

  useEffect(() => {
    localStorage.setItem('billingHistory', JSON.stringify(billingHistory));
  }, [billingHistory]);

  const parkVehicle = (spaceId, vehicleData) => {
    setParkingSpaces(spaces =>
      spaces.map(space =>
        space.id === spaceId
          ? {
              ...space,
              isOccupied: true,
              customerName: vehicleData.customerName,
              phoneNumber: vehicleData.phoneNumber,
              vehicleNumber: vehicleData.vehicleNumber,
              parkingType: vehicleData.parkingType,
              checkInTime: vehicleData.parkingType === 'daily' ? new Date().toISOString() : null,
              monthlyStartDate: vehicleData.parkingType === 'monthly' ? vehicleData.monthlyStartDate : null,
              monthlyEndDate: vehicleData.parkingType === 'monthly' ? vehicleData.monthlyEndDate : null,
              customAmount: vehicleData.customAmount || null,
            }
          : space
      )
    );
  };

  const removeVehicle = (spaceId) => {
    setParkingSpaces(spaces =>
      spaces.map(space =>
        space.id === spaceId
          ? {
              ...space,
              isOccupied: false,
              customerName: null,
              phoneNumber: null,
              vehicleNumber: null,
              parkingType: null,
              checkInTime: null,
              monthlyStartDate: null,
              monthlyEndDate: null,
              customAmount: null,
            }
          : space
      )
    );
  };

  const calculateBill = (space) => {
    if (!space.isOccupied) return 0;

    // If custom amount is set, use it
    if (space.customAmount !== null && space.customAmount !== undefined) {
      return parseFloat(space.customAmount) || 0;
    }

    if (space.parkingType === 'monthly') {
      return pricing.monthly;
    }

    if (space.parkingType === 'daily') {
      const checkIn = new Date(space.checkInTime);
      const now = new Date();
      const hours = Math.ceil((now - checkIn) / (1000 * 60 * 60));
      const amount = Math.min(hours * pricing.hourly, pricing.daily);
      return amount;
    }

    return 0;
  };

  const generateBill = (spaceId) => {
    const space = parkingSpaces.find(s => s.id === spaceId);
    if (!space || !space.isOccupied) return null;

    const amount = calculateBill(space);
    const bill = {
      id: Date.now(),
      date: new Date().toISOString(),
      spaceNumber: space.spaceNumber,
      customerName: space.customerName,
      phoneNumber: space.phoneNumber,
      vehicleNumber: space.vehicleNumber,
      parkingType: space.parkingType,
      checkInTime: space.checkInTime,
      checkOutTime: new Date().toISOString(),
      monthlyStartDate: space.monthlyStartDate,
      monthlyEndDate: space.monthlyEndDate,
      customAmount: space.customAmount,
      amount,
    };

    setBillingHistory(prev => [bill, ...prev]);
    return bill;
  };

  const getStatistics = () => {
    const total = parkingSpaces.length;
    const occupied = parkingSpaces.filter(s => s.isOccupied).length;
    const available = total - occupied;
    const daily = parkingSpaces.filter(s => s.isOccupied && s.parkingType === 'daily').length;
    const monthly = parkingSpaces.filter(s => s.isOccupied && s.parkingType === 'monthly').length;

    return { total, occupied, available, daily, monthly };
  };

  const value = {
    parkingSpaces,
    billingHistory,
    pricing,
    parkVehicle,
    removeVehicle,
    calculateBill,
    generateBill,
    getStatistics,
  };

  return (
    <ParkingContext.Provider value={value}>
      {children}
    </ParkingContext.Provider>
  );
};
