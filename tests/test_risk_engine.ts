import { extractEntities } from '../backend/src/engine/entityExtractor.js';
import { evaluateScamPatterns } from '../backend/src/engine/patternEngine.js';
import { evaluateOrgConsistency } from '../backend/src/engine/orgConsistency.js';
import { calculatePotentialExposure } from '../backend/src/engine/exposureCalculator.js';
import { evaluateConfidence } from '../backend/src/engine/confidenceEngine.js';
import { aggregateInvestigation } from '../backend/src/engine/riskAggregator.js';
import { DEMO_CASES } from '../backend/src/data/demoCases.js';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, details?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  ❌ [FAIL] ${testName}${details ? ` -> ${details}` : ''}`);
  }
}

function runInvestigation(text: string) {
  const entities = extractEntities(text);
  const signals = evaluateScamPatterns(text, entities);
  const orgConsistency = evaluateOrgConsistency(text, entities);
  const potentialExposure = calculatePotentialExposure(entities, signals);
  const confidence = evaluateConfidence(text, entities, signals, orgConsistency);

  return aggregateInvestigation(
    text,
    'text',
    entities,
    signals,
    orgConsistency,
    potentialExposure,
    confidence.confidenceScore,
    confidence.confidenceRationale,
    confidence.uncertainty
  );
}

console.log(`\n====================================================`);
console.log(`🧪 RUNNING SCAMCHECK INTELLIGENCE ENGINE TEST SUITE`);
console.log(`====================================================\n`);

// Test 1: High Risk Payment Scam (Demo 1)
console.log(`▶ Test Suite 1: Malicious Fake Internship (Advance Fee & Impersonation)`);
const demo1Report = runInvestigation(DEMO_CASES[0].content);
assert(demo1Report.riskTier === 'HIGH RISK', 'Demo 1 classified as HIGH RISK');
assert(demo1Report.riskScore >= 75, `Demo 1 score is high (Got ${demo1Report.riskScore}/100)`);
assert(demo1Report.extractedOpportunity.paymentAmount.includes('2,999'), 'Extracted exact payment amount ₹2,999');
assert(demo1Report.signals.some(s => s.signalId === 'SIG-ADV-01'), 'Detected Upfront Registration Fee signal');
assert(demo1Report.signals.some(s => s.signalId === 'SIG-EML-09'), 'Detected Public Email for Corporate Claim signal');
assert(demo1Report.signals.some(s => s.signalId === 'SIG-URG-06'), 'Detected Urgency Deadline pressure');
assert(demo1Report.evidenceChain.length >= 4, `Evidence chain contains multiple nodes (${demo1Report.evidenceChain.length})`);
assert(demo1Report.recommendedAction.primaryVerdict === 'STOP', 'Recommended action is STOP');

// Test 2: Verified Legitimate Opportunity (Demo 2)
console.log(`\n▶ Test Suite 2: Verified Legitimate Opportunity (Google Summer Internship)`);
const demo2Report = runInvestigation(DEMO_CASES[1].content);
assert(demo2Report.riskTier === 'LOW RISK', 'Demo 2 classified as LOW RISK');
assert(demo2Report.riskScore <= 30, `Demo 2 score is low (Got ${demo2Report.riskScore}/100)`);
assert(demo2Report.signals.some(s => s.signalId === 'SIG-POS-01'), 'Triggered Verified Corporate Domain Match positive signal');
assert(demo2Report.signals.some(s => s.signalId === 'SIG-POS-02'), 'Triggered Verified Enterprise ATS Portal positive signal');
assert(demo2Report.signals.some(s => s.signalId === 'SIG-POS-03'), 'Triggered Documented Multi-Stage Assessment positive signal');
assert(demo2Report.orgConsistency.recruiterDomainStatus === 'OFFICIAL_MATCH', 'Recruiter domain status is OFFICIAL_MATCH');
assert(demo2Report.recommendedAction.primaryVerdict === 'PROCEED_WITH_CAUTION', 'Recommended action is PROCEED_WITH_CAUTION');

// Test 3: Ambiguous Freelance Proposal (Demo 3)
console.log(`\n▶ Test Suite 3: Ambiguous Gig (Uncertainty & Refusal Handling)`);
const demo3Report = runInvestigation(DEMO_CASES[2].content);
assert(demo3Report.riskTier === 'NEEDS VERIFICATION', 'Demo 3 classified as NEEDS VERIFICATION');
assert(demo3Report.uncertainty.isAmbiguous, 'Ambiguity flag correctly set to true');
assert(demo3Report.uncertainty.missingEvidence.length > 0, 'Lists missing evidence items');
assert(demo3Report.recommendedAction.primaryVerdict === 'VERIFY', 'Recommended action is VERIFY');

// Test 4: Scholarship & Grant Fraud (Demo 4)
console.log(`\n▶ Test Suite 4: Scholarship Advance-Fee Extortion`);
const demo4Report = runInvestigation(DEMO_CASES[3].content);
assert(demo4Report.riskTier === 'HIGH RISK', 'Demo 4 classified as HIGH RISK');
assert(demo4Report.signals.some(s => s.signalId === 'SIG-ADV-01'), 'Detected Disbursement Clearance Fee extortion');
assert(demo4Report.potentialExposure.financialLevel === 'CRITICAL', 'Financial exposure evaluated as CRITICAL');

// Test 5: Credential Harvesting Vector
console.log(`\n▶ Test Suite 5: Direct Credential & OTP Harvesting`);
const credPayload = `Please provide your NetBanking OTP and account password to hr@company-verify.com to authorize direct deposit.`;
const credReport = runInvestigation(credPayload);
assert(credReport.signals.some(s => s.signalId === 'SIG-CRD-04'), 'Detected Credential / OTP Harvesting signal');
assert(credReport.potentialExposure.credentialLevel === 'CRITICAL', 'Credential exposure evaluated as CRITICAL');

// Test 6: Task / Video Rating Scheme
console.log(`\n▶ Test Suite 6: Task-Based YouTube/TikTok Rating Scam`);
const taskPayload = `Earn Rs 3000 daily by simply like youtube videos and rating hotels on google maps. Send your whatsapp number for daily commission.`;
const taskReport = runInvestigation(taskPayload);
assert(taskReport.signals.some(s => s.signalId === 'SIG-TSK-16'), 'Detected Task-Based Rating / Prepaid Commission Scam Signature');
assert(taskReport.riskTier === 'HIGH RISK', 'Task scam classified as HIGH RISK');

// Test 7: Hardware & Laptop Courier Deposit Scam
console.log(`\n▶ Test Suite 7: Hardware / Laptop Courier Deposit Scheme`);
const equipPayload = `You have been selected as Remote Data Analyst. Please deposit ₹4,500 laptop deposit for shipping your corporate MacBook.`;
const equipReport = runInvestigation(equipPayload);
assert(equipReport.signals.some(s => s.signalId === 'SIG-EQP-03'), 'Detected Hardware / Kit Deposit Demand signal');

// Test 8: Empty / Minimal Edge Case
console.log(`\n▶ Test Suite 8: Minimal Text Edge Case`);
const minimalReport = runInvestigation(`Hiring developers for project.`);
assert(minimalReport.confidenceScore < 60, 'Low confidence on minimal text');
assert(minimalReport.uncertainty.isAmbiguous, 'Triggers uncertainty on minimal text');

console.log(`\n====================================================`);
console.log(`📊 TEST RESULTS: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
console.log(`====================================================\n`);

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log(`🎉 ALL INTELLIGENCE ENGINE TESTS PASSED PERFECTLY!\n`);
  process.exit(0);
}
