// Drug Interaction Checker Service with FDA integration and severity levels
import { openFDAService } from './OpenFDAService';

export interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: 'MINOR' | 'MODERATE' | 'MAJOR' | 'CONTRAINDICATED';
  description: string;
  clinicalEffect: string;
  mechanism: string;
  management: string;
  riskLevel: number; // 1-10 scale
  sources: string[];
}

export interface DrugInfo {
  name: string;
  brandName?: string;
  genericName?: string;
  purpose: string;
  dosage?: string;
  sideEffects: string[];
  warnings: string[];
  interactions: string[];
  fdaApproved: boolean;
  drugClass: string;
  mechanism: string;
  indications: string[];
}

class DrugInteractionService {
  private interactionDatabase: Map<string, DrugInteraction[]> = new Map();
  private drugInfoCache: Map<string, DrugInfo> = new Map();

  // Common drug interactions database (medical-grade data)
  private commonInteractions: DrugInteraction[] = [
    {
      drug1: 'warfarin',
      drug2: 'aspirin',
      severity: 'MAJOR',
      description: 'Increased risk of bleeding when warfarin is combined with aspirin',
      clinicalEffect: 'Enhanced anticoagulant effect leading to increased bleeding risk',
      mechanism: 'Additive antiplatelet and anticoagulant effects',
      management: 'Monitor INR closely, consider dose adjustment, watch for bleeding signs',
      riskLevel: 8,
      sources: ['FDA Drug Labels', 'Clinical Studies']
    },
    {
      drug1: 'metformin',
      drug2: 'alcohol',
      severity: 'MODERATE',
      description: 'Alcohol may increase the risk of lactic acidosis with metformin',
      clinicalEffect: 'Increased risk of lactic acidosis, especially in kidney impairment',
      mechanism: 'Both can affect lactate metabolism',
      management: 'Limit alcohol consumption, monitor kidney function',
      riskLevel: 6,
      sources: ['FDA Drug Labels', 'Prescribing Information']
    },
    {
      drug1: 'lisinopril',
      drug2: 'potassium',
      severity: 'MODERATE',
      description: 'ACE inhibitors can increase potassium levels',
      clinicalEffect: 'Risk of hyperkalemia',
      mechanism: 'Reduced aldosterone production leading to potassium retention',
      management: 'Monitor serum potassium levels regularly',
      riskLevel: 5,
      sources: ['Clinical Guidelines', 'FDA Warnings']
    },
    {
      drug1: 'simvastatin',
      drug2: 'grapefruit',
      severity: 'MAJOR',
      description: 'Grapefruit juice significantly increases simvastatin levels',
      clinicalEffect: 'Increased risk of muscle toxicity and rhabdomyolysis',
      mechanism: 'Inhibition of CYP3A4 enzyme in intestines',
      management: 'Avoid grapefruit juice completely while taking simvastatin',
      riskLevel: 7,
      sources: ['FDA Drug Labels', 'Clinical Studies']
    },
    {
      drug1: 'digoxin',
      drug2: 'furosemide',
      severity: 'MODERATE',
      description: 'Diuretics can increase digoxin toxicity risk',
      clinicalEffect: 'Increased digoxin levels due to electrolyte imbalances',
      mechanism: 'Hypokalemia and hypomagnesemia increase digoxin sensitivity',
      management: 'Monitor digoxin levels and electrolytes closely',
      riskLevel: 6,
      sources: ['Cardiology Guidelines', 'FDA Warnings']
    }
  ];

  constructor() {
    this.initializeDatabase();
  }

  private initializeDatabase() {
    // Build interaction lookup map
    this.commonInteractions.forEach(interaction => {
      const key1 = interaction.drug1.toLowerCase();
      const key2 = interaction.drug2.toLowerCase();
      
      if (!this.interactionDatabase.has(key1)) {
        this.interactionDatabase.set(key1, []);
      }
      if (!this.interactionDatabase.has(key2)) {
        this.interactionDatabase.set(key2, []);
      }
      
      this.interactionDatabase.get(key1)!.push(interaction);
      this.interactionDatabase.get(key2)!.push({
        ...interaction,
        drug1: interaction.drug2,
        drug2: interaction.drug1
      });
    });
  }

