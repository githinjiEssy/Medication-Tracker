import api from '../api/axios'; 

export const commentService = {
    getAllComments: () => api.get('medications/comments/'),

    addMedicationSideEffect: (medicationId, content, severity) => {
        const cleanSeverity = Number(severity);

        return api.post(`medications/medications/${medicationId}/add_comment/`, {
            comment_type: 'SIDE_EFFECT',
            content: content,  
            severity: isNaN(cleanSeverity) ? 3 : cleanSeverity
        });
    },

    addIntakeSideEffect: (intakeId, content, severity) => {
        return api.post(`medications/intakes/${intakeId}/add_comment/`, {
            comment_type: 'SIDE_EFFECT',
            content: content,  
            severity: Number(severity)
        });
    },

    updateComment: (id, data) => api.patch(`medications/comments/${id}/`, data),
    deleteComment: (id) => api.delete(`medications/comments/${id}/`)
};