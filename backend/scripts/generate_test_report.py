from datetime import datetime
from html import escape
from pathlib import Path
import sys
import xml.etree.ElementTree as ET

BASE_DIR = Path(__file__).resolve().parent.parent
XML_FILE = BASE_DIR / "reports" / "junit.xml"
HTML_FILE = BASE_DIR / "reports" / "test-report.html"

# The keys must match the pytest test function names.
TEST_CATALOG = {
    "test_register_success": {
        "id": "TC-01",
        "condition": "Submit valid name, email, and password for a new account.",
        "expected": "Account is created successfully and a success response is returned.",
    },
    "test_duplicate_registration": {
        "id": "TC-02",
        "condition": "Register again using an email address that already exists.",
        "expected": "Registration is rejected with an appropriate conflict response.",
    },
    "test_login_success": {
        "id": "TC-03",
        "condition": "Log in using valid account credentials.",
        "expected": "Login succeeds and returns the authenticated user's information and token.",
    },
   "test_login_wrong_password": {
    	"id": "TC-04",
    	"condition": "Attempt to log in using a registered email address and an incorrect password.",
    	"expected": "Login is rejected with an unauthorized response.",
    },
    "test_protected_endpoint_without_token": {
        "id": "TC-05",
        "condition": "Request a protected endpoint without an authentication token.",
        "expected": "Access is rejected with an unauthorized response.",
    },
    "test_create_item_success": {
        "id": "TC-06",
        "condition": "Submit a valid lost-or-found item report while authenticated.",
        "expected": "The report is created and the API returns a successful creation response.",
    },
    "test_create_item_without_token": {
        "id": "TC-07",
        "condition": "Attempt to create an item report without an authentication token.",
        "expected": "The API rejects the request as unauthorized.",
    },
    "test_search_items": {
        "id": "TC-08",
        "condition": "Search item reports using a keyword present in a report.",
        "expected": "Matching reports are returned.",
    },
    "test_filter_found": {
        "id": "TC-09",
        "condition": "Filter reports by type Found when the test database contains no Found reports.",
        "expected": "The API returns an empty result list.",
    },
    "test_invalid_report_type": {
        "id": "TC-10",
        "condition": "Submit an item report with an invalid report type.",
        "expected": "The API rejects the invalid input with a client-error response.",
    },
     "test_filter_items_by_type": {
    "id": "TC-09",
    "condition": "Filter item reports by report type, such as Lost or Found.",
    "expected": "Only reports matching the selected report type are returned.",
},
"test_get_item_details": {
    "id": "TC-11",
    "condition": "Request the details of an existing item report.",
    "expected": "The API returns HTTP 200 and the correct report details.",
},
"test_my_items_returns_own_reports": {
    "id": "TC-12",
    "condition": "Request the reports created by the authenticated user.",
    "expected": "The API returns the user's own reports and the correct count.",
},
"test_resolve_own_item": {
    "id": "TC-13",
    "condition": "The creator marks their own report as resolved.",
    "expected": "The API returns HTTP 200 and the report status becomes Resolved.",
},
"test_user_cannot_resolve_another_users_item": {
    "id": "TC-14",
    "condition": "A different authenticated user attempts to resolve someone else's report.",
    "expected": "The API returns HTTP 403 and the original report remains Open.",
},
}


def read_test_cases():
    if not XML_FILE.exists():
        print(f"JUnit results not found: {XML_FILE}")
        print("Run pytest with --junitxml=reports/junit.xml first.")
        sys.exit(1)

    root = ET.parse(XML_FILE).getroot()
    cases = root.findall(".//testcase")

    results = []
    for case in cases:
        name = case.attrib.get("name", "Unknown test")
        duration = float(case.attrib.get("time", "0") or 0)

        failure = case.find("failure")
        error = case.find("error")
        skipped = case.find("skipped")

        if failure is not None:
            status = "FAIL"
            details = failure.attrib.get("message", "") or failure.text or "Assertion failed."
        elif error is not None:
            status = "ERROR"
            details = error.attrib.get("message", "") or error.text or "Test execution error."
        elif skipped is not None:
            status = "SKIPPED"
            details = skipped.attrib.get("message", "") or skipped.text or "Test was skipped."
        else:
            status = "PASS"
            details = "All assertions in this test passed."

        # Match by exact pytest function name.
        info = TEST_CATALOG.get(name, {
            "id": "UNMAPPED",
            "condition": "Add this test to TEST_CATALOG in generate_test_report.py.",
            "expected": "Expected behavior has not yet been documented for this test.",
        })

        results.append({
            "id": info["id"],
            "name": name,
            "condition": info["condition"],
            "expected": info["expected"],
            "actual": details,
            "status": status,
            "duration": duration,
        })

    return results


