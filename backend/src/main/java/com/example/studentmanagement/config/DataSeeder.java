package com.example.studentmanagement.config;

import com.example.studentmanagement.model.*;
import com.example.studentmanagement.repository.*;
import com.example.studentmanagement.service.StudentService;
import jakarta.persistence.EntityManager;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {
        private final EntityManager entityManager;
        private final StudentService studentService;
        private final StudentRepository studentRepository;
        private final UserAccountRepository userAccountRepository;
        private final DepartmentRepository departmentRepository;
        private final SchoolClassRepository schoolClassRepository;
        private final SubjectRepository subjectRepository;

        public DataSeeder(
                        EntityManager entityManager,
                        StudentService studentService,
                        StudentRepository studentRepository,
                        UserAccountRepository userAccountRepository,
                        DepartmentRepository departmentRepository,
                        SchoolClassRepository schoolClassRepository,
                        SubjectRepository subjectRepository) {
                this.entityManager = entityManager;
                this.studentService = studentService;
                this.studentRepository = studentRepository;
                this.userAccountRepository = userAccountRepository;
                this.departmentRepository = departmentRepository;
                this.schoolClassRepository = schoolClassRepository;
                this.subjectRepository = subjectRepository;
        }

        @Override
        @Transactional
        public void run(String... args) {
                System.out.println("=== BAT DAU DON DEP VA TAO FAKE DATA ===");

                // 1. Xoa du lieu bang SQL thuan de tranh loi null primitive tu database cu
                entityManager.createNativeQuery("SET FOREIGN_KEY_CHECKS = 0").executeUpdate();
                entityManager.createNativeQuery("DELETE FROM student_activities").executeUpdate();
                entityManager.createNativeQuery("DELETE FROM student_grades").executeUpdate();
                entityManager.createNativeQuery("DELETE FROM student").executeUpdate();
                entityManager.createNativeQuery("DELETE FROM user_account").executeUpdate();
                entityManager.createNativeQuery("DELETE FROM school_class").executeUpdate();
                entityManager.createNativeQuery("DELETE FROM department").executeUpdate();
                entityManager.createNativeQuery("DELETE FROM subject").executeUpdate();
                entityManager.createNativeQuery("SET FOREIGN_KEY_CHECKS = 1").executeUpdate();

                // 2. Tao Khoa (Departments)
                List<Department> departments = List.of(
                                department("Công nghệ thông tin", "CNTT"),
                                department("Điện tử viễn thông", "DTVT"),
                                department("Kinh tế đối ngoại", "KTDN"),
                                department("Quản trị kinh doanh", "QTKD"),
                                department("Ngôn ngữ Anh", "NNA"));
                departmentRepository.saveAll(departments);

                // 3. Tao Lop (SchoolClasses)
                List<SchoolClass> schoolClasses = List.of(
                                schoolClass("CNTT-01-K15", "Công nghệ thông tin"),
                                schoolClass("CNTT-02-K15", "Công nghệ thông tin"),
                                schoolClass("DTVT-01-K15", "Điện tử viễn thông"),
                                schoolClass("KTDN-01-K15", "Kinh tế đối ngoại"),
                                schoolClass("QTKD-01-K15", "Quản trị kinh doanh"),
                                schoolClass("NNA-01-K15", "Ngôn ngữ Anh"));
                schoolClassRepository.saveAll(schoolClasses);

                // 4. Tao Mon hoc (Subjects)
                List<Subject> subjects = List.of(
                                new Subject("INT1306", "Lập trình hướng đối tượng", 3),
                                new Subject("INT1339", "Cấu trúc dữ liệu và giải thuật", 3),
                                new Subject("INT1342", "Cơ sở dữ liệu", 3),
                                new Subject("MAT1101", "Toán rời rạc", 4),
                                new Subject("INT1335", "Mạng máy tính", 3),
                                new Subject("BSA1001", "Kinh tế vi mô", 3),
                                new Subject("BSA1002", "Kinh tế vi mô nâng cao", 3),
                                new Subject("ENG1001", "Tiếng Anh giao tiếp 1", 2),
                                new Subject("ENG1002", "Tiếng Anh giao tiếp 2", 2),
                                new Subject("PHY1001", "Vật lý đại cương", 4));
                subjectRepository.saveAll(subjects);

                // 5. Tao Sinh vien & Bang diem (Students & Grades)
                List<Student> studentsToSave = new ArrayList<>();

                // SV001
                Student sv1 = student("SV001", "Nguyễn Văn Anh", "Nam", "2004-05-15", "vananh.nguyen@student.edu.vn",
                                "0987654321", "123 Đường Láng, Đống Đa, Hà Nội", "CNTT-01-K15", "Công nghệ thông tin",
                                "Đang học", 85,
                                "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120");
                sv1.setGrades(List.of(
                                new Grade("INT1306", "Lập trình hướng đối tượng", "Học kỳ I - 2025-2026", 9.0, 9.0, 9.0,
                                                10, 30, 60),
                                new Grade("INT1339", "Cấu trúc dữ liệu và giải thuật", "Học kỳ I - 2025-2026", 8.5, 8.0,
                                                8.5, 10, 30, 60),
                                new Grade("INT1342", "Cơ sở dữ liệu", "Học kỳ I - 2025-2026", 8.0, 8.5, 9.0, 10, 30,
                                                60),
                                new Grade("MAT1101", "Toán rời rạc", "Học kỳ II - 2025-2026", 7.5, 8.0, 8.0, 10, 30,
                                                60),
                                new Grade("INT1335", "Mạng máy tính", "Học kỳ II - 2025-2026", 8.0, 7.5, 8.5, 10, 30,
                                                60)));
                studentsToSave.add(sv1);

                // SV002
                Student sv2 = student("SV002", "Trần Thị Bình", "Nữ", "2004-08-22", "thibinh.tran@student.edu.vn",
                                "0976543210", "456 Lê Lợi, Quận 1, TP. Hồ Chí Minh", "KTDN-01-K15", "Kinh tế đối ngoại",
                                "Đang học", 92,
                                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120");
                sv2.setGrades(List.of(
                                new Grade("BSA1001", "Kinh tế vi mô", "Học kỳ I - 2025-2026", 9.5, 9.0, 9.5, 10, 30,
                                                60),
                                new Grade("BSA1002", "Kinh tế vi mô nâng cao", "Học kỳ I - 2025-2026", 9.0, 8.5, 9.0,
                                                10, 30, 60),
                                new Grade("ENG1001", "Tiếng Anh giao tiếp 1", "Học kỳ I - 2025-2026", 9.0, 9.0, 9.5, 10,
                                                30, 60),
                                new Grade("ENG1002", "Tiếng Anh giao tiếp 2", "Học kỳ II - 2025-2026", 9.5, 9.5, 10.0,
                                                10, 30, 60)));
                studentsToSave.add(sv2);

                // SV003
                Student sv3 = student("SV003", "Phạm Minh Cường", "Nam", "2003-11-05", "minhcuong.pham@student.edu.vn",
                                "0965432109", "789 Nguyễn Văn Linh, Hải Châu, Đà Nẵng", "DTVT-01-K15",
                                "Điện tử viễn thông",
                                "Đang học", 78,
                                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120");
                sv3.setGrades(List.of(
                                new Grade("PHY1001", "Vật lý đại cương", "Học kỳ I - 2025-2026", 7.0, 6.5, 7.0, 10, 30,
                                                60),
                                new Grade("MAT1101", "Toán rời rạc", "Học kỳ I - 2025-2026", 6.0, 6.5, 6.0, 10, 30, 60),
                                new Grade("ENG1001", "Tiếng Anh giao tiếp 1", "Học kỳ II - 2025-2026", 8.0, 7.5, 8.0,
                                                10, 30, 60)));
                studentsToSave.add(sv3);

                // SV004
                Student sv4 = student("SV004", "Lê Hoàng Nam", "Nam", "2004-03-12", "hoangnam.le@student.edu.vn",
                                "0954321098", "321 Nguyễn Trãi, Thanh Xuân, Hà Nội", "CNTT-01-K15",
                                "Công nghệ thông tin",
                                "Đang học", 88,
                                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120");
                sv4.setGrades(List.of(
                                new Grade("INT1306", "Lập trình hướng đối tượng", "Học kỳ I - 2025-2026", 8.0, 8.5, 8.5,
                                                10, 30, 60),
                                new Grade("INT1339", "Cấu trúc dữ liệu và giải thuật", "Học kỳ I - 2025-2026", 7.5, 8.0,
                                                7.5, 10, 30, 60),
                                new Grade("INT1342", "Cơ sở dữ liệu", "Học kỳ II - 2025-2026", 8.5, 9.0, 9.0, 10, 30,
                                                60)));
                studentsToSave.add(sv4);

                // SV005
                Student sv5 = student("SV005", "Hoàng Quốc Anh", "Nam", "2004-12-01", "quocanh.hoang@student.edu.vn",
                                "0943210987", "55 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội", "CNTT-02-K15",
                                "Công nghệ thông tin",
                                "Bảo lưu", 82,
                                "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120");
                sv5.setGrades(List.of(
                                new Grade("INT1306", "Lập trình hướng đối tượng", "Học kỳ I - 2025-2026", 7.0, 7.5, 7.0,
                                                10, 30, 60),
                                new Grade("MAT1101", "Toán rời rạc", "Học kỳ I - 2025-2026", 6.5, 7.0, 6.5, 10, 30,
                                                60)));
                studentsToSave.add(sv5);

                // SV006
                Student sv6 = student("SV006", "Vũ Thị Lan", "Nữ", "2004-09-18", "thilan.vu@student.edu.vn",
                                "0932109876", "88 Trần Phú, Hà Đông, Hà Nội", "QTKD-01-K15", "Quản trị kinh doanh",
                                "Đang học", 95,
                                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120");
                sv6.setGrades(List.of(
                                new Grade("BSA1001", "Kinh tế vi mô", "Học kỳ I - 2025-2026", 9.0, 9.5, 9.5, 10, 30,
                                                60),
                                new Grade("ENG1001", "Tiếng Anh giao tiếp 1", "Học kỳ I - 2025-2026", 9.5, 9.0, 9.0, 10,
                                                30, 60),
                                new Grade("BSA1002", "Kinh tế vi mô nâng cao", "Học kỳ II - 2025-2026", 8.5, 8.5, 9.0,
                                                10, 30, 60)));
                studentsToSave.add(sv6);

                // SV007
                Student sv7 = student("SV007", "Đỗ Thanh Đạt", "Nam", "2004-07-25", "thanhdat.do@student.edu.vn",
                                "0921098765", "12 Câu Giấy, Câu Giấy, Hà Nội", "NNA-01-K15", "Ngôn ngữ Anh",
                                "Đang học", 90,
                                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120");
                sv7.setGrades(List.of(
                                new Grade("ENG1001", "Tiếng Anh giao tiếp 1", "Học kỳ I - 2025-2026", 9.5, 9.5, 9.5, 10,
                                                30, 60),
                                new Grade("ENG1002", "Tiếng Anh giao tiếp 2", "Học kỳ I - 2025-2026", 9.0, 9.5, 9.0, 10,
                                                30, 60),
                                new Grade("MAT1101", "Toán rời rạc", "Học kỳ II - 2025-2026", 7.0, 7.5, 7.0, 10, 30,
                                                60)));
                studentsToSave.add(sv7);

                // SV008
                Student sv8 = student("SV008", "Phan Thị Diệp", "Nữ", "2004-02-14", "thidiep.phan@student.edu.vn",
                                "0910987654", "234 Hàng Bông, Hoàn Kiếm, Hà Nội", "NNA-01-K15", "Ngôn ngữ Anh",
                                "Thôi học", 60,
                                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120");
                sv8.setGrades(List.of(
                                new Grade("ENG1001", "Tiếng Anh giao tiếp 1", "Học kỳ I - 2025-2026", 5.0, 4.5, 4.0, 10,
                                                30, 60),
                                new Grade("ENG1002", "Tiếng Anh giao tiếp 2", "Học kỳ I - 2025-2026", 4.0, 4.0, 3.5, 10,
                                                30, 60)));
                studentsToSave.add(sv8);

                // Luu hoc sinh thong qua studentService de tu dong tinh GPA thang 4 va luu
                // activity logs
                for (Student s : studentsToSave) {
                        studentService.create(s);
                }

                // 6. Tao Tai khoan Nguoi dung (User Accounts)
                List<UserAccount> userAccounts = new ArrayList<>();
                userAccounts.add(user("admin", "123", "admin", null, "Kim Hoàng"));

                for (Student s : studentsToSave) {
                        userAccounts.add(user(s.getId().toLowerCase(), "123", "student", s.getId(), s.getName()));
                }
                userAccountRepository.saveAll(userAccounts);

                System.out.println("=== TAO FAKE DATA HOAN TAT ===");
        }

        private Student student(
                        String id,
                        String name,
                        String gender,
                        String dob,
                        String email,
                        String phone,
                        String address,
                        String className,
                        String department,
                        String status,
                        int conductScore,
                        String avatar) {
                Student student = new Student();
                student.setId(id);
                student.setName(name);
                student.setGender(gender);
                student.setDob(dob);
                student.setEmail(email);
                student.setPhone(phone);
                student.setAddress(address);
                student.setClassName(className);
                student.setDepartment(department);
                student.setStatus(status);
                student.setConductScore(conductScore);
                student.setAvatar(avatar);
                student.setGrades(new ArrayList<>());
                student.setActivities(new ArrayList<>());
                return student;
        }

        private UserAccount user(String username, String password, String role, String studentId, String fullName) {
                UserAccount userAccount = new UserAccount();
                userAccount.setUsername(username);
                userAccount.setPassword(password);
                userAccount.setRole(role);
                userAccount.setStudentId(studentId);
                userAccount.setFullName(fullName);
                return userAccount;
        }

        private Department department(String name, String admissionCode) {
                Department department = new Department();
                department.setName(name);
                department.setAdmissionCode(admissionCode);
                return department;
        }

        private SchoolClass schoolClass(String code, String departmentName) {
                SchoolClass schoolClass = new SchoolClass();
                schoolClass.setCode(code);
                schoolClass.setDepartmentName(departmentName);
                return schoolClass;
        }
}
