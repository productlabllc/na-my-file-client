interface acceptedDocumentType {
  documentGroup: string;
  documentName: string;
}

export const acceptedDocuments = <acceptedDocumentType[]>[
  { documentGroup: 'Identity', documentName: 'Birth Certificate' },
  { documentGroup: 'Identity', documentName: 'Driver’s License' },
  { documentGroup: 'Identity', documentName: 'Military ID' },
  { documentGroup: 'Identity', documentName: 'Social Security Card' },
  { documentGroup: 'Identity', documentName: 'Tax ID (ITIN)' },
  { documentGroup: 'Identity', documentName: 'State-Issued ID' },
  { documentGroup: 'Identity', documentName: 'Passport' },
  { documentGroup: 'Identity', documentName: 'Green Card' },
  { documentGroup: 'Identity', documentName: 'Picture Employment ID' },
  { documentGroup: 'Employment Income', documentName: '1099' },
  {
    documentGroup: 'Employment Income',
    documentName: 'Bank Statement that show deposits'
  },
  { documentGroup: 'Employment Income', documentName: 'Credit Card Statement' },
  { documentGroup: 'Employment Income', documentName: 'Income Statement' },
  { documentGroup: 'Employment Income', documentName: 'Paystub' },
  {
    documentGroup: 'Employment Income',
    documentName: 'Tax Return (federal and/or state)'
  },
  { documentGroup: 'Employment Income', documentName: 'W2' },
  {
    documentGroup: 'Employment Income',
    documentName: 'Notarized letters from employers'
  },
  { documentGroup: 'Employment Income', documentName: 'Form 1040' },
  { documentGroup: 'Employment Income', documentName: 'Other (describe)' },
  {
    documentGroup: 'Other Income',
    documentName:
      'Valid Section 8 transfer voucher or proof of another rental subsidy'
  },
  {
    documentGroup: 'Other Income',
    documentName: 'Social Security Award letter'
  },
  {
    documentGroup: 'Other Income',
    documentName: "Veteran's Benefits (annual documentation)"
  },
  {
    documentGroup: 'Other Income',
    documentName: 'Income from rental properties'
  },
  {
    documentGroup: 'Other Income',
    documentName: 'Public Assistance budget letter'
  },
  {
    documentGroup: 'Other Income',
    documentName: 'Armed Forces Reserves'
  },
  {
    documentGroup: 'Other Income',
    documentName: 'Pension letter'
  },
  {
    documentGroup: 'Other Income',
    documentName:
      'Unemployment Payment history from NYS Department of Labor Online System'
  },
  {
    documentGroup: 'Other Income',
    documentName:
      'Copies of dividend and/or annuities statements from issuing institution(s)'
  },
  {
    documentGroup: 'Assets',
    documentName: 'Completed Asset Certification (Attachment T)'
  },
  {
    documentGroup: 'Assets',
    documentName: '6 months of statements for checking accounts'
  },
  {
    documentGroup: 'Assets',
    documentName:
      'Most recent statement for all other savings/retirement/investment accounts'
  },
  {
    documentGroup: 'Proof of alimony and/or child support',
    documentName:
      'Copies of separation or settlement agreement(s) stating the amount and type of support and payment schedule'
  },
  {
    documentGroup: 'Proof of alimony and/or child support',
    documentName:
      'Copies of any official statement or print-out (dated within the last 120 days and showing activity and amounts)'
  },
  {
    documentGroup: 'Proof of alimony and/or child support',
    documentName:
      'Notarized affidavit of frequency and amount, by the payer and/or recipient'
  },
  {
    documentGroup: 'Benefits',
    documentName: 'Benefit Award Letter'
  },
  {
    documentGroup: 'Benefits',
    documentName: 'EBT Card'
  },
  {
    documentGroup: 'Benefits',
    documentName: 'Military'
  },
  {
    documentGroup: 'Proof of residence',
    documentName: 'Signed universal ROI '
  },
  {
    documentGroup: 'Proof of residence',
    documentName: 'Lease'
  },
  {
    documentGroup: 'Proof of residence',
    documentName: 'Mortgage'
  },
  {
    documentGroup: 'Proof of residence',
    documentName: 'Telephone Bill'
  },
  {
    documentGroup: 'Proof of residence',
    documentName: 'Utility Bill'
  },
  {
    documentGroup: 'Healthcare',
    documentName: 'Doctor’s Note'
  },
  {
    documentGroup: 'Healthcare',
    documentName: 'Insurance Card'
  },
  {
    documentGroup: 'Healthcare',
    documentName: 'Prescription'
  },
  {
    documentGroup: 'Healthcare',
    documentName: 'Proof of Insurance'
  },
  {
    documentGroup: 'Healthcare',
    documentName: 'Vaccine Records'
  },
  {
    documentGroup: 'Education',
    documentName: 'Diploma'
  },
  {
    documentGroup: 'Education',
    documentName: 'Education Record'
  },
  {
    documentGroup: 'Education',
    documentName: 'GED'
  },
  {
    documentGroup: 'Education',
    documentName: 'Professional Certificate'
  },
  {
    documentGroup: 'Legal',
    documentName: 'Proof of disability accommodation needs'
  },
  {
    documentGroup: 'Legal',
    documentName: 'Proof of custody'
  },
  {
    documentGroup: 'Legal',
    documentName: 'Marriage or domestic partnership certificate'
  },
  {
    documentGroup: 'Other',
    documentName: 'Other'
  }
];
