const SubscriptionApp = {
    billingCycle: 'monthly', // 'monthly' or 'yearly'
    plans: [
    {
        id: 'free',
        name: 'Free (Standard)',
        description: 'เริ่มต้นฝึกฝนและทดลองระบบ AI เบื้องต้น',
        priceMonthly: 0,
        priceYearly: 0,
        features: [
            { text: 'คลังข้อสอบเก่า พร้อมเฉลยละเอียด', active: true },
            { text: 'สแกนโจทย์จำกัด 3 ครั้ง/เดือน', active: true },
            { text: 'โหมด Adaptive จำกัด 1 ครั้ง/สัปดาห์', active: true },
            { text: 'วิดีโอเฉลยจากติวเตอร์ผู้เชี่ยวชาญ', active: false },
            { text: 'วิเคราะห์โอกาสสอบติดคณะในฝัน', active: false },
            { text: 'ตารางเรียนและระบบแจ้งเตือนอัจฉริยะ', active: false },
            { text: 'AI วิเคราะห์จุดอ่อนรายบุคคลเชิงลึก', active: false }
        ],
        popular: false
    },
    {
        id: 'exam-plus',
        name: 'Exam Plus (Starter)',
        description: 'สแกนไม่จำกัด เพื่อการทำบ้านและทบทวนบทเรียน',
        priceMonthly: 99,
        priceYearly: 790,   
        features: [
            { text: 'ทุกอย่างที่อยู่ในแผน Free', active: true },
            { text: 'สแกนโจทย์และดูเฉลยได้ไม่จำกัด', active: true },
            { text: 'เข้าถึงวิดีโอเฉลยข้อสอบทุกวิชา', active: true },
            { text: 'โหมด Adaptive ฝึกฝนได้ไม่จำกัดครั้ง', active: true },
            { text: 'วิเคราะห์โอกาสสอบติดคณะในฝัน', active: false },
            { text: 'ตารางเรียนและระบบแจ้งเตือนอัจฉริยะ', active: false },
            { text: 'AI วิเคราะห์จุดอ่อนรายบุคคลเชิงลึก', active: false }
        ],
        popular: false
    },
    {
        id: 'adaptive-pro',
        name: 'Adaptive Pro (Advanced)',
        description: 'แผนยอดนิยมสำหรับนักเรียนที่เตรียมสอบจริงจัง',
        priceMonthly: 199,
        priceYearly: 1590,
        features: [
            { text: 'ทุกอย่างที่อยู่ในแผน Exam Plus', active: true },
            { text: 'วิเคราะห์โอกาสสอบติด (TCAS Prediction)', active: true },
            { text: 'แนะนำคณะและวิชาที่ควรสอบตามเป้าหมาย', active: true },
            { text: 'โหมดจำลองสนามสอบจริงพร้อมจับเวลา', active: true },
            { text: 'ตารางเรียนอัจฉริยะ ปรับตามวันสอบจริง', active: false },
            { text: 'แนะนำข้อสอบรายบุคคลเพื่อปิดจุดบอด', active: false },
            { text: 'วิเคราะห์จุดอ่อนรายบุคคลเชิงลึก (MRI Scan)', active: false }
        ],
        popular: true
    },
    {
        id: 'analyst-elite',
        name: 'Analyst Elite (Ultimate)',
        description: 'มี AI เป็นโค้ชส่วนตัว วางกลยุทธ์เพื่อความสำเร็จ',
        priceMonthly: 599,
        priceYearly: 5500,
        features: [
            { text: 'ทุกอย่างที่อยู่ในแผน Adaptive Pro', active: true },
            { text: 'AI วิเคราะห์จุดอ่อนเชิงลึก (Deep Diagnostic)', active: true },
            { text: 'แนะนำข้อสอบรายบุคคล (Personalized Suggestion)', active: true },
            { text: 'ตารางเรียนอัจฉริยะพร้อมระบบแจ้งเตือน', active: true }
        ],
        popular: false,
        luxury: true
    }
],

    init() {
        this.renderPlans();
        this.setBilling('monthly'); // set default
    },

    setBilling(type) {
        this.billingCycle = type;
        
        // Update toggle styles
        document.querySelectorAll('.billing-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.type === type) {
                btn.classList.add('active');
            }
        });
        
        // Animate slider position
        const slider = document.querySelector('.billing-toggle-bg');
        if (slider) {
            slider.style.transform = type === 'yearly' ? 'translateX(100%)' : 'translateX(0)';
        }

        this.renderPlans();
    },

    renderPlans() {
        const container = document.getElementById('plansContainer');
        if (!container) return;

        const isYearly = this.billingCycle === 'yearly';
        
        container.innerHTML = this.plans.map(plan => {
            // Calculate savings
            const standardMonthly = plan.priceMonthly * 12;
            const savings = standardMonthly - plan.priceYearly;
            
            let saveText = '<div class="plan-price-save"></div>';
            let priceDisplay = '';
            
            if (plan.priceMonthly === 0) {
                // Free Plan
                priceDisplay = 'ฟรี';
            } else {
                priceDisplay = `฿${plan.priceMonthly.toLocaleString()}<span>/เดือน</span>`;
                if (isYearly) {
                    saveText = `<div class="plan-price-save">฿${plan.priceYearly.toLocaleString()}/ปี (ประหยัด ฿${savings.toLocaleString()})</div>`;
                }
            }

            return `
            <div class="plan-card ${plan.popular ? 'popular' : ''} ${plan.luxury ? 'luxury' : ''}">
                ${plan.popular ? `<div class="popular-badge"><i class="fas fa-star text-warning"></i> ยอดนิยม</div>` : ''}
                ${plan.luxury ? `<div class="luxury-badge"><i class="fas fa-crown"></i> Ultimate</div>` : ''}
                
                <div class="plan-header">
                    <div class="plan-header-left" style="flex:1; padding-right:10px;">
                        <h3 style="font-size:16px;">${plan.name}</h3>
                        <div style="font-size:12px; color:var(--text-secondary); margin-top:4px;">${plan.description}</div>
                    </div>
                    <div class="plan-header-right">
                        <div class="plan-price">
                            ${priceDisplay}
                        </div>
                        ${saveText}
                    </div>
                </div>

                <div class="mb-3 mt-2">
                    <b style="font-size:13px; color:var(--text-secondary);">สิ่งที่ได้รับ</b>
                </div>
                <ul class="plan-features">
                    ${plan.features.map(f => `
                        <li class="${f.active ? '' : 'disabled'}">
                            <i class="fas ${f.active ? 'fa-check' : 'fa-times'}" style="color:#60a5fa; font-size:14px;"></i>
                            ${f.text}
                        </li>
                    `).join('')}
                </ul>

                <button class="plan-btn mt-3" onclick="SubscriptionApp.selectPlan('${plan.id}')">
                    ${plan.priceMonthly === 0 ? 'เริ่มใช้งาน' : 'เลือกแผนนี้'}
                </button>
            </div>
            `;
        }).join('');
    },

    selectPlan(planId) {
        const plan = this.plans.find(p => p.id === planId);
        if (!plan) return;

        if (plan.priceMonthly === 0) {
            Utils.showToast('เริ่มใช้งานฟรีสำเร็จ!', 'success');
            MobileApp.navigate('dashboard');
            return;
        }

        // Prepare payment data
        const isYearly = this.billingCycle === 'yearly';
        MobileApp.data.paymentData = {
            id: plan.id,
            name: plan.name,
            description: plan.description,
            price: isYearly ? plan.priceYearly : plan.priceMonthly,
            cycle: this.billingCycle
        };

        // Navigate to payment page
        MobileApp.navigate('payment');
    }
};
