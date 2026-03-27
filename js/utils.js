const Utils = {
    showLoading: (message = '') => {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) overlay.classList.add('active');
    },

    hideLoading: () => {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) overlay.classList.remove('active');
    },

    showToast: (message, type = 'info') => {
        const existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    getDifficultyLabel: (difficulty) => {
        const labels = {
            easy: 'ง่าย',
            medium: 'ปานกลาง',
            hard: 'ยาก'
        };
        return labels[difficulty] || difficulty;
    }
};
