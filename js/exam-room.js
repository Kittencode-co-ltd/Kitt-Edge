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

    // MODIFIED: mode + group state for group-by-group flow
    mode: 'reading',      // 'reading' | 'answer'
    currentGroup: 0,      // which passage group we are on

    // Initialize and start exam
    init(examDataObj) {
        this.examData = examDataObj;
        this.currentQ = 0;
        this.answers = {};
        this.secondsLeft = examDataObj.duration * 60;
        this.startTime = Date.now();

        document.getElementById('examRoomName').textContent = examDataObj.title;
        document.getElementById('examRoomSubtitle').textContent = examDataObj.subtitle;

        // MODIFIED: choose start mode based on exam type
        if (examDataObj.isPassageBased) {
            this.mode = 'reading';
            this.currentGroup = 0;
            // Hide the question-dot grid (not used in passage mode)
            const bottomNav = document.querySelector('.exam-bottom-nav');
            if (bottomNav) bottomNav.style.display = 'none';
            this.renderReadingPage();
        } else {
            this.mode = 'answer';
            this.buildQuestionGrid();
            this.renderQuestion();
        }

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

    // MODIFIED: Render the reading page for the CURRENT group only
    renderReadingPage() {
        const area = document.getElementById('examQuestionArea');
        if (!area || !this.examData.examContent) return;

        const passages = this.examData.examContent.passages;
        const p = passages[this.currentGroup];
        const totalGroups = passages.length;
        const { start, end } = p.questionRange;
        const groupTotal = end - start + 1;
        const groupAnswered = Object.keys(this.answers)
            .filter(k => +k >= start && +k <= end).length;

        // Highlight blank numbers as clickable jumps
        const contentHtml = p.content
            .replace(/\n/g, '<br>')
            .replace(/\((\d+)\)/g, (_, n) =>
                `<span class="blank-num" onclick="ExamRoom.jumpToQuestion(${parseInt(n) - 1})">(${n})</span>`);

        // Build group dot stepper
        const stepperHtml = passages.map((pg, gi) => {
            const { start: s, end: e } = pg.questionRange;
            const done = Object.keys(this.answers).filter(k => +k >= s && +k <= e).length;
            const cls = gi === this.currentGroup ? 'active' : (done === e - s + 1 ? 'complete' : '');
            return `<button class="group-dot ${cls}" onclick="ExamRoom.jumpToGroup(${gi})" title="${pg.title}">${gi + 1}</button>`;
        }).join('');

        // Overall progress bar
        const totalQ = this.examData.questions.length;
        const totalAnswered = Object.keys(this.answers).length;
        const bar = document.getElementById('examProgressBar');
        if (bar) bar.style.width = `${(totalAnswered / totalQ) * 100}%`;

        area.innerHTML = `
            <div class="reading-page">
                <div class="group-stepper">${stepperHtml}</div>
                <div class="reading-header">
                    <i class="fas fa-book-open"></i>
                    <span>${p.title}</span>
                    <span class="group-badge">${this.currentGroup + 1} / ${totalGroups}</span>
                </div>
                <p class="reading-hint">
                    อ่านบทสนทนา แล้วกด <strong>Start Answering</strong> เพื่อตอบข้อ ${start + 1}–${end + 1}<br>
                    หรือกดที่ <span class="blank-num-demo">(${start + 1})</span> เพื่อข้ามไปยังข้อนั้นโดยตรง
                </p>
                <div class="passage-card">
                    <div class="passage-title">${p.title}</div>
                    <div class="passage-body">${contentHtml}</div>
                </div>
                <button class="go-to-answer-btn" onclick="ExamRoom.nextStep()">
                    <i class="fas fa-pen-to-square"></i> Start Answering (${groupAnswered}/${groupTotal} ตอบแล้ว)
                </button>
            </div>`;
    },

    // MODIFIED: Render the answer page for the CURRENT group only
    renderAnswerPage() {
        const area = document.getElementById('examQuestionArea');
        if (!area || !this.examData.answerSheet) return;

        const passages = this.examData.examContent.passages;
        const p = passages[this.currentGroup];
        const { start, end } = p.questionRange;
        const totalQ = this.examData.questions.length;
        const totalAnswered = Object.keys(this.answers).length;
        const isLastGroup = this.currentGroup === passages.length - 1;

        // Update overall progress bar
        const bar = document.getElementById('examProgressBar');
        if (bar) bar.style.width = `${(totalAnswered / totalQ) * 100}%`;

        const choiceLabels = ['A', 'B', 'C', 'D'];

        // Render only this group's questions
        const questionsHtml = this.examData.answerSheet
            .slice(start, end + 1)
            .map((item, localIdx) => {
                const idx = start + localIdx; // global index
                const choicesHtml = item.choices.map((c, ci) => {
                    const sel = this.answers[idx] === ci ? 'selected' : '';
                    return `<button class="as-choice-btn ${sel}" onclick="ExamRoom.selectAnswerSheetChoice(${idx}, ${ci})">
                        <span class="as-choice-label">${choiceLabels[ci]}</span>
                        <span class="as-choice-text">${c}</span>
                    </button>`;
                }).join('');
                const isDone = this.answers[idx] !== undefined;
                return `
                    <div class="as-question-card ${isDone ? 'answered' : ''}" id="asq-${idx}">
                        <div class="as-q-number">ข้อ ${item.no}</div>
                        <div class="as-choices">${choicesHtml}</div>
                    </div>`;
            }).join('');

        const groupAnswered = Object.keys(this.answers).filter(k => +k >= start && +k <= end).length;
        const groupTotal = end - start + 1;

        const nextBtnHtml = isLastGroup
            ? `<button class="exam-submit-inline-btn" onclick="ExamRoom.submitExam()">
                    <i class="fas fa-paper-plane"></i> ส่งข้อสอบ
               </button>`
            : `<button class="go-to-answer-btn" style="margin-top:8px" onclick="ExamRoom.nextStep()">
                    <i class="fas fa-arrow-right"></i> Next: ${passages[this.currentGroup + 1].title}
               </button>`;

        area.innerHTML = `
            <div class="answer-sheet-page">
                <div class="answer-sheet-header">
                    <button class="back-to-reading-btn" onclick="ExamRoom.goToReading()">
                        <i class="fas fa-arrow-left"></i> อ่านบทสนทนา
                    </button>
                    <span class="as-progress-label">${groupAnswered}/${groupTotal} · รวม ${totalAnswered}/${totalQ}</span>
                </div>
                <div class="as-section-label">${p.title} — ข้อ ${start + 1}–${end + 1}</div>
                <div class="as-questions-list">${questionsHtml}</div>
                ${nextBtnHtml}
            </div>`;

        // Scroll to targeted question if set
        if (this._scrollToQ !== undefined) {
            const el = document.getElementById(`asq-${this._scrollToQ}`);
            if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
            this._scrollToQ = undefined;
        }
    },

    // ADDED: Advance through the group-by-group flow
    nextStep() {
        const passages = this.examData.examContent.passages;
        if (this.mode === 'reading') {
            // reading → answer for this group
            this.mode = 'answer';
            this.renderAnswerPage();
        } else {
            // answer → next group reading (or done)
            if (this.currentGroup < passages.length - 1) {
                this.currentGroup++;
                this.mode = 'reading';
                this.renderReadingPage();
                document.getElementById('examQuestionArea').scrollTop = 0;
            } else {
                // last group answered → submit
                this.submitExam();
            }
        }
    },

    // ADDED: Jump directly to a group's reading page
    jumpToGroup(groupIdx) {
        this.currentGroup = groupIdx;
        this.mode = 'reading';
        this.renderReadingPage();
    },

    // MODIFIED: Go back to reading for the current group
    goToReading() {
        this.mode = 'reading';
        this.renderReadingPage();
    },

    // Select choice from the Answer Sheet Page
    selectAnswerSheetChoice(qIdx, choiceIdx) {
        this.answers[qIdx] = choiceIdx;
        this.renderAnswerPage();
    },

    // MODIFIED: Jump to a question — finds the correct group automatically
    jumpToQuestion(qIdx) {
        const passages = this.examData.examContent.passages;
        const groupIdx = passages.findIndex(p => qIdx >= p.questionRange.start && qIdx <= p.questionRange.end);
        if (groupIdx !== -1) this.currentGroup = groupIdx;
        this.mode = 'answer';
        this._scrollToQ = qIdx;
        this.renderAnswerPage();
    },

    // Render current question (used for non-passage exams)
    renderQuestion() {
        // MODIFIED: dispatch to reading/answer page for passage-based exams
        if (this.examData && this.examData.isPassageBased) {
            if (this.mode === 'reading') this.renderReadingPage();
            else this.renderAnswerPage();
            return;
        }

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
