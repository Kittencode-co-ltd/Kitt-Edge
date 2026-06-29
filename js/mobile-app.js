// ============================================
// Kitt-Edge - Mobile App Logic
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    MobileApp.init();
});

const MobileApp = {
    data: {
        user: null,
        subjects: [],
        questions: [],
        activities: [],
        paymentData: null
    },

    async init() {
        console.log('📱 Kitt-Edge Mobile App Initialized');
        this.setupNavigation();
        this.updateGlobalUI();
        
        // Start App Flow
        await this.navigate('splash');
        
        // Simulate app loading/initializing then go to auth
        setTimeout(() => {
            this.navigate('auth');
        }, 1800);

        this.loadData();
        this.setupGestures();
        this.setupPullToRefresh();
    },

    // Setup Bottom Navigation
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                this.navigate(page);
                
                // Update active state
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });
    },

    // Navigate to Page
    async navigate(pageName) {
        Utils.showLoading();
        try {
            const response = await fetch(`pages/${pageName}.html`);
            if (!response.ok) throw new Error('Page not found');
            const html = await response.text();
            
            const mainContent = document.getElementById('mainContent');
            mainContent.innerHTML = html;
            
            // Activate the loaded page div for gesture handling
            const loadedPage = mainContent.querySelector('.page');
            if (loadedPage) {
                loadedPage.classList.add('active');
            }
            
            // Show/hide bottom nav and header for full screen pages
            const isFullScreen = ['exam-room', 'camera', 'scan-result', 'subscription', 'splash', 'auth', 'profile-setup', 'notifications', 'payment', 'exam-admin'].includes(pageName);
            const bottomNav = document.querySelector('.bottom-nav');
            const header = document.querySelector('.mobile-header');
            const fab = document.getElementById('fab');
            if (bottomNav) bottomNav.style.display = isFullScreen ? 'none' : '';
            if (header) header.style.display = isFullScreen ? 'none' : '';
            if (fab) fab.style.display = isFullScreen ? 'none' : '';
            mainContent.style.padding = isFullScreen ? '0' : '';
            
            // Handle Camera Lifecycle
            if (window.CameraApp) {
                if (pageName === 'camera') CameraApp.init();
                else CameraApp.stop();
            }

            // Load page specific data
            if (pageName === 'dashboard') this.renderDashboard();
            if (pageName === 'exams') this.renderExams();
            if (pageName === 'progress') this.renderProgress();
            if (pageName === 'profile') this.renderProfile();
            if (pageName === 'profile-setup') this.renderProfileSetup();
            if (pageName === 'exam-admin') this.renderExamAdmin();
            if (pageName === 'subscription') {
                if (typeof SubscriptionApp !== 'undefined') {
                    SubscriptionApp.init();
                }
            }
            if (pageName === 'notifications') this.renderNotifications();
            if (pageName === 'payment') this.renderPayment();
            if (pageName === 'scan-result') {
                if (typeof ScanResult !== 'undefined') {
                    const captured = sessionStorage.getItem('scanCapturedImage') || null;
                    ScanResult.init(captured);
                }
            }
            
            // Scroll to top
            mainContent.scrollTop = 0;
        } catch (error) {
            console.error('Navigation error:', error);
            Utils.showToast('ไม่สามารถโหลดหน้าจอได้', 'error');
        } finally {
            Utils.hideLoading();
        }
    },

    // Load Data
    async loadData() {
        Utils.showLoading();
        
        try {
            const [user, knowledge, questions, activities, progress] = await Promise.all([
                api.getUserProfile(),
                api.getKnowledgeMap(),
                api.getQuestions(),
                api.getActivityHistory(5),
                api.getProgress()
            ]);
            this.data = { user, subjects: knowledge.subjects, questions, activities, progress };
            this.updateNotificationBadge();
            this.renderDashboard();
        } catch (error) {
            console.error('Load data error:', error);
            Utils.showToast('ไม่สามารถโหลดข้อมูลได้', 'error');
        } finally {
            Utils.hideLoading();
        }
    },

    // Render Dashboard
    renderDashboard() {
        this.renderSubjects();
        this.renderQuestions();
        this.renderActivities();
    },

    // Render Subject List
    renderSubjects() {
        const container = document.getElementById('subjectList');
        if (!container || !this.data.subjects) return;
        
        const icons = {
            chapter1: '<i class="fas fa-headphones"></i>',
            chapter2: '<i class="fas fa-microphone"></i>',
            chapter3: '<i class="fas fa-book-reader"></i>',
            chapter4: '<i class="fas fa-pen-nib"></i>'
        };
        
        container.innerHTML = this.data.subjects.map(subject => `
            <div class="subject-item" onclick="MobileApp.openSubject('${subject.id}')">
                <div class="subject-icon" style="color: ${subject.color}; background: ${subject.color}15; font-size: 24px;">
                    ${icons[subject.id] || '<i class="fas fa-book"></i>'}
                </div>
                <div class="subject-info">
                    <div class="subject-name">${subject.nameTH}</div>
                    <div class="subject-progress">
                        <div class="fill" style="width: ${subject.proficiency}%; background: ${subject.color}"></div>
                    </div>
                </div>
                <div class="subject-score" style="color: ${subject.color}">${subject.proficiency}%</div>
            </div>
        `).join('');
    },

    // Render Question Carousel
    renderQuestions() {
        const container = document.getElementById('questionCarousel');
        if (!container || !this.data.questions) return;
        
        container.innerHTML = this.data.questions.slice(0, 5).map(q => `
            <div class="question-card-mobile ${q.subject}" onclick="MobileApp.startQuestion('${q.id}')">
                <div class="question-subject">${q.subjectName}</div>
                <div class="question-text">${q.question}</div>
                <div class="question-meta">
                    <span class="difficulty-badge ${q.difficulty}">${Utils.getDifficultyLabel(q.difficulty)}</span>
                    <span><i class="far fa-clock"></i> ${Math.floor(q.estimatedTime / 60)} นาที</span>
                </div>
            </div>
        `).join('');
    },

    // Render Activity List
    renderActivities() {
        const container = document.getElementById('activityList');
        if (!container || !this.data.activities) return;
        
        container.innerHTML = this.data.activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon ${activity.type}">
                    <i class="fas ${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-desc">${activity.description}</div>
                </div>
                <div class="activity-time">${activity.time}</div>
            </div>
        `).join('');
    },

    // Render AI Tutor
    renderCamera() {
        const container = document.getElementById('chatMessages');
        if (!container) return;
        
        // Add welcome message if empty
        if (container.children.length === 0) {
            container.innerHTML = `
                <div class="message ai">
                    <div class="message-avatar">🤖</div>
                    <div class="message-content">
                        <p>สวัสดีค่ะ! มีอะไรให้ช่วยวันนี้บอกได้เลยนะคะ</p>
                        <span class="message-time">${new Date().toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                </div>
            `;
        }
        
        // Setup chat input
        const sendBtn = document.getElementById('sendChat');
        const chatInput = document.getElementById('chatInput');
        
        if (sendBtn && chatInput) {
            sendBtn.onclick = () => this.handleChat();
            chatInput.onkeypress = (e) => {
                if (e.key === 'Enter') this.handleChat();
            };
        }
    },

    // Handle Chat
    handleChat() {
        const input = document.getElementById('chatInput');
        const container = document.getElementById('chatMessages');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addMessage('user', message);
        input.value = '';
        
        // Simulate AI response
        setTimeout(() => {
            const responses = [
                "คำถามเกี่ยวกับการฟังและการพูดน่าสนใจมากค่ะ! ลองคิดดูว่า...",
                "จุดนี้สำคัญมากในประวัติศาสตร์พิษณุโลกนะคะ...",
                "ครูมีเทคนิคการจับใจความมาฝาก อยากให้น้องลองนำไปใช้ดูไหมคะ?",
                "ถูกต้องค่ะ! การเขียนเรียงความที่ดีต้องอาศัยการฝึกฝนและจัดระเบียบความคิด..."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            this.addMessage('ai', randomResponse);
        }, 1000);
    },

    // Add Message to Chat
    addMessage(role, text) {
        const container = document.getElementById('chatMessages');
        const time = new Date().toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit'});
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;
        messageDiv.innerHTML = `
            <div class="message-avatar">${role === 'ai' ? '🤖' : '👤'}</div>
            <div class="message-content">
                <p>${text}</p>
                <span class="message-time">${time}</span>
            </div>
        `;
        
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
    },

    // ==========================================
    // Notifications Logic
    // ==========================================
    
    updateNotificationBadge() {
        const badge = document.getElementById('notificationBadge');
        if (!badge || !mockData.notifications) return;
        
        const unreadCount = mockData.notifications.filter(n => !n.isRead).length;
        if (unreadCount > 0) {
            badge.style.display = 'flex';
            badge.innerText = unreadCount > 99 ? '99+' : unreadCount;
        } else {
            badge.style.display = 'none';
        }
    },

    renderNotifications() {
        const container = document.getElementById('notificationsList');
        if (!container) return;
        
        if (!mockData.notifications || mockData.notifications.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
                    <i class="fas fa-bell-slash" style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;"></i>
                    <p>ไม่มีการแจ้งเตือนใหม่</p>
                </div>
            `;
            return;
        }

        container.innerHTML = mockData.notifications.map(n => `
            <div class="notification-item ${n.isRead ? 'read' : 'unread'}" onclick="MobileApp.markNotificationRead('${n.id}')">
                <div class="notif-avatar" style="${n.avatarBg ? 'background: ' + n.avatarBg + ';' : ''}">
                    ${n.senderAvatar.startsWith('<') ? n.senderAvatar : '<img src="' + n.senderAvatar + '" alt="avatar">'}
                    ${!n.isRead ? '<div class="unread-dot"></div>' : ''}
                </div>
                <div class="notif-content">
                    <div class="notif-text">${n.text}</div>
                    <div class="notif-time">${n.time}</div>
                </div>
                ${n.thumbnail ? 
                    `<div class="notif-thumbnail"><img src="${n.thumbnail}" alt="thumb"></div>` : 
                    `<button class="icon-btn notif-menu-btn" onclick="event.stopPropagation();"><i class="fas fa-ellipsis-v"></i></button>`
                }
            </div>
        `).join('');
    },

    markNotificationRead(id) {
        const notif = mockData.notifications.find(n => n.id === id);
        if (notif && !notif.isRead) {
            notif.isRead = true;
            this.updateNotificationBadge();
            this.renderNotifications();
        }
    },

    markAllNotificationsRead() {
        if (!mockData.notifications) return;
        mockData.notifications.forEach(n => n.isRead = true);
        this.updateNotificationBadge();
        this.renderNotifications();
        Utils.showToast('อ่านการแจ้งเตือนทั้งหมดแล้ว', 'success');
    },

    // ==========================================
    // Payment Logic
    // ==========================================
    
    renderPayment() {
        if (!this.data.paymentData) {
            // Fallback if no plan selected (should not happen in normal flow)
            this.data.paymentData = {
                name: 'Premium Plus',
                description: 'เข้าถึงคลังข้อสอบและ Adaptive Exam ไม่จำกัด',
                price: 249
            };
        }

        const plan = this.data.paymentData;
        const nameEl = document.getElementById('paymentPlanName');
        const descEl = document.getElementById('paymentPlanDesc');
        const totalEl = document.getElementById('paymentTotal');
        const confirmTotalEl = document.getElementById('paymentConfirmTotal');

        if (nameEl) nameEl.innerText = plan.name;
        if (descEl) descEl.innerText = plan.description;
        if (totalEl) totalEl.innerText = `฿${plan.price.toLocaleString()}`;
        if (confirmTotalEl) confirmTotalEl.innerText = `฿${plan.price.toLocaleString()}`;
    },

    async processPayment(method) {
        Utils.showLoading();
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        Utils.hideLoading();
        Utils.showToast(`ชำระเงินด้วย ${method} สำเร็จ!`, 'success');
        
        // Confirm pending plan as active plan
        const pendingPlan = localStorage.getItem('pendingPlan');
        if (pendingPlan) {
            localStorage.setItem('userPlan', pendingPlan);
            localStorage.removeItem('pendingPlan');
        }

        // Update user status (simulation)
        if (this.data.user) {
            this.data.user.isPremium = true;
            this.data.user.plan = this.data.paymentData.name;
        }
        
        // Go to dashboard after success
        setTimeout(() => {
            this.navigate('dashboard');
            // Refresh dashboard to show premium status if needed
            this.renderDashboard();
        }, 1500);
    },

    // Render Exams — grouped by chapter, each with a ก่อนเรียน/หลังเรียน pair
    renderExams() {
        const container = document.getElementById('examList');
        if (!container) return;

        const chapters = mockData.chapters || [];
        const exams = mockData.mockExams || [];

        const PILL_LABEL = {
            available: 'เริ่มทำ',
            completed: 'ทำแล้ว',
            locked: 'ยังไม่เปิด',
            not_started: 'รอก่อนเรียน'
        };
        const PILL_CLASS = {
            available: 'pill-available',
            completed: 'pill-completed',
            locked: 'pill-locked',
            not_started: 'pill-locked'
        };

        container.innerHTML = chapters.map(ch => {
            const pre = exams.find(e => e.chapterId === ch.id && e.examType === 'pre');
            const post = exams.find(e => e.chapterId === ch.id && e.examType === 'post');
            const isOpenChapter = [pre, post].some(e => e && e.status === 'available');
            const chapterLocked = !isOpenChapter && [pre, post].every(e => !e || e.status === 'locked');

            const pillHtml = (exam, label) => {
                if (!exam) return '';
                const clickable = exam.status === 'available' || exam.status === 'completed';
                const cls = PILL_CLASS[exam.status] || 'pill-locked';
                return `
                    <button class="exam-pill ${cls}" ${clickable ? `onclick="MobileApp.startExam('${exam.id}')"` : 'disabled'}>
                        <span class="exam-pill-tag">${label}</span>
                        <span class="exam-pill-status">
                            <i class="fas ${exam.status === 'completed' ? 'fa-check-circle' : exam.status === 'available' ? 'fa-play-circle' : 'fa-lock'}"></i>
                            ${PILL_LABEL[exam.status] || 'ยังไม่เปิด'}
                        </span>
                    </button>`;
            };

            return `
                <div class="exam-chapter-card ${chapterLocked ? 'is-locked' : ''}">
                    <div class="exam-chapter-top">
                        <div class="exam-chapter-icon" style="background:${ch.color}18; color:${ch.color}">
                            <i class="fas ${ch.icon}"></i>
                        </div>
                        <div class="exam-chapter-title">
                            <span class="exam-chapter-name">${ch.nameTH}</span>
                            ${isOpenChapter ? '<span class="exam-open-badge"><i class="fas fa-bolt"></i> เปิดให้ทำตอนนี้</span>' : ''}
                        </div>
                    </div>
                    <div class="exam-pill-row">
                        ${pillHtml(pre, 'ก่อนเรียน')}
                        ${pillHtml(post, 'หลังเรียน')}
                    </div>
                    ${chapterLocked ? '<div class="exam-chapter-hint"><i class="fas fa-hourglass-half"></i> บทนี้จะเปิดให้ทำเร็ว ๆ นี้</div>' : ''}
                </div>
            `;
        }).join('');
    },

    // Render Progress
    renderProgress() {
        const chapters = mockData.chapters || [];

        // ── 1. Summary strip ──────────────────────────────────
        const done       = chapters.filter(c => c.status === 'done').length;
        const withPre    = chapters.filter(c => c.preScore !== null);
        const withPost   = chapters.filter(c => c.postScore !== null);
        const avgPre     = withPre.length  ? Math.round(withPre.reduce((s,c)=>s+c.preScore,0)  / withPre.length)  : '—';
        const avgPost    = withPost.length ? Math.round(withPost.reduce((s,c)=>s+c.postScore,0) / withPost.length) : '—';

        const summaryEl = document.getElementById('devSummary');
        if (summaryEl) {
            summaryEl.innerHTML = `
                <div class="dev-stat">
                    <span class="dev-stat-val">${done}<span class="dev-stat-total">/${chapters.length}</span></span>
                    <span class="dev-stat-label">บทเรียนเสร็จ</span>
                </div>
                <div class="dev-stat-divider"></div>
                <div class="dev-stat">
                    <span class="dev-stat-val pre-color">${avgPre}${typeof avgPre==='number'?'%':''}</span>
                    <span class="dev-stat-label">เฉลี่ยก่อนเรียน</span>
                </div>
                <div class="dev-stat-divider"></div>
                <div class="dev-stat">
                    <span class="dev-stat-val post-color">${avgPost}${typeof avgPost==='number'?'%':''}</span>
                    <span class="dev-stat-label">เฉลี่ยหลังเรียน</span>
                </div>`;
        }

        // ── 2. Chart: grouped bar (ก่อน/หลัง per chapter) ──────
        const ctx = document.getElementById('devChart');
        if (ctx) {
            const existing = Chart.getChart('devChart');
            if (existing) existing.destroy();

            const labels   = chapters.map(c => c.nameTH.replace('บทที่ ', 'บท ').split(':')[0].trim());
            const preData  = chapters.map(c => c.preScore  ?? null);
            const postData = chapters.map(c => c.postScore ?? null);

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels,
                    datasets: [
                        {
                            label: 'ก่อนเรียน',
                            data: preData,
                            backgroundColor: 'rgba(148,163,184,0.7)',
                            borderRadius: 4,
                            borderSkipped: false,
                        },
                        {
                            label: 'หลังเรียน',
                            data: postData,
                            backgroundColor: 'rgba(219,39,119,0.85)',
                            borderRadius: 4,
                            borderSkipped: false,
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: ctx => ctx.raw !== null ? `${ctx.dataset.label}: ${ctx.raw}%` : 'ยังไม่มีข้อมูล'
                            }
                        }
                    },
                    scales: {
                        x: { grid: { display: false }, ticks: { font: { size: 10 }, maxRotation: 30 } },
                        y: { beginAtZero: true, max: 100,
                             ticks: { callback: v => v + '%', font: { size: 10 } },
                             grid: { color: 'rgba(0,0,0,0.05)' } }
                    }
                }
            });
        }

        // ── 2b. Chart: predicted score trend (weeks) ───────────
        const predictCtx = document.getElementById('predictChart');
        const progress = mockData.progress;
        if (predictCtx && progress) {
            const existingPredict = Chart.getChart('predictChart');
            if (existingPredict) existingPredict.destroy();

            const weekLabels = progress.weeks.map(w => `สัปดาห์ ${w}`);

            new Chart(predictCtx, {
                type: 'line',
                data: {
                    labels: weekLabels,
                    datasets: [
                        {
                            label: 'คะแนนจริง',
                            data: progress.scores,
                            borderColor: 'rgba(99,102,241,0.9)',
                            backgroundColor: 'rgba(99,102,241,0.15)',
                            tension: 0.35,
                            fill: true,
                            spanGaps: false,
                            pointRadius: 4
                        },
                        {
                            label: 'คาดคะเน',
                            data: progress.predictedScores,
                            borderColor: 'rgba(244,114,182,0.9)',
                            borderDash: [6, 4],
                            backgroundColor: 'transparent',
                            tension: 0.35,
                            spanGaps: true,
                            pointRadius: 4,
                            pointStyle: 'circle'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: ctx => ctx.raw !== null ? `${ctx.dataset.label}: ${ctx.raw}%` : 'ยังไม่มีข้อมูล'
                            }
                        }
                    },
                    scales: {
                        x: { grid: { display: false }, ticks: { font: { size: 10 } } },
                        y: { beginAtZero: true, max: 100,
                             ticks: { callback: v => v + '%', font: { size: 10 } },
                             grid: { color: 'rgba(0,0,0,0.05)' } }
                    }
                }
            });

            const hintEl = document.getElementById('predictHint');
            if (hintEl) {
                const lastPredicted = [...progress.predictedScores].reverse().find(v => v !== null);
                hintEl.textContent = lastPredicted
                    ? `แนวโน้ม: คาดว่าคะแนนของคุณจะไปถึง ${lastPredicted}% หากเรียนต่อในจังหวะนี้`
                    : '';
            }
        }

        // ── 3. Strengths & weaknesses by topic ─────────────────
        const insightEl = document.getElementById('insightSection');
        if (!insightEl) return;

        const renderInsightGroup = (items, type) => {
            if (!items || items.length === 0) return '';
            const isStrength = type === 'strength';
            return items.map((item, idx) => {
                const topTopic = [...item.topics].sort((a, b) => isStrength ? b.score - a.score : a.score - b.score)[0];
                return `
                    <div class="insight-item clickable" onclick="MobileApp.showInsightByIndex('${type}', ${idx})">
                        <div class="insight-item-left">
                            <span class="insight-emoji">${item.icon}</span>
                            <div>
                                <div class="insight-subject">${item.subject}</div>
                                <div class="insight-top-topic">${topTopic.name}: ${topTopic.level}</div>
                            </div>
                        </div>
                        <div class="insight-item-right">
                            <span class="insight-score ${type}">${item.score}%</span>
                            <i class="fas fa-chevron-right insight-chevron"></i>
                        </div>
                    </div>`;
            }).join('');
        };

        const strengths = mockData.progress?.strengths || [];
        const weaknesses = mockData.progress?.weaknesses || [];

        if (strengths.length === 0 && weaknesses.length === 0) {
            insightEl.innerHTML = `<div class="dev-empty-hint">ยังไม่มีข้อมูลเพียงพอสำหรับวิเคราะห์จุดแข็ง/จุดที่ควรพัฒนา</div>`;
            return;
        }

        insightEl.innerHTML = `
            ${strengths.length ? `
            <div class="insight-card pattern-success">
                <h3>✨ จุดแข็งของคุณ</h3>
                <div class="insight-list">${renderInsightGroup(strengths, 'strength')}</div>
            </div>` : ''}
            ${weaknesses.length ? `
            <div class="insight-card pattern-warning">
                <h3>🎯 จุดที่ควรพัฒนา</h3>
                <div class="insight-list">${renderInsightGroup(weaknesses, 'weakness')}</div>
            </div>` : ''}`;
    },

    // Look up a strength/weakness item by index and open its detail modal
    showInsightByIndex(type, idx) {
        const list = type === 'strength' ? mockData.progress?.strengths : mockData.progress?.weaknesses;
        const item = list && list[idx];
        if (item) this.showInsightDetail(item, type);
    },

    // Setup Gestures (Swipe)
    setupGestures() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        const content = document.getElementById('mainContent');
        
        content.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        content.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });
    },

    // Handle Swipe Gesture
    handleSwipe(startX, endX) {
        const diff = startX - endX;
        const threshold = 100;
        
        if (Math.abs(diff) > threshold) {
            const currentPage = document.querySelector('.page.active');
            if (!currentPage) return;
            const currentPageId = currentPage.id;
            
            const pages = ['dashboardPage', 'aiTutorPage', 'examsPage', 'progressPage', 'profilePage'];
            const currentIndex = pages.indexOf(currentPageId);
            
            if (diff > 0 && currentIndex < pages.length - 1) {
                // Swipe left - next page
                const nextPage = pages[currentIndex + 1].replace('Page', '');
                this.navigate(nextPage);
                this.updateNavActive(nextPage);
            } else if (diff < 0 && currentIndex > 0) {
                // Swipe right - previous page
                const prevPage = pages[currentIndex - 1].replace('Page', '');
                this.navigate(prevPage);
                this.updateNavActive(prevPage);
            }
        }
    },

    // Update Navigation Active State
    updateNavActive(pageName) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.page === pageName);
        });
    },

    // Setup Pull to Refresh
    setupPullToRefresh() {
        const content = document.getElementById('mainContent');
        let startY = 0;
        let currentY = 0;
        let isPulling = false;
        
        content.addEventListener('touchstart', (e) => {
            if (content.scrollTop === 0) {
                startY = e.changedTouches[0].screenY;
                isPulling = true;
            }
        });
        
        content.addEventListener('touchmove', (e) => {
            if (!isPulling) return;
            currentY = e.changedTouches[0].screenY;
            const diff = currentY - startY;
            
            if (diff > 0 && diff < 100) {
                // Show pull indicator
                console.log('Pulling...', diff);
            }
        });
        
        content.addEventListener('touchend', () => {
            if (isPulling && currentY - startY > 80) {
                // Trigger refresh
                this.refreshData();
            }
            isPulling = false;
            currentY = 0;
        });
    },

    // Refresh Data
    async refreshData() {
        Utils.showToast('กำลังรีเฟรช...', 'info');
        await this.loadData();
        Utils.showToast('รีเฟรชสำเร็จ', 'success');
    },

    // Open Subject Detail
    openSubject(subjectId) {
        Utils.showToast(`เปิดบทเรียน ${subjectId}`, 'info');
        // Navigate to subject detail page
    },

    // Show Insight Detail Modal
    showInsightDetail(item, type) {
        // Parse if passed as string (from inline onclick)
        if (typeof item === 'string') {
            try { item = JSON.parse(item); } catch(e) { return; }
        }
        
        const isStrength = type === 'strength';
        const levelColors = {
            'เชี่ยวชาญ': { bg: '#d1fae5', text: '#065f46' },
            'ดีมาก':     { bg: '#dbeafe', text: '#1e40af' },
            'ดี':        { bg: '#ede9fe', text: '#5b21b6' },
            'พอใช้':     { bg: '#fed7aa', text: '#92400e' },
            'ต้องพัฒนา': { bg: '#fecaca', text: '#991b1b' }
        };
        
        const topicsHTML = item.topics.map(t => {
            const lc = levelColors[t.level] || { bg: '#f3f4f6', text: '#374151' };
            return `
                <div class="insight-detail-topic">
                    <div class="insight-detail-topic-header">
                        <span class="insight-detail-topic-name">${t.name}</span>
                        <span class="insight-level-badge" style="background:${lc.bg};color:${lc.text}">${t.level}</span>
                    </div>
                    <div class="insight-detail-bar-bg">
                        <div class="insight-detail-bar-fill" style="width:${t.score}%;background:${item.color}"></div>
                    </div>
                    <div class="insight-detail-score" style="color:${item.color}">${t.score}%</div>
                </div>
            `;
        }).join('');
        
        const overlay = document.createElement('div');
        overlay.id = 'insightDetailOverlay';
        overlay.className = 'insight-detail-overlay';
        overlay.innerHTML = `
            <div class="insight-detail-sheet">
                <div class="insight-detail-handle"></div>
                <div class="insight-detail-header" style="border-left: 4px solid ${item.color}">
                    <div class="insight-detail-title-row">
                        <span class="insight-detail-emoji">${item.icon}</span>
                        <div>
                            <div class="insight-detail-subject">${item.subject}</div>
                            <div class="insight-detail-type">${isStrength ? '✨ จุดแข็ง' : '🎯 จุดที่ควรพัฒนา'}</div>
                        </div>
                        <div class="insight-detail-overall" style="color:${item.color}">${item.score}%</div>
                    </div>
                </div>
                <div class="insight-detail-topics">${topicsHTML}</div>
                ${ !isStrength ? `<button class="insight-practice-btn" onclick="MobileApp.startAdaptiveExam()" style="background:${item.color}">
                    <i class="fas fa-dumbbell"></i> ฝึกทำโจทย์จุดอ่อนนี้
                </button>` : '' }
            </div>
        `;
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.closeInsightDetail();
        });
        
        document.querySelector('.mobile-app').appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('active'));
    },

    // Close Insight Detail Modal
    closeInsightDetail() {
        const overlay = document.getElementById('insightDetailOverlay');
        if (overlay) {
            overlay.classList.remove('active');
            overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
        }
    },

    // Start Question
    startQuestion(questionId) {
        Utils.showToast(`เริ่มทำโจทย์ ${questionId}`, 'info');
        // Navigate to question interface
    },

    // Start Adaptive Exam
    async startAdaptiveExam() {
        // Disabled adaptive exam mode
        Utils.showToast('ยังไม่พร้อมใช้งาน', 'info');
        return;

        /*
        await this.navigate('exam-room');

        // Build an adaptive exam session object
        const adaptiveExamData = {
            id: 'ADAPTIVE',
            name: 'ข้อสอบปรับระดับอัตโนมัติ',
            subtitle: 'AI Adaptive · ปรับความยากตามคำตอบของคุณ',
            duration: 90,
            isAdaptive: true,
            questions: mockData.questions.map((q, idx) => ({
                ...q,
                number: idx + 1
            }))
        };

        ExamRoom.init(adaptiveExamData);
        */
    },

    // Start Exam
    async startExam(examId) {
        const exam = mockData.mockExams.find(e => e.id === examId);
        if (exam && exam.status === 'locked') {
            Utils.showToast('บทนี้ยังไม่เปิดให้ทำ เปิดเฉพาะบทที่ 6 ในขณะนี้', 'info');
            return;
        }

        // Look up the full exam content by ID (see js/exam-data.js)
        const examDataObj = (typeof examDataRegistry !== 'undefined') ? examDataRegistry[examId] : null;

        if (!examDataObj) {
            Utils.showToast('อยู่ระหว่างพัฒนา', 'info');
            return;
        }

        // Load the exam-room page
        await this.navigate('exam-room');
        ExamRoom.init(examDataObj);
    },

    // Render Profile
    renderProfile() {
        const savedImage = localStorage.getItem('profileImage');
        if (savedImage) {
            const imgElement = document.getElementById('profileImagePreview');
            const defaultIcon = document.getElementById('defaultAvatarIcon');
            if (imgElement && defaultIcon) {
                imgElement.src = savedImage;
                imgElement.style.display = 'block';
                defaultIcon.style.display = 'none';
            }
        }
        
        try {
            const savedData = JSON.parse(localStorage.getItem('userProfileData') || '{}');
            const displayName = savedData.name || 'นักเรียน';
            const profileNameEl = document.getElementById('profileDisplayName');
            if (profileNameEl) profileNameEl.textContent = displayName;

            const metaEl = document.getElementById('profileMetaInfo');
            if (metaEl) {
                const metaParts = [];
                if (savedData.grade) metaParts.push(`<span><i class="fas fa-school"></i> ${savedData.grade}</span>`);
                if (savedData.seatNo) metaParts.push(`<span><i class="fas fa-hashtag"></i> เลขที่ ${savedData.seatNo}</span>`);
                if (savedData.school) metaParts.push(`<span><i class="fas fa-landmark"></i> ${savedData.school}</span>`);
                metaEl.innerHTML = metaParts.join('');
                metaEl.style.display = metaParts.length ? 'flex' : 'none';
            }
        } catch (e) {}

        // --- Update subscription tier badge ---
        const tierBadge = document.getElementById('profileTierBadge');
        if (tierBadge) {
            const planId = localStorage.getItem('userPlan') || 'free';
            const tierMap = {
                'free':          { label: 'Free Plan',     cls: 'tier-free',    icon: '' },
                'exam-plus':     { label: 'Starter Plan',  cls: 'tier-starter', icon: '✨' },
                'adaptive-pro':  { label: 'Advance Plan',  cls: 'tier-advance', icon: '⭐' },
                'analyst-elite': { label: 'Ultimate Plan', cls: 'tier-ultimate',icon: '👑' }
            };
            const tier = tierMap[planId] || tierMap['free'];
            tierBadge.className = `profile-tier ${tier.cls}`;
            tierBadge.innerHTML = tier.icon ? `<span>${tier.icon}</span> ${tier.label}` : tier.label;
        }
    },

    // Render Exam Admin (design-only stub for future exam management)
    renderExamAdmin() {
        const container = document.getElementById('examAdminList');
        if (!container) return;

        const chapters = mockData.chapters || [];
        const exams = mockData.mockExams || [];
        const STATUS_LABEL = { available: 'เปิดให้ทำ', completed: 'มีข้อสอบแล้ว', locked: 'ยังไม่เปิด' };

        container.innerHTML = chapters.map(ch => {
            const pre = exams.find(e => e.chapterId === ch.id && e.examType === 'pre');
            const post = exams.find(e => e.chapterId === ch.id && e.examType === 'post');
            const pill = (exam, label) => exam
                ? `<span class="admin-pill status-${exam.status}">${label}: ${STATUS_LABEL[exam.status] || exam.status}</span>`
                : `<span class="admin-pill status-locked">${label}: ไม่มีข้อสอบ</span>`;

            return `
                <div class="exam-admin-card">
                    <div class="exam-admin-card-top">
                        <div class="exam-chapter-icon" style="background:${ch.color}18; color:${ch.color}">
                            <i class="fas ${ch.icon}"></i>
                        </div>
                        <span class="exam-admin-name">${ch.nameTH}</span>
                        <button class="icon-btn" title="แก้ไขข้อสอบ" onclick="window.open('exam-builder/index.html','_blank')">
                            <i class="fas fa-pen"></i>
                        </button>
                    </div>
                    <div class="exam-admin-pills">
                        ${pill(pre, 'ก่อนเรียน')}
                        ${pill(post, 'หลังเรียน')}
                    </div>
                </div>`;
        }).join('');
    },

    // Render Profile Setup
    renderProfileSetup() {
        // Add logic to load saved profile data, unless it's a new registration
        if (localStorage.getItem('isRegistering') === 'true') {
            localStorage.removeItem('isRegistering');
            if (document.getElementById('setupBackButton')) {
                document.getElementById('setupBackButton').style.display = 'none';
            }
        } else {
            if (document.getElementById('setupBackButton')) {
                document.getElementById('setupBackButton').style.display = 'flex';
            }
            try {
                const savedData = JSON.parse(localStorage.getItem('userProfileData') || '{}');
                if (savedData.prefix && document.getElementById('setupPrefix')) document.getElementById('setupPrefix').value = savedData.prefix;
                if (savedData.name && document.getElementById('setupName')) document.getElementById('setupName').value = savedData.name;
                if (savedData.grade && document.getElementById('setupGrade')) document.getElementById('setupGrade').value = savedData.grade;
                if (savedData.seatNo && document.getElementById('setupSeatNo')) document.getElementById('setupSeatNo').value = savedData.seatNo;
                if (savedData.school && document.getElementById('setupSchool')) document.getElementById('setupSchool').value = savedData.school;
            } catch (e) {
                console.warn('Could not parse user profile data');
            }
        }
    },

    // Submit Profile Setup
    submitProfileSetup() {
        // Collect and save data
        const profileData = {
            prefix: document.getElementById('setupPrefix')?.value || '',
            name: document.getElementById('setupName')?.value || '',
            grade: document.getElementById('setupGrade')?.value || '',
            seatNo: document.getElementById('setupSeatNo')?.value || '',
            school: document.getElementById('setupSchool')?.value || ''
        };

        if (!profileData.name) {
            Utils.showToast('กรุณากรอกชื่อ-นามสกุล', 'error');
            return;
        }
        if (!profileData.grade) {
            Utils.showToast('กรุณากรอกชั้นเรียน', 'error');
            return;
        }
        if (!profileData.seatNo) {
            Utils.showToast('กรุณากรอกเลขที่', 'error');
            return;
        }
        if (!profileData.school) {
            Utils.showToast('กรุณากรอกชื่อโรงเรียน', 'error');
            return;
        }

        try {
            localStorage.setItem('userProfileData', JSON.stringify(profileData));
            this.updateGlobalUI();
        } catch (e) {
            console.warn('Could not save user profile data');
        }

        Utils.showLoading();
        setTimeout(() => {
            Utils.hideLoading();
            Utils.showToast('บันทึกข้อมูลส่วนตัวสำเร็จ', 'success');
            this.navigate('dashboard');
        }, 1200);
    },

    // Handle Profile Image Upload
    handleProfileImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imgElement = document.getElementById('profileImagePreview');
                const defaultIcon = document.getElementById('defaultAvatarIcon');
                
                if (imgElement && defaultIcon) {
                    const imageDataUrl = e.target.result;
                    imgElement.src = imageDataUrl;
                    imgElement.style.display = 'block';
                    defaultIcon.style.display = 'none';
                    
                    // Save to localStorage so it persists between views
                    try {
                        localStorage.setItem('profileImage', imageDataUrl);
                    } catch (err) {
                        console.warn('Could not save profile image to localStorage due to quota limit');
                    }
                    
                    Utils.showToast('อัปโหลดรูปโปรไฟล์สำเร็จ', 'success');
                }
            }
            reader.readAsDataURL(file);
        }
    },

    // Update Global UI (e.g. Header text)
    updateGlobalUI() {
        try {
            const savedData = JSON.parse(localStorage.getItem('userProfileData') || '{}');
            const displayName = savedData.name || 'นักเรียน';
            const headerNameEl = document.getElementById('headerDisplayName');
            if (headerNameEl) headerNameEl.textContent = displayName;
        } catch (e) {}
    },

    // Generic placeholder for features that are not built yet
    notReady() {
        Utils.showToast('อยู่ระหว่างพัฒนา', 'info');
    },

    // Log the user out and return to the login screen
    logout() {
        localStorage.removeItem('userPlan');
        localStorage.removeItem('pendingPlan');
        this.data.user = null;
        Utils.showToast('ออกจากระบบแล้ว', 'success');
        this.navigate('auth');
    }
};

// Override Utils for mobile
Utils.showLoading = function(message = '') {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('active');
    }
};

Utils.hideLoading = function() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
};

Utils.showToast = function(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
};