const api = {
    getUserProfile: async () => {
        return new Promise(resolve => {
            setTimeout(() => resolve(mockData.user), 500);
        });
    },
    getKnowledgeMap: async () => {
        return new Promise(resolve => {
            setTimeout(() => resolve({ subjects: mockData.subjects }), 500);
        });
    },
    getQuestions: async () => {
        return new Promise(resolve => {
            setTimeout(() => resolve(mockData.questions), 500);
        });
    },
    getActivityHistory: async (limit = 5) => {
        return new Promise(resolve => {
            setTimeout(() => resolve(mockData.activities.slice(0, limit)), 500);
        });
    },
    getProgress: async () => {
        return new Promise(resolve => {
            setTimeout(() => resolve(mockData.progress), 500);
        });
    }
};
