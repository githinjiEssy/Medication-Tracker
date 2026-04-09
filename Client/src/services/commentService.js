import api from '../api/axios'; 

export const commentService = {
    // 1. Get all comments (GET /api/medications/comments/)
    getAllComments: () => api.get('medications/comments/'),

    // 2. Add Comment to Medication
    addMedicationComment: (medicationId, data) => {
        return api.post(`medications/medications/${medicationId}/add_comment/`, data);
    },

    // 3. Get comments for a specific medication (GET /api/medications/medications/{id}/comments/)
    getMedicationComments: (medicationId) => {
        return api.get(`medications/medications/${medicationId}/comments/`);
    },

    // 4. Add Side Effect Comment to Medication
    addMedicationSideEffect: (medicationId, content, severity) => {
        const cleanSeverity = Number(severity);

        return api.post(`medications/medications/${medicationId}/add_comment/`, {
            comment_type: 'SIDE_EFFECT',
            content: content,  
            severity: isNaN(cleanSeverity) ? 3 : cleanSeverity
        });
    },

    // 5. Add comment to a specific intake (POST /api/medications/intakes/{id}/add_comment/)
    addIntakeSideEffect: (intakeId, content, severity) => {
        return api.post(`medications/intakes/${intakeId}/add_comment/`, {
            comment_type: 'SIDE_EFFECT',
            content: content,  
            severity: Number(severity)
        });
    },

    // 6. Get comments for a specific medication with optional filtering by type (GET /api/medications/medications/{id}/comments/?type=SIDE_EFFECT)
    getMedicationComments: (medicationId, type = null) => {
        const params = type ? { type } : {};
        return api.get(`medications/medications/${medicationId}/comments/`, { params });
    },

    // 7. Update a comment (PATCH /api/medications/comments/{id}/)
    updateComment: (id, data) => api.patch(`medications/comments/${id}/`, data),

    // 8. Delete a comment (DELETE /api/medications/comments/{id}/)
    deleteComment: (id) => api.delete(`medications/comments/${id}/`)
};