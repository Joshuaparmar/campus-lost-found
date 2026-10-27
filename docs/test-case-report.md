# CAMPUS LOST & FOUND PORTAL
## Software Testing and Test-Case Report

**Project:** Campus Lost & Found Portal  
**Document Type:** Software Testing Report  
**Testing Approach:** Manual Browser Verification and Automated Backend Testing  
**Technology Stack:** React, TypeScript, Vite, Flask, SQLAlchemy, SQLite, JWT

---

## 1. Introduction

This report documents the testing approach and verification results for the Campus Lost & Found Portal. The purpose of testing is to verify that the application's core functionalities operate as expected and that protected operations enforce appropriate access controls.

Testing focuses on account management, browsing and searching item reports, report submission, personal report management, report resolution, and authentication.

## 2. Testing Environment

| Component | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Backend | Python, Flask |
| Database | SQLite |
| ORM | SQLAlchemy |
| Authentication | JSON Web Tokens (JWT) |
| Automated Testing Framework | pytest |
| Environment | Local development environment |

*Note: Record the operating system, browser, and software versions used during the final demonstration if required.*

## 3. Test Cases

The following test cases define the expected behaviour of the application. Individual execution results should be recorded where they have not already been documented.

**Status definitions**

- **PASS:** Actual behaviour matches the expected result.
- **FAIL:** Actual behaviour differs from the expected result.
- **NOT RECORDED:** An individual execution result has not been documented.

| ID | Test Scenario | Expected Result | Status |
|---|---|---|---|
| TC-01 | User registration | A new account is created using valid, unused account details. | Not recorded individually |
| TC-02 | Valid login | The user is authenticated and signed in successfully. | Not recorded individually |
| TC-03 | Invalid login | Login is rejected when incorrect credentials are provided. | Not recorded individually |
| TC-04 | Browse reports | Available lost and found reports are displayed. | Not recorded individually |
| TC-05 | Search and filter | Results match the entered search term or selected filter. | Not recorded individually |
| TC-06 | Create a report | A valid report is saved and the interface reflects the submission. | Not recorded individually |
| TC-07 | Unauthenticated report submission | Authentication is required before a report can be submitted. | Not recorded individually |
| TC-08 | View personal reports | The signed-in user can view their own reports. | Not recorded individually |
| TC-09 | Resolve own report | An eligible report created by the signed-in user is marked as resolved. | Not recorded individually |
| TC-10 | Unauthorized resolution | A user cannot resolve another user's report. | Not recorded individually |
| TC-11 | Invalid report data | Invalid or incomplete report data is rejected appropriately. | Not recorded individually |
| TC-12 | Sign out | The session ends and protected operations require authentication again. | Not recorded individually |

**Note:** The table above is the detailed test plan. Completed browser checks and automated backend results are documented separately below. A test should only be marked PASS or FAIL when its actual result has been recorded.

## 4. Automated Backend Testing

The backend test suite is maintained in `backend/tests` and is executed using pytest.

### 4.1 Execution command

Run the following command from the project root:

```powershell
python -m pytest .\backend\tests -v
```

### 4.2 Recorded results

| Metric | Result |
|---|---:|
| Total tests executed | 14 |
| Tests passed | 14 |
| Tests failed | 0 |
| Warnings | 0 |
| Execution time | 3.91 seconds |

**Outcome: All 14 automated backend tests passed.**

The automated suite covers key backend behaviours, including registration, authentication, access control, report creation, search and filtering, report retrieval, and report resolution.

*These figures represent the recorded test run. If the suite is executed again before submission, update this table using the latest terminal output.*

## 5. Browser Verification

The application was also checked through its browser interface to verify that the primary user workflows were accessible and functioning.

### 5.1 Results

| No. | Verification performed | Result |
|---:|---|---|
| 1 | Browse items and view reports | PASS |
| 2 | Open the login panel using the Sign In button | PASS |
| 3 | Register an account and log in | PASS |
| 4 | Navigate to the report submission form | PASS |
| 5 | View personal reports in My Reports | PASS |
| 6 | Resolve a report | PASS |
| 7 | Sign out | PASS |

### 5.2 Summary

| Metric | Result |
|---|---:|
| Browser verification checks | 7 |
| Passed | 7 |
| Failed | 0 |

**Outcome: All seven recorded browser verification checks passed.**

These checks verify the main user-facing workflows. They are separate from the automated backend test suite and do not replace individually recorded results for all 12 test cases in Section 3.

## 6. Defect Reporting

Any defect discovered during testing should be documented using the following information:

| Field | Description |
|---|---|
| Defect ID | Unique identifier for the defect |
| Related Test Case | Test case in which the defect occurred |
| Steps to Reproduce | Actions required to reproduce the issue |
| Expected Result | Intended application behaviour |
| Actual Result | Observed application behaviour |
| Corrective Action | Fix applied, if any |
| Retest Result | Outcome after applying the fix |

No defect should be marked as resolved until the corrective change has been retested.

## 7. Testing Summary

The recorded testing results demonstrate successful execution of the automated backend test suite and the browser verification checklist.

- **Automated backend testing:** 14 passed, 0 failed.
- **Browser verification:** 7 passed, 0 failed.
- **Detailed manual test plan:** 12 test cases documented; individual execution results are not fully recorded in this report.

The automated and browser results provide evidence that the application's principal workflows have been verified. The remaining documentation task is to record individual manual test outcomes where required and confirm the final results before submission.

## 8. Conclusion

Testing of the Campus Lost & Found Portal covered core functionality, including account management, report browsing, search and filtering, report submission, personal report management, report resolution, and access control.

The recorded automated backend tests and browser verification checks completed successfully. The test-case plan provides a structured basis for further verification and defect tracking.

The project is ready for final testing documentation once any outstanding individual test results have been recorded and the report has been checked against the final application build.
