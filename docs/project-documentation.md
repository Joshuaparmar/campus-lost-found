Campus Lost & Found Portal
Software Engineering Mini-Project Documentation
Project Title: Campus Lost & Found Portal
Team Members: \(Enter student name and roll number\) · \(Enter
student name and roll number\)
Department: \(Enter department\)
Academic Year: \(Enter academic year\)
1. Abstract
The Campus Lost & Found Portal is a web-based application designed to
help members of a college campus report, search for, and track lost and
found items. Traditional lost-and-found processes often rely on verbal
communication, notice boards, or informal messaging, making it difficult
to connect people who have lost items with those who have found them.

The portal provides a centralized platform where users can browse
reported items, search and filter listings, create an account, submit
lost or found reports, and manage their own reports. The application
uses React and TypeScript for the frontend and Flask for the backend,
with SQLAlchemy and SQLite for data management. JSON Web Token
(JWT)-based authentication protects user-specific operations.

The project demonstrates software engineering practices through
requirements analysis, system design, implementation, and testing.
2. Introduction
Lost personal belongings are a common problem in educational
institutions. Students, faculty members, and campus visitors may lose
items such as identity cards, books, stationery, electronic devices, or
personal accessories.

Without a centralized reporting mechanism, information about lost and
found items can become scattered across different communication
channels. This may delay recovery and make it difficult to identify the
person who reported an item.

The Campus Lost & Found Portal addresses this problem by providing a
single platform for publishing and browsing lost and found reports.
3. Problem Statement
The absence of a centralized and organized campus lost-and-found system
can make it difficult for people to report missing belongings, discover
found items, and track the status of their reports.

A web-based portal is proposed to organize lost-and-found information,
support item discovery, and allow registered users to manage their own
reports.
4. Objectives
The main objectives of the project are:
1. Develop a centralized platform for lost and found item reports.
2. Allow visitors to browse, search, filter, and view reported items.
3. Provide user registration and login functionality.
4. Allow authenticated users to submit lost and found reports.
5. Allow users to view and manage their own reports.
6. Support marking a user's own eligible report as resolved.
7. Store user and item information in a structured database.
8. Apply software engineering practices during design, implementation,
   and testing.
5. Scope of the Project
5.1 Included Features
- User registration and login.
- JWT-based authentication for protected operations.
- Browsing lost and found listings.
- Searching and filtering items.
- Viewing item details.
- Submitting lost or found reports.
- Viewing reports created by the signed-in user.
- Marking eligible reports as resolved.
- Persistent storage using SQLite.
5.2 Limitations
The current project focuses on reporting and discovering lost and found
items. It does not include automatic item matching, real-time
notifications, image-based recognition, or a built-in messaging system
unless these features are implemented separately.

The application is intended as an academic prototype. Production
deployment would require additional security, operational, and privacy
considerations.
6. Intended Users
6.1 Visitors
Visitors can browse listings, search and filter reports, and view item
details. They must register or sign in to perform protected operations.
6.2 Registered Users
Registered users can sign in, submit reports, view their own reports,
and mark their own eligible reports as resolved.
6.3 Administrator
The current documented feature set does not establish a separate
administrator role or administrator dashboard. These may be considered
for future development.
7. Functional Requirements
  ID                                  Requirement
  FR-01                               The system shall allow a new user
                                      to register an account.

  FR-02                               The system shall allow registered
                                      users to sign in.

  FR-03                               The system shall allow users to
                                      browse available item reports.

  FR-04                               The system shall support searching
                                      and filtering item reports.

  FR-05                               The system shall display details of
                                      an individual item report.

  FR-06                               The system shall allow
                                      authenticated users to create lost
                                      or found reports.

  FR-07                               The system shall allow
                                      authenticated users to view their
                                      own reports.

  FR-08                               The system shall allow an
                                      authorized report creator to mark
                                      their eligible report as resolved.

  FR-09                               The system shall allow a user to
                                      sign out.

  FR-10                               The system shall store user and
                                  item information persistently.
8. Non-Functional Requirements
8.1 Security
- Passwords shall be stored as password hashes rather than plain text.
- Protected API operations shall require authentication.
- Users shall not be permitted to resolve reports belonging to other
  users.
- Secret keys shall be configured appropriately before deployment.
8.2 Usability
- The interface should provide clear navigation between browsing,
  reporting, and account-related functions.
- Forms should identify required fields and provide useful feedback.
- The interface should be usable on common desktop and mobile screen
  sizes.
8.3 Reliability
- The application should handle invalid requests and authentication
  failures appropriately.
- Data should persist in the configured database.
- Errors should be reported without exposing sensitive implementation
  details.
8.4 Maintainability
- The frontend and backend should remain separated into distinct
  components.
- API routes, database models, and interface components should be
  organized for easier maintenance.
- Automated tests should be used to detect regressions.
8.5 Performance
- Common browsing and reporting operations should respond within an
  acceptable time under the expected prototype workload.
9. Hardware and Software Requirements
9.1 Hardware Requirements
- A computer capable of running a modern web browser.
- Sufficient memory and storage to run the frontend, backend, and
  database.
