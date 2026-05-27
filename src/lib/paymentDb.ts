import fs from "fs";
import path from "path";

export interface PaymentPackage {
  id: string;
  name: string;
  price: number;
  durationMonths: number;
  description: string;
  features: string[];
  isActive: boolean;
  createdAt: string;
}

export interface PaymentInvoice {
  id: string;
  userId: string | null;
  userName: string;
  userEmail: string;
  packageId: string;
  packageName: string;
  amount: number;
  status: "PENDING" | "PAID" | "CANCELLED";
  createdAt: string;
  paidAt: string | null;
  paymentMethod: "SEPAY" | "MANUAL_BANK" | null;
  sepayTransactionId: string | null;
}

export interface SepayTransaction {
  id: string;
  amount: number;
  transactionDate: string;
  transferContent: string;
  senderAccount: string;
  senderBank: string;
  bankTransactionId: string;
  status: "MATCHED" | "UNMATCHED" | "PENDING";
  matchedInvoiceId: string | null;
}

const PACKAGES_FILE = path.join(process.cwd(), "src", "lib", "paymentPackages.json");
const INVOICES_FILE = path.join(process.cwd(), "src", "lib", "paymentInvoices.json");
const SEPAY_FILE = path.join(process.cwd(), "src", "lib", "sepayTransactions.json");

function ensureFileExists(filePath: string, defaultData: any): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), "utf-8");
  }
}

