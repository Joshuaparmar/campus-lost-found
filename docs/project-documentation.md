\# Campus Lost \& Found Portal

\## Software Engineering Mini-Project Documentation



\## 1. Abstract



The Campus Lost \& Found Portal is a web-based application designed to help members of a college campus report, search for, and track lost and found items. Traditional lost-and-found processes often rely on verbal communication, notice boards, or informal messaging, which can make it difficult to connect people who have lost items with those who have found them.



The proposed system provides a centralized platform where users can browse reported items, search and filter listings, create an account, submit lost or found reports, and manage their own reports. The application uses React and TypeScript for the frontend and Flask for the backend, with SQLAlchemy and SQLite for data management. JWT-based authentication protects user-specific operations.



The project demonstrates the application of software engineering principles through requirements analysis, system design, implementation, and software testing.



\## 2. Introduction



Lost personal belongings are a common problem in educational institutions. Students, faculty members, and other campus visitors may lose items such as identity cards, books, stationery, electronic devices, or personal accessories.



Without a centralized reporting mechanism, information about lost and found items may be scattered across different communication channels. This can delay recovery and make it difficult to identify the person who reported an item.



The Campus Lost \& Found Portal addresses this problem by providing a single platform for publishing and browsing lost and found reports.



\## 3. Problem Statement



The absence of a centralized and organized campus lost-and-found system can make it difficult for people to report missing belongings, discover found items, and track the status of their reports.



A web-based portal is therefore proposed to organize lost-and-found information, support item discovery, and allow registered users to manage their own reports.



\## 4. Objectives



The main objectives are:



1\. To develop a centralized platform for lost and found item reports.

2\. To allow visitors to browse, search, filter, and view reported items.

3\. To provide user registration and login functionality.

4\. To allow authenticated users to submit lost and found reports.

5\. To allow users to view and manage their own reports.

6\. To support marking a user's own report as resolved.

7\. To store user and item information in a structured database.

8\. To apply software engineering practices during design, implementation, and testing.



\## 5. Scope of the Project



\### 5.1 Included Features



\- User registration and login.

\- JWT-based authentication for protected operations.

\- Browsing lost and found listings.

\- Searching and filtering items.

\- Viewing item details.

\- Submitting lost or found reports.

\- Viewing reports created by the signed-in user.

\- Marking eligible reports as resolved.

\- Persistent storage using SQLite.



\### 5.2 Limitations



The current project focuses on reporting and discovering lost and found items. It does not claim to provide automatic item matching, real-time notifications, image-based recognition, or a built-in messaging system unless these features are implemented separately.



The application is intended as an academic prototype. Production deployment would require additional security, operational, and privacy considerations.



\## 6. Intended Users



\### 6.1 Visitors



Visitors can browse listings, search and filter reports, and view item details. They must register or sign in to perform protected operations.



\### 6.2 Registered Users



Registered users can sign in, submit reports, view their own reports, and mark their own reports as resolved.



\### 6.3 Administrator



The current documented feature set does not establish a separate administrator role or administrator dashboard. Such functionality may be considered for future development.



\## 7. Functional Requirements



| ID | Requirement |

|---|---|

| FR-01 | The system shall allow a new user to register an account. |

| FR-02 | The system shall allow registered users to sign in. |

| FR-03 | The system shall allow users to browse available item reports. |

| FR-04 | The system shall support searching and filtering item reports. |

| FR-05 | The system shall display details of an individual item report. |

| FR-06 | The system shall allow authenticated users to create lost or found reports. |

| FR-07 | The system shall allow authenticated users to view their own reports. |

| FR-08 | The system shall allow an authorized report creator to mark their report as resolved. |

| FR-09 | The system shall allow a user to sign out. |

| FR-10 | The system shall store user and item information persistently. |



\## 8. Non-Functional Requirements



\### 8.1 Security



\- Passwords shall be stored as password hashes rather than plain text.

\- Protected API operations shall require authentication.

\- Users shall not be permitted to resolve reports belonging to other users.

\- Secret keys shall be configured appropriately before deployment.



\### 8.2 Usability



\- The interface should provide clear navigation between browsing, reporting, and account-related functions.

\- Forms should identify required fields and provide useful feedback.

\- The interface should be usable on common desktop and mobile screen sizes.



\### 8.3 Reliability



\- The application should handle invalid requests and authentication failures appropriately.

\- Data should persist in the configured database.

\- Errors should be reported without exposing sensitive implementation details.



\### 8.4 Maintainability



\- The frontend and backend should remain separated into distinct components.

\- API routes, database models, and interface components should be organized for easier maintenance.

\- Automated tests should be used to detect regressions.



\### 8.5 Performance



\- Common browsing and reporting operations should respond within an acceptable time under the expected prototype workload.



\## 9. Hardware and Software Requirements



\### Hardware Requirements



\- A computer capable of running a modern web browser.

\- Sufficient memory and storage to run the frontend, backend, and database.

\- A network connection when required by the application environment.



\### Software Requirements



