export interface Question {
  id: string;
  type: string;
  audioDescription?: string;
  transcript?: string;
  questionText?: string;
  options?: string[];
  correctAnswer?: string;
  answers?: string[];
  passage?: string;
  items?: { statement: string; correctAnswer: string }[];
  instruction?: string;
  prompt?: string;
  chartDescription?: string;
  minimumWords?: number;
  questions?: string[];
  cueCard?: string;
  bulletPoints?: string[];
}

export const DIAGNOSTIC_QUESTIONS: {
  listening: Question[];
  reading: Question[];
  writing: Question[];
  speaking: Question[];
} = {
  listening: [
    {
      id: "l1",
      type: "fill_in_blank",
      audioDescription: "University Accommodation Office — Booking an Appointment",
      transcript: `
Student: Hello, I'd like to book an appointment with the accommodation advisor, please.
Officer: Certainly. I can book that for you. Let's see what we have available. We have slots on Monday afternoon or Wednesday morning.
Student: Monday afternoon would be perfect for me.
Officer: Great. The advisor is free at 2:00 pm or 3:30 pm.
Student: Let's go with the earlier one, 2:00 pm please.
Officer: Excellent. I've booked you in for Monday at 2:00 pm.
`,
      questionText: "The appointment is booked for ______ at ______ pm.",
      answers: ["Monday", "2"],
    },
    {
      id: "l2",
      type: "multiple_choice",
      audioDescription: "Academic Announcement — New Global Scholarship Program",
      transcript: `
Speaker: Good morning, everyone. I am pleased to announce the launch of our new Global Leaders Scholarship. Unlike other programs that prioritize grade point average or require recommendation letters, this scholarship is open to any student who demonstrates exceptional community contribution. The application process is simple: you must write and submit an original essay detailing a community project you have led. All essays will be graded by an independent panel.
`,
      questionText: "What is the main requirement for the scholarship?",
      options: [
        "A. GPA above 3.5",
        "B. Community service hours",
        "C. Essay submission",
        "D. Teacher recommendation"
      ],
      correctAnswer: "C",
    },
    {
      id: "l3",
      type: "fill_in_blank",
      audioDescription: "Environmental Science Lecture — Global Temperature Trends",
      transcript: `
Lecturer: When analyzing climate trends over the past century, the data is stark. Since the year 1900, average global temperatures have risen by approximately 1.1 degrees Celsius. While this may sound like a minor fluctuation, it represents an unprecedented rate of warming in geological history, causing widespread melting of glaciers and rising sea levels.
`,
      questionText: "Global temperatures have risen by approximately ______ degrees Celsius since 1900.",
      answers: ["1.1", "1.1°C"],
    }
  ],
  reading: [
    {
      id: "r1",
      type: "true_false_not_given",
      passage: `
Urban agriculture, the practice of cultivating, processing, and distributing food in or around metropolitan areas, is rapidly gaining popularity. As cities expand, the reliance on rural farming for sustenance creates significant environmental and economic challenges, particularly in transportation. Food transported over long distances contributes heavily to carbon emissions, a phenomenon known as "food miles." By producing food locally within urban boundaries, cities can drastically reduce their carbon footprint and ensure fresher produce for residents.

However, critics point out that urban farming is not a complete solution. Most urban agricultural initiatives are small-scale, community-driven projects that rely on volunteers and private donations, rather than government subsidies or commercial sales. Rooftop gardens, a popular form of urban farming, provide crucial ecological benefits such as lowering urban temperatures by absorbing heat and reducing stormwater runoff. Nonetheless, the high cost of urban land and structural limitations of older buildings prevent these projects from scaling to meet the full nutritional demands of cities.
`,
      items: [
        {
          statement: "Cultivating food inside cities can help lower the environmental impact caused by transportation.",
          correctAnswer: "TRUE"
        },
        {
          statement: "The majority of urban agriculture programs receive substantial funding from municipal governments.",
          correctAnswer: "FALSE"
        },
        {
          statement: "Building rooftop gardens is cheaper than buying land in rural areas.",
          correctAnswer: "NOT GIVEN"
        }
      ]
    },
    {
      id: "r2",
      type: "multiple_choice",
      questionText: "What is one limitation of rooftop gardens mentioned in the text?",
      options: [
        "A. They cannot absorb urban heat effectively.",
        "B. Older buildings might have structural limitations that prevent installation.",
        "C. They generate high stormwater runoff.",
        "D. They require too much municipal planning."
      ],
      correctAnswer: "B"
    }
  ],
  writing: [
    {
      id: "w1",
      type: "task1",
      instruction: "You should spend about 20 minutes on this task. Write at least 150 words.",
      prompt: "The table below shows the proportion of households with access to select domestic appliances in a particular country in 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
      chartDescription: `
Table Data:
Proportion of Households with Access to Domestic Appliances:
- Internet: 2000 (32%) | 2020 (93%)
- Smartphone: 2000 (4%) | 2020 (88%)
- Washing machine: 2000 (74%) | 2020 (90%)
- Dishwasher: 2000 (28%) | 2020 (58%)
`,
      minimumWords: 150,
    },
    {
      id: "w2",
      type: "task2",
      instruction: "You should spend about 40 minutes on this task. Write at least 250 words.",
      prompt: "Some people believe that vertical farming (growing crops in stacked layers in urban environments) is the future of food production. Others argue that its high setup costs and energy consumption make it unsustainable. Discuss both views and give your opinion.",
      minimumWords: 250,
    }
  ],
  speaking: [
    {
      id: "sp1",
      type: "part1",
      instruction: "Answer the following questions as you would in a real IELTS Speaking test. Write your answers.",
      questions: [
        "Do you enjoy studying English? Why or why not?",
        "What do you usually do in your free time?",
        "How important is English in your daily life or work?"
      ]
    },
    {
      id: "sp2",
      type: "part2",
      instruction: "You have 1 minute to prepare, then speak for up to 2 minutes. Write your spoken response.",
      cueCard: "Describe a place you have always wanted to visit.",
      bulletPoints: [
        "Where it is",
        "Why you want to go there",
        "What you would do there",
        "How you feel about visiting this place"
      ],
      minimumWords: 80,
    }
  ]
};
