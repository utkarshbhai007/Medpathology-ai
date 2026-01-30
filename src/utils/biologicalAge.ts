// Biological Age & Vitality Score Calculator
// This revolutionary feature calculates how "old" your body really is

export interface BiologicalAgeData {
  chronologicalAge: number;
  biologicalAge: number;
  vitalityScore: number;
  vitalityGap: number;
  longevityInsights: LongevityInsight[];
  optimizationPlan: OptimizationAction[];
  doctorRecommendation: DoctorRecommendation;
}

export interface LongevityInsight {
  category: 'cardiovascular' | 'metabolic' | 'inflammatory' | 'cognitive' | 'cellular';
  impact: 'positive' | 'negative' | 'neutral';
  ageImpact: number; // years added/subtracted
  description: string;
  trend: 'improving' | 'declining' | 'stable';
}

export interface OptimizationAction {
  priority: 'high' | 'medium' | 'low';
  category: string;
  action: string;
  expectedBenefit: string;
  timeframe: string;
  doctorConsultation: boolean;
}

export interface DoctorRecommendation {
  urgency: 'immediate' | 'within_month' | 'routine' | 'optional';
  reason: string;
  focusAreas: string[];
  expectedOutcome: string;
  costBenefit: string;
}

export class BiologicalAgeCalculator {
  
  /**
   * Calculate biological age based on comprehensive biomarkers
   */
  static calculateBiologicalAge(
    chronologicalAge: number,
    biomarkers: any,
    historicalData: any[] = []
  ): BiologicalAgeData {
    
    let biologicalAge = chronologicalAge;
    const insights: LongevityInsight[] = [];
    const optimizationPlan: OptimizationAction[] = [];
    
    // Cardiovascular Aging Factors
    const cardioAge = this.calculateCardiovascularAge(biomarkers, chronologicalAge);
    biologicalAge += cardioAge.ageAdjustment;
    insights.push(...cardioAge.insights);
    
    // Metabolic Aging Factors  
    const metabolicAge = this.calculateMetabolicAge(biomarkers, chronologicalAge);
    biologicalAge += metabolicAge.ageAdjustment;
    insights.push(...metabolicAge.insights);
    
    // Inflammatory Aging Factors
    const inflammatoryAge = this.calculateInflammatoryAge(biomarkers, chronologicalAge);
    biologicalAge += inflammatoryAge.ageAdjustment;
    insights.push(...inflammatoryAge.insights);
    
    // Cellular Aging Factors
    const cellularAge = this.calculateCellularAge(biomarkers, chronologicalAge);
    biologicalAge += cellularAge.ageAdjustment;
    insights.push(...cellularAge.insights);
    
    // Trend Analysis (Historical Data Impact)
    const trendImpact = this.analyzeTrends(historicalData, chronologicalAge);
    biologicalAge += trendImpact.ageAdjustment;
    insights.push(...trendImpact.insights);
    
    // Calculate Vitality Score (0-100)
    const vitalityScore = Math.max(0, Math.min(100, 
      100 - ((biologicalAge - chronologicalAge) * 5)
    ));
    
    const vitalityGap = biologicalAge - chronologicalAge;
    
    // Generate Optimization Plan
    const optimization = this.generateOptimizationPlan(insights, vitalityGap);
    optimizationPlan.push(...optimization);
    
    // Generate Doctor Recommendation
    const doctorRecommendation = this.generateDoctorRecommendation(vitalityGap, insights);
    
    return {
      chronologicalAge,
      biologicalAge: Math.round(biologicalAge * 10) / 10,
      vitalityScore: Math.round(vitalityScore),
      vitalityGap: Math.round(vitalityGap * 10) / 10,
      longevityInsights: insights,
      optimizationPlan,
      doctorRecommendation
    };
  }
  
  private static calculateCardiovascularAge(biomarkers: any, age: number) {
    let ageAdjustment = 0;
    const insights: LongevityInsight[] = [];
    
    // Blood Pressure Analysis
    const systolic = biomarkers.bloodPressure?.systolic || 120;
    const diastolic = biomarkers.bloodPressure?.diastolic || 80;
    
    if (systolic > 140 || diastolic > 90) {
      ageAdjustment += 3;
      insights.push({
        category: 'cardiovascular',
        impact: 'negative',
        ageImpact: 3,
        description: 'Elevated blood pressure accelerates arterial aging',
        trend: 'declining'
      });
    } else if (systolic > 130 || diastolic > 85) {
      ageAdjustment += 1.5;
      insights.push({
        category: 'cardiovascular',
        impact: 'negative',
        ageImpact: 1.5,
        description: 'Pre-hypertensive range suggests early vascular aging',
        trend: 'stable'
      });
    }
    
    // Cholesterol Analysis
    const totalCholesterol = biomarkers.cholesterol?.total || 180;
    const hdl = biomarkers.cholesterol?.hdl || 50;
    const ldl = biomarkers.cholesterol?.ldl || 100;
    
    if (totalCholesterol > 240 || ldl > 160) {
      ageAdjustment += 2.5;
      insights.push({
        category: 'cardiovascular',
        impact: 'negative',
        ageImpact: 2.5,
        description: 'High cholesterol accelerates atherosclerosis and vascular aging',
        trend: 'declining'
      });
    } else if (hdl > 60) {
      ageAdjustment -= 1;
      insights.push({
        category: 'cardiovascular',
        impact: 'positive',
        ageImpact: -1,
        description: 'High HDL provides cardiovascular protection and longevity benefits',
        trend: 'improving'
      });
    }
    
    return { ageAdjustment, insights };
  }
  