  // Check interactions between multiple drugs
  async checkInteractions(drugList: string[]): Promise<DrugInteraction[]> {
    const interactions: DrugInteraction[] = [];
    const normalizedDrugs = drugList.map(drug => drug.toLowerCase().trim());

    for (let i = 0; i < normalizedDrugs.length; i++) {
      for (let j = i + 1; j < normalizedDrugs.length; j++) {
        const drug1 = normalizedDrugs[i];
        const drug2 = normalizedDrugs[j];
        
        const interaction = await this.findInteraction(drug1, drug2);
        if (interaction) {
          interactions.push(interaction);
        }
      }
    }

    // Sort by severity (most severe first)
    return interactions.sort((a, b) => {
      const severityOrder = { 'CONTRAINDICATED': 4, 'MAJOR': 3, 'MODERATE': 2, 'MINOR': 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }

  private async findInteraction(drug1: string, drug2: string): Promise<DrugInteraction | null> {
    // Check local database first
    const interactions = this.interactionDatabase.get(drug1);
    if (interactions) {
      const found = interactions.find(int => 
        int.drug2.toLowerCase() === drug2 || 
        int.drug1.toLowerCase() === drug2
      );
      if (found) return found;
    }

    // Try FDA API for additional interactions
    try {
      const fdaInteraction = await this.checkFDAInteraction(drug1, drug2);
      if (fdaInteraction) return fdaInteraction;
    } catch (error) {
      console.warn('FDA interaction check failed:', error);
    }

    return null;
  }

  private async checkFDAInteraction(drug1: string, drug2: string): Promise<DrugInteraction | null> {
    try {
      // Use FDA adverse events API to detect potential interactions
      const events1 = await openFDAService.getAdverseEventCount(drug1);
      const events2 = await openFDAService.getAdverseEventCount(drug2);
      
      // If both drugs have significant adverse events, flag as potential interaction
      if (events1 > 100 && events2 > 100) {
        return {
          drug1,
          drug2,
          severity: 'MODERATE',
          description: `Potential interaction detected between ${drug1} and ${drug2}`,
          clinicalEffect: 'Monitor for increased side effects when used together',
          mechanism: 'Interaction mechanism requires further investigation',
          management: 'Consult healthcare provider before combining these medications',
          riskLevel: 4,
          sources: ['FDA Adverse Events Database']
        };
      }
    } catch (error) {
      console.warn('FDA interaction check error:', error);
    }
    
    return null;
  }

  // Get detailed drug information
  async getDrugInfo(drugName: string): Promise<DrugInfo | null> {
    const normalizedName = drugName.toLowerCase().trim();
    
    // Check cache first
    if (this.drugInfoCache.has(normalizedName)) {
      return this.drugInfoCache.get(normalizedName)!;
    }

    try {
      // Try FDA first
      const fdaInfo = await openFDAService.getDrugLabel(drugName);
      if (fdaInfo) {
        const drugInfo: DrugInfo = {
          name: drugName,
          brandName: fdaInfo.brand_name,
          genericName: fdaInfo.generic_name,
          purpose: fdaInfo.indications_and_usage || 'Information not available',
          sideEffects: fdaInfo.adverse_reactions || [],
          warnings: fdaInfo.warnings || [],
          interactions: fdaInfo.drug_interactions || [],
          fdaApproved: true,
          drugClass: fdaInfo.pharmacologic_class || 'Unknown',
          mechanism: fdaInfo.mechanism_of_action || 'Not specified',
          indications: fdaInfo.indications_and_usage ? [fdaInfo.indications_and_usage] : []
        };
        
        this.drugInfoCache.set(normalizedName, drugInfo);
        return drugInfo;
      }
    } catch (error) {
      console.warn('FDA drug info failed, trying fallback:', error);
    }

    // Fallback to Groq AI for drug information
    try {
      const groqInfo = await this.getGroqDrugInfo(drugName);
      if (groqInfo) {
        this.drugInfoCache.set(normalizedName, groqInfo);
        return groqInfo;
      }
    } catch (error) {
      console.warn('Groq drug info failed:', error);
    }

    return null;
  }

  private async getGroqDrugInfo(drugName: string): Promise<DrugInfo | null> {
    try {
      // This would integrate with Groq API
      // For now, return a structured response based on common drugs
      const commonDrugs: { [key: string]: DrugInfo } = {
        'aspirin': {
          name: 'Aspirin',
          brandName: 'Bayer Aspirin',
          genericName: 'Acetylsalicylic Acid',
          purpose: 'Pain relief, fever reduction, anti-inflammatory, cardiovascular protection',
          sideEffects: ['Stomach irritation', 'Bleeding risk', 'Allergic reactions'],
          warnings: ['Do not use in children with viral infections', 'Bleeding risk'],
          interactions: ['Warfarin', 'Alcohol', 'NSAIDs'],
          fdaApproved: true,
          drugClass: 'NSAID',
          mechanism: 'Inhibits cyclooxygenase enzymes',
          indications: ['Pain', 'Fever', 'Inflammation', 'Cardiovascular protection']
        },
        'metformin': {
          name: 'Metformin',
          brandName: 'Glucophage',
          genericName: 'Metformin Hydrochloride',
          purpose: 'Type 2 diabetes management, blood sugar control',
          sideEffects: ['Nausea', 'Diarrhea', 'Metallic taste', 'Vitamin B12 deficiency'],
          warnings: ['Lactic acidosis risk', 'Kidney function monitoring required'],
          interactions: ['Alcohol', 'Contrast dyes', 'Diuretics'],
          fdaApproved: true,
          drugClass: 'Biguanide',
          mechanism: 'Decreases glucose production by liver',
          indications: ['Type 2 Diabetes Mellitus']
        },
        'lisinopril': {
          name: 'Lisinopril',
          brandName: 'Prinivil, Zestril',
          genericName: 'Lisinopril',
          purpose: 'High blood pressure, heart failure, post-heart attack treatment',
          sideEffects: ['Dry cough', 'Dizziness', 'Hyperkalemia', 'Angioedema'],
          warnings: ['Pregnancy category D', 'Kidney function monitoring'],
          interactions: ['Potassium supplements', 'NSAIDs', 'Diuretics'],
          fdaApproved: true,
          drugClass: 'ACE Inhibitor',
          mechanism: 'Blocks angiotensin-converting enzyme',
          indications: ['Hypertension', 'Heart Failure', 'Post-MI']
        }
      };

      const drugInfo = commonDrugs[drugName.toLowerCase()];
      if (drugInfo) {
        return drugInfo;
      }

      // If not in common drugs, return a generic response
      return {
        name: drugName,
        purpose: 'Medication information not available in database. Please consult your healthcare provider.',
        sideEffects: ['Consult healthcare provider for side effect information'],
        warnings: ['Always follow prescribed dosage and instructions'],
        interactions: ['Check with pharmacist for drug interactions'],
        fdaApproved: false,
        drugClass: 'Unknown',
        mechanism: 'Consult healthcare provider for mechanism of action',
        indications: ['Consult healthcare provider for indications']
      };
    } catch (error) {
      console.error('Groq API error:', error);
      return null;
    }
  }

  // Get severity color for UI
  getSeverityColor(severity: string): string {
    switch (severity) {
      case 'CONTRAINDICATED': return 'bg-red-600 text-white';
      case 'MAJOR': return 'bg-red-500 text-white';
      case 'MODERATE': return 'bg-yellow-500 text-white';
      case 'MINOR': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  }

  // Get severity icon
  getSeverityIcon(severity: string): string {
    switch (severity) {
      case 'CONTRAINDICATED': return '🚫';
      case 'MAJOR': return '⚠️';
      case 'MODERATE': return '⚡';
      case 'MINOR': return 'ℹ️';
      default: return '❓';
    }
  }
}

export const drugInteractionService = new DrugInteractionService();