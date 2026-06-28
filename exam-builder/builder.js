// ============================================================
// Kitt-Edge — Exam Builder
// ============================================================

const B = {

  // ── State ──────────────────────────────────────────────────
  exam: { id: '', title: '', subtitle: '', duration: 30 },
  passages: [],   // { id, title, content, fromQ, toQ }
  questions: [],  // per type, see _newQuestion()
  selIdx: -1,
  _pid: 1,

  // ── Question types ─────────────────────────────────────────
  TYPES: [
    { id: 'choice',      label: 'เลือกตอบ (ข้อเดียว)',    icon: 'fa-list-ul',       dot: 'dot-choice',      hint: 'กดตัวอักษรเพื่อระบุข้อที่ถูกต้อง' },
    { id: 'multi',       label: 'เลือกหลายข้อถูก',        icon: 'fa-check-square',  dot: 'dot-multi',       hint: 'กดได้หลายข้อ' },
    { id: 'truefalse',   label: 'ตาราง ใช่ / ไม่ใช่',     icon: 'fa-table',         dot: 'dot-truefalse',   hint: 'กำหนดว่าแต่ละข้อความเป็น ใช่ หรือ ไม่ใช่' },
    { id: 'fill-closed', label: 'กรอกคำตอบ (ปิด)',        icon: 'fa-keyboard',      dot: 'dot-fill-closed', hint: 'คำตอบที่แน่ชัด ตัดสินด้วยการเทียบตรง' },
    { id: 'fill-open',   label: 'กรอกคำตอบ (เปิด)',       icon: 'fa-pen-nib',       dot: 'dot-fill-open',   hint: 'ตัดสินด้วยเกณฑ์ที่กำหนด' },
  ],

  // ── Init ───────────────────────────────────────────────────
  init() {
    this._renderQList();
    this._showEditor();
  },

  // ── Exam metadata ──────────────────────────────────────────
  setMeta(k, v) {
    this.exam[k] = v;
    if (k === 'title') document.title = (v || 'เครื่องมือสร้างข้อสอบ') + ' — ครูริสา สอนภาษาไทย';
  },

  // ── Question CRUD ──────────────────────────────────────────
  addQuestion() {
    const no = this.questions.length + 1;
    this.questions.push(this._newQuestion(no));
    this._renderQList();
    this.selectQ(this.questions.length - 1);
  },

  deleteQuestion(idx) {
    if (!confirm(`ลบข้อที่ ${idx + 1}?`)) return;
    const pid = this.questions[idx].passageId;
    this.questions.splice(idx, 1);
    this.questions.forEach((q, i) => { q.no = i + 1; });
    this.selIdx = this.questions.length === 0 ? -1 : Math.min(this.selIdx, this.questions.length - 1);
    this._renderQList();
    this._showEditor();
  },

  selectQ(idx) {
    this.selIdx = idx;
    this._renderQList();
    this._showEditor();
  },

  get q() { return this.questions[this.selIdx] ?? null; },

  _newQuestion(no) {
    return {
      no,
      type: 'choice',
      text: '',
      passageId: null,
      choices: ['', '', '', ''],
      answer: -1,
    };
  },

  // ── Passage management ─────────────────────────────────────
  onPassageToggle(on) {
    if (!this.q) return;
    if (on) {
      if (this.passages.length > 0) {
        this.q.passageId = this.passages[0].id;
      } else {
        this._createPassage();
      }
    } else {
      this.q.passageId = null;
    }
    this._renderPassageSection();
  },

  _createPassage() {
    const id = 'p' + (this._pid++);
    const no = this.q ? this.q.no : 1;
    this.passages.push({ id, title: '', content: '', fromQ: no, toQ: no });
    this.q.passageId = id;
    return id;
  },

  onPassageSelect(val) {
    if (!this.q) return;
    if (val === '_new') {
      this._createPassage();
    } else {
      this.q.passageId = val;
    }
    this._renderPassageSection();
  },

  updPass(field, val) {
    const p = this.passages.find(p => p.id === this.q?.passageId);
    if (p) p[field] = val;
  },

  delPassage() {
    const pid = this.q?.passageId;
    if (!pid) return;
    const users = this.questions.filter(q => q.passageId === pid).length;
    const msg = users > 1
      ? `บทความนี้ถูกใช้โดย ${users} ข้อ\nลบแล้วทุกข้อจะถูกยกเลิกการเชื่อมโยง ยืนยัน?`
      : 'ลบบทความนี้?';
    if (!confirm(msg)) return;
    this.passages = this.passages.filter(p => p.id !== pid);
    this.questions.forEach(q => { if (q.passageId === pid) q.passageId = null; });
    this._renderPassageSection();
  },

  // ── Question field updates ─────────────────────────────────
  updQ(field, val) {
    if (!this.q) return;
    this.q[field] = val;
    if (field === 'text') this._renderQList();
  },

  setType(type) {
    if (!this.q || this.q.type === type) return;
    this.q.type = type;
    // Reset type-specific fields
    delete this.q.choices; delete this.q.answer; delete this.q.answers;
    delete this.q.rows; delete this.q.rubric; delete this.q.maxScore;
    switch (type) {
      case 'choice':
        this.q.choices = ['', '', '', ''];
        this.q.answer = -1;
        break;
      case 'multi':
        this.q.choices = ['', '', '', ''];
        this.q.answers = [];
        break;
      case 'truefalse':
        this.q.rows = [{ statement: '', answer: null }];
        break;
      case 'fill-closed':
        this.q.answer = '';
        break;
      case 'fill-open':
        this.q.maxScore = 2;
        this.q.rubric = [
          { score: 2, criteria: '' },
          { score: 1, criteria: '' },
          { score: 0, criteria: '' },
        ];
        break;
    }
    this._renderQList();
    this._renderTypeChips();
    this._renderAnswerSection();
  },

  // ── Choice (single) ────────────────────────────────────────
  addChoice() {
    if (this.q.choices.length >= 8) return;
    this.q.choices.push('');
    this._renderAnswerSection();
  },
  removeChoice(i) {
    if (this.q.choices.length <= 2) return;
    this.q.choices.splice(i, 1);
    if (this.q.answer === i) this.q.answer = -1;
    else if (this.q.answer > i) this.q.answer--;
    this._renderAnswerSection();
  },
  updChoice(i, v)  { this.q.choices[i] = v; },
  setAnswer(i)     { this.q.answer = (this.q.answer === i) ? -1 : i; this._renderAnswerSection(); },

  // ── Choice (multi) ─────────────────────────────────────────
  addChoiceMulti() {
    if (this.q.choices.length >= 8) return;
    this.q.choices.push('');
    this._renderAnswerSection();
  },
  removeChoiceMulti(i) {
    if (this.q.choices.length <= 2) return;
    this.q.choices.splice(i, 1);
    this.q.answers = this.q.answers
      .filter(a => a !== i)
      .map(a => a > i ? a - 1 : a);
    this._renderAnswerSection();
  },
  updChoiceMulti(i, v) { this.q.choices[i] = v; },
  toggleAnswerMulti(i) {
    const idx = this.q.answers.indexOf(i);
    if (idx === -1) this.q.answers.push(i);
    else this.q.answers.splice(idx, 1);
    this._renderAnswerSection();
  },

  // ── True/False ─────────────────────────────────────────────
  addTFRow() {
    this.q.rows.push({ statement: '', answer: null });
    this._renderAnswerSection();
  },
  removeTFRow(i) {
    if (this.q.rows.length <= 1) return;
    this.q.rows.splice(i, 1);
    this._renderAnswerSection();
  },
  updTFStmt(i, v)   { this.q.rows[i].statement = v; },
  setTFAnswer(i, v) {
    this.q.rows[i].answer = this.q.rows[i].answer === v ? null : v;
    this._renderAnswerSection();
  },

  // ── Fill closed ────────────────────────────────────────────
  setFillAnswer(v) { if (this.q) this.q.answer = v; },

  // ── Fill open / rubric ─────────────────────────────────────
  setMaxScore(v)          { if (this.q) this.q.maxScore = +v; },
  addRubric()             { this.q.rubric.push({ score: 0, criteria: '' }); this._renderAnswerSection(); },
  removeRubric(i)         { if (this.q.rubric.length > 1) { this.q.rubric.splice(i, 1); this._renderAnswerSection(); } },
  updRubricScore(i, v)    { this.q.rubric[i].score = +v; },
  updRubricCriteria(i, v) { this.q.rubric[i].criteria = v; },

  // ── Rendering ──────────────────────────────────────────────
  _renderQList() {
    const list = document.getElementById('qList');
    document.getElementById('qBadge').textContent = this.questions.length;
    list.innerHTML = this.questions.map((q, i) => {
      const t = this.TYPES.find(t => t.id === q.type);
      const preview = q.text.trim().substring(0, 28) || '(ยังไม่มีโจทย์)';
      return `<div class="q-item${i === this.selIdx ? ' active' : ''}" onclick="B.selectQ(${i})">
        <span class="q-num">${q.no}</span>
        <span class="q-preview">${preview}</span>
        <span class="q-dot ${t?.dot || ''}"></span>
        <button class="btn-del-q" onclick="event.stopPropagation();B.deleteQuestion(${i})" title="ลบ">
          <i class="fas fa-times"></i>
        </button>
      </div>`;
    }).join('');
  },

  _showEditor() {
    const noSel  = document.getElementById('noSel');
    const content = document.getElementById('editorContent');
    if (!this.q) {
      noSel.hidden = false;
      content.hidden = true;
      return;
    }
    noSel.hidden = true;
    content.hidden = false;
    this._renderPassageSection();
    this._renderTypeChips();
    document.getElementById('qText').value = this.q.text;
    this._renderAnswerSection();
  },

  _renderPassageSection() {
    if (!this.q) return;
    const hasPassage = !!this.q.passageId;
    document.getElementById('passToggle').checked = hasPassage;
    const body = document.getElementById('s1Body');
    body.hidden = !hasPassage;
    if (!hasPassage) return;

    // Populate dropdown
    const sel = document.getElementById('passSelect');
    sel.innerHTML = '<option value="_new">+ สร้างบทความใหม่</option>' +
      this.passages.map(p =>
        `<option value="${p.id}">${p.title || '(ไม่มีชื่อ)'}</option>`
      ).join('');
    sel.value = this.q.passageId;

    const delBtn = document.getElementById('btnDelPass');
    delBtn.hidden = !this.passages.find(p => p.id === this.q.passageId);

    const p = this.passages.find(p => p.id === this.q.passageId);
    if (p) {
      document.getElementById('passTitle').value = p.title;
      document.getElementById('passBody').value  = p.content;
      document.getElementById('passFrom').value  = p.fromQ;
      document.getElementById('passTo').value    = p.toQ;
    }
  },

  _renderTypeChips() {
    const row = document.getElementById('typeRow');
    row.innerHTML = this.TYPES.map(t =>
      `<button class="type-chip${this.q?.type === t.id ? ' active' : ''}" onclick="B.setType('${t.id}')">
        <i class="fas ${t.icon}"></i>${t.label}
      </button>`
    ).join('');
    // Update s2 desc
    const active = this.TYPES.find(t => t.id === this.q?.type);
    document.getElementById('s2TypeLabel').textContent = active?.label || '';
  },

  _renderAnswerSection() {
    const body = document.getElementById('ansBody');
    const hint = document.getElementById('s3Hint');
    if (!this.q) { body.innerHTML = ''; return; }

    const t = this.TYPES.find(t => t.id === this.q.type);
    hint.textContent = t?.hint || '';

    switch (this.q.type) {
      case 'choice':     body.innerHTML = this._htmlChoices(false); break;
      case 'multi':      body.innerHTML = this._htmlChoices(true);  break;
      case 'truefalse':  body.innerHTML = this._htmlTrueFalse();    break;
      case 'fill-closed':body.innerHTML = this._htmlFillClosed();   break;
      case 'fill-open':  body.innerHTML = this._htmlFillOpen();     break;
    }
  },

  // ── Answer HTML builders ───────────────────────────────────

  _htmlChoices(isMulti) {
    const LABELS = ['A','B','C','D','E','F','G','H'];
    const choices = this.q.choices || [];
    const answer  = this.q.answer;
    const answers = this.q.answers || [];

    const items = choices.map((c, i) => {
      const isCorrect = isMulti ? answers.includes(i) : answer === i;
      const labelClass = isCorrect ? (isMulti ? 'choice-label correct-multi' : 'choice-label correct') : 'choice-label';
      const onMark  = isMulti ? `B.toggleAnswerMulti(${i})` : `B.setAnswer(${i})`;
      const onInput = isMulti ? `B.updChoiceMulti(${i},this.value)` : `B.updChoice(${i},this.value)`;
      const onDel   = isMulti ? `B.removeChoiceMulti(${i})` : `B.removeChoice(${i})`;
      const canDel  = choices.length > 2;
      return `<div class="choice-item">
        <button class="${labelClass}" onclick="${onMark}" title="ทำเครื่องหมายว่าถูกต้อง">${LABELS[i]}</button>
        <input class="choice-input" type="text" value="${this._esc(c)}" placeholder="ตัวเลือก ${LABELS[i]}..." oninput="${onInput}">
        ${canDel ? `<button class="btn-icon btn-danger" onclick="${onDel}" title="ลบตัวเลือกนี้"><i class="fas fa-times"></i></button>` : ''}
      </div>`;
    }).join('');

    const addFn = isMulti ? 'B.addChoiceMulti()' : 'B.addChoice()';
    return `<div class="choice-list">${items}</div>
      ${choices.length < 8 ? `<button class="btn-sm" onclick="${addFn}" style="margin-top:4px"><i class="fas fa-plus"></i> เพิ่มตัวเลือก</button>` : ''}`;
  },

  _htmlTrueFalse() {
    const rows = (this.q.rows || []).map((r, i) => {
      const yClass = r.answer === true  ? 'tf-radio-btn active-yes' : 'tf-radio-btn';
      const nClass = r.answer === false ? 'tf-radio-btn active-no'  : 'tf-radio-btn';
      const canDel = this.q.rows.length > 1;
      return `<tr>
        <td class="stmt">
          <input class="tf-stmt-input" type="text" value="${this._esc(r.statement)}"
            placeholder="ข้อความที่ ${i+1}..." oninput="B.updTFStmt(${i},this.value)">
        </td>
        <td><button class="${yClass}" onclick="B.setTFAnswer(${i},true)" title="ใช่">✓</button></td>
        <td><button class="${nClass}" onclick="B.setTFAnswer(${i},false)" title="ไม่ใช่">✗</button></td>
        <td>${canDel ? `<button class="btn-icon btn-danger" onclick="B.removeTFRow(${i})"><i class="fas fa-times"></i></button>` : ''}</td>
      </tr>`;
    }).join('');
    return `<table class="tf-table">
      <thead><tr>
        <th style="text-align:left">โจทย์ย่อย</th>
        <th style="width:70px">ใช่</th>
        <th style="width:70px">ไม่ใช่</th>
        <th style="width:44px"></th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <button class="btn-sm" onclick="B.addTFRow()" style="margin-top:8px">
      <i class="fas fa-plus"></i> เพิ่มแถว
    </button>`;
  },

  _htmlFillClosed() {
    return `<div>
      <p class="fill-label" style="margin-bottom:8px">คำตอบที่ถูกต้อง (ตรวจด้วยการเทียบตรง)</p>
      <input class="field" type="text" value="${this._esc(this.q.answer || '')}"
        placeholder="พิมพ์คำตอบที่ถูกต้อง..." oninput="B.setFillAnswer(this.value)">
    </div>`;
  },

  _htmlFillOpen() {
    const maxScore = this.q.maxScore ?? 2;
    const rows = (this.q.rubric || []).map((r, i) =>
      `<div class="rubric-row">
        <input class="rubric-score" type="number" min="0" value="${r.score}"
          oninput="B.updRubricScore(${i},this.value)" title="คะแนน">
        <span class="fill-label">คะแนน</span>
        <input class="rubric-criteria" type="text" value="${this._esc(r.criteria)}"
          placeholder="เกณฑ์การให้คะแนน เช่น ตอบถูกครบถ้วน..." oninput="B.updRubricCriteria(${i},this.value)">
        ${this.q.rubric.length > 1
          ? `<button class="btn-icon btn-danger" onclick="B.removeRubric(${i})"><i class="fas fa-times"></i></button>`
          : ''}
      </div>`
    ).join('');

    return `<div class="max-score-row">
        <span class="fill-label">คะแนนเต็มของข้อนี้</span>
        <input class="num-input" type="number" min="0" value="${maxScore}" oninput="B.setMaxScore(this.value)">
        <span class="fill-label">คะแนน</span>
      </div>
      <p class="fill-label" style="margin-bottom:8px">เกณฑ์การให้คะแนน (เรียงจากมากไปน้อย)</p>
      <div class="rubric-list">${rows}</div>
      <button class="btn-sm" onclick="B.addRubric()" style="margin-top:8px">
        <i class="fas fa-plus"></i> เพิ่มเกณฑ์
      </button>`;
  },

  // ── Export ─────────────────────────────────────────────────
  exportJSON() {
    const hasPassage = this.passages.length > 0;
    const out = {
      id:             this.exam.id || ('EX_' + Date.now()),
      title:          this.exam.title    || 'ข้อสอบ',
      subtitle:       this.exam.subtitle || '',
      totalQuestions: this.questions.length,
      duration:       this.exam.duration,
      isPassageBased: hasPassage,
    };

    if (hasPassage) {
      out.examContent = {
        passages: this.passages.map(p => ({
          title:         p.title,
          content:       p.content,
          questionRange: { start: p.fromQ - 1, end: p.toQ - 1 },
        })),
      };
    }

    out.questions = this.questions.map(q => {
      const base = { no: q.no, type: q.type, text: q.text };
      if (q.passageId) base.passageId = q.passageId;
      switch (q.type) {
        case 'choice':
          return { ...base, choices: q.choices, answer: q.answer };
        case 'multi':
          return { ...base, choices: q.choices, answers: q.answers || [] };
        case 'truefalse':
          return { ...base, rows: q.rows || [] };
        case 'fill-closed':
          return { ...base, type: 'fill', answer: q.answer, placeholder: 'กรอกคำตอบ...' };
        case 'fill-open':
          return { ...base, maxScore: q.maxScore ?? 2, rubric: q.rubric || [] };
        default:
          return base;
      }
    });

    this._exportedJSON = JSON.stringify(out, null, 2);
    document.getElementById('exportPre').textContent = this._exportedJSON;
    document.getElementById('exportModal').hidden = false;
  },

  copyJSON() {
    if (!this._exportedJSON) return;
    navigator.clipboard.writeText(this._exportedJSON).then(() => {
      alert('คัดลอก JSON แล้ว!');
    });
  },

  closeExport() {
    document.getElementById('exportModal').hidden = true;
  },

  closeModalBg(e) {
    if (e.target === document.getElementById('exportModal')) this.closeExport();
  },

  // ── Utility ────────────────────────────────────────────────
  _esc(str) {
    return String(str ?? '')
      .replace(/&/g,'&amp;')
      .replace(/"/g,'&quot;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;');
  },
};

document.addEventListener('DOMContentLoaded', () => B.init());
