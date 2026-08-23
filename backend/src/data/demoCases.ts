export interface DemoCase {
  id: string;
  title: string;
  category: 'High Risk Scam' | 'Verified Legitimate' | 'Ambiguous Offer' | 'Scholarship Fraud';
  badge: 'HIGH RISK' | 'LOW RISK' | 'NEEDS VERIFICATION';
  description: string;
  content: string;
}

export const DEMO_CASES: DemoCase[] = [
  {
    id: 'demo-1-fake-internship',
    title: 'Deceptive Enterprise Internship (TCS Impersonation)',
    category: 'High Risk Scam',
    badge: 'HIGH RISK',
    description: 'Impersonates TCS with ₹2,999 registration fee, Gmail address, 24h deadline, and Telegram onboarding.',
    content: `CONGRATULATIONS! YOU HAVE BEEN SELECTED!

Dear Candidate,
We are pleased to inform you that you have been directly shortlisted and selected for the position of Software Development & AI Intern at Tata Consultancy Services (TCS).

Internship Highlights:
- Role: AI & Python Development Intern
- Stipend: INR 45,000 per month
- Work Mode: Remote / Work From Home
- Duration: 3 Months

Important Instructions for Onboarding:
As per our updated campus hiring policy, all selected candidates must deposit a one-time refundable security and training fee of INR 2,999 towards your developer training kit and cloud credentials setup. This amount is 100% refundable with your first monthly stipend.

Required Documents for Immediate Dispatch:
Please upload your Aadhaar Card, PAN Card, and Bank Account Details for direct stipend setup.

DEADLINE: You must complete the registration fee payment within 24 hours of receiving this offer letter to reserve your slot. Only 3 slots left for this batch.

Payment & Verification:
Please contact our HR coordinator on Telegram: @TCS_Campus_Recruiter or reply with your payment receipt to hr.tcsinternships2026@gmail.com.

Best Regards,
Rajesh Sharma
Talent Acquisition Team
Tata Consultancy Services
Website: https://tcs.com`
  },
  {
    id: 'demo-2-legitimate-offer',
    title: 'Verified Software Engineering Internship (Google)',
    category: 'Verified Legitimate',
    badge: 'LOW RISK',
    description: 'Authentic enterprise internship through official ATS portal with standard interview rounds and $0 candidate fee.',
    content: `Google LLC — Software Engineering Internship (Summer 2026)

Position: Software Engineering Intern
Location: Bangalore, Karnataka, India / Hybrid
Application Requisition ID: #G-SWE-2026-IN

Thank you for your interest in joining Google. We are pleased to invite you to participate in our standard University Graduate Internship technical assessment process.

Selection Process & Interview Stages:
1. Online Coding Assessment (Google Assessment Platform)
2. Technical Interview Round 1 (Data Structures, Algorithms, Complexity Analysis)
3. Technical Interview Round 2 (System Design & Code Quality)
4. Hiring Manager & Team Matching Discussion

Compensation & Benefits:
- Monthly Stipend: INR 1,10,000 per month + standard corporate housing assistance
- Hardware: Enterprise MacBook Pro provisioned and shipped directly by Google IT at zero cost to the candidate.

Security & Equal Opportunity Notice:
Google is an Equal Opportunity Employer. Google NEVER requests application fees, security deposits, training charges, or processing money at any stage of the recruitment process. All official communications will originate exclusively from authenticated @google.com email domains.

To review your application status or schedule your coding assessment round, please log into your Google Careers Candidate Portal:
https://careers.google.com/applications/swe-intern-2026

Warm regards,
Ananya Sen
University Recruiting & Talent Operations
Google India Private Limited
Email: ananya.sen@google.com`
  },
  {
    id: 'demo-3-ambiguous-freelance',
    title: 'Ambiguous Startup Web Development Project',
    category: 'Ambiguous Offer',
    badge: 'NEEDS VERIFICATION',
    description: 'Vague freelance offer with minimal company footprint, personal email, but no immediate financial extortion.',
    content: `Hey there!
I saw your profile on GitHub and wanted to reach out regarding a fast-track project for our early-stage stealth startup, NexaCraft Studios.

We are looking for a freelance React & Node.js developer to help build our client landing page and dashboard over the next 3 weeks.
- Compensation: $400 for completing the milestone tasks.
- Timeline: Start next Monday.
- Communication: Slack or email.

Please reply to nexacraft.stealth@gmail.com with your portfolio links and let me know if you are available to take this up. We do not have a public website launched yet since we are in private beta.

Cheers,
Mark
Founder, NexaCraft Studios`
  },
  {
    id: 'demo-4-scholarship-fraud',
    title: 'Global Fellowship & Grant Advance-Fee Scam',
    category: 'Scholarship Fraud',
    badge: 'HIGH RISK',
    description: 'Fake international grant requiring $350 disbursement clearance fee and passport scans.',
    content: `INTERNATIONAL SCHOLARSHIP FOUNDATION & GLOBAL RESEARCH GRANTS (GENEVA / NEW YORK)

OFFICIAL GRANT NOTIFICATION — REFERENCE #ISF-2026-9918

Attention: Beneficiary
We are pleased to notify you that your profile has been approved for the 2026 Global Academic Innovation Grant in the amount of $10,000 USD.

Selection Criteria:
Selected through International Academic Merit Draw without examination.

Disbursement Requirements:
To release your $10,000 wire transfer, international anti-money laundering regulations require an upfront foreign currency conversion and disbursement clearance fee of $350 USD to be transferred via Western Union or Crypto USDT to our accredited escrow agent.

Mandatory Verification:
You must submit a full scan of your International Passport, Bank Statement, and Account Login verification within 48 hours to prevent grant forfeiture.

Contact:
Dr. Arthur Pendelton
Grant Administrator
Email: grant.disbursement@scholarship-global-fund.org
Chat Support: https://t.me/ISF_Grant_Disbursement`
  }
];
