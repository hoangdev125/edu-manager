import type { Student } from './types/student';

export const initialStudents: Student[] = [
  {
    id: 'SV001',
    name: 'Nguyễn Văn Anh',
    gender: 'Nam',
    dob: '2004-05-15',
    email: 'vananh.nguyen@student.edu.vn',
    phone: '0987654321',
    address: '123 Đường Láng, Đống Đa, Hà Nội',
    className: 'CNTT-01-K15',
    department: 'Công nghệ thông tin',
    gpa: 3.65,
    status: 'Đang học',
    grades: [
      { subject: 'Lập trình hướng đối tượng', score: 9.0 },
      { subject: 'Cấu trúc dữ liệu và giải thuật', score: 8.5 },
      { subject: 'Cơ sở dữ liệu', score: 8.8 },
      { subject: 'Toán rời rạc', score: 9.5 },
      { subject: 'Mạng máy tính', score: 8.0 }
    ],
    activities: [
      { id: 'act-1', action: 'Thêm mới sinh viên vào hệ thống', timestamp: '2026-05-10T08:30:00Z' },
      { id: 'act-2', action: 'Cập nhật bảng điểm học kỳ 1', timestamp: '2026-05-20T14:15:00Z' }
    ],
    notes: 'Sinh viên năng nổ, tích cực tham gia các hoạt động nghiên cứu khoa học của khoa.',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 'SV002',
    name: 'Trần Thị Bình',
    gender: 'Nữ',
    dob: '2004-08-22',
    email: 'thibinh.tran@student.edu.vn',
    phone: '0976543210',
    address: '456 Lê Lợi, Quận 1, TP. Hồ Chí Minh',
    className: 'KTDN-02-K15',
    department: 'Kinh tế đối ngoại',
    gpa: 3.82,
    status: 'Đang học',
    grades: [
      { subject: 'Kinh tế vĩ mô', score: 9.5 },
      { subject: 'Kinh tế vi mô', score: 9.2 },
      { subject: 'Marketing căn bản', score: 9.0 },
      { subject: 'Thương mại quốc tế', score: 9.6 },
      { subject: 'Tiếng Anh thương mại', score: 9.8 }
    ],
    activities: [
      { id: 'act-3', action: 'Thêm mới sinh viên vào hệ thống', timestamp: '2026-05-11T09:00:00Z' }
    ],
    notes: 'Học lực xuất sắc, giành học bổng loại giỏi học kỳ trước.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 'SV003',
    name: 'Phạm Minh Cường',
    gender: 'Nam',
    dob: '2003-11-05',
    email: 'minhcuong.pham@student.edu.vn',
    phone: '0965432109',
    address: '789 Nguyễn Văn Linh, Hải Châu, Đà Nẵng',
    className: 'DTVT-01-K14',
    department: 'Điện tử viễn thông',
    gpa: 2.85,
    status: 'Đang học',
    grades: [
      { subject: 'Kỹ thuật điện', score: 7.0 },
      { subject: 'Xử lý tín hiệu số', score: 6.5 },
      { subject: 'Vi điều khiển', score: 7.5 },
      { subject: 'Điện tử số', score: 8.0 },
      { subject: 'Lý thuyết mạch', score: 6.8 }
    ],
    activities: [
      { id: 'act-4', action: 'Thêm mới sinh viên vào hệ thống', timestamp: '2026-05-12T10:15:00Z' },
      { id: 'act-5', action: 'Cập nhật số điện thoại liên lạc', timestamp: '2026-05-25T16:20:00Z' }
    ],
    notes: 'Có cố gắng trong học tập nhưng cần tập trung hơn ở các môn chuyên ngành viễn thông.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 'SV004',
    name: 'Lê Thu Đông',
    gender: 'Nữ',
    dob: '2004-01-30',
    email: 'thudong.le@student.edu.vn',
    phone: '0954321098',
    address: '101 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội',
    className: 'NNA-03-K15',
    department: 'Ngôn ngữ Anh',
    gpa: 3.45,
    status: 'Đang học',
    grades: [
      { subject: 'Biên dịch nâng cao', score: 8.5 },
      { subject: 'Phiên dịch nâng cao', score: 8.0 },
      { subject: 'Văn học Anh-Mỹ', score: 8.8 },
      { subject: 'Kỹ năng thuyết trình', score: 9.2 },
      { subject: 'Ngữ pháp chuyên sâu', score: 9.0 }
    ],
    activities: [
      { id: 'act-6', action: 'Thêm mới sinh viên vào hệ thống', timestamp: '2026-05-12T11:00:00Z' }
    ],
    notes: 'Khả năng giao tiếp xuất sắc. Hoạt động ngoại khóa tích cực.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 'SV005',
    name: 'Hoàng Việt Hùng',
    gender: 'Nam',
    dob: '2004-12-12',
    email: 'viethung.hoang@student.edu.vn',
    phone: '0943210987',
    address: '222 Lê Thanh Nghị, Hai Bà Trưng, Hà Nội',
    className: 'CNTT-02-K15',
    department: 'Công nghệ thông tin',
    gpa: 3.12,
    status: 'Đang học',
    grades: [
      { subject: 'Lập trình hướng đối tượng', score: 8.0 },
      { subject: 'Cấu trúc dữ liệu và giải thuật', score: 7.2 },
      { subject: 'Cơ sở dữ liệu', score: 7.8 },
      { subject: 'Toán rời rạc', score: 7.5 },
      { subject: 'Mạng máy tính', score: 8.5 }
    ],
    activities: [
      { id: 'act-7', action: 'Thêm mới sinh viên vào hệ thống', timestamp: '2026-05-13T14:40:00Z' }
    ],
    notes: 'Học lực khá, có tư duy lập trình tốt nhưng cần rèn luyện tính cẩn thận khi làm bài tập lớn.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 'SV006',
    name: 'Vũ Thị Hương',
    gender: 'Nữ',
    dob: '2002-09-18',
    email: 'thihuong.vu@student.edu.vn',
    phone: '0932109876',
    address: '333 Quang Trung, Hà Đông, Hà Nội',
    className: 'KTDN-01-K13',
    department: 'Kinh tế đối ngoại',
    gpa: 3.95,
    status: 'Đã tốt nghiệp',
    grades: [
      { subject: 'Kinh tế vĩ mô', score: 9.8 },
      { subject: 'Thương mại quốc tế', score: 9.9 },
      { subject: 'Tài chính quốc tế', score: 9.7 },
      { subject: 'Khóa luận tốt nghiệp', score: 10.0 },
      { subject: 'Quản trị chuỗi cung ứng', score: 9.6 }
    ],
    activities: [
      { id: 'act-8', action: 'Cập nhật trạng thái: Đã tốt nghiệp', timestamp: '2026-05-15T10:00:00Z' }
    ],
    notes: 'Sinh viên xuất sắc của khóa K13. Đã nhận việc làm tại tập đoàn đa quốc gia trước khi tốt nghiệp.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 'SV007',
    name: 'Đặng Hoàng Lâm',
    gender: 'Nam',
    dob: '2003-03-25',
    email: 'hoanglam.dang@student.edu.vn',
    phone: '0921098765',
    address: '444 Nguyễn Trãi, Thanh Xuân, Hà Nội',
    className: 'DTVT-02-K14',
    department: 'Điện tử viễn thông',
    gpa: 2.34,
    status: 'Bảo lưu',
    grades: [
      { subject: 'Kỹ thuật điện', score: 5.5 },
      { subject: 'Xử lý tín hiệu số', score: 5.0 },
      { subject: 'Vi điều khiển', score: 6.0 },
      { subject: 'Điện tử số', score: 5.8 },
      { subject: 'Lý thuyết mạch', score: 5.2 }
    ],
    activities: [
      { id: 'act-9', action: 'Cập nhật trạng thái: Bảo lưu (vì lý do cá nhân)', timestamp: '2026-05-05T09:30:00Z' }
    ],
    notes: 'Đang xin bảo lưu học tập 1 năm từ học kỳ 2 năm học 2025-2026.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 'SV008',
    name: 'Bùi Thị Mai',
    gender: 'Nữ',
    dob: '2004-06-11',
    email: 'thimai.bui@student.edu.vn',
    phone: '0910987654',
    address: '555 Kim Mã, Ba Đình, Hà Nội',
    className: 'NNA-01-K15',
    department: 'Ngôn ngữ Anh',
    gpa: 3.28,
    status: 'Đang học',
    grades: [
      { subject: 'Biên dịch nâng cao', score: 8.0 },
      { subject: 'Phiên dịch nâng cao', score: 7.8 },
      { subject: 'Văn học Anh-Mỹ', score: 8.5 },
      { subject: 'Kỹ năng thuyết trình', score: 8.8 },
      { subject: 'Tiếng Anh giao tiếp', score: 9.0 }
    ],
    activities: [
      { id: 'act-10', action: 'Thêm mới sinh viên vào hệ thống', timestamp: '2026-05-14T11:20:00Z' }
    ],
    notes: 'Có khả năng phát âm chuẩn. Chăm chỉ học bài.',
    avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 'SV009',
    name: 'Nguyễn Tiến Nam',
    gender: 'Nam',
    dob: '2005-02-14',
    email: 'tiennam.nguyen@student.edu.vn',
    phone: '0909876543',
    address: '666 Giải Phóng, Hoàng Mai, Hà Nội',
    className: 'CNTT-01-K16',
    department: 'Công nghệ thông tin',
    gpa: 3.90,
    status: 'Đang học',
    grades: [
      { subject: 'Tin học cơ sở', score: 9.5 },
      { subject: 'Nhập môn lập trình', score: 9.8 },
      { subject: 'Đại số tuyến tính', score: 9.6 },
      { subject: 'Giải tích 1', score: 9.2 },
      { subject: 'Triết học Mác-Lênin', score: 8.8 }
    ],
    activities: [
      { id: 'act-11', action: 'Thêm mới sinh viên vào hệ thống', timestamp: '2026-05-15T08:15:00Z' }
    ],
    notes: 'Sinh viên năm nhất xuất sắc, đạt điểm tuyệt đối ở nhiều môn thực hành lập trình.',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 'SV010',
    name: 'Phạm Hồng Nhung',
    gender: 'Nữ',
    dob: '2005-07-09',
    email: 'hongnhung.pham@student.edu.vn',
    phone: '0898765432',
    address: '777 Xã Đàn, Đống Đa, Hà Nội',
    className: 'KTDN-02-K16',
    department: 'Kinh tế đối ngoại',
    gpa: 3.35,
    status: 'Đang học',
    grades: [
      { subject: 'Kinh tế vi mô', score: 8.2 },
      { subject: 'Kinh tế pháp luật', score: 8.0 },
      { subject: 'Toán cao cấp cho kinh tế', score: 7.8 },
      { subject: 'Quản trị học', score: 9.0 },
      { subject: 'Lịch sử kinh tế', score: 8.5 }
    ],
    activities: [
      { id: 'act-12', action: 'Thêm mới sinh viên vào hệ thống', timestamp: '2026-05-15T09:45:00Z' }
    ],
    notes: 'Ý thức tự giác cao, tích cực tham gia phát biểu xây dựng bài trong lớp học.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'
  }
];

export const departments = [
  'Công nghệ thông tin',
  'Kinh tế đối ngoại',
  'Điện tử viễn thông',
  'Ngôn ngữ Anh'
];

export const classes = [
  'CNTT-01-K15',
  'CNTT-02-K15',
  'CNTT-01-K16',
  'KTDN-01-K13',
  'KTDN-02-K15',
  'KTDN-02-K16',
  'DTVT-01-K14',
  'DTVT-02-K14',
  'NNA-01-K15',
  'NNA-03-K15'
];