  private static calculateMetabolicAge(biomarkers: any, age: number) {
    let ageAdjustment = 0;
    const insights: LongevityInsight[] = [];
    
    // Glucose Analysis
    const glucose = biomarkers.glucose?.fasting || 90;
    const hba1c = biomarkers.hba1c || 5.4;
    
    if (glucose > 126 || hba1c > 6.5) {
      ageAdjustment += 4;
      insights.push({
        category: 'metabolic',
        impact: 'negative',
        ageImpact: 4,
        description: 'Diabetes significantly accelerates cellular aging and organ damage',
        trend: 'declining'
      });
    } else if (glucose > 100 || hba1c > 5.7) {
      ageAdjustment += 2;
      insights.push({
        category: 'metabolic',
        impact: 'negative',
        ageImpact: 2,
        description: 'Pre-diabetic glucose levels indicate metabolic aging',
        trend: 'declining'
      });
    } else if (glucose < 85 && hba1c < 5.2) {
      ageAdjustment -= 0.5;
      insights.push({
        category: 'metabolic',
        impact: 'positive',
        ageImpact: -0.5,
        description: 'Optimal glucose control supports healthy aging',
        trend: 'stable'
      });
    }
    
    // BMI Analysis
    const bmi = biomarkers.bmi || 25;
    if (bmi > 30) {
      ageAdjustment += 2;
      insights.push({
        category: 'metabolic',
        impact: 'negative',
        ageImpact: 2,
        description: 'Obesity accelerates aging through inflammation and metabolic stress',
        trend: 'declining'
      });
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      ageAdjustment -= 0.5;
      insights.push({
        category: 'metabolic',
        impact: 'positive',
        ageImpact: -0.5,
        description: 'Healthy weight supports longevity and reduces disease risk',
        trend: 'stable'
      });
    }
    
    return { ageAdjustment, insights };
  }
  
  private static calculateInflammatoryAge(biomarkers: any, age: number) {
    let ageAdjustment = 0;
    const insights: LongevityInsight[] = [];
    
    // CRP Analysis (C-Reactive Protein)
    const crp = biomarkers.crp || 1.0;
    if (crp > 3.0) {
      ageAdjustment += 2;
      insights.push({
        category: 'inflammatory',
        impact: 'negative',
        ageImpact: 2,
        description: 'High inflammation accelerates aging and increases disease risk',
        trend: 'declining'
      });
    } else if (crp < 1.0) {
      ageAdjustment -= 0.5;
      insights.push({
        category: 'inflammatory',
        impact: 'positive',
        ageImpact: -0.5,
        description: 'Low inflammation supports healthy aging and longevity',
        trend: 'improving'
      });
    }
    
    // White Blood Cell Count
    const wbc = biomarkers.wbc || 7000;
    if (wbc > 10000) {
      ageAdjustment += 1;
      insights.push({
        category: 'inflammatory',
        impact: 'negative',
        ageImpact: 1,
        description: 'Elevated white blood cells suggest chronic inflammation',
        trend: 'declining'
      });
    }
    
    return { ageAdjustment, insights };
  }
  
  private static calculateCellularAge(biomarkers: any, age: number) {
    let ageAdjustment = 0;
    const insights: LongevityInsight[] = [];
    
    // Kidney Function (Creatinine)
    const creatinine = biomarkers.creatinine || 1.0;
    if (creatinine > 1.3) {
      ageAdjustment += 2;
      insights.push({
        category: 'cellular',
        impact: 'negative',
        ageImpact: 2,
        description: 'Reduced kidney function indicates accelerated organ aging',
        trend: 'declining'
      });
    }
    
    // Liver Function (ALT)
    const alt = biomarkers.alt || 25;
    if (alt > 40) {
      ageAdjustment += 1;
      insights.push({
        category: 'cellular',
        impact: 'negative',
        ageImpact: 1,
        description: 'Elevated liver enzymes suggest cellular stress and aging',
        trend: 'declining'
      });
    }
    
    // Hemoglobin (Oxygen carrying capacity)
    const hemoglobin = biomarkers.hemoglobin || 14;
    if (hemoglobin < 12) {
      ageAdjustment += 1.5;
      insights.push({
        category: 'cellular',
        impact: 'negative',
        ageImpact: 1.5,
        description: 'Low hemoglobin reduces oxygen delivery and accelerates aging',
        trend: 'declining'
      });
    }
    
    return { ageAdjustment, insights };
  }
  
