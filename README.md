# EdTech Backend Project
* Ed-tech platform that enables users to create, consume,and rate educational content.
* The back end of the platform is built using NodeJS and ExpressJS, which are popular frameworks for building scalable and robust server-side applications. The back end provides APIs for the front end to consume, which include functionalities such as user authentication, course creation, and course consumption. The back end also handles the logic for processing and storing the course content and user data.
* The database for the platform is built using MongoDB, which is a NoSQL database that provides a flexible and scalable data storage solution. MongoDB allows for the storage of unstructured and semi-structured data, which is useful for storing course content such as videos, images, and PDFs. The database stores the course content, user data, and other relevant information related to the platform.

## Features and Functionalities of the Back-end:
1. **User authentication and authorization:** Students and instructors can sign up and log in to the platform using their email addresses and password. The platform also supports OTP (One-Time Password) verification and forgot password functionality for added security.
2. **Course management:** Instructors can create, read, update, and delete courses, as well as manage course content and media. Students can view and rate courses.
3. **Payment Integration:** Students will purchase and enrol on courses by completing the checkout flow that is followed by Razorpay integration for payment handling.
4. **Cloud-based media management:** EdTech uses Cloudinary, a cloud-based media management service, to store and manage all media content, including images, videos, and documents.
5. **Markdown formatting:** Course content in document format is stored in Markdown format, which allows for easier display and rendering on the front end.

## Frameworks, Libraries, and Tools used:
The back end of EdTech uses a range of frameworks, libraries, and tools to ensure its functionality and performance, including:
1. **Node.js:** Node.js is used as the primary framework for the back end.
2. **MongoDB:** MongoDB is used as the primary database, providing a flexible and scalable
data storage solution.
3. **Express.js:** Express.js is used as a web application framework, providing a range of
features and tools for building web applications.
4. **JWT:** JWT (JSON Web Tokens) are used for authentication and authorization,
providing a secure and reliable way to manage user credentials.
5. **Bcrypt:** Bcrypt is used for password hashing, adding an extra layer of security to user
data.
6. **Mongoose:** Mongoose is used as an Object Data Modeling (ODM) library, providing a
way to interact with MongoDB using JavaScript.

## Data Models and Database Schema:
The back end of EdTech uses a range of data models and database schemas to manage data, including:
1. **Student schema:** Includes fields such as name, email, password, and course details for each student.
2. **Instructor schema:** Includes fields such as name, email, password, and course details for each instructor.
3. **Course schema:** Includes fields such as course name, description, instructor details, and media content.

* Overall, the back-end of EdTech is designed to provide a robust and scalable solution for an ed-tech platform, with a focus on security, reliability, and ease of use. By using the right frameworks, libraries, and tools, we can ensure that the platform functions smoothly and provides an optimal user experience for all its users.

### Package Installation for EdTech Project
1. npm i express
2. npm i nodemon
3. npm i dotenv
4. npm i mongoose
5. npm i cookie-parser
6. npm i jsonwebtoken
7. npm i nodemailer
8. npm i otp-generator
9. npm i bcrypt