def main():
    results = read_test_cases()

    total = len(results)
    passed = sum(r["status"] == "PASS" for r in results)
    failed = sum(r["status"] in ("FAIL", "ERROR") for r in results)
    skipped = sum(r["status"] == "SKIPPED" for r in results)
    duration = sum(r["duration"] for r in results)
    pass_rate = (passed / total * 100) if total else 0

    rows = []
    for r in results:
        status_class = r["status"].lower()
        rows.append(f"""
        <tr>
          <td>{escape(r['id'])}</td>
          <td>
            <strong>{escape(r['name'])}</strong>
            <div class="muted">{escape(r['condition'])}</div>
          </td>
          <td>{escape(r['expected'])}</td>
          <td>{escape(r['actual'])}</td>
          <td><span class="status {status_class}">{escape(r['status'])}</span></td>
        </tr>
        """)

    generated_at = datetime.now().astimezone().strftime("%d %b %Y, %I:%M:%S %p %Z")

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Campus Lost &amp; Found Portal — Test Report</title>
<style>
  body {{ font-family: Arial, sans-serif; margin: 0; padding: 28px; color: #202938; background: #f4f6fa; }}
  main {{ max-width: 1400px; margin: auto; }}
  h1 {{ margin-bottom: 6px; }}
  .muted {{ color: #586579; font-size: 13px; margin-top: 7px; line-height: 1.45; }}
  .summary {{ display: grid; grid-template-columns: repeat(4, minmax(130px, 1fr)); gap: 14px; margin: 24px 0; }}
  .metric {{ background: white; padding: 18px; border: 1px solid #e1e6ef; border-radius: 10px; }}
  .metric span {{ display: block; color: #586579; font-size: 13px; }}
  .metric strong {{ display: block; font-size: 28px; margin-top: 8px; }}
  .table-wrap {{ overflow-x: auto; background: white; border: 1px solid #e1e6ef; border-radius: 10px; }}
  table {{ width: 100%; border-collapse: collapse; min-width: 1000px; }}
  th, td {{ text-align: left; padding: 14px; border-bottom: 1px solid #e7ebf2; vertical-align: top; font-size: 14px; line-height: 1.5; }}
  th {{ background: #edf1f7; }}
  .status {{ display: inline-block; padding: 5px 9px; border-radius: 5px; font-weight: bold; font-size: 12px; }}
  .pass {{ background: #e0f6e8; color: #17663a; }}
  .fail, .error {{ background: #fde6e6; color: #9a2020; }}
  .skipped {{ background: #fff1cc; color: #765400; }}
  .note {{ margin-top: 18px; font-size: 13px; color: #586579; }}
  @media (max-width: 700px) {{ body {{ padding: 14px; }} .summary {{ grid-template-columns: repeat(2, minmax(120px, 1fr)); }} }}
</style>
</head>
<body>
<main>
  <h1>Campus Lost &amp; Found Portal</h1>
  <p>Automated Software Testing Report</p>
  <p class="muted">Generated: {escape(generated_at)} · Total execution time: {duration:.2f} seconds</p>

  <section class="summary">
    <div class="metric"><span>Total tests</span><strong>{total}</strong></div>
    <div class="metric"><span>Passed</span><strong>{passed}</strong></div>
    <div class="metric"><span>Failed / errors</span><strong>{failed}</strong></div>
    <div class="metric"><span>Pass rate</span><strong>{pass_rate:.1f}%</strong></div>
  </section>

  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Test ID</th>
          <th>Test / Condition</th>
          <th>Expected Result</th>
          <th>Actual Result</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {''.join(rows) if rows else '<tr><td colspan="5">No test cases were found in the JUnit results.</td></tr>'}
      </tbody>
    </table>
  </div>

  <p class="note">
    Statuses and execution details are derived from the pytest JUnit XML output.
    For passing tests, “All assertions in this test passed” indicates the test
    assertions succeeded; it is not a transcript of the full API response.
    Confirm that each test's condition and expected result match its actual code.
  </p>
</main>
</body>
</html>
"""

    HTML_FILE.write_text(html, encoding="utf-8")
    print(f"HTML report generated: {HTML_FILE}")
    print(f"Total: {total} | Passed: {passed} | Failed/errors: {failed} | Skipped: {skipped}")
    print(f"Pass rate: {pass_rate:.1f}%")


if __name__ == "__main__":
    main()