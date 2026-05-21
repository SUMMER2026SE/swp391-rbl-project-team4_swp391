import * as bcrypt from "bcryptjs";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "STUDENT" | "GUEST";
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

// Biến lưu trữ dữ liệu giả lập trong bộ nhớ
let mockUsers: MockUser[] = [];

// Khởi tạo dữ liệu mẫu nếu danh sách trống
const initializeMockUsers = () => {
  if (mockUsers.length > 0) return;
  
  mockUsers = [
    {
      id: "usr_1",
      name: "Admin QualiCode",
      email: "admin@qualicode.com",
      role: "ADMIN",
      isLocked: false,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 ngày trước
      updatedAt: new Date().toISOString(),
    },
    {
      id: "usr_2",
      name: "Nguyễn Văn An",
      email: "nguyenvana@gmail.com",
      role: "STUDENT",
      isLocked: false,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 ngày trước
      updatedAt: new Date().toISOString(),
    },
    {
      id: "usr_3",
      name: "Trần Thị Bình",
      email: "tranthib@gmail.com",
      role: "STUDENT",
      isLocked: true, // Đang bị khóa
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "usr_4",
      name: "Lê Văn Cường",
      email: "levanc@gmail.com",
      role: "STUDENT",
      isLocked: false,
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "usr_5",
      name: "Phạm Thị Dung",
      email: "phamthid@gmail.com",
      role: "STUDENT",
      isLocked: false,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "usr_6",
      name: "Hoàng Thế Em",
      email: "hoangthee@gmail.com",
      role: "GUEST",
      isLocked: false,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "usr_7",
      name: "Vũ Văn Phong",
      email: "vuvanf@gmail.com",
      role: "GUEST",
      isLocked: false,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "usr_8",
      name: "Nguyễn Thị Gia",
      email: "nguyenthig@gmail.com",
      role: "GUEST",
      isLocked: true, // Đang bị khóa
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
};

// Singleton Mock DB
export const mockDb = {
  getUsers: () => {
    initializeMockUsers();
    return mockUsers;
  },
  
  findUserById: (id: string) => {
    initializeMockUsers();
    return mockUsers.find((u) => u.id === id) || null;
  },

  findUserByEmail: (email: string) => {
    initializeMockUsers();
    return mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  createUser: (name: string, email: string, role: "ADMIN" | "STUDENT" | "GUEST") => {
    initializeMockUsers();
    const newUser: MockUser = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      name,
      email,
      role,
      isLocked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockUsers.unshift(newUser); // Thêm lên đầu danh sách để dễ thấy
    return newUser;
  },

  updateUser: (id: string, data: { name: string; email: string; role: "ADMIN" | "STUDENT" | "GUEST"; isLocked?: boolean }) => {
    initializeMockUsers();
    const index = mockUsers.findIndex((u) => u.id === id);
    if (index === -1) return null;

    mockUsers[index] = {
      ...mockUsers[index],
      name: data.name,
      email: data.email,
      role: data.role,
      isLocked: typeof data.isLocked === "boolean" ? data.isLocked : mockUsers[index].isLocked,
      updatedAt: new Date().toISOString(),
    };
    return mockUsers[index];
  },

  toggleLock: (id: string) => {
    initializeMockUsers();
    const index = mockUsers.findIndex((u) => u.id === id);
    if (index === -1) return null;

    mockUsers[index] = {
      ...mockUsers[index],
      isLocked: !mockUsers[index].isLocked,
      updatedAt: new Date().toISOString(),
    };
    return mockUsers[index];
  },

  deleteUser: (id: string) => {
    initializeMockUsers();
    const index = mockUsers.findIndex((u) => u.id === id);
    if (index === -1) return false;

    mockUsers.splice(index, 1);
    return true;
  }
};
