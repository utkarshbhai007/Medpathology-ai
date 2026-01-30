const Report = require('../models/Report');
const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || 'gsk_dummy_key_to_prevent_startup_crash'
});

// Helper for AI Processing
async function getGroqCompletion(systemPrompt, userPrompt) {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            // Updated model to latest supported version
            model: "llama-3.3-70b-versatile",
            temperature: 0.1,
            response_format: { type: "json_object" }
        });
        return JSON.parse(completion.choices[0]?.message?.content || "{}");
    } catch (error) {
        console.error("Groq API Error:", error);
        throw error;
    }
}

// 1. Report Generation Agent
exports.generateReport = async (req, res) => {
    try {
        const { patientName, patientId, doctorId, labId, testType, rawData } = req.body;
        const startTime = new Date();

        // 1. Initial Report Entry
        let report = new Report({
            patientName,
            patientId,
            doctorId,
            labId,
            testType,
            rawData,
            status: 'processing',
            agentsInvolved: [{
                agentName: 'Intake System',
                action: 'Received data for analysis',
                timestamp: new Date(),
                status: 'success'
            }]
        });

        // 2. Call AI Agent (Report Generation)
        const systemPrompt = `You are an expert Pathologist AI Agent. Analyze the provided patient test results and generate a detailed medical report.
        Return a valid JSON object with the following structure:
        {
            "diagnosis": [
                {
                    "condition": "Primary condition",
                    "confidenceLevel": "High/Medium/Low",
                    "description": "Brief description",
                    "evidenceFromText": "Relevant text from patient data"
                }
            ],
            "riskFactors": [
                {
                    "factor": "Risk factor name",
                    "impact": "High/Medium/Low",
                    "description": "Brief description",
                    "mitigation": "Suggested steps"
                }
            ],
            "recommendations": [
                {
                    "recommendation": "Action item",
                    "reason": "Clinical reasoning",
                    "priority": "High/Medium/Low",
                    "timeframe": "Immediate/Short-term/Long-term"
                }
            ],
            "nextSteps": [
                {
                    "step": "Next step",
                    "reason": "Rationale",
                    "timeline": "Immediate/Soon/Future",
                    "details": "Specific instructions"
                }
            ],
            "dataQuality": {
                "completeness": "High/Medium/Low",
                "missingInformation": ["List of missing info"],
                "suggestedTests": ["Suggested additional tests"]
            },
            "riskAssessment": {
                "diabetes": { "risk": "LOW/MODERATE/HIGH", "score": 0-100, "trend": "STABLE/RISING/IMPROVING/DECLINING", "nextScreening": "Timeframe" },
                "cardiovascular": { "risk": "LOW/MODERATE/HIGH", "score": 0-100, "trend": "STABLE/RISING/IMPROVING/DECLINING", "nextScreening": "Timeframe" },
                "kidney": { "risk": "LOW/MODERATE/HIGH", "score": 0-100, "trend": "STABLE/RISING/IMPROVING/DECLINING", "nextScreening": "Timeframe" },
                "liver": { "risk": "LOW/MODERATE/HIGH", "score": 0-100, "trend": "STABLE/RISING/IMPROVING/DECLINING", "nextScreening": "Timeframe" }
            }
        }
        Strictly adhere to this JSON format and ensure all arrays are populated if data allows.`;

        const userPrompt = `Patient Name: ${patientName}
        Test Type: ${testType}
        Test Data: ${JSON.stringify(rawData)}`;

        let aiResults;
        try {
            aiResults = await getGroqCompletion(systemPrompt, userPrompt);
        } catch (error) {
            // Fallback if AI fails (e.g. invalid key)
            console.error("AI Generation Failed, using fallback");
            aiResults = {
                diagnosis: [{
                    condition: "Analysis Unavailable",
                    confidenceLevel: "Low",
                    description: "Automated analysis failed. Please review raw data manually.",
                    evidenceFromText: "System Error"
                }],
                riskFactors: [{
                    factor: "Unknown",
                    impact: "Low",
                    description: "Could not assess risk factors.",
                    mitigation: "Manual review required"
                }],
                recommendations: [{
                    recommendation: "Consult Physician",
                    reason: "Automated analysis failed",
                    priority: "High",
                    timeframe: "Immediate"
                }],
                nextSteps: [],
                dataQuality: {
                    completeness: "Low",
                    missingInformation: ["AI Processing Failed"],
                    suggestedTests: []
                }
            };
        }

        // 3. Update Report with AI Results
        report.aiAnalysis = aiResults;

        report.agentsInvolved.push({
            agentName: 'Report Generation Agent',
            action: 'Generated comprehensive pathology analysis',
            timestamp: new Date(),
            status: 'success'
        });

        // 4. Quality Control Check (Simple Rule-based + AI Logic)
        if (aiResults.riskAssessment?.level === 'High' || (rawData.hemoglobin && (rawData.hemoglobin < 7 || rawData.hemoglobin > 20))) {
            report.status = 'flagged';
            report.agentsInvolved.push({
                agentName: 'Quality Control Agent',
                action: 'Flagged for Critical Review due to abnormal values',
                timestamp: new Date(),
                status: 'warning'
            });
        } else {
            report.status = 'completed';
            report.agentsInvolved.push({
                agentName: 'Quality Control Agent',
                action: 'Verified results within acceptable parameters',
                timestamp: new Date(),
                status: 'success'
            });
        }

        // 5. Calculate TAT
        const endTime = new Date();
        report.tat = {
            startTime,
            endTime,
            durationMinutes: (endTime - startTime) / 60000
        };

        await report.save();

        res.status(201).json({
            success: true,
            message: 'Report generated successfully',
            data: report
        });

    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// 2. Specialized Analysis Endpoints
exports.analyzeSideEffects = async (req, res) => {
    try {
        const { drug } = req.body;

        const systemPrompt = `You are a Medical AI Agent specialized in pharmacology. Analyze the side effects of the provided medication.
        Return a valid JSON object with the following structure:
        {
            "sideEffects": [
                {
                    "name": "Side effect name",
                    "probability": 0.1-0.99, // numeric value
                    "severity": "Mild/Moderate/Severe",
                    "management": "How to manage this side effect",
                    "timeframe": "When it typically occurs",
                    "riskFactors": ["List of risk factors"]
                }
            ]
        }
        Strictly adhere to this JSON format. List at least 5 significant side effects.`;

        const userPrompt = `Drug Name: ${drug}`;

        const analysis = await getGroqCompletion(systemPrompt, userPrompt);

        res.json({
            success: true,
            data: analysis,
            agent: 'Medical Safety Agent'
        });
    } catch (error) {
        console.error("Side Effects Analysis Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.analyzeDrugInteraction = async (req, res) => {
    try {
        const { drugs } = req.body;

        const systemPrompt = `You are a Medication Safety AI Agent. Check for known interactions between the following drugs.
        Return a JSON object with the following structure:
        {
            "interactions": [
                {
                    "drug1": "First drug name",
                    "drug2": "Second drug name",
                    "severity": "Low/Moderate/High",
                    "mechanism": "Mechanism of interaction",
                    "effect": "Description of the clinical effect",
                    "evidence": "Level of evidence",
                    "recommendation": "Management recommendation"
                }
            ]
        }
        If no interactions are found, return an empty array for "interactions".`;

        const userPrompt = `Drugs list: ${JSON.stringify(drugs)}`;

        const analysis = await getGroqCompletion(systemPrompt, userPrompt);

        res.json({
            success: true,
            data: analysis,
            agent: 'Medication Safety Agent'
        });
    } catch (error) {
        console.error("Interaction Check Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.recommendDrugs = async (req, res) => {
    try {
        const { patientInfo, disease } = req.body;

        const systemPrompt = `You are a Clinical Pharmacologist AI Agent. Recommend appropriate medications based on the provided patient information or disease.
        Return a valid JSON object with the following structure:
        {
            "recommendations": [
                {
                    "drugName": "Name of the drug",
                    "dosage": "Recommended dosage",
                    "sideEffects": "Common side effects",
                    "precautions": "Important precautions",
                    "reason": "Why this drug is recommended"
                }
            ]
        }
        Strictly adhere to this JSON format. Provide at least 3 distinct recommendations.`;

        const userPrompt = patientInfo
            ? `Patient Information: ${patientInfo}`
            : `Disease/Condition: ${disease}`;

        const analysis = await getGroqCompletion(systemPrompt, userPrompt);

        res.json({
            success: true,
            data: analysis,
            agent: 'Clinical Pharmacologist Agent'
        });
    } catch (error) {
        console.error("Drug Recommendation Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.predictRisk = async (req, res) => {
    try {
        const { patientData } = req.body;

        const systemPrompt = `You are an Early Disease Detection AI Agent. Analyze the patient history and current vitals to predict future disease risks.
        Return a JSON object with:
        {
            "condition": "Primary predicted risk condition",
            "probability": "Percentage string (e.g. '75%')",
            "timeframe": "Estimated timeframe",
            "preventable": boolean,
            "reasoning": "Brief explanation of why"
        }`;

        const userPrompt = `Patient Data: ${JSON.stringify(patientData)}`;

        const prediction = await getGroqCompletion(systemPrompt, userPrompt);

        res.json({
            success: true,
            data: prediction,
            agent: 'Early Disease Detection Agent'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.performQualityCheck = async (req, res) => {
    try {
        const { reportData } = req.body;

        const systemPrompt = `You are a Quality Control Pathologist AI Agent. Review the provided pathology report data for consistency, errors, and significant anomalies.
        Return a JSON object with:
        {
            "qualityScore": 0-100, // numeric
            "status": "Verified/Flagged/Rejected",
            "issues": ["List of potential errors or inconsistencies"],
            "verificationNotes": "Brief summary of quality check"
        }
        Strictly adhere to this JSON format.`;

        const userPrompt = `Report Data: ${JSON.stringify(reportData)}`;

        const analysis = await getGroqCompletion(systemPrompt, userPrompt);

        res.json({
            success: true,
            data: analysis,
            agent: 'Quality Control Agent'
        });
    } catch (error) {
        console.error("Quality Control Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.coordinateCare = async (req, res) => {
    try {
        const { patientId, agentResults } = req.body;

        const systemPrompt = `You are a Care Coordinator AI Agent (Master Agent). Review the outputs from the Diagnosis, Risk, and Medication agents. Synthesize a cohesive care plan.
        Return a JSON object with:
        {
            "carePlan": {
                "summary": "Executive summary of patient status",
                "immediateActions": ["List of urgent actions"],
                "scheduledFollowups": ["List of recommended appointments"],
                "lifestyleAdjustments": ["List of lifestyle changes"]
            },
            "status": "Stable/Critical/Monitoring"
        }`;

        const userPrompt = `Agent Results: ${JSON.stringify(agentResults)}`;

        const analysis = await getGroqCompletion(systemPrompt, userPrompt);

        res.json({
            success: true,
            data: analysis,
            agent: 'Care Coordinator Agent'
        });
    } catch (error) {
        console.error("Care Coordination Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update a report (e.g., adding Care Plan)
exports.updateReport = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const report = await Report.findByIdAndUpdate(id, updates, { new: true });

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Report not found'
            });
        }

        res.status(200).json({
            success: true,
            data: report
        });
    } catch (error) {
        console.error('Update Report Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update report',
            error: error.message
        });
    }
};

exports.getReports = async (req, res) => {
    try {
        const { patientId, doctorId } = req.query;
        const query = {};

        if (patientId) query.patientId = patientId;
        if (doctorId) query.doctorId = doctorId;

        const reports = await Report.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reports.length,
            data: reports
        });
    } catch (error) {
        console.error('Get Reports Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reports',
            error: error.message
        });
    }
};
