// Real-time Health Scoring Algorithm
// Based on medical standards and organ system risk assessment

export interface OrganRiskData {
  organ: string;
  currentRisk: 'LOW' | 'MODERATE' | 'HIGH';
  futureRisk: 'LOW' | 'MODERATE' | 'HIGH';
  riskScore: number;
  biomarkers: string[];
  criticalValues?: { [key: string]: number };
}

export interface BiomarkerData {
  name: string;
  value: number;
  normalRange: { min: number; max: number };
  unit: string;
  weight: number; // Importance factor (0-1)
}

export interface HealthScoreResult {
  overallScore: number;
  category: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL';
  trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
  riskFactors: string[];
  recommendations: string[];
  organScores: { [organ: string]: number };
  lastUpdated: Date;
}

// Organ weight factors based on medical importance
const ORGAN_WEIGHTS = {
  heart: 0.25,      // Cardiovascular system - highest priority
  brain: 0.20,      // Neurological function
  kidneys: 0.15,    // Filtration and fluid balance
  liver: 0.15,      // Metabolic function
  lungs: 0.12,      // Respiratory function
  pancreas: 0.08,   // Endocrine function
  stomach: 0.05     // Digestive function
};

// Risk level to score mapping
const RISK_SCORE_MAP = {
  'LOW': 85,
  'MODERATE': 65,
  'HIGH': 35
};

// Biomarker scoring functions
export const calculateBiomarkerScore = (biomarkers: BiomarkerData[]): number => {
  if (biomarkers.length === 0) return 75; // Default if no data

  let totalScore = 0;
  let totalWeight = 0;

  biomarkers.forEach(marker => {
    const { value, normalRange, weight } = marker;
    let score = 100;

    // Calculate deviation from normal range
    if (value < normalRange.min) {
      const deviation = (normalRange.min - value) / normalRange.min;
      score = Math.max(0, 100 - (deviation * 100));
    } else if (value > normalRange.max) {
      const deviation = (value - normalRange.max) / normalRange.max;
      score = Math.max(0, 100 - (deviation * 100));
    }

    totalScore += score * weight;
    totalWeight += weight;
  });

  return totalWeight > 0 ? totalScore / totalWeight : 75;
};

// Real-time organ scoring based on risk assessment
export const calculateOrganScore = (organData: OrganRiskData): number => {
  const baseScore = RISK_SCORE_MAP[organData.currentRisk];
  const futureRiskPenalty = organData.futureRisk === 'HIGH' ? -10 : 
                           organData.futureRisk === 'MODERATE' ? -5 : 0;
  
  // Apply critical values penalty if present
  let criticalPenalty = 0;
  if (organData.criticalValues) {
    Object.values(organData.criticalValues).forEach(value => {
      if (value > 2) criticalPenalty += 15; // Severe abnormality
      else if (value > 1.5) criticalPenalty += 10; // Moderate abnormality
      else if (value > 1.2) criticalPenalty += 5; // Mild abnormality
    });
  }

  return Math.max(0, Math.min(100, baseScore + futureRiskPenalty - criticalPenalty));
};

// Main health score calculation
export const calculateOverallHealthScore = (
  organRisks: OrganRiskData[],
  biomarkers: BiomarkerData[] = [],
  previousScore?: number
): HealthScoreResult => {
  
  // Calculate organ-specific scores
  const organScores: { [organ: string]: number } = {};
  let weightedOrganScore = 0;
  let totalWeight = 0;

  organRisks.forEach(organ => {
    const score = calculateOrganScore(organ);
    organScores[organ.organ] = score;
    
    const weight = ORGAN_WEIGHTS[organ.organ as keyof typeof ORGAN_WEIGHTS] || 0.05;
    weightedOrganScore += score * weight;
    totalWeight += weight;
  });

  // Calculate biomarker contribution (30% of total score)
  const biomarkerScore = calculateBiomarkerScore(biomarkers);
  
  // Combine organ and biomarker scores
  const organContribution = totalWeight > 0 ? (weightedOrganScore / totalWeight) * 0.7 : 50;
  const biomarkerContribution = biomarkerScore * 0.3;
  
  let overallScore = Math.round(organContribution + biomarkerContribution);
  
  // Apply age and lifestyle factors (if available)
  // This could be enhanced with actual patient data
  
  // Ensure score is within bounds
  overallScore = Math.max(0, Math.min(100, overallScore));

  // Determine category
  let category: HealthScoreResult['category'];
  if (overallScore >= 90) category = 'EXCELLENT';
  else if (overallScore >= 75) category = 'GOOD';
  else if (overallScore >= 60) category = 'FAIR';
  else if (overallScore >= 40) category = 'POOR';
  else category = 'CRITICAL';

  // Determine trend
  let trend: HealthScoreResult['trend'] = 'STABLE';
  if (previousScore) {
    const change = overallScore - previousScore;
    if (change >= 5) trend = 'IMPROVING';
    else if (change <= -5) trend = 'DECLINING';
  }

  // Generate risk factors
  const riskFactors: string[] = [];
  organRisks.forEach(organ => {
    if (organ.currentRisk === 'HIGH') {
      riskFactors.push(`Critical ${organ.organ} dysfunction`);
    } else if (organ.currentRisk === 'MODERATE') {
      riskFactors.push(`${organ.organ.charAt(0).toUpperCase() + organ.organ.slice(1)} monitoring required`);
    }
  });

  // Generate recommendations
  const recommendations: string[] = [];
  if (overallScore < 60) {
    recommendations.push('Immediate medical consultation recommended');
    recommendations.push('Comprehensive health assessment needed');
  } else if (overallScore < 75) {
    recommendations.push('Regular monitoring and lifestyle modifications');
    recommendations.push('Preventive care measures advised');
  } else {
    recommendations.push('Maintain current health practices');
    recommendations.push('Continue regular check-ups');
  }

  return {
    overallScore,
    category,
    trend,
    riskFactors,
    recommendations,
    organScores,
    lastUpdated: new Date()
  };
};

