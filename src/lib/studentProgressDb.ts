import fs from "fs";
import path from "path";

export interface StudentStreak {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null; // "YYYY-MM-DD"
  lastStudyTimestamp: string | null; // ISO String
}

export interface StudyLog {
  id: string;
  userId: string;
  date: string; // "YYYY-MM-DD"
  timestamp: string; // ISO String
  activity: string;
}

export interface InAppNotification {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: "STUDY_REMINDER" | "STREAK_WARNING" | "SYSTEM";
  status: "READ" | "UNREAD";
  createdAt: string; // ISO String
}

export interface StudentProgressData {
  streaks: Record<string, StudentStreak>;
  studyLogs: StudyLog[];
  notifications: InAppNotification[];
}

const PROGRESS_FILE = path.join(process.cwd(), "src", "lib", "studentProgress.json");

// Helper to format date to YYYY-MM-DD in local time zone
export function getLocalDateString(dateInput: Date = new Date()): string {
  const offset = dateInput.getTimezoneOffset();
  const localDate = new Date(dateInput.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split("T")[0];
}

const initialProgressData = (): StudentProgressData => {
  const yesterday = getLocalDateString(new Date(Date.now() - 24 * 60 * 60 * 1000));
  const threeDaysAgo = getLocalDateString(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000));
  const today = getLocalDateString(new Date());

  return {
    streaks: {
      "usr_2": {
        userId: "usr_2",
        currentStreak: 5,
        longestStreak: 12,
        lastStudyDate: yesterday,
        lastStudyTimestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      "usr_4": {
        userId: "usr_4",
        currentStreak: 0,
        longestStreak: 4,
        lastStudyDate: threeDaysAgo,
        lastStudyTimestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      "usr_5": {
        userId: "usr_5",
        currentStreak: 3,
        longestStreak: 3,
        lastStudyDate: today,
        lastStudyTimestamp: new Date().toISOString()
      }
    },
    studyLogs: [
      {
        id: "log_init_1",
        userId: "usr_2",
        date: yesterday,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        activity: "Luyện đề Speaking - Study & Hometown (Part 1)"
      },
      {
        id: "log_init_2",
        userId: "usr_5",
        date: today,
        timestamp: new Date().toISOString(),
        activity: "Luyện tập IELTS Speaking Room"
      }
    ],
    notifications: [
      {
        id: "notify_init_1",
        userId: "usr_2",
        title: "Duy trì streak học tập! 🔥",
        content: "Chúc mừng bạn đã đạt chuỗi 5 ngày học liên tiếp. Hãy tiếp tục luyện tập hôm nay để nâng band điểm IELTS nhé!",
        type: "STUDY_REMINDER",
        status: "UNREAD",
        createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
      },
      {
        id: "notify_init_2",
        userId: "usr_4",
        title: "Cảnh báo sắp mất chuỗi học tập! ⚠️",
        content: "Đã 3 ngày bạn chưa luyện tập IELTS. Hãy làm ngay một bài nói Speaking ngắn hôm nay để kích hoạt lại streak nhé!",
        type: "STREAK_WARNING",
        status: "UNREAD",
        createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString()
      }
    ]
  };
};

function ensureProgressFileExists(): void {
  const dir = path.dirname(PROGRESS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(PROGRESS_FILE)) {
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(initialProgressData(), null, 2), "utf-8");
  }
}

export async function readProgressData(): Promise<StudentProgressData> {
  ensureProgressFileExists();
  try {
    const fileData = await fs.promises.readFile(PROGRESS_FILE, "utf-8");
    return JSON.parse(fileData || JSON.stringify(initialProgressData()));
  } catch (error) {
    console.error("Lỗi khi đọc file studentProgress.json:", error);
    return initialProgressData();
  }
}

export async function writeProgressData(data: StudentProgressData): Promise<boolean> {
  ensureProgressFileExists();
  try {
    await fs.promises.writeFile(PROGRESS_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Lỗi khi ghi file studentProgress.json:", error);
    return false;
  }
}

// Streaks Operations
export async function getStudentStreak(userId: string): Promise<StudentStreak> {
  const data = await readProgressData();
  if (!data.streaks[userId]) {
    // Create new streak record for new users
    data.streaks[userId] = {
      userId,
      currentStreak: 0,
      longestStreak: 0,
      lastStudyDate: null,
      lastStudyTimestamp: null
    };
    await writeProgressData(data);
  }
  return data.streaks[userId];
}

export async function logStudyActivity(userId: string, activity: string): Promise<StudentStreak> {
  const data = await readProgressData();
  const todayStr = getLocalDateString();
  const timestamp = new Date().toISOString();

  // Create streak if not exist
  if (!data.streaks[userId]) {
    data.streaks[userId] = {
      userId,
      currentStreak: 0,
      longestStreak: 0,
      lastStudyDate: null,
      lastStudyTimestamp: null
    };
  }

  const streak = data.streaks[userId];
  const lastStudy = streak.lastStudyDate;

  if (lastStudy === todayStr) {
    // Already studied today, streak remains unchanged, but we log the activity
    console.log(`User ${userId} already studied today ${todayStr}. Streak remains at ${streak.currentStreak}.`);
  } else if (lastStudy === getLocalDateString(new Date(Date.now() - 24 * 60 * 60 * 1000))) {
    // Studied yesterday, increment streak
    streak.currentStreak += 1;
    if (streak.currentStreak > streak.longestStreak) {
      streak.longestStreak = streak.currentStreak;
    }
  } else {
    // Break in streak, reset to 1
    streak.currentStreak = 1;
    if (streak.longestStreak === 0) {
      streak.longestStreak = 1;
    }
  }

  streak.lastStudyDate = todayStr;
  streak.lastStudyTimestamp = timestamp;
  data.streaks[userId] = streak;

  // Add study log
  const newLog: StudyLog = {
    id: "log_" + Math.random().toString(36).substring(2, 9),
    userId,
    date: todayStr,
    timestamp,
    activity
  };
  data.studyLogs.push(newLog);

  // Write back to DB
  await writeProgressData(data);
  return streak;
}

// Notifications Operations
export async function getNotifications(userId: string): Promise<InAppNotification[]> {
  const data = await readProgressData();
  return data.notifications
    .filter(n => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function addNotification(
  userId: string,
  title: string,
  content: string,
  type: InAppNotification["type"]
): Promise<InAppNotification> {
  const data = await readProgressData();
  const newNotification: InAppNotification = {
    id: "notify_" + Math.random().toString(36).substring(2, 9),
    userId,
    title,
    content,
    type,
    status: "UNREAD",
    createdAt: new Date().toISOString()
  };
  
  data.notifications.push(newNotification);
  await writeProgressData(data);
  return newNotification;
}

export async function markNotificationAsRead(userId: string, notificationId: string): Promise<boolean> {
  const data = await readProgressData();
  const notification = data.notifications.find(n => n.id === notificationId && n.userId === userId);
  
  if (notification) {
    notification.status = "READ";
    await writeProgressData(data);
    return true;
  }
  return false;
}

export async function markAllNotificationsAsRead(userId: string): Promise<boolean> {
  const data = await readProgressData();
  let updated = false;
  
  data.notifications.forEach(n => {
    if (n.userId === userId && n.status === "UNREAD") {
      n.status = "READ";
      updated = true;
    }
  });

  if (updated) {
    await writeProgressData(data);
    return true;
  }
  return false;
}

export async function deleteNotification(userId: string, notificationId: string): Promise<boolean> {
  const data = await readProgressData();
  const index = data.notifications.findIndex(n => n.id === notificationId && n.userId === userId);
  
  if (index !== -1) {
    data.notifications.splice(index, 1);
    await writeProgressData(data);
    return true;
  }
  return false;
}
