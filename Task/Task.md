# Task Manager Web App

Simple full-stack web application to manage tasks with full CRUD functionality (Create, Read, Update, Delete). The project is implemented as a React frontend and a Spring Boot backend with an H2 in-memory database. :contentReference[oaicite:0]{index=0}

---

## 1. Project Overview

•⁠  ⁠*Name:* Task Manager
•⁠  ⁠*Goal:* Allow users to create, view, update, and delete tasks via a modern web UI and a RESTful backend.
•⁠  ⁠*Focus:* 
  - Correct implementation of CRUD functionality
  - Clean separation between frontend and backend
  - Proper validation and error handling
  - Explicit and reflected use of AI during development

---

## 2. Tech Stack

*Frontend*

•⁠  ⁠React.js  
•⁠  ⁠TypeScript (preferred; if not used, adapt this section)  
•⁠  ⁠Build tool: Vite or Create React App  
•⁠  ⁠Styling: TailwindCSS or Material UI (choose one and document here)

*Backend*

•⁠  ⁠Java 17+
•⁠  ⁠Spring Boot
•⁠  ⁠Build tool: Maven or Gradle
•⁠  ⁠Database: H2 in-memory (optional: PostgreSQL)
•⁠  ⁠API: REST, JSON over HTTP

---

## 3. Domain Model

### Task Entity

```ts
Task {
  id: number        // auto-generated
  title: string     // required, max 100 characters
  description: string | null // optional, max 500 characters
  status: "TODO" | "IN_PROGRESS" | "DONE"
  dueDate: string | null     // ISO date string (e.g. 2025-11-24)
}
Backend Entity (Java)
java
Code kopieren
public enum TaskStatus {
    TODO,
    IN_PROGRESS,
    DONE
}

@Entity
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    private String title;

    @Size(max = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    private LocalDate dueDate;
}
