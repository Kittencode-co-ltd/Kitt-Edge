const CameraApp = {
    stream: null,
    videoTrack: null,
    flashOn: false,

    async init() {
        const video = document.getElementById('cameraFeed');
        if (!video) return;

        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            video.srcObject = this.stream;
            this.videoTrack = this.stream.getVideoTracks()[0];
            
            // Check if flash is supported
            if (this.videoTrack.getCapabilities) {
                const capabilities = this.videoTrack.getCapabilities();
                const flashBtn = document.getElementById('cameraFlashBtn');
                if (capabilities.torch) {
                    flashBtn.style.display = 'flex';
                } else {
                    flashBtn.style.display = 'none';
                }
            }
        } catch (err) {
            console.error('Camera error:', err);
            Utils.showToast('ไม่สามารถเปิดใช้งานกล้องได้ โปรดตรวจสอบการอนุญาต', 'error');
        }
    },

    stop() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
            this.videoTrack = null;
            this.flashOn = false;
        }
    },

    async toggleFlash() {
        if (!this.videoTrack) return;
        try {
            this.flashOn = !this.flashOn;
            await this.videoTrack.applyConstraints({
                advanced: [{ torch: this.flashOn }]
            });
            const btn = document.getElementById('cameraFlashBtn');
            if (btn) {
                if (this.flashOn) btn.classList.add('active');
                else btn.classList.remove('active');
            }
        } catch (err) {
            console.error('Flash error:', err);
        }
    },

    takePhoto() {
        const video = document.getElementById('cameraFeed');
        const canvas = document.getElementById('cameraCanvas');
        if (!video || !canvas) return;

        // Flash screen visual effect
        const wrap = document.querySelector('.camera-bottom-controls');
        const flashOverlay = document.createElement('div');
        flashOverlay.className = 'camera-flash-overlay';
        document.getElementById('cameraPage').appendChild(flashOverlay);
        setTimeout(() => flashOverlay.remove(), 150);

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);

        Utils.showToast('ถ่ายรูปสำเร็จ! กำลังสแกน...', 'success');
        
        // Stop camera and go back after short delay
        setTimeout(() => {
            MobileApp.navigate('dashboard');
            MobileApp.updateNavActive('dashboard');
        }, 1500);
    }
};
