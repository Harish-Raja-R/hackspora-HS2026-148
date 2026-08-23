import {
  InvestigationReport,
  RiskTier,
  ExtractedOpportunity,
  ScamSignal,
  EvidenceNode,
  OrgConsistencyVector,
  PotentialExposure,
  RecommendedAction,
  UncertaintyHandling
} from './types.js';

export function aggregateInvestigation(
  inputSnippet: string,
  inputMode: 'text' | 'document' | 'image' | 'url',
  entities: ExtractedOpportunity,
  signals: ScamSignal[],
  orgConsistency: OrgConsistencyVector,
  potentialExposure: PotentialExposure,
  confidenceScore: number,
  confidenceRationale: string,
  uncertainty: UncertaintyHandling
): InvestigationReport {
  // 1. Calculate Weighted Risk Score
  let rawScore = 10; // baseline ambient risk

  for (const signal of signals) {
    rawScore += signal.weight;
  }

  // If critical scam vectors detected, ensure score reaches HIGH RISK tier floor
  const hasCriticalScam = signals.some((s) => s.severity === 'CRITICAL');
  if (hasCriticalScam) {
    rawScore = Math.max(rawScore, 65);
  }

  // If severe mismatch detected in consistency matrix, ensure appropriate risk floor
  if (orgConsistency.overallConsistency === 'SEVERE_MISMATCH') {
    rawScore = Math.max(rawScore, 65);
  }

  // If ambiguous/sparse and no critical signals found, settle in Needs Verification zone
  if (uncertainty.isAmbiguous && !hasCriticalScam) {
    rawScore = Math.min(rawScore, 52);
    rawScore = Math.max(rawScore, 35);
  }

  // Bound to 0 - 100
  const riskScore = Math.max(0, Math.min(100, Math.round(rawScore)));

  // 2. Classify Risk Tier
  let riskTier: RiskTier = 'LOW RISK';
  if (riskScore >= 61) {
    riskTier = 'HIGH RISK';
  } else if (riskScore >= 31) {
    riskTier = 'NEEDS VERIFICATION';
  } else {
    riskTier = 'LOW RISK';
  }

  // 3. Assemble Evidence Chain Nodes
  const evidenceChain: EvidenceNode[] = signals.map((s, idx) => ({
    id: `EV-NODE-${idx + 1}`,
    finding: s.name,
    evidenceQuote: s.evidence,
    whyItMatters: s.whyItMatters,
    riskContribution: s.weight,
    severity: s.severity,
    category: s.category
  }));

  // 4. Formulate Tier-Specific Recommended Action Playbook
  let recommendedAction: RecommendedAction;

  if (riskTier === 'HIGH RISK') {
    recommendedAction = {
      primaryVerdict: 'STOP',
      headline: 'CRITICAL THREAT DETECTED: Cease Engagement Immediately',
      actionSteps: [
        'DO NOT transfer any funds, registration fees, laptop deposits, or training charges.',
        'DO NOT share OTPs, banking credentials, UPI PINs, or national identity card scans (Aadhaar/PAN/SSN).',
        'Cease communication across unofficial channels (Telegram, WhatsApp, SMS).',
        'Verify the opportunity independently by navigating directly to the official company careers portal.',
        'Report the fraudulent recruiter profile and contact handles to cybercrime authorities and the host platform.'
      ],
      safetyTips: [
        'Real employers fund candidate onboarding and never request upfront payments.',
        'Official recruiters exclusively use corporate domain emails (e.g. @google.com, @tcs.com).',
        'Urgent deadlines (24-48 hours) are manufactured to inhibit logical verification.'
      ],
      officialVerificationGuide: [
        `Visit ${entities.website !== 'Not detected' ? entities.website : 'the official organization website'} directly via browser.`,
        'Look up the company talent acquisition office phone number via official directory.',
        'Cross-reference the job requisition ID on LinkedIn Jobs or official ATS portal.'
      ]
    };
  } else if (riskTier === 'NEEDS VERIFICATION') {
    recommendedAction = {
      primaryVerdict: 'VERIFY',
      headline: 'CAUTION: Unverified Attributes Require Independent Confirmation',
      actionSteps: [
        'Request the recruiter to send an official verification email from their corporate @domain.com address.',
        'Check whether this exact role/internship title is listed on the organization official careers page.',
        'Do not submit sensitive financial documents or government IDs until authenticity is verified.',
        'Insist on a video or in-person interview with technical team members before signing agreements.',
        'If freelance, request milestone escrow protection through recognized platforms (Upwork, Contra).'
      ],
      safetyTips: [
        'Partial inconsistency or lack of verifiable web footprint does not confirm malice, but demands diligence.',
        'Never accept unverified Google Forms or direct messaging offers without formal offer letters.'
      ],
      officialVerificationGuide: [
        'Search the recruiter profile on LinkedIn and verify current tenure with the claimed company.',
        'Contact the organization HR desk via official switchboard to verify active recruitment campaigns.'
      ]
    };
  } else {
    recommendedAction = {
      primaryVerdict: 'PROCEED_WITH_CAUTION',
      headline: 'VERIFIED SIGNATURE: Standard Hiring Pipeline Detected',
      actionSteps: [
        'Proceed through the standard corporate recruitment workflow and scheduled assessments.',
        'Ensure all subsequent communication remains on authenticated corporate domain channels.',
        'Never disclose sensitive bank login credentials or passwords at any stage of hiring.',
        'Review the written employment contract and compensation details carefully before signing.'
      ],
      safetyTips: [
        'Even in legitimate recruitment, monitor for sudden deviations such as third-party payment requests.',
        'Verify offer letters by checking cryptographic signatures or internal HR verification codes.'
      ],
      officialVerificationGuide: [
        'Track your application status inside the company candidate portal (Greenhouse, Workday, Lever).'
      ]
    };
  }

  // 5. Formulate Concise Executive Assessment
  let executiveAssessment = '';
  if (riskTier === 'HIGH RISK') {
    const criticalCount = signals.filter((s) => s.severity === 'CRITICAL').length;
    executiveAssessment = `Investigation classified this opportunity as HIGH RISK (${riskScore}/100) with ${confidenceScore}% assessment confidence. Detected ${signals.length} threat indicators, including ${criticalCount} critical fraud vectors (${signals.slice(0, 2).map((s) => s.name).join(', ')}). The hiring pattern exhibits classic deception mechanics. Immediate disengagement is advised.`;
  } else if (riskTier === 'NEEDS VERIFICATION') {
    executiveAssessment = `Investigation classified this opportunity as NEEDS VERIFICATION (${riskScore}/100) with ${confidenceScore}% confidence. While no direct financial extortion was triggered, the submission exhibits inconsistencies or lacks cryptographic proof of corporate authorization. Independent cross-verification through official corporate channels is strongly recommended before sharing personal data.`;
  } else {
    executiveAssessment = `Investigation classified this opportunity as LOW RISK (${riskScore}/100) with ${confidenceScore}% confidence. Opportunity attributes align with legitimate enterprise talent acquisition standards, verified domain infrastructure, and conventional screening protocols with zero candidate financial liability.`;
  }

  const reportId = `SC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  return {
    id: reportId,
    timestamp: new Date().toISOString(),
    inputSnippet: inputSnippet.length > 300 ? inputSnippet.substring(0, 297) + '...' : inputSnippet,
    inputMode,
    riskScore,
    riskTier,
    confidenceScore,
    confidenceRationale,
    executiveAssessment,
    extractedOpportunity: entities,
    signals,
    evidenceChain,
    orgConsistency,
    potentialExposure,
    recommendedAction,
    uncertainty,
    disclaimer:
      'ScamCheck provides algorithmic risk indicators and intelligence signals based on submitted evidence, not definitive legal proof of fraud. High-impact academic, financial, and career decisions should always be cross-referenced with independent primary sources.'
  };
}
