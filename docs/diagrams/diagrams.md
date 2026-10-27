# Campus Lost & Found Portal — Software Design Diagrams

This document contains the software design diagrams for the Campus Lost & Found Portal, a web application that allows campus users to browse lost and found items, submit reports, and manage their own reports.

---

## Diagram 1 — Use Case Diagram

This diagram shows how visitors and registered users interact with the portal.

```mermaid
flowchart LR
    Visitor["Guest / Visitor"]
    User["Registered User"]

    subgraph Portal["Campus Lost & Found Portal"]
        UC1(["Browse Items"])
        UC2(["Search and Filter Items"])
        UC3(["View Item Details"])
        UC4(["Register Account"])
        UC5(["Sign In"])
        UC6(["Submit Lost / Found Report"])
        UC7(["View My Reports"])
        UC8(["Resolve Own Report"])
        UC9(["Sign Out"])
    end

    Visitor --> UC1
    Visitor --> UC2
    Visitor --> UC3
    Visitor --> UC4
    Visitor --> UC5

    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC6
    User --> UC7
    User --> UC8
    User --> UC9
```

**Explanation:** Visitors can browse, search, filter, and view item details. Registered users can additionally submit reports, view their own reports, resolve their own reports, and sign out.

---

## Diagram 2 — Data Flow Diagram (DFD), Level 1

This diagram illustrates how data flows between users, application processes, and the database.

```mermaid
flowchart TD
    U["Visitor / Registered User"]

    P1(["1.0 Account Management"])
    P2(["2.0 Browse and Search Items"])
    P3(["3.0 Manage Item Reports"])

    D1[("D1: Users Database")]
    D2[("D2: Items Database")]

    U -->|"Registration / Login Details"| P1
    P1 -->|"Authentication Result / JWT"| U
    P1 <-->|"User Records"| D1

    U -->|"Search Query and Filters"| P2
    P2 <-->|"Item Records"| D2
    P2 -->|"Matching Items and Details"| U

    U -->|"New Report / Resolve Request"| P3
    P3 <-->|"Verify User / Store or Update Report"| D1
    P3 <-->|"Create or Update Item"| D2
    P3 -->|"Submission or Update Result"| U
```

**Explanation:** Account management handles registration and login. The browsing process retrieves and filters item reports. Report management creates reports and updates their status after authentication and ownership checks.

---

## Diagram 3 — Entity Relationship (ER) Diagram

This diagram represents the database entities and their relationship.

```mermaid
erDiagram
    USER ||--o{ ITEM : creates

    USER {
        int id PK
        string name
        string email UK
        string password_hash
        datetime created_at
    }

    ITEM {
        int id PK
        int creator_id FK
        string item_name
        string report_type
        string category
        string description
        string location
        date incident_date
        string status
        datetime created_at
    }
```

**Explanation:**

- **USER:** Stores registered-user information. Passwords are stored as hashes, not plain text.
- **ITEM:** Stores lost and found reports, including item details, location, incident date, and status.
- **Relationship:** One user can create multiple item reports. Each item report belongs to one creator.
- **Primary and foreign keys:** `USER.id` and `ITEM.id` are primary keys; `ITEM.creator_id` references `USER.id`.

---

## Diagram 4 — System Architecture Diagram

This diagram shows the main technology layers and how they communicate.

```mermaid
flowchart TB
    Browser["User's Web Browser"]

    subgraph Frontend["Frontend Layer"]
        React["React + TypeScript"]
        Vite["Vite Development / Build Tool"]
        UI["Portal UI and Client-Side State"]
    end

    subgraph Backend["Backend Layer"]
        Flask["Flask REST API"]
        JWT["JWT Authentication"]
        Routes["Authentication, Items, Search and Resolution Routes"]
        ORM["SQLAlchemy ORM"]
    end

    subgraph Database["Data Layer"]
        SQLite[("SQLite Database")]
        Users["User Records"]
        Items["Item Records"]
    end

    Browser --> UI
    UI --> React
    React --> Vite
    React <-->|"HTTP Requests / JSON Responses"| Flask
    Flask --> JWT
    Flask --> Routes
    Routes --> ORM
    ORM <--> SQLite
    SQLite --- Users
    SQLite --- Items
```

**Explanation:** The React and TypeScript frontend communicates with the Flask REST API using HTTP requests and JSON responses. JWT authentication protects restricted operations. SQLAlchemy connects the backend to the SQLite database, which stores user accounts and item reports.

---

## Conclusion

These four diagrams document the main interactions, data flow, database relationships, and software architecture of the Campus Lost & Found Portal. They should be consistent with the implemented application and its actual database schema.
