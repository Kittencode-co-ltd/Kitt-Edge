// ============================================
// A-Level คณิตศาสตร์ประยุกต์ 1 (มี.ค. 68)
// ============================================
const aLevelMath1Data = {
    id: 'EX001',
    title: 'A-Level คณิตศาสตร์ประยุกต์ 1',
    subtitle: 'มีนาคม 2568',
    totalQuestions: 30,
    duration: 90, // minutes
    questions: [
        // ======== Q1-Q25: เลือกตอบ (5 ตัวเลือก) ========
        {
            no: 1,
            type: 'choice',
            text: 'สำหรับเซต S ใดๆ ให้ P(S) แทนเพาเวอร์เซตของ S ให้เซต A = {∅, √2} แล้วเซต P(P(A)) ∪ P(A) มีสมาชิกกี่ตัว',
            choices: ['10', '16', '18', '19', '20'],
            answer: 3 // index (0-based) → '18'
        },
        {
            no: 2,
            type: 'choice',
            text: 'ให้ p, q และ r เป็นประพจน์ แล้วประพจน์ใดต่อไปนี้มีค่าความจริงเป็นจริงในบางกรณี และเป็นเท็จในบางกรณี',
            choices: [
                '(p ∨ ¬p) → (r ∧ ¬r)',
                '(¬p ∧ q) ∧ (p ∧ r)',
                '(q → r) ↔ (q ∧ ¬r)',
                '(p ∨ r) ∧ (q ∨ ¬r)',
                '(p ∧ q) ∧ (¬p ∨ ¬q)'
            ],
            answer: 3 // '(p ∨ r) ∧ (q ∨ ¬r)'
        },
        {
            no: 3,
            type: 'choice',
            text: 'กำหนดให้ p(x) และ q(x) เป็นพหุนามดีกรี 3 ที่ทำให้ p(−1) = 1 และ q(−1) = −1 แล้วพหุนามในข้อใดต่อไปนี้หารด้วย x+1 ลงตัว',
            choices: [
                'x·p(x) + q(x)',
                'p(x) + x·q(x)',
                'p(x)·q(x) + x',
                'p(x)·q(x) + x²',
                'p(x) + q(x) + x'
            ],
            answer: 3 // 'p(x)·q(x) + x²'
        },
        {
            no: 4,
            type: 'choice',
            text: 'สำนักข่าวออนไลน์ปัจจุบันเก็บค่าบริการ 70 บาท/คน มีสมาชิก 18,000 คน หากขึ้นค่าบริการทุก 1 บาท จะเสียสมาชิก 200 คน ให้ f(x) แทนรายได้เมื่อเก็บค่าบริการ x บาท/คน กราฟของ f มีลักษณะอย่างไร',
            choices: [
                'พาราโบลาหงาย จุดยอดที่ x = 0',
                'พาราโบลาหงาย จุดยอดที่ x = 70',
                'พาราโบลาคว่ำ จุดยอดที่ x = 75',
                'พาราโบลาคว่ำ จุดยอดที่ x = 80',
                'กราฟเส้นตรง ความชันเป็นบวก'
            ],
            answer: 3 // 'พาราโบลาคว่ำ จุดยอดที่ x = 80'
        },
        {
            no: 5,
            type: 'choice',
            text: 'กำหนดให้ x > 0 และ e^(x^e) = e^e ค่าของ ln(ln x) คืออะไร',
            choices: ['0', '1', '−1', 'e', '−e'],
            answer: 2 // '−1'
        },
        {
            no: 6,
            type: 'choice',
            text: 'ให้ f(x) = √(2−x) และ g(x) = log₃(5−x) โดเมนของ f ∘ g คืออะไร',
            choices: ['(−∞, 5)', '(−∞, 2]', '(−3, 2]', '[−4, 5)', '[−4, ∞)'],
            answer: 3 // '[−4, 5)'
        },
        {
            no: 7,
            type: 'choice',
            text: 'ค่าของ cot(π/12) − tan(π/12) คืออะไร',
            choices: ['√3', '2√3', '4√3', '9/2', '15/2'],
            answer: 1 // '2√3'
        },
        {
            no: 8,
            type: 'choice',
            text: 'กำหนดให้เมทริกซ์แต่งเติมของระบบสมการคือ [[1,−2,2,5],[−2,3,−1,−4],[1,−2,1,4]] เมื่อแปลงแถวแล้วได้ [[1,−2,2,a],[0,−1,3,b],[0,0,−1,c]] จงหาค่า a+b+c',
            choices: ['−10', '−5', '0', '5', '10'],
            answer: 4 // '10'
        },
        {
            no: 9,
            type: 'choice',
            text: 'พิจารณาข้อความเกี่ยวกับ det ของเมทริกซ์ A, B, C ที่กำหนดให้ ข้อความใดถูกต้อง\nก. det B = 2·det A\nข. det C = det A\nค. det(B+C) = 0',
            choices: ['ก. เพียงข้อเดียว', 'ค. เพียงข้อเดียว', 'ก. และ ข.', 'ก. และ ค.', 'ข. และ ค.'],
            answer: 1 // 'ค. เพียงข้อเดียว'
        },
        {
            no: 10,
            type: 'choice',
            text: 'ให้ a_n เป็นลำดับที่สอดคล้องกับ a_(n+1) = a_n + n/2 สำหรับทุกจำนวนนับ n ถ้า a_30 = 219 แล้ว a_1 มีค่าเท่ากับเท่าใด',
            choices: ['−29', '−27/2', '3/2', '16', '30'],
            answer: 2 // '3/2'
        },
        {
            no: 11,
            type: 'choice',
            text: 'ให้ a คือจำนวนเต็มที่น้อยที่สุดในเซตคำตอบของ x² − 4x + 1 < 0 และ b คือจำนวนเต็มที่มากที่สุดในเซตนั้น คำตอบของอสมการ |x − a| ≥ b คืออะไร',
            choices: ['x ≤ −3 หรือ x ≥ 5', 'x ≤ −1 หรือ x ≥ 5', '−3 ≤ x ≤ 5', '1 ≤ x ≤ 5', 'x ≤ −3 หรือ x ≥ 1'],
            answer: 0 // 'x ≤ −3 หรือ x ≥ 5'
        },
        {
            no: 12,
            type: 'choice',
            text: 'ฝากเงินปีละ 1,000 บาท (ฝากปีที่ 1 และปีที่ 2) อัตราดอกเบี้ย 1% ทบต้นต่อปี ต้องการเงินรวมมากกว่า 4,020 บาท ต้องฝากทั้งหมดกี่ปี (ใช้ log 1.01 ≈ 0.00432)',
            choices: ['68 ปี', '69 ปี', '70 ปี', '71 ปี', '72 ปี'],
            answer: 3 // '71 ปี'
        },
        {
            no: 13,
            type: 'choice',
            text: 'สามเหลี่ยม ABC มีพิกัด A(7, 6), B(1, 2), C(1, −2) ส่วนสูงจากจุด B ไปยังด้าน AC มีความยาวเท่าใด',
            choices: ['1.6 หน่วย', '2 หน่วย', '2.4 หน่วย', '3 หน่วย', '3.2 หน่วย'],
            answer: 2 // '2.4 หน่วย'
        },
        {
            no: 14,
            type: 'choice',
            text: 'วงรีมีจุดโฟกัสที่ (0,0) และ (10,0) และผ่านจุด (15,0) ให้ a และ b คือความยาวครึ่งแกนโต−เล็ก หาค่า a − b',
            choices: ['5', '15', '5√5', '5(√5−1)', '5(√5+1)'],
            answer: 1 // '15'
        },
        {
            no: 15,
            type: 'choice',
            text: 'เวกเตอร์หนึ่งหน่วย u⃗ และ v⃗ ทำมุม θ ต่อกัน ถ้า (u⃗ − 2v⃗) ตั้งฉากกับ (4u⃗ + v⃗) จงหาค่า sec θ',
            choices: ['7/2', '3/2', '2', '5/2', '4'],
            answer: 0 // '7/2'
        },
        {
            no: 16,
            type: 'choice',
            text: 'ในระบบพิกัด 3 มิติ กำหนด O เป็นจุดกำเนิด OA⃗ = (1,2,3) และ AB⃗ มีเงื่อนไข |AB⃗| = 3|OA⃗| จงหาพื้นที่สามเหลี่ยม OAB',
            choices: ['√14', '2√14', '3√14', '4√14', '7√2'],
            answer: 1 // '2√14'
        },
        {
            no: 17,
            type: 'choice',
            text: 'รหัส 6 หลัก สร้างจากเลข {0,1,2,...,9} โดยตัวเลขทุกหลักแตกต่างกัน มีเลข 0 อยู่ในรหัส แต่ไม่มีเลข 1, 4, 7 มีรหัสกี่ชุด',
            choices: ['6·6!', '5·6!', '4·6!', '6·5!', '5·5!'],
            answer: 0 // '6·6!'

        },
        {
            no: 18,
            type: 'choice',
            text: 'ยิงลูกบอลใส่เป้า 5 ครั้ง โอกาสยิงโดน 1/5 ในแต่ละครั้ง (อิสระต่อกัน) ความน่าจะเป็นที่โดนเป้าพอดี 3 ครั้ง คืออะไร',
            choices: [
                '3·(1/5)³·(4/5)²',
                'C(5,3)·(1/5)²·(4/5)³',
                '10·(4/5)³·(1/5)²',
                'C(5,2)·(1/5)³·(4/5)³',
                '10·(1/5)³·(4/5)²'
            ],
            answer: 4 // '10·(1/5)³·(4/5)²'
        },
        {
            no: 19,
            type: 'choice',
            text: 'ค่าเฉลี่ยของข้อมูล 10 ตัว คือ 78 เมื่อตัด x₁ และ x₂ ออก ค่าเฉลี่ยของข้อมูลที่เหลือ 8 ตัวยังคงเป็น 78 ถ้า x₁ + x₂ = 156 + k จงหาค่า |x₁ − x₂| ที่เป็นไปได้',
            choices: ['|k|', '|2k|', '|k/2|', '0', '|k| + 10'],
            answer: 1 // '10' → assuming k=5 → |2k|=10
        },
        {
            no: 20,
            type: 'choice',
            text: 'ถ่วงเหรียญที่ 5 บาชนิด โดยมีรหัส 3 หลัก สุ่มเลือก 1 รหัส ความน่าจะเป็นที่รหัสนั้น "ดี" และมีค่า > 3 คืออะไร',
            choices: ['0.512', '0.640', '0.729', '0.810', '0.819'],
            answer: 4 // '0.819'
        },
        {
            no: 21,
            type: 'choice',
            text: 'พิมพ์รายงาน 20 หน้า โอกาสพิมพ์ผิด 0.2 ต่อหน้า (อิสระต่อกัน) ความน่าจะเป็นที่ไม่มีหน้าไหนผิดเลย คือข้อใด',
            choices: ['0.8²⁰', '0.2²⁰', '1−0.8²⁰', 'C(20,0)·0.8²⁰·0.2⁰', 'ทั้ง ก. และ ง.'],
            answer: 4 // 'ทั้ง ก. และ ง.'
        },
        {
            no: 22,
            type: 'choice',
            text: 'ปริมาตรน้ำดื่มกระป๋องมีการแจกแจงปกติ μ = 498.2 mL, σ² = 1.44 mL² ความน่าจะเป็นที่เลือกกระป๋องหนึ่งแล้วมีปริมาตร > 500 mL คืออะไร (P(Z < 1.5) = 0.9332)',
            choices: ['0.9332', '0.8413', '0.1587', '0.0228', '0.0668'],
            answer: 4 // '0.0668'
        },
        {
            no: 23,
            type: 'choice',
            text: 'กำหนด F\'(2x) = f(x+2) สำหรับทุก x ถ้า F(6) = 10 และ F(4) = 5 หาค่าของ ∫₂³ f(x) dx',
            choices: ['5/2', '5', '10', '15', '20'],
            answer: 1 // '5'
        },
        {
            no: 24,
            type: 'choice',
            text: 'พิจารณาข้อความต่อไปนี้จากกราฟของฟังก์ชัน f และ g\nก. lim(x→1) [f(x)·g(x)] = 0\nข. f ต่อเนื่องที่ x = 1\nค. g ต่อเนื่องที่ x = 1\nข้อใดถูกต้อง',
            choices: ['ก. เพียงข้อเดียว', 'ข. เพียงข้อเดียว', 'ค. เพียงข้อเดียว', 'ก. และ ข.', 'ก. และ ค.'],
            answer: 0 // 'ก. เพียงข้อเดียว'
        },
        {
            no: 25,
            type: 'choice',
            text: 'จากกราฟของฟังก์ชัน f และเส้นสัมผัสที่ x = 1 จงหาค่า f\'(1)',
            choices: ['−2', '−1', '−1/2', '0', '1/2'],
            answer: 2 // '−1/2'
        },

        // ======== Q26-Q30: เติมตัวเลข ========
        {
            no: 26,
            type: 'fill',
            text: 'กำหนดให้ sin A / 4 = sin B / 5 = sin C / 6 จงหาค่า cos A (ตอบเป็นทศนิยมหรือเศษส่วน)',
            placeholder: 'เช่น 0.75',
            answer: '3/4'
        },
        {
            no: 27,
            type: 'fill',
            text: 'กำหนด z₁ = 3 − 2i และ z₂ = 1 + 5i จงหาค่าของ |z₁² + 2z₁z₂ + z₂²|',
            placeholder: 'เช่น 25',
            answer: '25'
        },
        {
            no: 28,
            type: 'fill',
            text: 'ให้ {a_n} เป็นลำดับเรขาคณิต ผลบวก 3^(a₁) + 3^(a₂) + ⋯ = s/t (s, t เป็นจำนวนเต็มบวกที่เป็นจำนวนเฉพาะ) จงหาค่า s + t',
            placeholder: 'เช่น 29',
            answer: '29'
        },
        {
            no: 29,
            type: 'fill',
            text: 'จากเงื่อนไขที่กำหนดให้ จงหาจำนวนสมาชิกของเซต A − (B ∪ C)',
            placeholder: 'เช่น 2',
            answer: '2'
        },
        {
            no: 30,
            type: 'fill',
            text: 'กำหนดให้มี 4 วิชาที่ต้องอ่านใน 3 วัน โดยวันแรกต้องอ่านอย่างน้อย 2 วิชา และแต่ละวิชาอ่านได้แค่วันเดียว จงหาจำนวนวิธีจัดตารางอ่านหนังสือทั้งหมด',
            placeholder: 'เช่น 192',
            answer: '192'
        }
    ]
};