  private static analyzeTrends(historicalData: any[], age: number) {
    let ageAdjustment = 0;
    const insights: LongevityInsight[] = [];
    
    if (historicalData.length < 2) {
      return { ageAdjustment, insights };
    }
    
    // Analyze trends over time
    const recent = historicalData[historicalData.length - 1];
    const previous = historicalData[historicalData.length - 2];
    
    // Glucose trend
    if (recent.glucose > previous.glucose * 1.1) {
      ageAdjustment += 1;
      insights.push({
        category: 'metabolic',
        impact: 'negative',
        ageImpact: 1,
        description: 'Rising glucose trend indicates accelerating metabolic aging',
        trend: 'declining'
      });
    }
    
    // Cholesterol trend
    if (recent.cholesterol?.total > previous.cholesterol?.total * 1.1) {
      ageAdjustment += 0.5;
      insights.push({
        category: 'cardiovascular',
        impact: 'negative',
        ageImpact: 0.5,
        description: 'Rising cholesterol trend suggests increasing cardiovascular risk',
        trend: 'declining'
      });
    }
    
    return { ageAdjustment, insights };
  }
  
  private static generateOptimizationPlan(insights: LongevityInsight[], vitalityGap: number): OptimizationAction[] {
    const actions: OptimizationAction[] = [];
    
    if (vitalityGap > 3) {
      actions.push({
        priority: 'high',
        category: 'Comprehensive Health Assessment',
        action: 'Schedule detailed longevity consultation with your doctor',
        expectedBenefit: 'Reduce biological age by 2-4 years',
        timeframe: 'Within 2 weeks',
        doctorConsultation: true
      });
    }
    
    // Cardiovascular optimization
    const cardioInsights = insights.filter(i => i.category === 'cardiovascular' && i.impact === 'negative');
    if (cardioInsights.length > 0) {
      actions.push({
        priority: 'high',
        category: 'Cardiovascular Health',
        action: 'Discuss advanced lipid panel and cardiac risk assessment',
        expectedBenefit: 'Reduce cardiovascular aging by 1-3 years',
        timeframe: '1 month',
        doctorConsultation: true
      });
    }
    
    // Metabolic optimization
    const metabolicInsights = insights.filter(i => i.category === 'metabolic' && i.impact === 'negative');
    if (metabolicInsights.length > 0) {
      actions.push({
        priority: 'high',
        category: 'Metabolic Health',
        action: 'Consult about continuous glucose monitoring and metabolic optimization',
        expectedBenefit: 'Improve metabolic age by 1-2 years',
        timeframe: '2 weeks',
        doctorConsultation: true
      });
    }
    
    // Inflammation optimization
    const inflammatoryInsights = insights.filter(i => i.category === 'inflammatory' && i.impact === 'negative');
    if (inflammatoryInsights.length > 0) {
      actions.push({
        priority: 'medium',
        category: 'Anti-Aging Therapy',
        action: 'Discuss anti-inflammatory protocols and supplements',
        expectedBenefit: 'Reduce inflammatory aging by 0.5-1.5 years',
        timeframe: '1 month',
        doctorConsultation: true
      });
    }
    
    return actions;
  }
  
  private static generateDoctorRecommendation(vitalityGap: number, insights: LongevityInsight[]): DoctorRecommendation {
    const negativeInsights = insights.filter(i => i.impact === 'negative');
    
    if (vitalityGap > 5) {
      return {
        urgency: 'immediate',
        reason: 'Significant biological aging detected - immediate intervention needed',
        focusAreas: ['Comprehensive metabolic panel', 'Cardiovascular risk assessment', 'Hormone optimization'],
        expectedOutcome: 'Potential to reduce biological age by 3-6 years with proper intervention',
        costBenefit: 'Investment in longevity medicine now can save $50,000+ in future healthcare costs'
      };
    } else if (vitalityGap > 2) {
      return {
        urgency: 'within_month',
        reason: 'Moderate biological aging - optimization opportunity available',
        focusAreas: ['Preventive screening', 'Lifestyle optimization', 'Supplement protocols'],
        expectedOutcome: 'Can reduce biological age by 1-3 years with targeted interventions',
        costBenefit: 'Preventive care investment of $2,000 can prevent $25,000 in future treatments'
      };
    } else if (vitalityGap > 0) {
      return {
        urgency: 'routine',
        reason: 'Mild biological aging - maintain current health with optimization',
        focusAreas: ['Annual longevity assessment', 'Biomarker optimization', 'Performance enhancement'],
        expectedOutcome: 'Maintain or improve current biological age with fine-tuning',
        costBenefit: 'Small investments in optimization yield significant long-term health dividends'
      };
    } else {
      return {
        urgency: 'optional',
        reason: 'Excellent biological age - focus on maintaining and enhancing longevity',
        focusAreas: ['Advanced longevity protocols', 'Performance optimization', 'Cutting-edge therapies'],
        expectedOutcome: 'Potential to achieve biological age younger than chronological age',
        costBenefit: 'Investment in advanced longevity medicine for optimal healthspan extension'
      };
    }
  }
}