| Component | Technology |

|---|---|

| Frontend | React |

| Programming language | TypeScript |

| Frontend development and build | Vite |

| Backend framework | Flask |

| Backend language | Python |

| Database access | SQLAlchemy |

| Database | SQLite |

| Authentication | JSON Web Tokens (JWT) |

| Frontend package manager | npm |

| Testing | pytest |



\## 10. Technology Stack



\### 10.1 React and TypeScript



React provides a component-based approach to building the user interface. TypeScript adds static type checking to help identify certain programming errors during development.



\### 10.2 Flask



Flask provides the backend API that processes authentication, item retrieval, report creation, and report-resolution requests.



\### 10.3 SQLAlchemy and SQLite



SQLAlchemy maps application models to database records and supports database operations. SQLite provides persistent relational storage suitable for a local academic prototype.



\### 10.4 JWT Authentication



JSON Web Tokens are used to authenticate requests to protected endpoints. The backend verifies the token before allowing authorized operations.



\### 10.5 Vite



Vite supports frontend development and creates the production frontend build.



\## 11. System Architecture



The application follows a client-server architecture.



1\. The user interacts with the React frontend through a web browser.

2\. The frontend sends HTTP requests to the Flask API.

3\. The backend validates incoming requests and applies application logic.

4\. Authentication and authorization checks are performed for protected operations.

5\. SQLAlchemy communicates with the SQLite database.

6\. The backend returns responses to the frontend, which updates the interface.



The architecture is documented in the System Architecture Diagram in `docs/diagrams/diagrams.md`.



\## 12. Database Design



\### 12.1 User Entity



The User entity stores account information.



\- `id`: Primary key.

\- `name`: User's name.

\- `email`: Unique email address.

\- `password\_hash`: Hashed password.

\- `created\_at`: Account creation timestamp.



\### 12.2 Item Entity



The Item entity stores lost and found reports.



\- `id`: Primary key.

\- `creator\_id`: Foreign key referencing the user who created the report.

\- `item\_name`: Name of the item.

\- `report\_type`: Lost or Found.

\- `category`: Item category.

\- `description`: Description of the item.

\- `location`: Relevant location.

\- `incident\_date`: Date associated with the reported incident.

\- `status`: Open or Resolved.

\- `created\_at`: Report creation timestamp.



One user can create multiple item reports. Each item report is associated with its creator.



\## 13. API Overview



| Method | Endpoint | Purpose |

|---|---|---|

| POST | `/api/auth/register` | Register an account |

| POST | `/api/auth/login` | Authenticate a user |

| GET | `/api/auth/me` | Retrieve the authenticated user's information |

| GET | `/api/items` | Browse and filter item reports |

| POST | `/api/items` | Create an item report |

| GET | `/api/items/<id>` | Retrieve a specific report |

| GET | `/api/items/mine` | Retrieve the authenticated user's reports |

| PATCH | `/api/items/<id>/resolve` | Mark an eligible report as resolved |

| GET | `/api/health` | Check backend health |



\## 14. Software Testing



Testing is used to verify that the application behaves according to its requirements.



The project includes automated backend tests in `backend/tests`. The test suite should be executed before submission, and the actual results should be recorded in the test report.



Testing should cover:



1\. Successful user registration.

2\. Successful login with valid credentials.

3\. Rejection of invalid login credentials.

4\. Retrieval of item reports.

5\. Creation of a report by an authenticated user.

6\. Rejection of report creation without authentication.

7\. Retrieval of the current user's reports.

8\. Successful resolution of an eligible report by its creator.

9\. Rejection of unauthorized report resolution.

10\. Handling of invalid report data.



For each test, record the test ID, input or precondition, expected result, actual result, and pass/fail status. Do not mark a test as passed until its result has been observed.



\## 15. Security and Privacy Considerations



\- Passwords must not be stored as plain text.

\- Authentication tokens should be handled carefully.

\- The JWT secret must be configured securely for deployment.

\- Protected operations must validate both authentication and ownership where applicable.

\- User data should not be exposed unnecessarily through API responses or logs.

\- Public deployment requires additional review of configuration, HTTPS, database backups, and privacy practices.



\## 16. Future Enhancements



Potential future improvements include:



\- Image uploads for lost and found items.

\- Notifications when relevant items are reported.

\- Automated matching of lost and found reports.

\- A dedicated administrator dashboard.

\- Report moderation and duplicate detection.

\- Improved deployment, monitoring, and backup procedures.



These enhancements are proposed future features and are not claimed to be part of the current implementation.



\## 17. Conclusion



The Campus Lost \& Found Portal demonstrates how a web application can organize lost-and-found information through a centralized reporting system. The project combines a React and TypeScript frontend with a Flask API and a relational database.



The implementation covers account management, item discovery, report creation, and report tracking. The project also provides an opportunity to apply software engineering concepts such as requirements analysis, system architecture, database design, authentication, and software testing.



Further development and testing can improve the platform's functionality, security, and suitability for deployment in a real campus environment.