// Initial Data Seeding
const initialPackages: PaymentPackage[] = [
  {
    id: "pkg_1",
    name: "IELTS Premium 3 Tháng",
    price: 299000,
    durationMonths: 3,
    description: "Gói học IELTS cơ bản cho học viên muốn cải thiện cấp tốc trong 3 tháng.",
    features: [
      "Truy cập đầy đủ ngân hàng câu hỏi Speaking",
      "Đánh giá AI tự động phản hồi phát âm",
      "Xem đáp án chi tiết các phần thi",
      "Luyện tập 30 bài thi thử IELTS thực tế"
    ],
    isActive: true,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "pkg_2",
    name: "IELTS VIP 6 Tháng",
    price: 599000,
    durationMonths: 6,
    description: "Gói học tập nâng cao, chấm chữa chi tiết, thích hợp cho mục tiêu tăng 1.0 - 1.5 band.",
    features: [
      "Tất cả tính năng của gói Premium 3 Tháng",
      "Đánh giá chi tiết từ AI nâng cao (ngữ pháp, từ vựng, độ trôi chảy)",
      "Ưu tiên phản hồi hỗ trợ trong 2 giờ",
      "Thống kê tiến độ học tập thông minh",
      "Tặng thêm tài liệu Speaking dự đoán quý mới nhất"
    ],
    isActive: true,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "pkg_3",
    name: "IELTS Master 12 Tháng",
    price: 999000,
    durationMonths: 12,
    description: "Giải pháp luyện thi toàn diện trong 1 năm cho người mất gốc hoặc mục tiêu band điểm cao 7.5+.",
    features: [
      "Tất cả tính năng của gói VIP 6 Tháng",
      "Thời hạn học tập trọn vẹn 12 tháng không giới hạn lượt truy cập",
      "Báo cáo phân tích điểm yếu kèm lộ trình khắc phục cá nhân hóa",
      "Cam kết đầu ra chuẩn IELTS Cambridge",
      "Hỗ trợ giải đáp bài tập 1-1 trực tuyến cùng giảng viên"
    ],
    isActive: true,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const initialInvoices: PaymentInvoice[] = [
  {
    id: "INV-9281A3",
    userId: null,
    userName: "Nguyễn Văn An",
    userEmail: "nguyenvana@gmail.com",
    packageId: "pkg_2",
    packageName: "IELTS VIP 6 Tháng",
    amount: 599000,
    status: "PAID",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    paidAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
    paymentMethod: "SEPAY",
    sepayTransactionId: "tx_1209384"
  },
  {
    id: "INV-10384B",
    userId: null,
    userName: "Lê Văn Cường",
    userEmail: "levanc@gmail.com",
    packageId: "pkg_1",
    packageName: "IELTS Premium 3 Tháng",
    amount: 299000,
    status: "PAID",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    paidAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000 + 12 * 60 * 1000).toISOString(),
    paymentMethod: "SEPAY",
    sepayTransactionId: "tx_1209847"
  },
  {
    id: "INV-7482C1",
    userId: null,
    userName: "Hoàng Thế Em",
    userEmail: "hoangthee@gmail.com",
    packageId: "pkg_3",
    packageName: "IELTS Master 12 Tháng",
    amount: 999000,
    status: "PENDING",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    paidAt: null,
    paymentMethod: null,
    sepayTransactionId: null
  },
  {
    id: "INV-2849D2",
    userId: null,
    userName: "Vũ Văn Phong",
    userEmail: "vuvanf@gmail.com",
    packageId: "pkg_2",
    packageName: "IELTS VIP 6 Tháng",
    amount: 599000,
    status: "PENDING",
    createdAt: new Date().toISOString(),
    paidAt: null,
    paymentMethod: null,
    sepayTransactionId: null
  }
];

const initialSepayTransactions: SepayTransaction[] = [
  {
    id: "tx_1209384",
    amount: 599000,
    transactionDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
    transferContent: "Thanh toan hoa don INV-9281A3",
    senderAccount: "00001234567",
    senderBank: "MBBank",
    bankTransactionId: "MB10384729",
    status: "MATCHED",
    matchedInvoiceId: "INV-9281A3"
  },
  {
    id: "tx_1209847",
    amount: 299000,
    transactionDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000 + 12 * 60 * 1000).toISOString(),
    transferContent: "QualiCode INV-10384B levancuong",
    senderAccount: "99998765432",
    senderBank: "Vietcombank",
    bankTransactionId: "VCB2847192",
    status: "MATCHED",
    matchedInvoiceId: "INV-10384B"
  },
  {
    id: "tx_1210102",
    amount: 599000,
    transactionDate: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), // 3 giờ trước
    transferContent: "Chuyen khoan dong hoc phi VIP 6 thang cho Vu Van Phong",
    senderAccount: "88881112223",
    senderBank: "Techcombank",
    bankTransactionId: "TCB9384721",
    status: "UNMATCHED", // Không chứa mã INV-2849D2 nên bị unmatched, cần duyệt thủ công!
    matchedInvoiceId: null
  },
  {
    id: "tx_1210203",
    amount: 999000,
    transactionDate: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 phút trước
    transferContent: "Hoc vien hoangthee chuyen khoan code INV-7482C1",
    senderAccount: "77774445556",
    senderBank: "ACB",
    bankTransactionId: "ACB8471920",
    status: "PENDING", // Đang chờ đối khớp hoặc phê duyệt hệ thống
    matchedInvoiceId: null
  }
];

// Packages APIs
export async function getPackages(): Promise<PaymentPackage[]> {
  ensureFileExists(PACKAGES_FILE, initialPackages);
  const data = await fs.promises.readFile(PACKAGES_FILE, "utf-8");
  return JSON.parse(data || "[]");
}

