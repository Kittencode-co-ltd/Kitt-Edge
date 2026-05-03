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
        {
            id: "EX001",
            name: "บทที่ 1 ความเป็นมาของ จังหวัดพิษณุโลก",
            subject: "history",
            totalQuestions: 10,
            duration: 30,
            status: "not_started"
        },
        {
            id: "EX002",
            name: "แบบทดสอบเรื่อง หลักภาษา",
            subject: "thai",
            totalQuestions: 20,
            duration: 30,
            status: "unavailable"
        },
        {
            id: "EX003",
            name: "แบบทดสอบเรื่อง วรรณคดี",
            subject: "thai",
            totalQuestions: 30,
            duration: 40,
            status: "unavailable"
        },
        {
            id: "EX004",
            name: "ข้อสอบ A-Level ภาษาไทย",
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
            sender: 'Kitt-Edge Tutor',
            senderAvatar: '<i class="fas fa-graduation-cap"></i>',
            isSystemIcon: true,
            avatarBg: '#4F46E5',
            text: '<b>Kitt-Edge Tutor</b> เพิ่มวิดีโอเฉลยใหม่: "เทคนิคการฟังจับใจความ"',
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
            sender: 'Kitt-Edge Team',
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
