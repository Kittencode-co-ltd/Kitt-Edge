const mockData = {
    user: {
        id: "U001",
        name: "Kitten",
        tier: "premium",
        avatar: "assets/images/avatar.png"
    },
    subjects: [
        { id: "math", nameTH: "คณิตศาสตร์", proficiency: 85, color: "#4F46E5" },
        { id: "science", nameTH: "วิทยาศาสตร์", proficiency: 72, color: "#10B981" },
        { id: "english", nameTH: "ภาษาอังกฤษ", proficiency: 64, color: "#F59E0B" },
        { id: "thai", nameTH: "ภาษาไทย", proficiency: 90, color: "#EC4899" },
        { id: "social", nameTH: "สังคมศึกษา", proficiency: 83, color: "#fad763ff" }
    ],
    questions: [
        {
            id: "Q001",
            subject: "math",
            subjectName: "คณิตศาสตร์ประยุกต์ 1",
            question: "สำหรับเซต S ใดๆ ให้ P(S) แทนเพาเวอร์เซตของ S ให้เซต A = {∅, √2} แล้วเซต P(P(A)) ∪ P(A) มีสมาชิกกี่ตัว",
            difficulty: "medium",
            estimatedTime: 180,
            options: ["10", "16", "18", "19", "20"],
            answer: 2 // index of 18
        },
        {
            id: "Q002",
            subject: "math",
            subjectName: "คณิตศาสตร์ประยุกต์ 1",
            question: "ให้ p, q และ r เป็นประพจน์ แล้วประพจน์ใดต่อไปนี้มีค่าความจริงเป็นจริงในบางกรณี และเป็นเท็จในบางกรณี",
            difficulty: "hard",
            estimatedTime: 240,
            options: [
                "(p ∨ ~p) → (r ∧ ~r)",
                "(~p ∧ q) ∧ (p ∧ r)",
                "(q → r) ↔ (q ∧ ~r)",
                "(p ∨ r) ∧ (q ∨ ~r)",
                "(p ∧ q) ∧ (~p ∨ ~q)"
            ],
            answer: 3
        },
        {
            id: "Q004",
            subject: "math",
            subjectName: "คณิตศาสตร์ประยุกต์ 1",
            question: "สำนักข่าวออนไลน์แห่งหนึ่งมีบริการสำหรับสมาชิกรายเดือน โดยปัจจุบันค่าบริการรายเดือนอยู่ที่ 70 บาทต่อคน และมีสมาชิกอยู่ 18,000 คน หากปรับราคาขึ้นทุกๆ 1 บาทต่อคน จะทำให้สมาชิกลดลง 200 คน ให้ f แทนฟังก์ชันรายได้ต่อเดือนเมื่อเก็บค่าบริการ x บาทต่อคน กราฟของฟังก์ชัน f มีลักษณะอย่างไร",
            difficulty: "hard",
            estimatedTime: 300,
            options: [
                "เป็นรูปพาราโบลาหงายที่มีจุดยอดที่ x = 0",
                "เป็นรูปพาราโบลาหงายที่มีจุดยอดที่ x = 70",
                "เป็นรูปพาราโบลาคว่ำที่มีจุดยอดที่ x = 75",
                "เป็นรูปพาราโบลาคว่ำที่มีจุดยอดที่ x = 80",
                "เป็นกราฟเส้นตรงที่มีค่าความชันเป็นบวก"
            ],
            answer: 3
        },
        {
            id: "Q007",
            subject: "math",
            subjectName: "คณิตศาสตร์ประยุกต์ 1",
            question: "ค่าของ cot(π/12) - tan(π/12) ตรงกับข้อใด",
            difficulty: "medium",
            estimatedTime: 180,
            options: ["√3", "2√3", "4√3", "9/2", "15/2"],
            answer: 1 // 2√3
        },
        {
            id: "Q008",
            subject: "math",
            subjectName: "คณิตศาสตร์ประยุกต์ 1",
            question: "กำหนดให้เมทริกซ์แต่งเติมของระบบสมการเชิงเส้นระบบหนึ่งคือ [[1,-2,2,5],[-2,3,-1,-4],[1,-2,1,4]] เมื่อใช้การดำเนินการตามแถวแปลงแล้วได้ [[1,-2,2,a],[0,-1,3,b],[0,0,-1,c]] จงหาค่า a+b+c",
            difficulty: "hard",
            estimatedTime: 240,
            options: ["-10", "-5", "0", "5", "10"],
            answer: 4 // 10
        },
        {
            id: "Q010",
            subject: "math",
            subjectName: "คณิตศาสตร์ประยุกต์ 1",
            question: "ให้ a_n เป็นลำดับที่สอดคล้องกับ a_n+1 = a_n + n/2 สำหรับทุกจำนวนนับ n ถ้า a_30 = 219 แล้ว a_1 มีค่าเท่ากับเท่าใด",
            difficulty: "hard",
            estimatedTime: 240,
            options: ["-29", "-27/2", "3/2", "16", "30"],
            answer: 2 // 3/2
        }
    ],
    mockExams: [
        {
            id: "EX001",
            name: "A-Level คณิตศาสตร์ประยุกต์ 1 (มี.ค. 68)",
            subject: "math",
            totalQuestions: 30,
            duration: 90,
            status: "not_started"
        },
        {
            id: "EX002",
            name: "TGAT ความถนัดทั่วไป (ตัวอย่าง)",
            subject: "general",
            totalQuestions: 60,
            duration: 60,
            status: "unavailable"
        },
        {
            id: "EX003",
            name: "A-Level ฟิสิกส์ (มี.ค. 68) (ตัวอย่าง)",
            subject: "science",
            totalQuestions: 30,
            duration: 90,
            status: "unavailable"
        },
        {
            id: "EX004",
            name: "A-Level เคมี (มี.ค. 68) (ตัวอย่าง)",
            subject: "science",
            totalQuestions: 40,
            duration: 90,
            status: "unavailable"
        },
        {
            id: "EX005",
            name: "A-Level ภาษาอังกฤษ (มี.ค. 68) (ตัวอย่าง)",
            subject: "english",
            totalQuestions: 80,
            duration: 90,
            status: "unavailable"
        },
        {
            id: "EX006",
            name: "TPAT1 ความถนัดแพทย์ (ตัวอย่าง)",
            subject: "science",
            totalQuestions: 45,
            duration: 75,
            status: "unavailable"
        },
        {
            id: "EX007",
            name: "A-Level ภาษาไทย (มี.ค. 67) (ตัวอย่าง)",
            subject: "thai",
            totalQuestions: 50,
            duration: 90,
            status: "unavailable"
        }
    ],
    activities: [
        {
            type: "quiz",
            icon: "fa-edit",
            title: "ทำโจทย์ชุดที่ 12 สำเร็จ",
            description: "คะแนนเฉลี่ย 85%",
            time: "2 ชม. ที่แล้ว"
        },
        {
            type: "lesson",
            icon: "fa-book-open",
            title: "เรียนบทเรียน: เซต",
            description: "เรียนจบไปแล้ว 80%",
            time: "5 ชม. ที่แล้ว"
        }
    ],
    progress: {
        weeks: [1, 2, 3, 4, 5, 6],
        scores: [60, 65, 72, 78, 82, null],
        predictedScores: [null, null, null, null, 82, 85],
        summary: {
            overallScore: 85,
            studyHours: 48,
            completedExams: 12
        },
        strengths: [
            {
                subject: "ภาษาไทย",
                icon: "📚",
                color: "#EC4899",
                score: 90,
                topics: [
                    { name: "การอ่านจับใจความ", level: "เชี่ยวชาญ", score: 95 },
                    { name: "การเขียนเรียงความ", level: "ดีมาก", score: 88 },
                    { name: "คำราชาศัพท์", level: "ดีมาก", score: 85 },
                    { name: "การวิเคราะห์วรรณคดี", level: "ดี", score: 80 }
                ]
            },
            {
                subject: "คณิตศาสตร์",
                icon: "📐",
                color: "#4F46E5",
                score: 85,
                topics: [
                    { name: "เซตและตรรกศาสตร์", level: "เชี่ยวชาญ", score: 93 },
                    { name: "ฟังก์ชัน", level: "ดีมาก", score: 86 },
                    { name: "เมทริกซ์", level: "ดี", score: 82 },
                    { name: "ความน่าจะเป็น", level: "ดี", score: 78 }
                ]
            }
        ],
        weaknesses: [
            {
                subject: "ภาษาอังกฤษ",
                icon: "📖",
                color: "#F59E0B",
                score: 64,
                topics: [
                    { name: "Grammar & Error", level: "ต้องพัฒนา", score: 52 },
                    { name: "Vocabulary in Context", level: "ต้องพัฒนา", score: 58 },
                    { name: "Reading Comprehension", level: "พอใช้", score: 68 },
                    { name: "Sentence Ordering", level: "พอใช้", score: 72 }
                ]
            },
            {
                subject: "วิทยาศาสตร์",
                icon: "🔬",
                color: "#10B981",
                score: 72,
                topics: [
                    { name: "สมดุลเคมี", level: "ต้องพัฒนา", score: 55 },
                    { name: "อัตราการเกิดปฏิกิริยา", level: "พอใช้", score: 63 },
                    { name: "ไฟฟ้าเคมี", level: "พอใช้", score: 67 },
                    { name: "ฟิสิกส์อะตอม", level: "พอใช้", score: 70 }
                ]
            }
        ]
    },
    notifications: [
        {
            id: 'notif-1',
            sender: 'Kitt-Edge Tutor',
            senderAvatar: '<i class="fas fa-graduation-cap"></i>',
            isSystemIcon: true,
            avatarBg: '#4F46E5',
            text: '<b>Kitt-Edge Tutor</b> เพิ่มวิดีโอเฉลยใหม่: "เฉลย A-Level คณิต 1 ข้อ 26-30"',
            time: '2 ชั่วโมงที่แล้ว',
            isRead: false,
            thumbnail: 'assets/images/math_thumb.png'
        },
        {
            id: 'notif-2',
            sender: 'ระบบ',
            senderAvatar: '<i class="fas fa-robot"></i>',
            isSystemIcon: true,
            avatarBg: '#10B981',
            text: 'รายงานผลการเรียนรายสัปดาห์ของคุณพร้อมแล้ว ดูความก้าวหน้าของคุณได้เลย!',
            time: '5 ชั่วโมงที่แล้ว',
            isRead: false,
            thumbnail: null
        },
        {
            id: 'notif-3',
            sender: 'Kitt-Edge Team',
            senderAvatar: '<i class="fas fa-bullhorn"></i>',
            isSystemIcon: true,
            avatarBg: '#F59E0B',
            text: 'อัปเดตระบบ: เพิ่ม<b>คลังข้อสอบ TGAT รุ่นใหม่</b> เข้ามาในระบบแล้ว',
            time: '1 วันที่ผ่านมา',
            isRead: true,
            thumbnail: null
        },
        {
            id: 'notif-4',
            sender: 'Community',
            senderAvatar: 'assets/images/user_avatar.png',
            isSystemIcon: false,
            text: 'มี 2 คนตอบกลับคอมเมนต์ของคุณใน <b>"เทคนิคการเดาศัพท์จากรากศัพท์"</b>',
            time: '2 วันที่ผ่านมา',
            isRead: true,
            thumbnail: null
        }
    ]
};