// Real-time biomarker processing from lab data
export const processBiomarkersFromLabData = (labData: any): BiomarkerData[] => {
  const biomarkers: BiomarkerData[] = [];

  // Common biomarkers with normal ranges and weights
  const biomarkerConfig = {
    glucose: { normalRange: { min: 70, max: 100 }, unit: 'mg/dL', weight: 0.15 },
    cholesterol: { normalRange: { min: 120, max: 200 }, unit: 'mg/dL', weight: 0.12 },
    ldl: { normalRange: { min: 0, max: 100 }, unit: 'mg/dL', weight: 0.10 },
    hdl: { normalRange: { min: 40, max: 80 }, unit: 'mg/dL', weight: 0.08 },
    triglycerides: { normalRange: { min: 0, max: 150 }, unit: 'mg/dL', weight: 0.08 },
    creatinine: { normalRange: { min: 0.6, max: 1.2 }, unit: 'mg/dL', weight: 0.12 },
    bun: { normalRange: { min: 7, max: 20 }, unit: 'mg/dL', weight: 0.08 },
    alt: { normalRange: { min: 7, max: 40 }, unit: 'U/L', weight: 0.10 },
    ast: { normalRange: { min: 10, max: 40 }, unit: 'U/L', weight: 0.10 },
    hba1c: { normalRange: { min: 4.0, max: 5.6 }, unit: '%', weight: 0.15 },
    hemoglobin: { normalRange: { min: 12.0, max: 16.0 }, unit: 'g/dL', weight: 0.08 },
    wbc: { normalRange: { min: 4.0, max: 11.0 }, unit: 'K/μL', weight: 0.06 },
    platelets: { normalRange: { min: 150, max: 450 }, unit: 'K/μL', weight: 0.05 }
  };

  // Extract biomarkers from lab data
  Object.entries(biomarkerConfig).forEach(([key, config]) => {
    const value = extractValueFromLabData(labData, key);
    if (value !== null) {
      biomarkers.push({
        name: key,
        value,
        normalRange: config.normalRange,
        unit: config.unit,
        weight: config.weight
      });
    }
  });

  return biomarkers;
};

// Helper function to extract values from various lab data formats
const extractValueFromLabData = (labData: any, biomarker: string): number | null => {
  if (!labData) return null;

  // Try different possible field names and formats
  const possibleKeys = [
    biomarker,
    biomarker.toLowerCase(),
    biomarker.toUpperCase(),
    biomarker.replace(/([A-Z])/g, '_$1').toLowerCase(),
    biomarker.replace(/_/g, ''),
  ];

  for (const key of possibleKeys) {
    if (labData[key] !== undefined && labData[key] !== null) {
      const value = parseFloat(labData[key]);
      if (!isNaN(value)) return value;
    }
  }

  return null;
};

// Real-time score monitoring hook
export const useRealTimeHealthScore = (
  organRisks: OrganRiskData[],
  labData: any,
  updateInterval: number = 5000
) => {
  const [healthScore, setHealthScore] = React.useState<HealthScoreResult | null>(null);
  const [isCalculating, setIsCalculating] = React.useState(false);

  React.useEffect(() => {
    const calculateScore = () => {
      setIsCalculating(true);
      
      try {
        const biomarkers = processBiomarkersFromLabData(labData);
        const previousScore = healthScore?.overallScore;
        const newScore = calculateOverallHealthScore(organRisks, biomarkers, previousScore);
        
        setHealthScore(newScore);
      } catch (error) {
        console.error('Health score calculation error:', error);
      } finally {
        setIsCalculating(false);
      }
    };

    // Initial calculation
    calculateScore();

    // Set up real-time updates
    const interval = setInterval(calculateScore, updateInterval);

    return () => clearInterval(interval);
  }, [organRisks, labData, updateInterval]);

  return { healthScore, isCalculating };
};

// Export for React import
import React from 'react';