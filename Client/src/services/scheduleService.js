import api from '../api/axios';

export const scheduleService = {

    // 1. Get Today's Grouped Summary (GET /api/medications/today/)
    getTodaySummary: () => api.get('medications/today/'),

    // 2. Get Intakes for a Specific Date (GET /api/medications/intakes/?date=YYYY-MM-DD)
    getIntakesByDate: (date) => api.get('medications/intakes/', { params: { date } }),

    // 2. Get Daily Intakes (GET /api/medications/daily/)
    getDailyIntakes: () => api.get('medications/daily/', {params: {}}),

    // 3. Get Upcoming Intakes (GET /api/medications/upcoming/?hours=24)
    getUpcomingIntakes: (hours = 24) => api.get('medications/upcoming/', { params: { hours } }),

    // 4. Record/Log a specific Intake (PATCH /api/medications/intakes/{id}/)
    updateIntakeStatus: (intakeId, data) => api.patch(`medications/intakes/${intakeId}/`, data),

    // 5. Get Adherence Statistics (GET /api/medications/medications/{id}/adherence/)
    getMedicationAdherence: (medId) => api.get(`medications/medications/${medId}/adherence/`),

    // 6. Add a Comment/Log to a Medication (POST /api/medications/comments/)
    addMedicationComment: (data) => api.post('medications/comments/', data),

    // 7. Get History/Comments for a Medication (GET /api/medications/comments/?medication=id)
    getMedicationHistory: (medId) => api.get('medications/comments/', { params: { medication: medId } })
};