\# Campus Lost \& Found Portal

\## Software Testing and Test-Case Report



\## 1. Purpose



This document describes the test cases used to verify the functional behaviour of the Campus Lost \& Found Portal. Testing covers account management, browsing and searching, report creation, report retrieval, report resolution, and access control.



The test cases are intended to be executed against the running application. Actual results and final statuses must be recorded after execution.



\## 2. Testing Environment



| Component | Details |

|---|---|

| Frontend | React, TypeScript, Vite |

| Backend | Python, Flask |

| Database | SQLite |

| Authentication | JWT |

| Automated testing framework | pytest |

| Test environment | Local development environment |



Record the actual operating system, browser, and software versions used for the final demonstration if required by the evaluator.



\## 3. Test Cases



\*\*Status legend:\*\* PASS = actual result matches expected result; FAIL = actual result differs; NOT RUN = not yet executed.



| Test ID | Test Scenario | Test Procedure / Input | Expected Result | Actual Result | Status |

|---|---|---|---|---|---|

| TC-01 | User registration | Register using valid, previously unused account details. | Account is created successfully. | To be recorded | NOT RUN |

| TC-02 | User login | Sign in using valid registered credentials. | User is authenticated and signed in. | To be recorded | NOT RUN |

| TC-03 | Invalid login | Enter an incorrect password for an existing account. | Login is rejected and an appropriate error is displayed. | To be recorded | NOT RUN |

| TC-04 | Browse item reports | Open the Browse Items section. | Available item reports are displayed. | To be recorded | NOT RUN |

| TC-05 | Search and filter | Enter a search term or select an available filter. | The displayed results match the selected search criteria. | To be recorded | NOT RUN |

| TC-06 | Create report | Sign in and submit a report with valid required fields. | The report is saved and the interface reflects the successful submission. | To be recorded | NOT RUN |

| TC-07 | Unauthenticated report creation | Sign out and attempt to access the report submission workflow. | The application requests authentication before report submission. | To be recorded | NOT RUN |

| TC-08 | View own reports | Sign in and open My Reports. | Reports created by the signed-in user are displayed. | To be recorded | NOT RUN |

| TC-09 | Resolve own report | Sign in as the creator of an eligible open report and mark it resolved. | The report status changes to Resolved. | To be recorded | NOT RUN |

| TC-10 | Unauthorized report resolution | Sign in as a different user and attempt to resolve another user's report. | The backend rejects the unauthorized operation. | To be recorded | NOT RUN |

| TC-11 | Invalid report data | Submit a report with missing or invalid required fields. | Invalid input is rejected and an appropriate error is returned. | To be recorded | NOT RUN |

| TC-12 | Sign out | Sign out from an authenticated session. | The user is signed out and protected operations require authentication again. | To be recorded | NOT RUN |



\## 4. Automated Backend Testing



The backend includes automated tests in `backend/tests`.



Run the test suite from the project root:



```powershell

python -m pytest .\\backend\\tests -v

```



Record the actual summary reported by pytest:



\- Total tests executed: To be recorded.

\- Tests passed: To be recorded.

\- Tests failed: To be recorded.

\- Tests skipped: To be recorded, if applicable.



Existing test reports may be available under `backend/reports/`. Confirm that they correspond to the latest test run before including them in the submission.



\## 5. Test Execution Summary



Complete this section after running the tests.



| Metric | Result |

|---|---|

| Total manual test cases | 12 |

| Manual test cases executed | To be recorded |

| Manual test cases passed | To be recorded |

| Manual test cases failed | To be recorded |

| Automated test results | To be recorded |


## Automated Backend Test Results

The backend automated test suite was executed using pytest.

Metric	Result
Total tests executed	14
Passed	14
Failed	0
Warnings	0
Execution time	3.91 seconds

**Result:** All 14 automated backend tests passed successfully, with no test failures.

**Note:** The test run produced 17 warnings related to the JWT signing key being shorter than the recommended length. These warnings should be resolved before final submission.


\## 6. Defect Recording



If a test fails, record:



\- Defect ID.

\- Related test case.

\- Steps to reproduce the problem.

\- Expected result.

\- Actual result.

\- Fix applied, if any.

\- Retest result.



Do not mark a failed test as passed until the fix has been verified.



\## 7. Conclusion



The test-case report provides a structured approach to verifying the Campus Lost \& Found Portal. Functional testing checks the primary user workflows, while access-control testing checks whether protected operations are restricted appropriately.



The final testing conclusion should be completed only after the relevant test cases have been executed and their results recorded.

## Browser Verification Results

**Overall result: 7/7 checks passed**

| No. | Test performed | Result |
|---:|---|---|
| 1 | Browse items and view reports | PASS |
| 2 | Sign in button opens the login panel | PASS |
| 3 | Register an account and log in | PASS |
| 4 | Report an item navigation and form access | PASS |
| 5 | View personal reports in My Reports | PASS |
| 6 | Resolve a report | PASS |
| 7 | Sign out | PASS |

**Summary:** All seven browser verification checks were completed successfully. No failures were reported.

**Note:** These results reflect the browser checks performed during verification. They do not replace the separate automated backend test results.



