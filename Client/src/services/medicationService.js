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

  // 8. Update Medication Status (POST /api/medications/medications/{id}/update_status/)
  updateMedicationStatus: (id, status) => api.post(`medications/medications/${id}/update_status/`, { status }),

  // 9. Delete Medication (DELETE /api/medications/medications/{id}/)
  deleteMedication: (id) => api.delete(`medications/medications/${id}/`),

  // 10. Get Statistics (GET /api/medications/statistics/)
  getStatistics: (days = 30) => {
    return api.get('medications/statistics/', {
      params: { days }
    });
  },

  // 11. Get Daily Intakes for specific date (GET /api/medications/daily-intakes/)
  getDailyIntakes: (date = null) => {
    const params = date ? { date } : {};
    return api.get('medications/daily-intakes/', { params });
  },

  // 12. Get Upcoming Intakes (GET /api/medications/upcoming-intakes/)
  getUpcomingIntakes: (hours = 24) => {
    return api.get('medications/upcoming-intakes/', {
      params: { hours }
    });
  },

  // 13. Get Medication Schedules (GET /api/medications/medications/{id}/schedules/)
  getMedicationSchedules: (id) => {
    return api.get(`medications/medications/${id}/schedules/`);
  },

  // 14. Add Medication Schedule (POST /api/medications/medications/{id}/add_schedule/)
  addMedicationSchedule: (id, data) => {
    return api.post(`medications/medications/${id}/add_schedule/`, data);
  },

  // 15. Get Medication Intakes (GET /api/medications/medications/{id}/intakes/)
  getMedicationIntakes: (id, params) => {
    return api.get(`medications/medications/${id}/intakes/`, { params });
  },

  // 16. Record Intake (POST /api/medications/medications/{id}/record_intake/)
  recordIntake: (id, data) => {
    return api.post(`medications/medications/${id}/record_intake/`, data);
  },

  // 17. Get Medication Adherence (GET /api/medications/medications/{id}/adherence/)
  getMedicationAdherence: (id, days = 30) => {
    return api.get(`medications/medications/${id}/adherence/`, {
      params: { days }
    });
  },

  // 18. Sync Existing Medication Schedule (POST /api/medications/medications/{id}/sync_existing/)
  syncMedicationSchedule: (id) => {
    return api.post(`medications/medications/${id}/sync_existing/`);
  },

  // 19. Update Intake (PATCH /api/medications/intakes/{id}/)
  updateIntake: (id, data) => {
    return api.patch(`medications/intakes/${id}/`, data);
  },

  // 20. Add Comment to Intake (POST /api/medications/intakes/{id}/add_comment/)
  addIntakeComment: (id, data) => {
    return api.post(`medications/intakes/${id}/add_comment/`, data);
  }
};