# Student Management Backend

Spring Boot REST API for the React student management frontend.

## Requirements

- Java 21+
- Maven 3.9+
- MySQL 8+

## Run

```bash
mvn spring-boot:run
```

The API starts on `http://localhost:8080`.

By default the app connects to MySQL with:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/student_management?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Bangkok
spring.datasource.username=root
spring.datasource.password=
```

Update `src/main/resources/application.properties` if your MySQL password is different.

## Main Endpoints

- `GET /api/students`
- `GET /api/students/{id}`
- `POST /api/students`
- `PUT /api/students/{id}`
- `DELETE /api/students/{id}`
- `GET /api/students/stats`
- `GET /api/auth/users`
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/academic/departments`
- `POST /api/academic/departments`
- `GET /api/academic/classes`
- `POST /api/academic/classes`
- `POST /api/files/avatar`

The database `student_management` is created automatically if the MySQL user has permission. Tables are created/updated automatically by Hibernate.