// ============================================
// ADDED: A-Level Listening & Speaking (Listening Passage Mode)
// ============================================

const examContent = {
    section: "Listening & Speaking",
    passages: [
        {
            title: "Conversation 1",
            questionRange: { start: 0, end: 3 }, // ADDED: answerSheet indices 0–3 (Q1–4)
            content: `Bow: You know I'm a real fan of K-pop. I just love Lalita.

Nan: Lalita? You mean the singer from that famous Thai girl group?

Bow: Yeah. Did you hear (1) ______ about Lalita? She (2) ______ that crazy Korean guy.

Nan: (3) ______ I thought she was living in the US.

Bow: No, she moved back to Korea last year.

Nan: Oh really? I don't follow K-pop much.

Bow: What? It's everywhere!

Nan: No, sorry. (4) ______`
        },
        {
            title: "Conversation 2",
            questionRange: { start: 4, end: 7 }, // ADDED: answerSheet indices 4–7 (Q5–8)
            content: `Prof. Lee: So, with that, I conclude that AI cannot truly create original music.

Student: But professor, AI can compose songs now.

Prof. Lee: It can only "cut-and-paste" from music already written. (5) ______

Student: Well, (6) ______ even human composers take ideas from others.

Prof. Lee: That's true, but humans have emotions.

Student: May I ask, (7) ______?

Prof. Lee: I prefer classical music.

Student: (8) ______`
        },
        {
            title: "Conversation 3",
            questionRange: { start: 8, end: 11 }, // ADDED: answerSheet indices 8–11 (Q9–12)
            content: `Teacher: OK, for homework, you will create a short video presentation.

Student: (9) ______

Teacher: Yes, you can use slides.

Student: (10) ______

Teacher: Yes, but make sure it is appropriate.

Student: (11) ______

Teacher: That's fine, but the information must be correct.

Student: (12) ______

Teacher: I'm glad you feel that way.`
        },
        {
            title: "Long Conversation",
            questionRange: { start: 12, end: 19 }, // ADDED: answerSheet indices 12–19 (Q13–20)
            content: `Pum: Hi again, Miko. Are you OK?

Miko: No, (13) ______ and I need someone to talk to.

Pum: Oh no, what happened?

Miko: We had a fight. (14) ______ I've been depressed all night.

Pum: That sounds serious.

Miko: (15) ______ she lives in Tokyo.

Pum: That must be difficult.

Miko: Since you are Japanese, (16) ______

Pum: I'll try my best to help.

Miko: He sent her a ring to show he's (17) ______

Pum: Wow.

Miko: (18) ______ did he ever give you a ring?

Pum: No, never.

Miko: He (19) ______ me that he had no girlfriend.

Pum: That's terrible.

Miko: (20) ______ I can't believe it!`
        }
    ]
};

