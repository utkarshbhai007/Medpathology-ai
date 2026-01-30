// Multi-Language AI Support Service (English, Hindi, Gujarati)
import React from 'react';

export type SupportedLanguage = 'en' | 'hi' | 'gu';

export interface TranslationData {
  [key: string]: {
    en: string;
    hi: string;
    gu: string;
  };
}

class TranslationService {
  private currentLanguage: SupportedLanguage = 'en';
  private translations: TranslationData = {
    // Common UI Elements
    'dashboard': {
      en: 'Dashboard',
      hi: 'डैशबोर्ड',
      gu: 'ડેશબોર્ડ'
    },
    'patient_portal': {
      en: 'Patient Portal',
      hi: 'रोगी पोर्टल',
      gu: 'દર્દી પોર્ટલ'
    },
    'health_score': {
      en: 'Health Score',
      hi: 'स्वास्थ्य स्कोर',
      gu: 'આરોગ્ય સ્કોર'
    },
    'live_monitoring': {
      en: 'Live Monitoring',
      hi: 'लाइव निगरानी',
      gu: 'લાઇવ મોનિટરિંગ'
    },
    'real_time': {
      en: 'Real-Time',
      hi: 'वास्तविक समय',
      gu: 'વાસ્તવિક સમય'
    },
    
    // Medical Terms
    'blood_pressure': {
      en: 'Blood Pressure',
      hi: 'रक्तचाप',
      gu: 'બ્લડ પ્રેશર'
    },
    'heart_rate': {
      en: 'Heart Rate',
      hi: 'हृदय गति',
      gu: 'હૃદય ગતિ'
    },
    'temperature': {
      en: 'Temperature',
      hi: 'तापमान',
      gu: 'તાપમાન'
    },
    'glucose': {
      en: 'Glucose',
      hi: 'ग्लूकोज',
      gu: 'ગ્લુકોઝ'
    },
    'cholesterol': {
      en: 'Cholesterol',
      hi: 'कोलेस्ट्रॉल',
      gu: 'કોલેસ્ટ્રોલ'
    },
    'hemoglobin': {
      en: 'Hemoglobin',
      hi: 'हीमोग्लोबिन',
      gu: 'હિમોગ્લોબિન'
    },
    
    // Risk Levels
    'low_risk': {
      en: 'Low Risk',
      hi: 'कम जोखिम',
      gu: 'ઓછું જોખમ'
    },
    'moderate_risk': {
      en: 'Moderate Risk',
      hi: 'मध्यम जोखिम',
      gu: 'મધ્યમ જોખમ'
    },
    'high_risk': {
      en: 'High Risk',
      hi: 'उच्च जोखिम',
      gu: 'વધુ જોખમ'
    },
    'critical': {
      en: 'Critical',
      hi: 'गंभीर',
      gu: 'ગંભીર'
    },
    
    // Health Status
    'excellent': {
      en: 'Excellent',
      hi: 'उत्कृष्ट',
      gu: 'ઉત્કૃષ્ટ'
    },
    'good': {
      en: 'Good',
      hi: 'अच्छा',
      gu: 'સારું'
    },
    'fair': {
      en: 'Fair',
      hi: 'ठीक',
      gu: 'યોગ્ય'
    },
    'poor': {
      en: 'Poor',
      hi: 'खराब',
      gu: 'ખરાબ'
    },
    
    // Drug Interactions
    'drug_interactions': {
      en: 'Drug Interactions',
      hi: 'दवा पारस्परिक क्रिया',
      gu: 'દવા ક્રિયાપ્રતિક્રિયા'
    },
    'severity_major': {
      en: 'Major Severity',
      hi: 'प्रमुख गंभीरता',
      gu: 'મુખ્ય ગંભીરતા'
    },
    'severity_moderate': {
      en: 'Moderate Severity',
      hi: 'मध्यम गंभीरता',
      gu: 'મધ્યમ ગંભીરતા'
    },
    'severity_minor': {
      en: 'Minor Severity',
      hi: 'मामूली गंभीरता',
      gu: 'નાની ગંભીરતા'
    },
    'contraindicated': {
      en: 'Contraindicated',
      hi: 'प्रतिबंधित',
      gu: 'પ્રતિબંધિત'
    },
    
    // Medicine Information
    'medicine_info': {
      en: 'Medicine Information',
      hi: 'दवा की जानकारी',
      gu: 'દવાની માહિતી'
    },
    'what_is_this_medicine_for': {
      en: 'What is this medicine for?',
      hi: 'यह दवा किस लिए है?',
      gu: 'આ દવા શેના માટે છે?'
    },
    'side_effects': {
      en: 'Side Effects',
      hi: 'दुष्प्रभाव',
      gu: 'આડઅસર'
    },
    'warnings': {
      en: 'Warnings',
      hi: 'चेतावनी',
      gu: 'ચેતવણી'
    },
    'dosage': {
      en: 'Dosage',
      hi: 'खुराक',
      gu: 'ડોઝ'
    },
    
    // Actions
    'search': {
      en: 'Search',
      hi: 'खोजें',
      gu: 'શોધો'
    },
    'check_interactions': {
      en: 'Check Interactions',
      hi: 'पारस्परिक क्रिया जांचें',
      gu: 'ક્રિયાપ્રતિક્રિયા તપાસો'
    },
    'get_medicine_info': {
      en: 'Get Medicine Info',
      hi: 'दवा की जानकारी प्राप्त करें',
      gu: 'દવાની માહિતી મેળવો'
    },
    
    // Common Phrases
    'consult_doctor': {
      en: 'Consult your doctor',
      hi: 'अपने डॉक्टर से सलाह लें',
      gu: 'તમારા ડૉક્ટરની સલાહ લો'
    },
    'monitor_closely': {
      en: 'Monitor closely',
      hi: 'बारीकी से निगरानी करें',
      gu: 'નજીકથી નિરીક્ષણ કરો'
    },
    'avoid_combination': {
      en: 'Avoid this combination',
      hi: 'इस संयोजन से बचें',
      gu: 'આ સંયોજનથી બચો'
    },
    
    // Health Insights
    'ai_recommendation': {
      en: 'AI Recommendation',
      hi: 'एआई सिफारिश',
      gu: 'AI ભલામણ'
    },
    'health_alert': {
      en: 'Health Alert',
      hi: 'स्वास्थ्य चेतावनी',
      gu: 'આરોગ્ય ચેતવણી'
    },
    'immediate_attention': {
      en: 'Immediate attention required',
      hi: 'तत्काल ध्यान देने की आवश्यकता',
      gu: 'તાત્કાલિક ધ્યાન આપવાની જરૂર'
    },
    
    // PDF Download
    'download_pdf': {
      en: 'Download PDF',
      hi: 'पीडीएफ डाउनलोड करें',
      gu: 'PDF ડાઉનલોડ કરો'
    },
    'download_all_pdf': {
      en: 'Download All PDF',
      hi: 'सभी पीडीएफ डाउनलोड करें',
      gu: 'બધા PDF ડાઉનલોડ કરો'
    },
    'download_all_json': {
      en: 'Download All JSON',
      hi: 'सभी JSON डाउनलोड करें',
      gu: 'બધા JSON ડાઉનલોડ કરો'
    },
    'pdf_generated_successfully': {
      en: 'PDF report generated successfully!',
      hi: 'पीडीएफ रिपोर्ट सफलतापूर्वक तैयार की गई!',
      gu: 'PDF રિપોર્ટ સફળતાપૂર્વક બનાવવામાં આવી!'
    },
    'pdf_generation_error': {
      en: 'Failed to generate PDF. Please try again.',
      hi: 'पीडीएफ बनाने में विफल। कृपया पुनः प्रयास करें।',
      gu: 'PDF બનાવવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.'
    },
    
    // Language Names
    'english': {
      en: 'English',
      hi: 'अंग्रेजी',
      gu: 'અંગ્રેજી'
    },
    'hindi': {
      en: 'Hindi',
      hi: 'हिंदी',
      gu: 'હિન્દી'
    },
    'gujarati': {
      en: 'Gujarati',
      hi: 'गुजराती',
      gu: 'ગુજરાતી'
    }
  };