export async function savePackages(packages: PaymentPackage[]): Promise<void> {
  const dir = path.dirname(PACKAGES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  await fs.promises.writeFile(PACKAGES_FILE, JSON.stringify(packages, null, 2), "utf-8");
}

export async function createPackage(pkgData: Omit<PaymentPackage, "id" | "createdAt">): Promise<PaymentPackage> {
  const packages = await getPackages();
  const newPkg: PaymentPackage = {
    ...pkgData,
    id: "pkg_" + Math.random().toString(36).substring(2, 9),
    createdAt: new Date().toISOString()
  };
  packages.push(newPkg);
  await savePackages(packages);
  return newPkg;
}

export async function updatePackage(id: string, pkgData: Partial<Omit<PaymentPackage, "id" | "createdAt">>): Promise<PaymentPackage | null> {
  const packages = await getPackages();
  const index = packages.findIndex(p => p.id === id);
  if (index === -1) return null;

  packages[index] = {
    ...packages[index],
    ...pkgData
  };
  await savePackages(packages);
  return packages[index];
}

export async function deletePackage(id: string): Promise<boolean> {
  const packages = await getPackages();
  const filtered = packages.filter(p => p.id !== id);
  if (filtered.length === packages.length) return false;
  await savePackages(filtered);
  return true;
}

// Invoices APIs
export async function getInvoices(): Promise<PaymentInvoice[]> {
  ensureFileExists(INVOICES_FILE, initialInvoices);
  const data = await fs.promises.readFile(INVOICES_FILE, "utf-8");
  return JSON.parse(data || "[]");
}

export async function saveInvoices(invoices: PaymentInvoice[]): Promise<void> {
  const dir = path.dirname(INVOICES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  await fs.promises.writeFile(INVOICES_FILE, JSON.stringify(invoices, null, 2), "utf-8");
}

export async function createInvoice(invoiceData: Omit<PaymentInvoice, "id" | "status" | "createdAt" | "paidAt" | "paymentMethod" | "sepayTransactionId">): Promise<PaymentInvoice> {
  const invoices = await getInvoices();
  const newInv: PaymentInvoice = {
    ...invoiceData,
    id: "INV-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    status: "PENDING",
    createdAt: new Date().toISOString(),
    paidAt: null,
    paymentMethod: null,
    sepayTransactionId: null
  };
  invoices.unshift(newInv); // Add to beginning of array
  await saveInvoices(invoices);
  return newInv;
}

export async function updateInvoiceStatus(id: string, status: PaymentInvoice["status"]): Promise<PaymentInvoice | null> {
  const invoices = await getInvoices();
  const index = invoices.findIndex(i => i.id === id);
  if (index === -1) return null;

  invoices[index].status = status;
  if (status === "PAID") {
    invoices[index].paidAt = new Date().toISOString();
  } else {
    invoices[index].paidAt = null;
  }
  
  await saveInvoices(invoices);
  return invoices[index];
}

// Sepay Transactions APIs
export async function getSepayTransactions(): Promise<SepayTransaction[]> {
  ensureFileExists(SEPAY_FILE, initialSepayTransactions);
  const data = await fs.promises.readFile(SEPAY_FILE, "utf-8");
  return JSON.parse(data || "[]");
}

export async function saveSepayTransactions(transactions: SepayTransaction[]): Promise<void> {
  const dir = path.dirname(SEPAY_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  await fs.promises.writeFile(SEPAY_FILE, JSON.stringify(transactions, null, 2), "utf-8");
}

export async function createSepayTransaction(txData: Omit<SepayTransaction, "status" | "matchedInvoiceId">): Promise<SepayTransaction> {
  const transactions = await getSepayTransactions();
  const newTx: SepayTransaction = {
    ...txData,
    status: "PENDING",
    matchedInvoiceId: null
  };
  transactions.unshift(newTx);
  await saveSepayTransactions(transactions);
  return newTx;
}

export async function matchTransactionAndInvoice(txId: string, invoiceId: string, method: "SEPAY" | "MANUAL_BANK"): Promise<boolean> {
  const transactions = await getSepayTransactions();
  const invoices = await getInvoices();

  const txIndex = transactions.findIndex(t => t.id === txId);
  const invIndex = invoices.findIndex(i => i.id === invoiceId);

  if (txIndex === -1 || invIndex === -1) return false;

  // Update invoice
  invoices[invIndex].status = "PAID";
  invoices[invIndex].paidAt = new Date().toISOString();
  invoices[invIndex].paymentMethod = method;
  invoices[invIndex].sepayTransactionId = txId;

  // Update transaction
  transactions[txIndex].status = "MATCHED";
  transactions[txIndex].matchedInvoiceId = invoiceId;

  await saveInvoices(invoices);
  await saveSepayTransactions(transactions);
  return true;
}