const answerSheet = [
    { no: 1,  choices: ['the news', 'the sound', 'the sports', 'the weather'],                                                                                                  answer: 0 },
    { no: 2,  choices: ['applied for', 'jumped into', 'moved away', 'got married to'],                                                                                          answer: 3 },
    { no: 3,  choices: ['Forget it!', 'Be careful!', "You're kidding!", 'Congratulations!'],                                                                                    answer: 2 },
    { no: 4,  choices: ['I sure do.', "I didn't mean to do that.", 'Pop culture is not my thing.', 'Music is a good way to relax.'],                                            answer: 2 },

    { no: 5,  choices: ['Do you get my point?', "What's the point of asking?", 'Can you point out the answer?', 'Would you please get to the point?'],                          answer: 0 },
    { no: 6,  choices: ['In other words,', 'On the other hand,', 'One and the same,', 'To say it another way,'],                                                                answer: 1 },
    { no: 7,  choices: ['which music do people prefer?', 'which style of music do you prefer?', 'what music is a favorite of everyone?', 'what style of music is preferred by all?'], answer: 1 },
    { no: 8,  choices: ['True. Parents work very hard.', 'I know. It takes years.', 'Yeah, when I was younger, the older folks hated my music, too.', 'Absolutely. Listening to music at home brings families together.'], answer: 2 },

    { no: 9,  choices: ['Is it ok if we take a break now?', 'Can I use slides for this assignment?', 'Will you give answers next week?', 'Should we answer in complete sentences?'], answer: 1 },
    { no: 10, choices: ['How long should we make our VDO?', 'Can I use something funny from TikTok?', 'Does everybody have to speak?', 'Will we get a lower score?'],             answer: 1 },
    { no: 11, choices: ["I don't even mind if it's a cartoon, but the information must be true.", 'I want you to have fun, not learn.', 'Spend time even if info is false.', 'Many websites are fake.'], answer: 0 },
    { no: 12, choices: ['I agree. Learning is funny.', 'You need to improve.', "I'm happy to hear that.", 'Thanks. Others may complain.'],                                       answer: 2 },

    { no: 13, choices: ['I just broke up with my boyfriend.', 'we just had a sunrise.', 'I bought clothes.', 'I came back from holiday.'],                                      answer: 0 },
    { no: 14, choices: ['Nevertheless,', 'As you can imagine,', 'More often than not,', 'All things considered,'],                                                              answer: 1 },
    { no: 15, choices: ['In other words,', 'Needless to say,', 'On the other hand,', 'As a matter of fact,'],                                                                   answer: 3 },
    { no: 16, choices: ['you speak English well.', 'I thought you could give me advice.', 'tell me best part.', 'we could meet.'],                                               answer: 1 },
    { no: 17, choices: ['worried about grades.', 'bored of anime.', 'honest about the relationship.', 'jealous of car.'],                                                        answer: 2 },
    { no: 18, choices: ['Tell me', 'Say to me', 'Talk to me', 'Speak to me'],                                                                                                   answer: 0 },
    { no: 19, choices: ['advised', 'promised', 'accused', 'respected'],                                                                                                         answer: 1 },
    { no: 20, choices: ["We're so lucky!", "He's a dream come true.", 'He gave us the same rings.', 'We should celebrate.'],                                                    answer: 2 }
];

// Build standard ExamRoom data from answerSheet (used by existing startExam / submitExam logic)
const aLevelEnglishData = {
    id: 'EX002',
    title: 'A-Level ภาษาอังกฤษ (Listening & Speaking)',
    subtitle: 'มีนาคม 2568',
    totalQuestions: 20,
    duration: 30,
    // Flag this exam as passage-based so ExamRoom can switch mode
    isPassageBased: true,
    examContent: examContent,
    answerSheet: answerSheet,
    // questions array keeps the existing submit/score pipeline working
    questions: answerSheet.map(item => ({
        no: item.no,
        type: 'choice',
        text: `ข้อ ${item.no} — เลือกคำตอบที่ถูกต้อง`,
        choices: item.choices,
        answer: item.answer
    }))
};