- A network connection when required by the application environment.
9.2 Software Requirements
  Component                             Technology
  Frontend library                      React
  Programming language                  TypeScript
  Frontend development and build tool   Vite
  Backend framework                     Flask
  Backend language                      Python
  Database access / ORM                 SQLAlchemy
  Database                              SQLite
  Authentication                        JSON Web Tokens (JWT)
  Frontend package manager              npm
  Testing framework                     pytest
10. Technology Stack
10.1 React and TypeScript
React provides a component-based approach to building the user
interface. TypeScript adds static type checking to help identify certain
programming errors during development.
10.2 Flask
Flask provides the backend API that processes authentication, item
retrieval, report creation, and report-resolution requests.
10.3 SQLAlchemy and SQLite
SQLAlchemy maps application models to database records and supports
database operations. SQLite provides persistent relational storage
suitable for a local academic prototype.
10.4 JWT Authentication
JSON Web Tokens are used to authenticate requests to protected
endpoints. The backend verifies the token before allowing authorized
operations.
10.5 Vite
Vite supports frontend development and creates the production frontend
build.
11. System Architecture
The application follows a client-server architecture:
1. The user interacts with the React frontend through a web browser.
2. The frontend sends HTTP requests to the Flask API.
3. The backend validates incoming requests and applies application
   logic.
4. Authentication and authorization checks are performed for protected
   operations.
5. SQLAlchemy communicates with the SQLite database.
6. The backend returns responses to the frontend, which updates the
   interface.
The system architecture and other design diagrams are maintained in
[`docs/diagrams/diagrams.md`](diagrams/diagrams.md).
12. Database Design
The application uses two main entities: User and Item.
12.1 User Entity
The User entity stores account information.

  Field             Description
  id              Primary key
  name            User's name
  email           Unique email address
  password_hash   Hashed password
  created_at      Account creation timestamp
12.2 Item Entity
The Item entity stores lost and found reports.
  Field                               Description
  id                                Primary key

  creator_id                        Foreign key referencing the user
                                      who created the report

  item_name                         Name of the item

  report_type                       Report type: Lost or Found

  category                          Item category

  description                       Description of the item

  location                          Relevant location

  incident_date                     Date associated with the reported
                                      incident

  status                            Report status, such as Open or
                                      Resolved
  created_at                        Report creation timestamp
One user can create multiple item reports. Each item report is
associated with its creator.
13. API Overview
  Method                  Endpoint                    Purpose
  GET                   /api/health               Check backend health

  POST                  /api/auth/register        Register an account

  POST                  /api/auth/login           Authenticate a user

  GET                   /api/auth/me              Retrieve the
                                                      authenticated user's
                                                      information

  GET                   /api/items                Browse and filter item
                                                      reports

  POST                  /api/items                Create an item report

  GET                   /api/items/<id>           Retrieve a specific
                                                      report

  GET                   /api/items/mine           Retrieve the
                                                      authenticated user's
                                                      reports

  PATCH                 /api/items/<id>/resolve   Mark an eligible report
                                                  as resolved
Protected endpoints require valid authentication. Report resolution is
restricted to the report's creator.
14. Software Testing
Testing verifies that the application behaves according to its
requirements. Automated backend tests are maintained in backend/tests.
The detailed test plan and recorded results are documented separately in
[`docs/test-case-report.md`](test-case-report.md).
14.1 Automated Backend Test Results
The recorded pytest run produced the following results:

  Metric                         Result
  Total tests executed               14
  Tests passed                       14
  Tests failed                        0
  Warnings                            0
  Execution time           3.91 seconds

Outcome: All 14 recorded automated backend tests passed.
14.2 Browser Verification Results
The recorded browser verification checklist covered browsing items,
opening the login panel, registration and login, accessing the report
form, viewing personal reports, resolving a report, and signing out.

  Metric                       Result
  Browser checks completed          7
  Passed                            7
  Failed                            0

Outcome: All seven recorded browser verification checks passed.

These results represent the recorded test run and browser checks. If
tests are rerun before submission, update the figures using the latest
output. Individual test-case results should only be marked as passed
when the corresponding behaviour has been observed.
15. Security and Privacy Considerations
- Passwords must not be stored as plain text.
- Authentication tokens should be handled carefully.
- The JWT secret must be configured securely for deployment.
- Protected operations must validate authentication and ownership
  where applicable.
- User data should not be exposed unnecessarily through API responses
  or logs.
- Public deployment requires additional review of configuration,
  HTTPS, database backups, and privacy practices.
16. Future Enhancements
Potential future improvements include:
- Image uploads for lost and found items.
- Notifications when relevant items are reported.
- Automated matching of lost and found reports.
- A dedicated administrator dashboard.
- Report moderation and duplicate detection.
- Improved deployment, monitoring, and backup procedures.
These are proposed enhancements and are not claimed to be part of the
current implementation.
17. Conclusion
The Campus Lost & Found Portal demonstrates how a web application can
organize lost-and-found information through a centralized reporting
system. The project combines a React and TypeScript frontend with a
Flask API and a relational database.

The documented implementation covers account management, item discovery,
report creation, and report tracking. It also provides an opportunity to
apply software engineering concepts such as requirements analysis,
system architecture, database design, authentication, and software
testing.

The recorded automated backend tests and browser verification checks
completed successfully. Further development and testing can improve the
platform's functionality, security, and suitability for deployment in a
real campus environment.