  // Medical condition translations
  private medicalConditions: TranslationData = {
    'diabetes': {
      en: 'Diabetes',
      hi: 'मधुमेह',
      gu: 'ડાયાબિટીસ'
    },
    'hypertension': {
      en: 'High Blood Pressure',
      hi: 'उच्च रक्तचाप',
      gu: 'હાઈ બ્લડ પ્રેશર'
    },
    'cardiovascular_disease': {
      en: 'Heart Disease',
      hi: 'हृदय रोग',
      gu: 'હૃદય રોગ'
    },
    'kidney_disease': {
      en: 'Kidney Disease',
      hi: 'गुर्दे की बीमारी',
      gu: 'કિડની રોગ'
    },
    'liver_disease': {
      en: 'Liver Disease',
      hi: 'यकृत रोग',
      gu: 'લીવર રોગ'
    }
  };

  setLanguage(language: SupportedLanguage) {
    this.currentLanguage = language;
    // Store in localStorage for persistence
    localStorage.setItem('medgenius_language', language);
  }

  getCurrentLanguage(): SupportedLanguage {
    // Check localStorage first
    const stored = localStorage.getItem('medgenius_language') as SupportedLanguage;
    if (stored && ['en', 'hi', 'gu'].includes(stored)) {
      this.currentLanguage = stored;
    }
    return this.currentLanguage;
  }

