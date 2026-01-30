import React from 'react';
import DigitalTwin from './DigitalTwin';

// Demo component with sample data for hackathon presentation
const DigitalTwinDemo: React.FC = () => {
  // Sample risk assessment data for demo
  const demoRiskAssessment = {
    diabetes: { risk: 'HIGH', score: 75, trend: 'RISING', nextScreening: '1 month' },
    cardiovascular: { risk: 'MODERATE', score: 45, trend: 'STABLE', nextScreening: '3 months' },
    kidney: { risk: 'MODERATE', score: 35, trend: 'RISING', nextScreening: '2 months' },
    liver: { risk: 'HIGH', score: 80, trend: 'CRITICAL', nextScreening: '2 weeks' }
  };

  // Sample health records for demo
  const demoHealthRecords = [
    {
      id: 'demo-1',
      date: new Date().toLocaleDateString(),
      rawDate: new Date(),
      type: 'Comprehensive Metabolic Panel + Lipid Panel',
      status: 'Critical - Immediate Attention Required',
      riskScore: 45,
      fullData: {
        diagnosis: [
          {
            condition: 'Type 2 Diabetes Mellitus',
            confidenceLevel: 'High',
            description: 'Severely elevated glucose and HbA1c indicating poor glycemic control'
          },
          {
            condition: 'Hepatic Steatosis (Fatty Liver)',
            confidenceLevel: 'High', 
            description: 'Elevated liver enzymes with metabolic syndrome pattern'
          }
        ],
        riskFactors: [
          { factor: 'Severe hyperglycemia (HbA1c 11.2%)', impact: 'Critical' },
          { factor: 'Elevated liver enzymes (ALT 145 U/L)', impact: 'High' },
          { factor: 'Microalbuminuria detected', impact: 'High' },
          { factor: 'Dyslipidemia (LDL 180 mg/dL)', impact: 'Moderate' }
        ]
      }
    },
    {
      id: 'demo-2',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      rawDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      type: 'Cardiac Risk Assessment',
      status: 'Attention Required',
      riskScore: 65,
      fullData: {
        diagnosis: [
          {
            condition: 'Metabolic Syndrome',
            confidenceLevel: 'High',
            description: 'Multiple cardiovascular risk factors present'
          }
        ],
        riskFactors: [
          { factor: 'Hypertension (BP 165/95)', impact: 'High' },
          { factor: 'Central obesity (BMI 32)', impact: 'Moderate' }
        ]
      }
    },
    {
      id: 'demo-3',
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      rawDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      type: 'Renal Function Panel',
      status: 'Attention Required',
      riskScore: 70,
      fullData: {
        diagnosis: [
          {
            condition: 'Chronic Kidney Disease Stage 2',
            confidenceLevel: 'Moderate',
            description: 'Mild decrease in kidney function with proteinuria'
          }
        ],
        riskFactors: [
          { factor: 'Reduced eGFR (75 mL/min/1.73m²)', impact: 'Moderate' },
          { factor: 'Persistent proteinuria', impact: 'High' }
        ]
      }
    }
  ];

  // Sample analysis data for demo
  const demoAnalysisData = {
    patientInfo: {
      name: 'John Martinez (Demo Patient)',
      age: 52,
      gender: 'M'
    },
    analysis: {
      diagnosis: [
        {
          condition: 'Diabetic Nephropathy with Hepatic Complications',
          confidenceLevel: 'High',
          description: 'Multi-organ involvement requiring immediate intervention and specialist care'
        },
        {
          condition: 'Cardiovascular Risk Syndrome',
          confidenceLevel: 'High',
          description: 'Constellation of risk factors indicating high probability of cardiac events'
        }
      ],
      riskFactors: [
        'Uncontrolled Type 2 Diabetes (HbA1c 11.2%)',
        'Severe fatty liver disease (ALT 145 U/L)',
        'Early kidney dysfunction (proteinuria + reduced eGFR)',
        'Hypertensive crisis risk (BP 165/95)',
        'Severe dyslipidemia (LDL 180 mg/dL)',
        'Metabolic syndrome with central obesity'
      ]
    },
    blockchainRecord: {
      recordId: 'DEMO-CRITICAL-001'
    }
  };

  return (
    <DigitalTwin 
      riskAssessment={demoRiskAssessment}
      healthRecords={demoHealthRecords}
      analysisData={demoAnalysisData}
    />
  );
};

export default DigitalTwinDemo;