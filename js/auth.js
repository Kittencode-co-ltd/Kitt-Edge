const AuthApp = {
    switchTab(tab) {
        // Toggle tab active states
        document.querySelectorAll('.auth-tab').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(el => el.classList.remove('active'));

        const targetTab = document.querySelector(`.auth-tab[onclick*="${tab}"]`);
        if (targetTab) targetTab.classList.add('active');
        
        const targetForm = document.getElementById(`${tab}Form`);
        if (targetForm) targetForm.classList.add('active');
    },

    login() {
        Utils.showLoading();
        // Simulate API call
        setTimeout(() => {
            Utils.hideLoading();
            Utils.showToast('เข้าสู่ระบบสำเร็จ', 'success');
            MobileApp.navigate('dashboard');
        }, 800);
    },

    register() {
        Utils.showLoading();
        // Simulate API call
        setTimeout(() => {
            Utils.hideLoading();
            Utils.showToast('สมัครสมาชิกสำเร็จ!', 'success');
            localStorage.setItem('isRegistering', 'true');
            // Redirect to profile setup instead of dashboard immediately
            MobileApp.navigate('profile-setup');
        }, 1200);
    }
};
