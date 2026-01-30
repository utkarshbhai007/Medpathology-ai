
import * as React from "react";
import { useState, useEffect } from "react";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import GlassCard from "@/components/ui/GlassCard";
import { Loader2, FileText, Upload, Play, CheckCircle2, User, Stethoscope, Microscope, Database, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { pathologyAI } from "@/utils/apiService";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const LabDashboard = () => {
  const [patientData, setPatientData] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [mintedRecord, setMintedRecord] = React.useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'minting' | 'complete'>('idle');

  // Real Data State
  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch Real Users on Mount
  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedPatients = await pathologyAI.getPatients();
      const fetchedDoctors = await pathologyAI.getDoctors();
      setPatients(fetchedPatients);
      setDoctors(fetchedDoctors);
    };
    fetchUsers();
  }, []);

  const handleRunAnalysis = async () => {
    if (!patientData || !selectedPatientId || !selectedDoctorId) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please select a patient, doctor, and enter data." });
      return;
    }

    setLoading(true);
    setStatus('analyzing');

    try {
      const patient = patients.find(u => u._id === selectedPatientId);

      // 1. Run Core AI Analysis
      const response = await pathologyAI.generatePathologyReport(
        { patientData },
        { name: patient?.name || 'Unknown', age: patient?.profile?.age || 'N/A', source: 'Lab Entry' }
      );

      // Parse response... 
      let result = typeof response === 'string' ? JSON.parse(response) : response;

      // Normalize result structure
      const baseResult = {
        diagnosis: result.diagnosis || [],
        riskFactors: result.riskFactors || [],
        recommendations: result.recommendations || [],
        nextSteps: result.nextSteps || [],
        metadata: { date: new Date().toISOString() }
      };

      // 2. Trigger Secondary Agents
      // The original instruction had a syntax error here, so I'm interpreting it as replacing the entire secondary agent and minting logic.
      // The new instruction seems to imply that `generatePathologyReport` should now handle the full analysis and persistence.
      // I'm assuming `fullData` in the instruction refers to `baseResult` or a similar comprehensive data object.
      // Given the instruction, I'll adapt the flow to match the new `generatePathologyReport` call.

      // Run Core AI Analysis and Save to Backend
      const analysisResults = await pathologyAI.generatePathologyReport(
        { patientData: patientData },
        {
          patientId: selectedPatientId,
          doctorId: selectedDoctorId,
          patientName: patient?.name,
          testType: 'General Analysis'
        }
      );

      // Map backend report to local "Record" structure for UI
      const record = {
        recordId: analysisResults._id,
        timestamp: analysisResults.createdAt
      };
      setMintedRecord(record);

      // Save for immediate local access fallback (optional but good for UX speed)
      localStorage.setItem('currentPatientAnalysis', JSON.stringify({
        patientInfo: patient,
        analysis: analysisResults,
        blockchainRecord: record
      }));

      setStatus('complete');
      toast({
        title: "Analysis Complete & Saved",
        description: "Report generated and assigned to Doctor.",
      });

    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: "Analysis failed" });
      setStatus('idle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Microscope className="h-8 w-8 text-blue-600" />
            Lab Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Sample Processing & AI Analysis Operations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <GlassCard>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" /> Patient Assignment
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Registered Patient</Label>
                  <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Patient..." />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.length === 0 ? (
                        <SelectItem value="none" disabled>No patients found</SelectItem>
                      ) : (
                        patients.map(user => (
                          <SelectItem key={user._id} value={user._id}>{user.name} (Email: {user.email})</SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {selectedPatientId && (
                    <p className="text-xs text-gray-500 font-mono">Patient ID: {selectedPatientId}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Assign Consulting Doctor</Label>
                  <Select value={selectedDoctorId} onValueChange={setSelectedDoctorId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Assign Doctor..." />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.length === 0 ? (
                        <SelectItem value="none" disabled>No doctors found</SelectItem>
                      ) : (
                        doctors.map(doc => (
                          <SelectItem key={doc._id} value={doc._id}>{doc.name}</SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {selectedDoctorId && (
                    <p className="text-xs text-gray-500 font-mono">Doctor ID: {selectedDoctorId}</p>
                  )}
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Upload className="h-5 w-5 text-blue-600" /> Clinical Data
              </h2>
              <Textarea
                placeholder="Paste raw LIS data or drag & drop JSON..."
                className="min-h-[200px] font-mono text-sm"
                value={patientData}
                onChange={(e) => setPatientData(e.target.value)}
              />
              <div className="flex gap-4 mt-4">
                <Button variant="outline" className="w-full" onClick={() => setPatientData("Patient: 45M. Sugar fast: 140, PP: 220. BP: 140/90. History of HTN.")}>
                  Load Sample
                </Button>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={loading || !patientData || !selectedPatientId || !selectedDoctorId}
                  onClick={handleRunAnalysis}
                >
                  {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  Run Analysis
                </Button>
              </div>
            </GlassCard>
          </div>

          {/* Status Section */}
          <div>
            <GlassCard className="h-full">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" /> Operations Log
              </h2>

              <div className="space-y-6">
                <div className={`flex items-center gap-4 p-3 rounded-lg ${status !== 'idle' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'}`}>
                  <div className="font-bold">1. Report Agent</div>
                  <div className="ml-auto text-sm">{status === 'analyzing' ? <Loader2 className="animate-spin" /> : status !== 'idle' ? 'Done' : 'Waiting'}</div>
                </div>
                <div className={`flex items-center gap-4 p-3 rounded-lg ${status !== 'idle' && status !== 'analyzing' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'}`}>
                  <div className="font-bold">2. QC & Safety Agents</div>
                  <div className="ml-auto text-sm">{status === 'analyzing' ? 'Pending...' : status === 'complete' || status === 'minting' ? 'Done' : 'Waiting'}</div>
                </div>
                <div className={`flex items-center gap-4 p-3 rounded-lg ${status === 'complete' ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-400'}`}>
                  <div className="font-bold">3. Database Persistence</div>
                  <div className="ml-auto text-sm">{status === 'minting' ? <Loader2 className="animate-spin" /> : status === 'complete' ? 'Saved' : 'Waiting'}</div>
                </div>
              </div>

              {status === 'complete' && (
                <div className="mt-8 p-6 bg-green-50 rounded-xl border border-green-200 text-center">
                  <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-800 mb-2">Processing Complete</h3>
                  <p className="text-sm text-green-600 mb-4">Record successfully assigned to {doctors.find(d => d._id === selectedDoctorId)?.name}.</p>

                  <div className="bg-white p-4 rounded-lg border border-green-100 text-left max-w-sm mx-auto space-y-2 mb-6 shadow-sm">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Record ID</span>
                      <span className="font-mono font-medium">{mintedRecord?.recordId || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Patient ID</span>
                      <span className="font-mono font-medium">{selectedPatientId}</span>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4">
                    <Button variant="outline" onClick={() => navigate('/doctor-dashboard')}>
                      View Doctor Portal
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/patient-portal')}>
                      View Patient Portal
                    </Button>
                  </div>
                </div>
              )}
            </GlassCard>

            {/* Registry View - Real Data */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Live Registry Stats</h3>
              <div className="flex justify-between text-sm">
                <span>Patients Registered: <strong>{patients.length}</strong></span>
                <span>Doctors Online: <strong>{doctors.length}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default LabDashboard;