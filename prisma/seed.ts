import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Bắt đầu nạp dữ liệu mẫu (seeding)...");

  // Xóa dữ liệu cũ nếu có
  await prisma.user.deleteMany();
  console.log("🧹 Đã dọn dẹp các bản ghi cũ.");

  // Mã hóa mật khẩu chung cho các tài khoản test
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash("admin123", salt);
  const studentPassword = await bcrypt.hash("student123", salt);
  const guestPassword = await bcrypt.hash("guest123", salt);

  // Tạo tài khoản admin hệ thống
  await prisma.user.create({
    data: {
      email: "admin@qualicode.com",
      name: "Admin QualiCode",
      password: adminPassword,
      role: "ADMIN",
      isLocked: false,
    },
  });

  // Tạo các tài khoản học viên (STUDENT)
  const students = [
    { email: "nguyenvana@gmail.com", name: "Nguyễn Văn An", role: "STUDENT", isLocked: false },
    { email: "tranthib@gmail.com", name: "Trần Thị Bình", role: "STUDENT", isLocked: true }, // Tài khoản bị khóa
    { email: "levanc@gmail.com", name: "Lê Văn Cường", role: "STUDENT", isLocked: false },
    { email: "phamthid@gmail.com", name: "Phạm Thị Dung", role: "STUDENT", isLocked: false },
  ];

  for (const s of students) {
    await prisma.user.create({
      data: {
        email: s.email,
        name: s.name,
        password: studentPassword,
        role: s.role,
        isLocked: s.isLocked,
      },
    });
  }

  // Tạo các tài khoản khách (GUEST)
  const guests = [
    { email: "hoangthee@gmail.com", name: "Hoàng Thế Em", role: "GUEST", isLocked: false },
    { email: "vuvanf@gmail.com", name: "Vũ Văn Phong", role: "GUEST", isLocked: false },
    { email: "nguyenthig@gmail.com", name: "Nguyễn Thị Gia", role: "GUEST", isLocked: true }, // Tài khoản bị khóa
  ];

  for (const g of guests) {
    await prisma.user.create({
      data: {
        email: g.email,
        name: g.name,
        password: guestPassword,
        role: g.role,
        isLocked: g.isLocked,
      },
    });
  }

  console.log("✅ Nạp dữ liệu thành công!");
  console.log("🔑 Tài khoản Admin: admin@qualicode.com / mật khẩu: admin123");
  console.log("🔑 Tài khoản Student: nguyenvana@gmail.com / mật khẩu: student123");
  console.log("🔑 Tài khoản Guest: hoangthee@gmail.com / mật khẩu: guest123");
}

main()
  .catch((e) => {
    console.error("❌ Lỗi trong quá trình seed dữ liệu:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