  translate(key: string): string {
    const translation = this.translations[key] || this.medicalConditions[key];
    if (translation) {
      return translation[this.currentLanguage] || translation.en;
    }
    
    // If no translation found, return the key (fallback)
    console.warn(`Translation not found for key: ${key}`);
    return key;
  }

  // Translate medical values with units
  translateMedicalValue(value: number, unit: string, context?: string): string {
    const unitTranslations: { [key: string]: TranslationData } = {
      'mg/dL': {
        en: 'mg/dL',
        hi: 'मिग्रा/डेली',
        gu: 'મિગ્રા/ડેલી'
      },
      'mmHg': {
        en: 'mmHg',
        hi: 'एमएमएचजी',
        gu: 'mmHg'
      },
      'BPM': {
        en: 'BPM',
        hi: 'बीपीएम',
        gu: 'BPM'
      },
      '°F': {
        en: '°F',
        hi: '°फ़ा',
        gu: '°F'
      },
      '%': {
        en: '%',
        hi: '%',
        gu: '%'
      }
    };

    const translatedUnit = unitTranslations[unit]?.[this.currentLanguage] || unit;
    return `${value} ${translatedUnit}`;
  }

  // Get language-specific number formatting
  formatNumber(value: number): string {
    const locale = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'gu': 'gu-IN'
    }[this.currentLanguage];

    return new Intl.NumberFormat(locale).format(value);
  }

  // Get available languages for UI
  getAvailableLanguages() {
    return [
      { code: 'en', name: this.translate('english'), flag: '🇺🇸' },
      { code: 'hi', name: this.translate('hindi'), flag: '🇮🇳' },
      { code: 'gu', name: this.translate('gujarati'), flag: '🇮🇳' }
    ];
  }

  // Translate drug interaction severity
  translateSeverity(severity: string): string {
    const severityMap: { [key: string]: string } = {
      'MAJOR': 'severity_major',
      'MODERATE': 'severity_moderate',
      'MINOR': 'severity_minor',
      'CONTRAINDICATED': 'contraindicated'
    };
    
    return this.translate(severityMap[severity] || severity.toLowerCase());
  }

  // Translate health status
  translateHealthStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'EXCELLENT': 'excellent',
      'GOOD': 'good',
      'FAIR': 'fair',
      'POOR': 'poor',
      'CRITICAL': 'critical'
    };
    
    return this.translate(statusMap[status] || status.toLowerCase());
  }

  // Translate risk level
  translateRiskLevel(risk: string): string {
    const riskMap: { [key: string]: string } = {
      'LOW': 'low_risk',
      'MODERATE': 'moderate_risk',
      'HIGH': 'high_risk'
    };
    
    return this.translate(riskMap[risk] || risk.toLowerCase());
  }

  // Add new translation dynamically
  addTranslation(key: string, translations: { en: string; hi: string; gu: string }) {
    this.translations[key] = translations;
  }

  // Get direction for text (RTL support if needed in future)
  getTextDirection(): 'ltr' | 'rtl' {
    return 'ltr'; // All supported languages use LTR
  }
}

// Create singleton instance
export const translationService = new TranslationService();

// React hook for translations
export const useTranslation = () => {
  const [language, setLanguage] = React.useState<SupportedLanguage>(
    translationService.getCurrentLanguage()
  );

  const changeLanguage = (newLanguage: SupportedLanguage) => {
    translationService.setLanguage(newLanguage);
    setLanguage(newLanguage);
  };

  const t = (key: string) => translationService.translate(key);

  return {
    language,
    changeLanguage,
    t,
    availableLanguages: translationService.getAvailableLanguages(),
    translateSeverity: translationService.translateSeverity.bind(translationService),
    translateHealthStatus: translationService.translateHealthStatus.bind(translationService),
    translateRiskLevel: translationService.translateRiskLevel.bind(translationService),
    translateMedicalValue: translationService.translateMedicalValue.bind(translationService),
    formatNumber: translationService.formatNumber.bind(translationService)
  };
};