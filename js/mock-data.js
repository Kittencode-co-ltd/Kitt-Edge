const mockData = {
    user: {
        id: "U001",
        name: "Kitten",
        tier: "premium",
        avatar: "assets/images/avatar.png"
    },
    subjects: [
        { id: "chapter1", nameTH: "บทที่ 1: การฟัง", proficiency: 85, color: "#8B5CF6" },
        { id: "chapter2", nameTH: "บทที่ 2: การพูด", proficiency: 72, color: "#10B981" },
        { id: "chapter3", nameTH: "บทที่ 3: การอ่าน", proficiency: 64, color: "#F97316" },
        { id: "chapter4", nameTH: "บทที่ 4: การเขียน", proficiency: 90, color: "#EC4899" }
    ],
    questions: [
        {
            id: "Q001",
            subject: "chapter1",
            subjectName: "การฟัง",
            question: "ข้อใดเป็นจุดมุ่งหมายสำคัญที่สุดของการฟังเพื่อจับใจความ",
            difficulty: "medium",
            estimatedTime: 60,
            options: ["เพื่อความสนุกสนาน", "เพื่อสรุปสาระสำคัญของเรื่อง", "เพื่อจับผิดผู้พูด", "เพื่อนำไปเล่าต่อ", "เพื่อประเมินน้ำเสียงผู้พูด"],
            answer: 1
        },
        {
            id: "Q002",
            subject: "chapter2",
            subjectName: "การพูด",
            question: "ข้อใดคือมารยาทที่ดีที่สุดในการพูดในที่สาธารณะ",
            difficulty: "easy",
            estimatedTime: 45,
            options: [
                "พูดแทรกเมื่อมีข้อสงสัยทันที",
                "ใช้ศัพท์สแลงเพื่อให้ดูทันสมัย",
                "สบตาผู้ฟังอย่างทั่วถึงและเป็นธรรมชาติ",
                "พูดเสียงดังเกินปกติเพื่อดึงความสนใจ",
                "อ่านจากโพยกระดาษตลอดเวลา"
            ],
            answer: 2
        },
        {
            id: "Q003",
            subject: "chapter3",
            subjectName: "การอ่าน",
            question: "การอ่านวิเคราะห์หมายถึงข้อใด",
            difficulty: "medium",
            estimatedTime: 60,
            options: [
                "การอ่านออกเสียงให้ถูกต้อง",
                "การอ่านเพื่อความบันเทิงเท่านั้น",
                "การแยกแยะและประเมินคุณค่าของเนื้อหา",
                "การจำรายละเอียดทุกอย่างในหนังสือ",
                "การอ่านอย่างรวดเร็วเพื่อหาคำตอบ"
            ],
            answer: 2
        },
        {
            id: "Q004",
            subject: "chapter4",
            subjectName: "การเขียน",
            question: "ส่วนประกอบใดของเรียงความที่ทำหน้าที่สรุปประเด็นทั้งหมด",
            difficulty: "easy",
            estimatedTime: 60,
            options: ["คำนำ", "เนื้อเรื่อง", "ย่อหน้าขยาย", "สรุป", "อ้างอิง"],
            answer: 3
        }
    ],
    mockExams: [
        // ── บทที่ 1: การฟัง ──
        {
            id: "EX_C1_PRE", chapterId: "chapter1", examType: "pre",
            name: "บทที่ 1: การฟัง", subject: "thai",
            totalQuestions: 10, duration: 30,
            status: "completed", tag: "ก่อนเรียน",
            linkedPostExamId: "EX_C1_POST"
        },
        {
            id: "EX_C1_POST", chapterId: "chapter1", examType: "post",
            name: "บทที่ 1: การฟัง", subject: "thai",
            totalQuestions: 10, duration: 30,
            status: "completed", tag: "หลังเรียน",
            linkedPreExamId: "EX_C1_PRE"
        },
        // ── บทที่ 2: การพูด ──
        {
            id: "EX_C2_PRE", chapterId: "chapter2", examType: "pre",
            name: "บทที่ 2: การพูด", subject: "thai",
            totalQuestions: 10, duration: 30,
            status: "completed", tag: "ก่อนเรียน",
            linkedPostExamId: "EX_C2_POST"
        },
        {
            id: "EX_C2_POST", chapterId: "chapter2", examType: "post",
            name: "บทที่ 2: การพูด", subject: "thai",
            totalQuestions: 10, duration: 30,
            status: "completed", tag: "หลังเรียน",
            linkedPreExamId: "EX_C2_PRE"
        },
        // ── บทที่ 3: การอ่าน (ปิดรับสมัครชั่วคราว) ──
        {
            id: "EX_C3_PRE", chapterId: "chapter3", examType: "pre",
            name: "บทที่ 3: การอ่าน", subject: "thai",
            totalQuestions: 8, duration: 30,
            status: "locked", tag: "ก่อนเรียน",
            linkedPostExamId: "EX_C3_POST"
        },
        {
            id: "EX_C3_POST", chapterId: "chapter3", examType: "post",
            name: "บทที่ 3: การอ่าน", subject: "thai",
            totalQuestions: 8, duration: 30,
            status: "locked", tag: "หลังเรียน",
            linkedPreExamId: "EX_C3_PRE"
        },
        // ── บทที่ 4: การเขียน (ปิดรับสมัครชั่วคราว) ──
        {
            id: "EX_C4_PRE", chapterId: "chapter4", examType: "pre",
            name: "บทที่ 4: การเขียน", subject: "thai",
            totalQuestions: 10, duration: 30,
            status: "locked", tag: "ก่อนเรียน",
            linkedPostExamId: "EX_C4_POST"
        },
        {
            id: "EX_C4_POST", chapterId: "chapter4", examType: "post",
            name: "บทที่ 4: การเขียน", subject: "thai",
            totalQuestions: 10, duration: 30,
            status: "locked", tag: "หลังเรียน",
            linkedPreExamId: "EX_C4_PRE"
        },
        // ── บทที่ 5: วรรณคดี ──
        {
            id: "EX_C5_PRE", chapterId: "chapter5", examType: "pre",
            name: "บทที่ 5: วรรณคดี", subject: "thai",
            totalQuestions: 10, duration: 30,
            status: "locked", tag: "ก่อนเรียน",
            linkedPostExamId: "EX_C5_POST"
        },
        {
            id: "EX_C5_POST", chapterId: "chapter5", examType: "post",
            name: "บทที่ 5: วรรณคดี", subject: "thai",
            totalQuestions: 10, duration: 30,
            status: "locked", tag: "หลังเรียน",
            linkedPreExamId: "EX_C5_PRE"
        },
        // ── บทที่ 6: พิษณุโลกวิปโยค — เปิดให้ทำเป็นบทเดียวในขณะนี้ ──
        {
            id: "EX_C6_PRE", chapterId: "chapter6", examType: "pre",
            name: "บทที่ 6: พิษณุโลกวิปโยค", subject: "thai",
            totalQuestions: 10, duration: 30,
            status: "available", tag: "ก่อนเรียน",
            linkedPostExamId: "EX_C6_POST"
        },
        {
            id: "EX_C6_POST", chapterId: "chapter6", examType: "post",
            name: "บทที่ 6: พิษณุโลกวิปโยค", subject: "thai",
            totalQuestions: 8, duration: 30,
            status: "locked", tag: "หลังเรียน",
            linkedPreExamId: "EX_C6_PRE"
        },
        // ── บทที่ 7: การแต่งคำประพันธ์ ──
        {
            id: "EX_C7_PRE", chapterId: "chapter7", examType: "pre",
            name: "บทที่ 7: การแต่งคำประพันธ์", subject: "thai",
            totalQuestions: 10, duration: 30,
            status: "locked", tag: "ก่อนเรียน",
            linkedPostExamId: "EX_C7_POST"
        },
        {
            id: "EX_C7_POST", chapterId: "chapter7", examType: "post",
            name: "บทที่ 7: การแต่งคำประพันธ์", subject: "thai",
            totalQuestions: 10, duration: 30,
            status: "locked", tag: "หลังเรียน",
            linkedPreExamId: "EX_C7_PRE"
        }
    ],

    activities: [
        {
            type: "quiz",
            icon: "fa-edit",
            title: "ทำแบบทดสอบเรื่อง ประวัติศาสตร์พิษณุโลก สำเร็จ",
            description: "คะแนนเฉลี่ย 85%",
            time: "2 ชม. ที่แล้ว"
        },
        {
            type: "lesson",
            icon: "fa-book-open",
            title: "เรียนบทเรียน: การฟัง",
            description: "เรียนจบไปแล้ว 80%",
            time: "5 ชม. ที่แล้ว"
        }
    ],
    chapters: [
        {
            id: "chapter1", nameTH: "บทที่ 1: การฟัง",
            color: "#8B5CF6", icon: "fa-headphones",
            preScore: 62, postScore: 85, worksheetDone: true, status: "done"
        },
        {
            id: "chapter2", nameTH: "บทที่ 2: การพูด",
            color: "#10B981", icon: "fa-microphone",
            preScore: 55, postScore: 72, worksheetDone: true, status: "done"
        },
        {
            id: "chapter3", nameTH: "บทที่ 3: การอ่าน",
            color: "#F97316", icon: "fa-book-reader",
            preScore: 48, postScore: null, worksheetDone: false, status: "in_progress"
        },
        {
            id: "chapter4", nameTH: "บทที่ 4: การเขียน",
            color: "#EC4899", icon: "fa-pen-nib",
            preScore: 70, postScore: null, worksheetDone: false, status: "in_progress"
        },
        {
            id: "chapter5", nameTH: "บทที่ 5: วรรณคดี",
            color: "#0EA5E9", icon: "fa-scroll",
            preScore: null, postScore: null, worksheetDone: false, status: "not_started"
        },
        {
            id: "chapter6", nameTH: "บทที่ 6: พิษณุโลกวิปโยค",
            color: "#F59E0B", icon: "fa-spell-check",
            preScore: null, postScore: null, worksheetDone: false, status: "not_started"
        },
        {
            id: "chapter7", nameTH: "บทที่ 7: การแต่งคำประพันธ์",
            color: "#6366F1", icon: "fa-feather",
            preScore: null, postScore: null, worksheetDone: false, status: "not_started"
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
                subject: "บทที่ 4: การเขียน",
                icon: "✍️",
                color: "#EC4899",
                score: 90,
                topics: [
                    { name: "การเขียนเรียงความ", level: "เชี่ยวชาญ", score: 95 },
                    { name: "การเขียนย่อความ", level: "ดีมาก", score: 88 },
                    { name: "การเขียนจดหมาย", level: "ดีมาก", score: 85 },
                    { name: "การเขียนรายงาน", level: "ดี", score: 80 }
                ]
            },
            {
                subject: "บทที่ 1: การฟัง",
                icon: "🎧",
                color: "#8B5CF6",
                score: 85,
                topics: [
                    { name: "การฟังเพื่อจับใจความ", level: "เชี่ยวชาญ", score: 93 },
                    { name: "การฟังเพื่อวิเคราะห์", level: "ดีมาก", score: 86 },
                    { name: "มารยาทในการฟัง", level: "ดี", score: 82 },
                    { name: "การประเมินผู้พูด", level: "ดี", score: 78 }
                ]
            }
        ],
        weaknesses: [
            {
                subject: "บทที่ 2: การพูด",
                icon: "🎤",
                color: "#10B981",
                score: 50,
                topics: [
                    { name: "การพูดในที่สาธารณะ", level: "ต้องพัฒนา", score: 45 },
                    { name: "การพูดโน้มน้าวใจ", level: "ต้องพัฒนา", score: 48 },
                    { name: "มารยาทในการพูด", level: "พอใช้", score: 60 },
                    { name: "การใช้ภาษาในการพูด", level: "พอใช้", score: 62 }
                ]
            },
            {
                subject: "บทที่ 3: การอ่าน",
                icon: "📖",
                color: "#F97316",
                score: 64,
                topics: [
                    { name: "การอ่านจับใจความ", level: "ต้องพัฒนา", score: 55 },
                    { name: "การอ่านวิเคราะห์", level: "พอใช้", score: 63 },
                    { name: "การอ่านตีความ", level: "พอใช้", score: 67 },
                    { name: "การประเมินค่า", level: "พอใช้", score: 70 }
                ]
            }
        ]
    },
    notifications: [
        {
            id: 'notif-1',
            sender: 'ติวเตอร์ครูริสา',
            senderAvatar: '<i class="fas fa-graduation-cap"></i>',
            isSystemIcon: true,
            avatarBg: '#4F46E5',
            text: '<b>ติวเตอร์ครูริสา</b> เพิ่มวิดีโอเฉลยใหม่: "เทคนิคการฟังจับใจความ"',
            time: '2 ชั่วโมงที่แล้ว',
            isRead: false,
            thumbnail: null
        },
        {
            id: 'notif-2',
            sender: 'ระบบ',
            senderAvatar: '<i class="fas fa-robot"></i>',
            isSystemIcon: true,
            avatarBg: '#10B981',
            text: 'รายงานผลการเรียนรายสัปดาห์ของคุณพร้อมแล้ว ดูความก้าวหน้าการเรียนของคุณได้เลย!',
            time: '5 ชั่วโมงที่แล้ว',
            isRead: false,
            thumbnail: null
        },
        {
            id: 'notif-3',
            sender: 'ทีมครูริสา',
            senderAvatar: '<i class="fas fa-bullhorn"></i>',
            isSystemIcon: true,
            avatarBg: '#F59E0B',
            text: 'อัปเดตระบบ: เพิ่ม<b>ข้อสอบประวัติศาสตร์พิษณุโลก</b> เข้ามาในระบบแล้ว',
            time: '1 วันที่ผ่านมา',
            isRead: true,
            thumbnail: null
        },
        {
            id: 'notif-4',
            sender: 'Community',
            senderAvatar: 'assets/images/user_avatar.png',
            isSystemIcon: false,
            text: 'มี 2 คนตอบกลับคอมเมนต์ของคุณใน <b>"เทคนิคการเขียนเรียงความ"</b>',
            time: '2 วันที่ผ่านมา',
            isRead: true,
            thumbnail: null
        }
    ]
};
