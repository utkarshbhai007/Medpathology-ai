// Professional Medical Report PDF Generation Service
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PatientInfo {
  name: string;
  id: string;
  age?: number;
  gender?: string;
  bloodType?: string;
  email?: string;
  phone?: string;
}

export interface ReportData {
  id: string;
  date: string;
  type: string;
  status: string;
  riskScore: number;
  fullData: any;
  patientInfo?: PatientInfo;
}

class PDFReportService {
  private addHeader(doc: jsPDF, patientInfo: PatientInfo, reportData: ReportData) {
    // Header background
    doc.setFillColor(37, 99, 235); // Blue-600
    doc.rect(0, 0, 210, 35, 'F');
    
    // Logo/Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('MedGenius AI', 20, 20);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Pathology Intelligence Report', 20, 28);
    
    // Report ID and Date
    doc.setFontSize(10);
    doc.text(`Report ID: ${reportData.id.slice(-8)}`, 140, 20);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 140, 28);
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
  }

  private addPatientInfo(doc: jsPDF, patientInfo: PatientInfo, yPosition: number): number {
    let y = yPosition;
    
    // Patient Information Section
    doc.setFillColor(248, 250, 252); // Gray-50
    doc.rect(15, y, 180, 35, 'F');
    doc.setDrawColor(226, 232, 240); // Gray-200
    doc.rect(15, y, 180, 35, 'S');
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42); // Slate-900
    doc.text('PATIENT INFORMATION', 20, y + 10);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105); // Slate-600
    
    // Patient details in two columns
    doc.text(`Name: ${patientInfo.name}`, 20, y + 20);
    doc.text(`Patient ID: ${patientInfo.id.slice(-8)}`, 110, y + 20);
    
    if (patientInfo.age || patientInfo.gender) {
      doc.text(`Age: ${patientInfo.age || 'N/A'}`, 20, y + 27);
      doc.text(`Gender: ${patientInfo.gender || 'N/A'}`, 110, y + 27);
    }
    
    if (patientInfo.bloodType || patientInfo.email) {
      doc.text(`Blood Type: ${patientInfo.bloodType || 'N/A'}`, 20, y + 34);
      doc.text(`Email: ${patientInfo.email || 'N/A'}`, 110, y + 34);
    }
    
    return y + 45;
  }

  private addDiagnosis(doc: jsPDF, diagnosis: any[], yPosition: number): number {
    if (!diagnosis || diagnosis.length === 0) return yPosition;
    
    let y = yPosition;
    
    // Diagnosis Section Header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('DIAGNOSIS & FINDINGS', 20, y);
    y += 10;
    
    diagnosis.forEach((d, index) => {
      // Diagnosis box
      doc.setFillColor(239, 246, 255); // Blue-50
      doc.rect(15, y, 180, 25, 'F');
      doc.setDrawColor(147, 197, 253); // Blue-300
      doc.rect(15, y, 180, 25, 'S');
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 64, 175); // Blue-800
      doc.text(`${index + 1}. ${d.condition}`, 20, y + 8);
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      
      // Confidence level
      doc.text(`Confidence: ${d.confidenceLevel}`, 20, y + 15);
      
      // Description (wrapped)
      const description = d.description || 'No description available';
      const wrappedText = doc.splitTextToSize(description, 160);
      doc.text(wrappedText.slice(0, 2), 20, y + 20); // Limit to 2 lines
      
      y += 30;
    });
    
    return y + 5;
  }

  private addRiskFactors(doc: jsPDF, riskFactors: any[], yPosition: number): number {
    if (!riskFactors || riskFactors.length === 0) return yPosition;
    
    let y = yPosition;
    
    // Risk Factors Section Header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('RISK FACTORS & PREDICTIONS', 20, y);
    y += 10;
    
    riskFactors.slice(0, 5).forEach((risk, index) => {
      const riskText = typeof risk === 'string' ? risk : risk.factor || risk;
      const impact = typeof risk === 'object' ? risk.impact : 'Unknown';
      
      // Risk item
      doc.setFillColor(254, 242, 242); // Red-50
      doc.rect(15, y, 180, 15, 'F');
      doc.setDrawColor(252, 165, 165); // Red-300
      doc.rect(15, y, 180, 15, 'S');
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(153, 27, 27); // Red-800
      
      // Risk icon and text
      doc.text('⚠', 20, y + 8);
      doc.text(riskText, 28, y + 8);
      
      // Impact level
      if (impact !== 'Unknown') {
        doc.setFont('helvetica', 'bold');
        doc.text(`${impact} Risk`, 160, y + 8);
      }
      
      y += 18;
    });
    
    return y + 5;
  }

  private addRecommendations(doc: jsPDF, recommendations: any[], yPosition: number): number {
    if (!recommendations || recommendations.length === 0) return yPosition;
    
    let y = yPosition;
    
    // Check if we need a new page
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    
    // Recommendations Section Header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('RECOMMENDATIONS & NEXT STEPS', 20, y);
    y += 10;
    
    recommendations.slice(0, 6).forEach((rec, index) => {
      const recommendation = typeof rec === 'string' ? rec : rec.recommendation || rec;
      const priority = typeof rec === 'object' ? rec.priority : 'Medium';
      
      // Recommendation box
      doc.setFillColor(240, 253, 244); // Green-50
      doc.rect(15, y, 180, 18, 'F');
      doc.setDrawColor(134, 239, 172); // Green-300
      doc.rect(15, y, 180, 18, 'S');
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(21, 128, 61); // Green-700
      
      // Recommendation number and text
      doc.text(`${index + 1}.`, 20, y + 8);
      
      // Wrap long recommendations
      const wrappedRec = doc.splitTextToSize(recommendation, 150);
      doc.text(wrappedRec.slice(0, 1), 28, y + 8);
      
      // Priority badge
      if (priority !== 'Medium') {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        const priorityColor = priority === 'High' ? [239, 68, 68] : [59, 130, 246];
        doc.setTextColor(priorityColor[0], priorityColor[1], priorityColor[2]);
        doc.text(priority.toUpperCase(), 160, y + 8);
      }
      
      y += 22;
    });
    
    return y + 5;
  }

  private addHealthScore(doc: jsPDF, riskScore: number, yPosition: number): number {
    let y = yPosition;
    
    // Health Score Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('OVERALL HEALTH ASSESSMENT', 20, y);
    y += 15;
    
    // Score circle background
    const scoreColor = riskScore >= 80 ? [34, 197, 94] : riskScore >= 60 ? [234, 179, 8] : [239, 68, 68];
    doc.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.circle(50, y + 10, 15, 'F');
    
    // Score text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`${riskScore}`, 45, y + 13);
    
    // Score description
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Health Score', 75, y + 8);
    
    const status = riskScore >= 80 ? 'Excellent' : riskScore >= 60 ? 'Good' : 'Needs Attention';
    doc.setFont('helvetica', 'bold');
    doc.text(`Status: ${status}`, 75, y + 18);
    
    return y + 35;
  }

  private addFooter(doc: jsPDF) {
    const pageHeight = doc.internal.pageSize.height;
    
    // Footer line
    doc.setDrawColor(226, 232, 240);
    doc.line(20, pageHeight - 25, 190, pageHeight - 25);
    
    // Footer text
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    
    doc.text('This report was generated by MedGenius AI - Pathology Intelligence Platform', 20, pageHeight - 18);
    doc.text('For medical questions, please consult your healthcare provider.', 20, pageHeight - 12);
    doc.text(`Generated on ${new Date().toLocaleString()}`, 20, pageHeight - 6);
    
    // Page number
    doc.text(`Page ${doc.getCurrentPageInfo().pageNumber}`, 180, pageHeight - 6);
  }

  private addDisclaimer(doc: jsPDF, yPosition: number): number {
    let y = yPosition;
    
    // Check if we need a new page
    if (y > 240) {
      doc.addPage();
      y = 20;
    }
    
    // Disclaimer Section
    doc.setFillColor(254, 243, 199); // Yellow-100
    doc.rect(15, y, 180, 40, 'F');
    doc.setDrawColor(245, 158, 11); // Yellow-500
    doc.rect(15, y, 180, 40, 'S');
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(146, 64, 14); // Yellow-800
    doc.text('IMPORTANT MEDICAL DISCLAIMER', 20, y + 10);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 53, 15); // Yellow-900
    
    const disclaimerText = [
      'This AI-generated report is for informational purposes only and should not replace',
      'professional medical advice, diagnosis, or treatment. Always consult qualified',
      'healthcare providers for medical decisions. The AI analysis is based on available',
      'data and may not reflect complete clinical picture.'
    ];
    
    disclaimerText.forEach((line, index) => {
      doc.text(line, 20, y + 20 + (index * 5));
    });
    
    return y + 45;
  }

  // Main PDF generation method
  async generateMedicalReportPDF(reportData: ReportData, patientInfo: PatientInfo): Promise<void> {
    const doc = new jsPDF();
    let yPosition = 40;
    
    try {
      // Add header
      this.addHeader(doc, patientInfo, reportData);
      
      // Add patient information
      yPosition = this.addPatientInfo(doc, patientInfo, yPosition);
      
      // Add health score
      yPosition = this.addHealthScore(doc, reportData.riskScore, yPosition);
      
      // Add diagnosis
      if (reportData.fullData.diagnosis) {
        yPosition = this.addDiagnosis(doc, reportData.fullData.diagnosis, yPosition);
      }
      
      // Add risk factors
      if (reportData.fullData.riskFactors) {
        yPosition = this.addRiskFactors(doc, reportData.fullData.riskFactors, yPosition);
      }
      
      // Add recommendations
      if (reportData.fullData.recommendations) {
        yPosition = this.addRecommendations(doc, reportData.fullData.recommendations, yPosition);
      }
      
      // Add disclaimer
      this.addDisclaimer(doc, yPosition);
      
      // Add footer to all pages
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        this.addFooter(doc);
      }
      
      // Generate filename
      const filename = `MedGenius_Report_${patientInfo.name.replace(/\s+/g, '_')}_${reportData.date.replace(/\//g, '-')}.pdf`;
      
      // Download the PDF
      doc.save(filename);
      
    } catch (error) {
      console.error('PDF generation error:', error);
      throw new Error('Failed to generate PDF report');
    }
  }

  // Alternative method for generating PDF from HTML element
  async generatePDFFromHTML(elementId: string, filename: string): Promise<void> {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element with ID '${elementId}' not found`);
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(filename);
    } catch (error) {
      console.error('HTML to PDF conversion error:', error);
      throw new Error('Failed to convert HTML to PDF');
    }
  }

  // Quick method for simple reports
  async generateSimplePDF(title: string, content: string, filename: string): Promise<void> {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('MedGenius AI', 20, 20);
    
    // Title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text(title, 20, 50);
    
    // Content
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const splitContent = doc.splitTextToSize(content, 170);
    doc.text(splitContent, 20, 70);
    
    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text(`Generated on ${new Date().toLocaleString()}`, 20, pageHeight - 10);
    
    doc.save(filename);
  }
}

// Export singleton instance
export const pdfReportService = new PDFReportService();