// ============================================
// Kitt-Edge – Scan Result Logic
// ============================================

const ScanResult = {

    // ── Mock AI responses (one per subject/topic pool)
    mockResults: [
        {
            subject: 'คณิตศาสตร์',
            difficulty: 'ยาก',
            time: '~8 นาที',
            answer: 'x = 3, y = -1',
            questionImage: 'assets/images/questions/question_math.png',
            concepts: ['สมการเชิงเส้น', 'การแก้ระบบสมการ', 'Substitution Method'],
            steps: [
                {
                    title: 'ระบุสมการทั้งสอง',
                    desc: 'จากโจทย์ได้ระบบสมการ:',
                    formula: '2x + y = 5\nx - y = 4'
                },
                {
                    title: 'บวกสมการเพื่อกำจัด y',
                    desc: 'บวกสมการทั้งสองข้างเข้าหากัน y ตัดออก:',
                    formula: '3x = 9  →  x = 3'
                },
                {
                    title: 'แทนค่า x กลับเข้าสมการ',
                    desc: 'แทน x = 3 ในสมการที่ 2 จะได้:',
                    formula: '3 - y = 4  →  y = -1'
                },
                {
                    title: 'ตรวจคำตอบ',
                    desc: 'แทน x=3, y=-1 ในสมการแรก: 2(3)+(-1)=5 ✓',
                    formula: null
                }
            ],
            related: [
                { emoji: '📐', title: 'สมการสองตัวแปร (1)', sub: 'คณิตศาสตร์ · ม.3', diff: 'medium' },
                { emoji: '🔢', title: 'Elimination Method', sub: 'คณิตศาสตร์ · ม.4', diff: 'hard' },
                { emoji: '📊', title: 'Matrix พื้นฐาน', sub: 'คณิตศาสตร์ · ม.5', diff: 'hard' }
            ]
        },
        {
            subject: 'ฟิสิกส์',
            difficulty: 'ปานกลาง',
            time: '~6 นาที',
            answer: 'F = 24 N',
            questionImage: 'assets/images/questions/question_physics.png',
            concepts: ["กฎของนิวตัน", "แรงลัพธ์", "F = ma"],
            steps: [
                {
                    title: 'ระบุตัวแปรที่ทราบ',
                    desc: 'มวล m = 6 kg, ความเร่ง a = 4 m/s²',
                    formula: 'F = m × a'
                },
                {
                    title: 'แทนค่าในสูตร',
                    desc: 'คำนวณแรงลัพธ์ที่กระทำต่อวัตถุ:',
                    formula: 'F = 6 × 4 = 24 N'
                },
                {
                    title: 'สรุปคำตอบ',
                    desc: 'แรงที่ต้องการกระทำต่อวัตถุ เท่ากับ 24 นิวตัน',
                    formula: null
                }
            ],
            related: [
                { emoji: '⚡', title: 'กฎข้อที่สองของนิวตัน', sub: 'ฟิสิกส์ · ม.4', diff: 'medium' },
                { emoji: '🚀', title: 'โมเมนตัมและแรงกระตุ้น', sub: 'ฟิสิกส์ · ม.5', diff: 'hard' },
                { emoji: '🎯', title: 'แรงและการเคลื่อนที่ (พื้นฐาน)', sub: 'ฟิสิกส์ · ม.3', diff: 'easy' }
            ]
        },
        {
            subject: 'เคมี',
            difficulty: 'ปานกลาง',
            time: '~7 นาที',
            answer: 'pH = 3',
            questionImage: 'assets/images/questions/question_chemistry.png',
            concepts: ['กรด-เบส', 'สมการกรด', 'ค่า pH'],
            steps: [
                {
                    title: 'ระบุความเข้มข้นของ H⁺',
                    desc: 'ได้รับ HCl 0.001 mol/L ซึ่งแตกตัวสมบูรณ์:',
                    formula: '[H⁺] = 0.001 = 10⁻³ mol/L'
                },
                {
                    title: 'คำนวณ pH',
                    desc: 'ใช้สูตร pH = -log[H⁺]:',
                    formula: 'pH = -log(10⁻³) = 3'
                },
                {
                    title: 'สรุป',
                    desc: 'สารละลาย HCl 0.001 M มีค่า pH = 3 (เป็นกรด)',
                    formula: null
                }
            ],
            related: [
                { emoji: '🧪', title: 'ค่า pH ของกรด-เบสอ่อน', sub: 'เคมี · ม.5', diff: 'hard' },
                { emoji: '⚗️', title: 'Titration เบื้องต้น', sub: 'เคมี · ม.5', diff: 'medium' },
                { emoji: '🔬', title: 'การแตกตัวของกรดแก่', sub: 'เคมี · ม.4', diff: 'easy' }
            ]
        }
    ],

    currentResult: null,

    // ── Called by mobile-app after navigate('scan-result')
    init(capturedDataUrl) {
        // Pick a random result (simulates AI detecting which question it is)
        this.currentResult = this.mockResults[Math.floor(Math.random() * this.mockResults.length)];

        // Show the real question image from our result bank as the primary display
        const imgWrap = document.querySelector('.scan-image-wrap');
        if (imgWrap) {
            imgWrap.innerHTML = `
                <img id="scanCapturedImage"
                     src="${this.currentResult.questionImage}"
                     alt="Question"
                     onerror="this.src=''; this.parentElement.innerHTML='<div style=\\'display:flex;flex-direction:column;align-items:center;gap:10px;padding:40px 20px;color:#9ca3af;\\'><i class=\\'fas fa-image\\' style=\\'font-size:48px;\\'></i><span style=\\'font-size:13px;\\'>รูปโจทย์ที่สแกน</span></div>'" />
            `;
        }

        // Update meta tags
        this._setText('scanMetaSubject',    `<i class="fas fa-book"></i> ${this.currentResult.subject}`);
        this._setText('scanMetaDifficulty', `<i class="fas fa-signal"></i> ${this.currentResult.difficulty}`);
        this._setText('scanMetaTime',       `<i class="far fa-clock"></i> ${this.currentResult.time}`);

        // Start loading animation, then reveal solution
        this._runLoadingSequence();
    },

    _setText(id, html) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
    },

    _runLoadingSequence() {
        const fill = document.getElementById('scanLoadingFill');
        const loadingMessages = [
            'Kitt-Edge AI กำลังวิเคราะห์โจทย์...',
            'ระบุหัวข้อและรูปแบบโจทย์...',
            'สร้างวิธีทำทีละขั้นตอน...',
            'เกือบเสร็จแล้ว...'
        ];
        const msgEl = document.querySelector('.scan-loading-text');

        let progress = 0;
        let msgIndex = 0;

        const interval = setInterval(() => {
            progress += Math.random() * 18 + 8;
            if (progress > 100) progress = 100;
            if (fill) fill.style.width = progress + '%';

            // Cycle through messages
            msgIndex = Math.min(Math.floor(progress / 28), loadingMessages.length - 1);
            if (msgEl) msgEl.textContent = loadingMessages[msgIndex];

            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => this._revealSolution(), 350);
            }
        }, 280);
    },

    _revealSolution() {
        const res = this.currentResult;

        // Hide loading card
        const loadingCard = document.getElementById('scanLoadingCard');
        if (loadingCard) {
            loadingCard.style.transition = 'opacity 0.3s';
            loadingCard.style.opacity = '0';
            setTimeout(() => loadingCard.style.display = 'none', 300);
        }

        // Answer value
        const answerEl = document.getElementById('scanAnswerValue');
        if (answerEl) answerEl.textContent = res.answer;

        // Steps
        const stepsEl = document.getElementById('scanSteps');
        if (stepsEl) {
            stepsEl.innerHTML = res.steps.map((s, i) => `
                <div class="scan-step" style="animation-delay:${i * 0.08}s">
                    <div class="scan-step-num">${i + 1}</div>
                    <div class="scan-step-body">
                        <div class="scan-step-title">${s.title}</div>
                        <div class="scan-step-desc">${s.desc}</div>
                        ${s.formula ? `<div class="scan-step-formula">${s.formula.replace(/\n/g, '<br>')}</div>` : ''}
                    </div>
                </div>
            `).join('');
        }

        // Concept tags
        const conceptRow = document.getElementById('scanConceptRow');
        if (conceptRow) {
            conceptRow.innerHTML = res.concepts.map(c =>
                `<span class="scan-concept-tag">${c}</span>`
            ).join('');
        }

        // Related questions
        const relatedList = document.getElementById('scanRelatedList');
        if (relatedList) {
            relatedList.innerHTML = res.related.map(r => `
                <div class="scan-related-item" onclick="Utils.showToast('เปิดโจทย์: ${r.title}', 'info')">
                    <div class="scan-related-thumb">${r.emoji}</div>
                    <div class="scan-related-info">
                        <div class="scan-related-title">${r.title}</div>
                        <div class="scan-related-sub">${r.sub}</div>
                    </div>
                    <span class="scan-related-diff ${r.diff}">${r.diff === 'easy' ? 'ง่าย' : r.diff === 'medium' ? 'ปานกลาง' : 'ยาก'}</span>
                </div>
            `).join('');
        }

        // Show solution, related and action cards
        setTimeout(() => {
            const solutionCard = document.getElementById('scanSolutionCard');
            const relatedCard  = document.getElementById('scanRelatedCard');
            const actions      = document.getElementById('scanActions');
            if (solutionCard) solutionCard.style.display = 'block';
            if (relatedCard)  relatedCard.style.display  = 'block';
            if (actions)      actions.style.display       = 'flex';
        }, 100);
    },

    share() {
        if (navigator.share) {
            navigator.share({
                title: 'Kitt-Edge – ผลการสแกนโจทย์',
                text: `คำตอบ: ${this.currentResult?.answer || '—'}`,
            }).catch(() => {});
        } else {
            Utils.showToast('คัดลอกคำตอบแล้ว!', 'success');
        }
    },

    practiceMore() {
        Utils.showToast('เปิดโหมดฝึกฝนโจทย์คล้ายกัน...', 'info');
        setTimeout(() => MobileApp.navigate('exams'), 800);
    }
};
