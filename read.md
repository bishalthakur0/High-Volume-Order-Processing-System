# FoodOrder Event Processor

## 1. Purpose & Background
Food delivery platforms rely on responsive user interfaces backed by scalable backend systems. This project demonstrates a full-stack application with asynchronous order processing, a clean UI, and robust backend architecture.

## 2. Objectives
- **Frontend**: Simple, intuitive, responsive web interface for placing and tracking orders.
- **Backend**: Scalable Spring Boot system with async processing (Producer-Consumer pattern).
- **Architecture**: Clear separation of concerns, REST APIs, and Caching.

## 3. Technology Stack
- **Frontend**: React.js (planned) for a dynamic and premium feel.
- **Backend**: Java, Spring Boot.
- **Database**: H2 (dev) / MySQL (prod compatibility).
- **Processing**: Java Implementations of BlockingQueue & ExecutorService.

## 4. Setup & Execution
### Backend
1. Navigate to the project root.
2. Run `mvn spring-boot:run`.
3. Server starts on `http://localhost:8080`.

### Frontend
1. Open `frontend/index.html` (if simple) or run `npm start` (if React).
2. Access the UI at `http://localhost:3000` (or configured port).

## 5. API Usage
- **POST /orders**: Create a new order.
- **GET /orders/{id}**: Track order status.
