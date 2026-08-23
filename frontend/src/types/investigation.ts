export type OpportunityType =
  | 'Internship'
  | 'Full-time Job'
  | 'Part-time Job'
  | 'Freelance Project'
  | 'Scholarship / Grant'
  | 'Training / Bootcamp'
  | 'Research Program'
  | 'Unspecified';

export type SignalSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO' | 'POSITIVE';

export type SignalCategory =
  | 'FINANCIAL'
  | 'IDENTITY'
  | 'COMMUNICATION'
  | 'PROCEDURE'
  | 'CONSISTENCY'
  | 'PSYCHOLOGICAL'
  | 'TRUST';

export type RiskTier = 'LOW RISK' | 'NEEDS VERIFICATION' | 'HIGH RISK';

export type ExposureLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';

export interface ExtractedOpportunity {
  organization: string;
  recruiter: string;
  recruiterEmail: string;
  phoneNumber: string;
  website: string;
  opportunityUrl: string;
  opportunityType: OpportunityType;
  jobTitle: string;
  salaryStipend: string;
  paymentAmount: string;
  paymentPurpose: string;
  deadlines: string;
  requestedDocuments: string[];
  requestedCredentials: string[];
  location: string;
  communicationPlatform: string;
  applicationMethod: string;
  claims: string[];
}

export interface ScamSignal {
  signalId: string;
  name: string;
  severity: SignalSeverity;
  category: SignalCategory;
  evidence: string;
  weight: number;
  whyItMatters: string;
  mitigation: string;
}

export interface EvidenceNode {
  id: string;
  finding: string;
  evidenceQuote: string;
  whyItMatters: string;
  riskContribution: number;
  severity: SignalSeverity;
  category: SignalCategory;
}

export interface OrgConsistencyVector {
  orgIdentityStatus: 'VERIFIED' | 'DETECTED' | 'AMBIGUOUS' | 'UNRESOLVED';
  orgIdentityNotes: string;
  officialDomainStatus: 'MATCHED' | 'DETECTED' | 'UNVERIFIED' | 'MISSING';
  officialDomainNotes: string;
  recruiterDomainStatus:
    | 'OFFICIAL_MATCH'
    | 'PUBLIC_FREE_EMAIL'
    | 'DOMAIN_MISMATCH'
    | 'ANONYMOUS_CHANNEL'
    | 'UNSPECIFIED';
  recruiterDomainNotes: string;
  contactPlatformStatus:
    | 'ENTERPRISE_ATS'
    | 'OFFICIAL_EMAIL'
    | 'DIRECT_PHONE'
    | 'UNOFFICIAL_CHAT_APP'
    | 'UNSPECIFIED';
  contactPlatformNotes: string;
  recruitmentWorkflowStatus:
    | 'STANDARD_MULTI_STAGE'
    | 'INFORMAL_DIRECT'
    | 'NO_INTERVIEW_INSTANT_OFFER'
    | 'PAYMENT_GATED'
    | 'UNSPECIFIED';
  recruitmentWorkflowNotes: string;
  overallConsistency: 'STRONG_ALIGNMENT' | 'PARTIAL_INCONSISTENCY' | 'SEVERE_MISMATCH' | 'INSUFFICIENT_DATA';
}

export interface PotentialExposure {
  financialAmount: string;
  financialLevel: ExposureLevel;
  financialNotes: string;
  credentialLevel: ExposureLevel;
  credentialNotes: string;
  identityLevel: ExposureLevel;
  identityNotes: string;
  employmentLevel: ExposureLevel;
  employmentNotes: string;
  privacyLevel: ExposureLevel;
  privacyNotes: string;
}

export interface RecommendedAction {
  primaryVerdict: 'STOP' | 'VERIFY' | 'PROCEED_WITH_CAUTION';
  headline: string;
  actionSteps: string[];
  safetyTips: string[];
  officialVerificationGuide: string[];
}

export interface UncertaintyHandling {
  isAmbiguous: boolean;
  refusalExplanation?: string;
  missingEvidence: string[];
  guidanceToAcquire: string[];
}

export interface InvestigationReport {
  id: string;
  timestamp: string;
  inputSnippet: string;
  inputMode: 'text' | 'document' | 'image' | 'url';
  riskScore: number;
  riskTier: RiskTier;
  confidenceScore: number;
  confidenceRationale: string;
  executiveAssessment: string;
  extractedOpportunity: ExtractedOpportunity;
  signals: ScamSignal[];
  evidenceChain: EvidenceNode[];
  orgConsistency: OrgConsistencyVector;
  potentialExposure: PotentialExposure;
  recommendedAction: RecommendedAction;
  uncertainty: UncertaintyHandling;
  disclaimer: string;
}

export interface ComparisonReport {
  id: string;
  timestamp: string;
  itemA: InvestigationReport;
  itemB: InvestigationReport;
  deltaSummary: {
    riskDelta: number;
    saferOption: 'A' | 'B' | 'EQUAL';
    keyDifferences: string[];
    recommendation: string;
  };
}

export interface DemoCase {
  id: string;
  title: string;
  category: 'High Risk Scam' | 'Verified Legitimate' | 'Ambiguous Offer' | 'Scholarship Fraud';
  badge: 'HIGH RISK' | 'LOW RISK' | 'NEEDS VERIFICATION';
  description: string;
  content: string;
}
