import api from '../api/axios';

export const medicationService = {
  // 1. List all medications (GET /api/medications/medications/)
  getMedications: (params) => api.get('medications/medications/', { params }),

  // 2. Create medication (POST /api/medications/medications/)
  createMedication: (data) => api.post('medications/medications/', data),

  // 3. Get Dashboard Summary (GET /api/medications/dashboard/)
  getDashboard: () => api.get('medications/dashboard/'),

  // 4. Mark as taken (POST /api/medications/medications/{id}/mark_taken/)
  markAsTaken: (id, data) => api.post(`medications/medications/${id}/mark_taken/`, data),

  // 5. Get Today's specific schedule (GET /api/medications/today/)
  getTodayIntakes: () => api.get('medications/today/'),
  
  // 6. Get detailed info including schedules/intakes
  getMedicationDetails: (id) => api.get(`medications/medications/${id}/`),

  // 7. Update Medication (PATCH /api/medications/medications/{id}/)
  updateMedication: (id, data) => api.patch(`medications/medications/${id}/`, data),

  // 8. Delete Medication (DELETE /api/medications/medications/{id}/)
  deleteMedication: (id) => api.delete(`medications/medications/${id}/`),

  // 9. Fetch notifications that need a popup
  getUnalertedNotifications: () => api.get('medications/notifications/unalerted/'),

  // 10. Mark notification as alerted
  markAsAlerted: (id) => api.post(`medications/notifications/${id}/mark_alerted/`),
};