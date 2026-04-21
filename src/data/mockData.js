export const bookings = [
  { id: 'BK001', user: 'Arjun Sharma', activity: 'Rafting', date: '2025-07-10', time: '09:00', persons: 4, amount: 3200, status: 'Confirmed', payment: 'Paid' },
  { id: 'BK002', user: 'Priya Mehta', activity: 'Camp', date: '2025-07-11', time: '14:00', persons: 2, amount: 2400, status: 'Pending', payment: 'Paid' },
  { id: 'BK003', user: 'Rohit Verma', activity: 'Kayaking', date: '2025-07-11', time: '10:00', persons: 3, amount: 2700, status: 'Confirmed', payment: 'Paid' },
  { id: 'BK004', user: 'Sneha Patel', activity: 'Rental', date: '2025-07-12', time: '08:00', persons: 1, amount: 800, status: 'Cancelled', payment: 'Refunded' },
  { id: 'BK005', user: 'Karan Singh', activity: 'Rafting', date: '2025-07-12', time: '11:00', persons: 6, amount: 4800, status: 'Confirmed', payment: 'Paid' },
  { id: 'BK006', user: 'Anita Joshi', activity: 'Camp', date: '2025-07-13', time: '15:00', persons: 4, amount: 4800, status: 'Pending', payment: 'Pending' },
  { id: 'BK007', user: 'Vikram Nair', activity: 'Kayaking', date: '2025-07-13', time: '09:00', persons: 2, amount: 1800, status: 'Confirmed', payment: 'Paid' },
  { id: 'BK008', user: 'Deepa Rao', activity: 'Rafting', date: '2025-07-14', time: '10:00', persons: 5, amount: 4000, status: 'Confirmed', payment: 'Paid' },
  { id: 'BK009', user: 'Manish Gupta', activity: 'Rental', date: '2025-07-14', time: '08:00', persons: 2, amount: 1600, status: 'Pending', payment: 'Pending' },
  { id: 'BK010', user: 'Pooja Iyer', activity: 'Camp', date: '2025-07-15', time: '14:00', persons: 3, amount: 3600, status: 'Confirmed', payment: 'Paid' },
];

export const activities = [
  { id: 'ACT001', name: 'River Rafting', type: 'Rafting', price: 800, duration: '3 hours', capacity: 8, description: 'Thrilling white-water rafting experience on the Ganges.', status: 'Active', image: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=400' },
  { id: 'ACT002', name: 'Jungle Camp', type: 'Camp', price: 1200, duration: '1 night', capacity: 20, description: 'Overnight camping in the heart of the jungle with bonfire.', status: 'Active', image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400' },
  { id: 'ACT003', name: 'Kayaking Adventure', type: 'Kayaking', price: 900, duration: '2 hours', capacity: 6, description: 'Solo kayaking through calm river stretches.', status: 'Active', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400' },
  { id: 'ACT004', name: 'Equipment Rental', type: 'Rental', price: 800, duration: 'Per day', capacity: 50, description: 'Rent camping and adventure gear for your trip.', status: 'Active', image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400' },
];

export const slots = [
  { id: 'SL001', activity: 'Rafting', date: '2025-07-15', time: '09:00', capacity: 8, booked: 5, status: 'Available' },
  { id: 'SL002', activity: 'Rafting', date: '2025-07-15', time: '12:00', capacity: 8, booked: 8, status: 'Full' },
  { id: 'SL003', activity: 'Camp', date: '2025-07-15', time: '14:00', capacity: 20, booked: 12, status: 'Available' },
  { id: 'SL004', activity: 'Kayaking', date: '2025-07-15', time: '10:00', capacity: 6, booked: 0, status: 'Blocked' },
  { id: 'SL005', activity: 'Rafting', date: '2025-07-16', time: '09:00', capacity: 8, booked: 2, status: 'Available' },
  { id: 'SL006', activity: 'Kayaking', date: '2025-07-16', time: '10:00', capacity: 6, booked: 4, status: 'Available' },
  { id: 'SL007', activity: 'Camp', date: '2025-07-16', time: '14:00', capacity: 20, booked: 20, status: 'Full' },
  { id: 'SL008', activity: 'Rental', date: '2025-07-16', time: '08:00', capacity: 50, booked: 10, status: 'Available' },
];

export const users = [
  { id: 'USR001', name: 'Arjun Sharma', email: 'arjun@example.com', phone: '+91 98765 43210', bookings: 3, joined: '2025-01-15', status: 'Active' },
  { id: 'USR002', name: 'Priya Mehta', email: 'priya@example.com', phone: '+91 87654 32109', bookings: 1, joined: '2025-02-20', status: 'Active' },
  { id: 'USR003', name: 'Rohit Verma', email: 'rohit@example.com', phone: '+91 76543 21098', bookings: 2, joined: '2025-03-10', status: 'Active' },
  { id: 'USR004', name: 'Sneha Patel', email: 'sneha@example.com', phone: '+91 65432 10987', bookings: 1, joined: '2025-04-05', status: 'Inactive' },
  { id: 'USR005', name: 'Karan Singh', email: 'karan@example.com', phone: '+91 54321 09876', bookings: 4, joined: '2025-01-28', status: 'Active' },
  { id: 'USR006', name: 'Anita Joshi', email: 'anita@example.com', phone: '+91 43210 98765', bookings: 2, joined: '2025-05-12', status: 'Active' },
];

export const payments = [
  { id: 'PAY001', bookingId: 'BK001', user: 'Arjun Sharma', activity: 'Rafting', amount: 3200, method: 'Razorpay', date: '2025-07-10', status: 'Success' },
  { id: 'PAY002', bookingId: 'BK002', user: 'Priya Mehta', activity: 'Camp', amount: 2400, method: 'Razorpay', date: '2025-07-11', status: 'Success' },
  { id: 'PAY003', bookingId: 'BK003', user: 'Rohit Verma', activity: 'Kayaking', amount: 2700, method: 'Razorpay', date: '2025-07-11', status: 'Success' },
  { id: 'PAY004', bookingId: 'BK004', user: 'Sneha Patel', activity: 'Rental', amount: 800, method: 'Razorpay', date: '2025-07-12', status: 'Refunded' },
  { id: 'PAY005', bookingId: 'BK005', user: 'Karan Singh', activity: 'Rafting', amount: 4800, method: 'Razorpay', date: '2025-07-12', status: 'Success' },
  { id: 'PAY006', bookingId: 'BK007', user: 'Vikram Nair', activity: 'Kayaking', amount: 1800, method: 'Razorpay', date: '2025-07-13', status: 'Success' },
  { id: 'PAY007', bookingId: 'BK008', user: 'Deepa Rao', activity: 'Rafting', amount: 4000, method: 'Razorpay', date: '2025-07-14', status: 'Success' },
  { id: 'PAY008', bookingId: 'BK010', user: 'Pooja Iyer', activity: 'Camp', amount: 3600, method: 'Razorpay', date: '2025-07-15', status: 'Success' },
];

export const revenueData = [
  { day: 'Mon', revenue: 8400 },
  { day: 'Tue', revenue: 12600 },
  { day: 'Wed', revenue: 9800 },
  { day: 'Thu', revenue: 15200 },
  { day: 'Fri', revenue: 18900 },
  { day: 'Sat', revenue: 24300 },
  { day: 'Sun', revenue: 21000 },
];

export const activityStats = [
  { name: 'Rafting', value: 42 },
  { name: 'Camp', value: 28 },
  { name: 'Kayaking', value: 20 },
  { name: 'Rental', value: 10 },
];
