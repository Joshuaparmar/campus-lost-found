\# Campus Lost \& Found Portal



A web-based application that helps campus users report lost and found belongings, browse existing reports, search for items, and manage their own reports.



\## Project Overview



The Campus Lost \& Found Portal provides a centralized platform for managing lost-and-found reports within a campus environment. Users can create accounts, log in, publish lost or found item reports, browse reports submitted by users, and mark their own reports as resolved.



\## Key Features



\- \*\*User Registration and Login:\*\* Create an account and authenticate securely.

\- \*\*Browse Reports:\*\* View available lost-and-found reports.

\- \*\*Search and Filtering:\*\* Search by item name or description and filter by report type or category.

\- \*\*Create Reports:\*\* Submit a lost or found item report with its name, category, description, location, and incident date.

\- \*\*My Reports:\*\* View reports created by the logged-in user.

\- \*\*Resolve Reports:\*\* Mark your own reports as resolved.

\- \*\*Access Control:\*\* Authentication protects report creation and personal report management.



\## Technology Stack



\### Frontend

\- React

\- TypeScript

\- Vite

\- CSS



\### Backend

\- Python

\- Flask

\- Flask-JWT-Extended

\- Flask-CORS

\- SQLAlchemy



\### Database

\- SQLite



\### Testing

\- pytest



\## Project Structure



```text

campus-lost-found/

├── backend/

│   ├── app/

│   │   ├── \_\_init\_\_.py

│   │   ├── database.py

│   │   └── routes.py

│   ├── tests/

│   │   ├── conftest.py

│   │   ├── test\_auth.py

│   │   └── test\_items.py

│   ├── requirements.txt

│   └── run.py

├── frontend/

│   └── src/

├── docs/

│   ├── diagrams/

│   │   └── diagrams.md

│   ├── project-documentation.md

│   └── test-case-report.md

└── README.md

```



\## Prerequisites



Install the following before running the project:



\- Python with pip

\- Node.js and npm

\- A modern web browser



\## Installation and Setup



\### 1. Clone or obtain the project



Open a terminal in the project directory.



\### 2. Set up the backend



From the project root, run:



```powershell

cd backend

python -m venv .venv

.\\.venv\\Scripts\\Activate.ps1

python -m pip install -r requirements.txt

```



If PowerShell blocks virtual-environment activation, use an appropriate local PowerShell execution policy or activate the environment using another supported method.



\### 3. Start the backend



From the `backend` directory, run:



```powershell

python run.py

```



Keep the backend terminal open.



The backend exposes a health endpoint at:



`http://127.0.0.1:5000/api/health`



This URL assumes the development server uses Flask's default port. If your configuration uses another port, use the actual address shown in the terminal.



\### 4. Set up the frontend



Open a second terminal and navigate to the frontend directory:



```powershell

cd frontend

npm install

npm run dev

```



Open the local URL displayed by Vite, typically:



`http://localhost:5173`



\## API Overview



| Method | Endpoint | Purpose |

|---|---|---|

| GET | `/api/health` | Check API status |

| POST | `/api/auth/register` | Register a user |

| POST | `/api/auth/login` | Authenticate a user |

| GET | `/api/auth/me` | Retrieve the current user |

| GET | `/api/items` | Browse, search, and filter reports |

| POST | `/api/items` | Create a report |

| GET | `/api/items/mine` | Retrieve the current user's reports |

| GET | `/api/items/<id>` | Retrieve report details |

| PATCH | `/api/items/<id>/resolve` | Resolve a report owned by the current user |



Protected endpoints require a valid authentication token.



\## Testing



Run the backend automated tests from the project root:



```powershell

python -m pytest .\\backend\\tests -v

```



Latest recorded result:



\- Tests executed: 14

\- Tests passed: 14

\- Tests failed: 0

\- Warnings: 0

\- Execution time: 3.91 seconds



These results reflect the recorded test run; rerun the command to verify the current environment.



\## Documentation



Additional project documents are available in the `docs/` directory:



\- `project-documentation.md` — project overview, requirements, architecture, and technical details.

\- `test-case-report.md` — automated and manual testing records.

\- `diagrams/diagrams.md` — system diagrams.



\## Limitations and Future Enhancements



Potential future improvements include image uploads, email notifications, advanced matching between lost and found reports, administrative moderation, and deployment to a production environment.



\## Security Notes



\- Passwords are stored as hashes.

\- Authentication uses JWT access tokens.

\- Report resolution is restricted to the report creator.

\- Configure a strong, securely generated JWT secret outside the source code before deployment.

\- Do not commit secrets, local databases containing personal information, or virtual-environment files.



\## Project Status



The core prototype has passed 14 automated backend tests and seven reported browser verification checks.



This project is intended as an academic software engineering prototype.

