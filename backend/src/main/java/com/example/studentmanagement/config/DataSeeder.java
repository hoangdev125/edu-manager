package com.example.studentmanagement.config;

import com.example.studentmanagement.model.ActivityLog;
import com.example.studentmanagement.model.Department;
import com.example.studentmanagement.model.Grade;
import com.example.studentmanagement.model.SchoolClass;
import com.example.studentmanagement.model.Student;
import com.example.studentmanagement.model.UserAccount;
import com.example.studentmanagement.repository.DepartmentRepository;
import com.example.studentmanagement.repository.SchoolClassRepository;
import com.example.studentmanagement.repository.StudentRepository;
import com.example.studentmanagement.repository.UserAccountRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {
    private final StudentRepository studentRepository;
    private final UserAccountRepository userAccountRepository;
    private final DepartmentRepository departmentRepository;
    private final SchoolClassRepository schoolClassRepository;

    public DataSeeder(
            StudentRepository studentRepository,
            UserAccountRepository userAccountRepository,
            DepartmentRepository departmentRepository,
            SchoolClassRepository schoolClassRepository
    ) {
        this.studentRepository = studentRepository;
        this.userAccountRepository = userAccountRepository;
        this.departmentRepository = departmentRepository;
        this.schoolClassRepository = schoolClassRepository;
    }

    @Override
    public void run(String... args) {
        if (departmentRepository.count() == 0) {
            departmentRepository.saveAll(List.of(
                    department("Cong nghe thong tin"),
                    department("Kinh te doi ngoai"),
                    department("Dien tu vien thong"),
                    department("Ngon ngu Anh")
            ));
        }

        if (schoolClassRepository.count() == 0) {
            schoolClassRepository.saveAll(List.of(
                    schoolClass("CNTT-01-K15", "Cong nghe thong tin"),
                    schoolClass("CNTT-02-K15", "Cong nghe thong tin"),
                    schoolClass("CNTT-01-K16", "Cong nghe thong tin"),
                    schoolClass("KTDN-01-K13", "Kinh te doi ngoai"),
                    schoolClass("KTDN-02-K15", "Kinh te doi ngoai"),
                    schoolClass("KTDN-02-K16", "Kinh te doi ngoai"),
                    schoolClass("DTVT-01-K14", "Dien tu vien thong"),
                    schoolClass("DTVT-02-K14", "Dien tu vien thong"),
                    schoolClass("NNA-01-K15", "Ngon ngu Anh"),
                    schoolClass("NNA-03-K15", "Ngon ngu Anh")
            ));
        }

        if (studentRepository.count() == 0) {
            studentRepository.saveAll(List.of(
                    student("SV001", "Nguyen Van Anh", "Nam", "2004-05-15", "vananh.nguyen@student.edu.vn",
                            "0987654321", "123 Duong Lang, Dong Da, Ha Noi", "CNTT-01-K15",
                            "Cong nghe thong tin", 3.65, "Dang hoc",
                            "Sinh vien nang no, tich cuc tham gia nghien cuu khoa hoc.",
                            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120"),
                    student("SV002", "Tran Thi Binh", "Nu", "2004-08-22", "thibinh.tran@student.edu.vn",
                            "0976543210", "456 Le Loi, Quan 1, TP. Ho Chi Minh", "KTDN-02-K15",
                            "Kinh te doi ngoai", 3.82, "Dang hoc",
                            "Hoc luc xuat sac, gianh hoc bong loai gioi hoc ky truoc.",
                            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120"),
                    student("SV003", "Pham Minh Cuong", "Nam", "2003-11-05", "minhcuong.pham@student.edu.vn",
                            "0965432109", "789 Nguyen Van Linh, Hai Chau, Da Nang", "DTVT-01-K14",
                            "Dien tu vien thong", 2.85, "Dang hoc",
                            "Can tap trung hon o cac mon chuyen nganh.",
                            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120")
            ));
        }

        if (userAccountRepository.count() == 0) {
            UserAccount admin = user("admin", "123", "admin", null, "Kim Hoang");
            UserAccount sv001 = user("sv001", "123", "student", "SV001", "Nguyen Van Anh");
            UserAccount sv002 = user("sv002", "123", "student", "SV002", "Tran Thi Binh");
            UserAccount sv003 = user("sv003", "123", "student", "SV003", "Pham Minh Cuong");
            userAccountRepository.saveAll(List.of(admin, sv001, sv002, sv003));
        }
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
            double gpa,
            String status,
            String notes,
            String avatar
    ) {
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
        student.setGpa(gpa);
        student.setStatus(status);
        student.setNotes(notes);
        student.setAvatar(avatar);
        student.setGrades(List.of(
                new Grade("INT1306", "Lap trinh huong doi tuong", "Hoc ky I - 2025-2026", 9.0, 9.0, 9.0, 10, 30, 60),
                new Grade("INT1339", "Cau truc du lieu va giai thuat", "Hoc ky I - 2025-2026", 8.5, 8.5, 8.5, 10, 30, 60),
                new Grade("INT1342", "Co so du lieu", "Hoc ky I - 2025-2026", 8.8, 8.8, 8.8, 10, 30, 60),
                new Grade("MAT1101", "Toan roi rac", "Hoc ky I - 2025-2026", 9.0, 9.0, 9.0, 10, 30, 60),
                new Grade("INT1335", "Mang may tinh", "Hoc ky I - 2025-2026", 8.0, 8.0, 8.0, 10, 30, 60)
        ));
        student.setActivities(List.of(
                new ActivityLog("act-" + id.toLowerCase(), "Them moi sinh vien vao he thong", "2026-05-10T08:30:00Z")
        ));
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

    private Department department(String name) {
        Department department = new Department();
        department.setName(name);
        return department;
    }

    private SchoolClass schoolClass(String code, String departmentName) {
        SchoolClass schoolClass = new SchoolClass();
        schoolClass.setCode(code);
        schoolClass.setDepartmentName(departmentName);
        return schoolClass;
    }
}
