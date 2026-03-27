// ============================================
// Kitt-Edge - Exam Room Logic
// ============================================

const ExamRoom = {
    examData: null,
    currentQ: 0,
    answers: {}, // { qIndex: value }
    timerInterval: null,
    secondsLeft: 0,
    startTime: null,

    // Initialize and start exam
    init(examDataObj) {
        this.examData = examDataObj;
        this.currentQ = 0;
        this.answers = {};
        this.secondsLeft = examDataObj.duration * 60;
        this.startTime = Date.now();

        document.getElementById('examRoomName').textContent = examDataObj.title;
        document.getElementById('examRoomSubtitle').textContent = examDataObj.subtitle;

        this.buildQuestionGrid();
        this.renderQuestion();
        this.startTimer();

        // Back button
        document.getElementById('examBackBtn').onclick = () => {
            if (confirm('ออกจากข้อสอบ? คำตอบจะหายทั้งหมด')) {
                this.stopTimer();
                MobileApp.navigate('exams');
                MobileApp.updateNavActive('exams');
            }
        };
    },

    // Build the dot grid at the bottom
    buildQuestionGrid() {
        const grid = document.getElementById('questionGrid');
        if (!grid) return;
        grid.innerHTML = '';
        this.examData.questions.forEach((q, i) => {
            const dot = document.createElement('button');
            dot.className = 'q-dot';
            dot.id = `qdot-${i}`;
            dot.textContent = i + 1;
            dot.onclick = () => this.goToQuestion(i);
            grid.appendChild(dot);
        });
    },

    // Navigate to question index
    goToQuestion(index) {
        this.currentQ = index;
        this.renderQuestion();
    },

    // Render current question
    renderQuestion() {
        const q = this.examData.questions[this.currentQ];
        const total = this.examData.questions.length;
        const area = document.getElementById('examQuestionArea');
        if (!area || !q) return;

        // Update question number labels visually
        document.querySelectorAll('.q-dot').forEach((dot, i) => {
            dot.classList.remove('active', 'answered');
            if (i === this.currentQ) dot.classList.add('active');
            if (this.answers[i] !== undefined) dot.classList.add('answered');
        });

        // Scroll the active dot into view
        const activeDot = document.getElementById(`qdot-${this.currentQ}`);
        if (activeDot) activeDot.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

        // Progress
        const answered = Object.keys(this.answers).length;
        const pct = (answered / total) * 100;
        const bar = document.getElementById('examProgressBar');
        if (bar) bar.style.width = pct + '%';

        // Build question HTML
        let optionsHtml = '';
        if (q.type === 'choice') {
            optionsHtml = `<div class="choice-list">` +
                q.choices.map((c, ci) => {
                    const sel = this.answers[this.currentQ] === ci ? 'selected' : '';
                    return `<button class="choice-btn ${sel}" onclick="ExamRoom.selectChoice(${ci})">${ci + 1}. ${c}</button>`;
                }).join('') +
                `</div>`;
        } else {
            const val = this.answers[this.currentQ] !== undefined ? this.answers[this.currentQ] : '';
            optionsHtml = `
                <div class="fill-input-wrap">
                    <label>กรอกคำตอบ</label>
                    <input class="fill-input" type="text" id="fillInput" 
                           value="${val}" placeholder="${q.placeholder}"
                           oninput="ExamRoom.saveFill(this.value)">
                </div>`;
        }

        const qText = q.text.replace(/\n/g, '<br>');

        area.innerHTML = `
            <div class="question-card-exam">
                <div class="question-number-badge">
                    ข้อที่ ${this.currentQ + 1} / ${total}
                    <span class="q-type-badge ${q.type === 'fill' ? 'fill' : 'choice'}">${q.type === 'fill' ? 'เติมคำตอบ' : 'เลือกตอบ'}</span>
                </div>
                <div class="question-text-exam">${qText}</div>
                ${optionsHtml}
            </div>`;

        // Update nav buttons
        document.getElementById('prevBtn').disabled = this.currentQ === 0;
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');
        const allAnswered = Object.keys(this.answers).length === total;

        if (this.currentQ === total - 1) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'flex';
            submitBtn.style.background = allAnswered ? '#22c55e' : '#64748b';
        } else {
            nextBtn.style.display = 'flex';
            submitBtn.style.display = 'none';
        }
    },

    // Select a choice answer
    selectChoice(choiceIndex) {
        this.answers[this.currentQ] = choiceIndex;
        this.renderQuestion();
    },

    // Save fill-in answer
    saveFill(value) {
        if (value.trim() === '') {
            delete this.answers[this.currentQ];
        } else {
            this.answers[this.currentQ] = value.trim();
        }
        // Update progress
        const total = this.examData.questions.length;
        const answered = Object.keys(this.answers).length;
        const pct = (answered / total) * 100;
        const bar = document.getElementById('examProgressBar');
        if (bar) bar.style.width = pct + '%';
        // Update dot
        const dot = document.getElementById(`qdot-${this.currentQ}`);
        if (dot) {
            dot.classList.toggle('answered', this.answers[this.currentQ] !== undefined);
        }
        // Update submit button color
        if (this.currentQ === total - 1) {
            const submitBtn = document.getElementById('submitBtn');
            if (submitBtn) submitBtn.style.background = answered === total ? '#22c55e' : '#64748b';
        }
    },

    // Go to previous question
    prevQuestion() {
        if (this.currentQ > 0) {
            this.currentQ--;
            this.renderQuestion();
        }
    },

    // Go to next question
    nextQuestion() {
        if (this.currentQ < this.examData.questions.length - 1) {
            this.currentQ++;
            this.renderQuestion();
        }
    },

    // Start countdown timer
    startTimer() {
        this.stopTimer();
        const display = document.getElementById('timerDisplay');
        this.timerInterval = setInterval(() => {
            if (this.secondsLeft <= 0) {
                this.stopTimer();
                Utils.showToast('หมดเวลาแล้ว! กำลังส่งข้อสอบ...', 'warning');
                setTimeout(() => this.submitExam(), 1500);
                return;
            }
            this.secondsLeft--;
            const m = Math.floor(this.secondsLeft / 60).toString().padStart(2, '0');
            const s = (this.secondsLeft % 60).toString().padStart(2, '0');
            if (display) {
                display.textContent = `${m}:${s}`;
                display.parentElement.classList.toggle('timer-warning', this.secondsLeft <= 300);
            }
        }, 1000);
    },

    // Stop timer
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    },

    // Submit the exam and show results
    submitExam() {
        this.stopTimer();

        const total = this.examData.questions.length;
        const answered = Object.keys(this.answers).length;
        const unanswered = total - answered;

        if (unanswered > 0) {
            const go = confirm(`ยังมี ${unanswered} ข้อที่ยังไม่ได้ตอบ\nต้องการส่งข้อสอบเลยไหม?`);
            if (!go) {
                this.startTimer();
                return;
            }
        }

        // Score
        let correct = 0;
        this.examData.questions.forEach((q, i) => {
            const userAns = this.answers[i];
            if (q.type === 'choice') {
                if (userAns === q.answer) correct++;
            } else {
                // fill: compare string loosely
                if (userAns !== undefined && String(userAns).trim() === String(q.answer).trim()) correct++;
            }
        });

        const elapsedSec = Math.round((Date.now() - this.startTime) / 1000);
        const elapsedMin = Math.floor(elapsedSec / 60);
        const elapsedS = elapsedSec % 60;
        const pct = Math.round((correct / total) * 100);

        this.showResults(correct, total, pct, elapsedMin, elapsedS);
    },

    // Show results screen
    showResults(correct, total, pct, elapsedMin, elapsedS) {
        const area = document.getElementById('examQuestionArea');
        const grade = pct >= 80 ? '🎉 ยอดเยี่ยม!' : pct >= 60 ? '👍 ดีมาก' : '📚 ต้องฝึกเพิ่ม';
        const gradeColor = pct >= 80 ? '#22c55e' : pct >= 60 ? '#f59e0b' : '#ef4444';

        // Build per-question review
        const reviewHtml = this.examData.questions.map((q, i) => {
            const userAns = this.answers[i];
            let isCorrect = false;
            let userLabel = '—';
            let correctLabel = '';

            if (q.type === 'choice') {
                isCorrect = userAns === q.answer;
                userLabel = userAns !== undefined ? `${userAns + 1}. ${q.choices[userAns]}` : '— ไม่ได้ตอบ —';
                correctLabel = `${q.answer + 1}. ${q.choices[q.answer]}`;
            } else {
                isCorrect = userAns !== undefined && String(userAns).trim() === String(q.answer).trim();
                userLabel = userAns !== undefined ? userAns : '— ไม่ได้ตอบ —';
                correctLabel = q.answer;
            }

            return `
                <div class="review-item ${isCorrect ? 'correct' : 'wrong'}">
                    <div class="review-q-header">
                        <span class="review-q-no">ข้อ ${i + 1}</span>
                        <span class="review-status">${isCorrect ? '✓ ถูก' : '✗ ผิด'}</span>
                    </div>
                    <div class="review-q-text">${q.text.replace(/\n/g, '<br>').substring(0, 100)}${q.text.length > 100 ? '...' : ''}</div>
                    <div class="review-ans">คุณตอบ: <strong>${userLabel}</strong></div>
                    ${!isCorrect ? `<div class="review-correct">เฉลย: <strong>${correctLabel}</strong></div>` : ''}
                </div>`;
        }).join('');

        area.innerHTML = `
            <div class="results-screen">
                <div class="results-header">
                    <div class="results-grade">${grade}</div>
                    <div class="results-score" style="color:${gradeColor}">${pct}%</div>
                    <div class="results-detail">${correct} / ${total} ข้อถูก</div>
                    <div class="results-time">⏱ เวลาที่ใช้: ${elapsedMin} นาที ${elapsedS} วินาที</div>
                </div>
                <div class="results-review-title">เฉลยรายข้อ</div>
                <div class="results-review">${reviewHtml}</div>
                <button class="exam-back-to-list" onclick="MobileApp.navigate('exams'); MobileApp.updateNavActive('exams');">
                    <i class="fas fa-list"></i> กลับหน้ารายการข้อสอบ
                </button>
            </div>`;

        // Hide bottom nav
        document.querySelector('.exam-bottom-nav').style.display = 'none';
    }
};
