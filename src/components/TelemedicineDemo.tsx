import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  MessageSquare,
  FileText,
  Calendar,
  Clock,
  User,
  Stethoscope,
  Heart,
  Activity,
  Camera,
  Share2,
  Download,
  Send,
  Users,
  Shield,
  Zap,
  CheckCircle,
  AlertTriangle,
  Monitor
} from 'lucide-react';

interface TelemedicineDemoProps {
  patientData?: any;
}

const TelemedicineDemo: React.FC<TelemedicineDemoProps> = ({ patientData }) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);
  const [currentView, setCurrentView] = useState<'lobby' | 'consultation' | 'summary'>('lobby');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Dr. Smith', message: 'Hello! I can see your recent biological age analysis shows some optimization opportunities.', time: '10:30 AM', type: 'doctor' },
    { sender: 'You', message: 'Yes, I was concerned about the 3.5 year vitality gap.', time: '10:31 AM', type: 'patient' },
    { sender: 'Dr. Smith', message: 'Let me review your real-time vitals and we can discuss a longevity optimization plan.', time: '10:32 AM', type: 'doctor' }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [consultationTime, setConsultationTime] = useState(0);

  // Demo consultation timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setConsultationTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startConsultation = () => {
    setIsCallActive(true);
    setCurrentView('consultation');
  };

  const endConsultation = () => {
    setIsCallActive(false);
    setCurrentView('summary');
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages(prev => [...prev, {
        sender: 'You',
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'patient'
      }]);
      setNewMessage('');
      
      // Simulate doctor response
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          sender: 'Dr. Smith',
          message: 'I understand your concern. Based on your data, I recommend we focus on metabolic optimization first.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'doctor'
        }]);
      }, 2000);
    }
  };

  if (currentView === 'lobby') {
    return (
      <div className="space-y-6">
        {/* Telemedicine Lobby */}
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Video className="h-6 w-6 text-blue-600" />
              Telemedicine Consultation Platform
              <Badge className="bg-blue-500 text-white">DEMO</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Upcoming Appointment */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  Scheduled Consultation
                </h3>
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Stethoscope className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold">Dr. Sarah Smith</p>
                      <p className="text-sm text-gray-600">Longevity Medicine Specialist</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Badge variant="outline" className="text-xs">Board Certified</Badge>
                        <Badge variant="outline" className="text-xs">15+ Years</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>Today, 10:30 AM - 11:00 AM (30 min)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span>Biological Age Optimization Consultation</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pre-Consultation Summary */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  Pre-Consultation Summary
                </h3>
                <div className="bg-white p-4 rounded-lg border border-purple-200">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Biological Age</span>
                      <span className="font-semibold text-red-600">38.5 years</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Chronological Age</span>
                      <span className="font-semibold">35 years</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Vitality Gap</span>
                      <span className="font-semibold text-orange-600">+3.5 years</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <p className="text-xs text-gray-600 mb-2">Key Focus Areas:</p>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">Metabolic Health</Badge>
                        <Badge variant="outline" className="text-xs">Cardiovascular</Badge>
                        <Badge variant="outline" className="text-xs">Inflammation</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Connection Test */}
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Connection Ready</p>
                    <p className="text-sm text-green-600">Camera, microphone, and internet connection verified</p>
                  </div>
                </div>
                <Button onClick={startConsultation} className="bg-green-600 hover:bg-green-700">
                  <Video className="mr-2 h-4 w-4" />
                  Join Consultation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentView === 'consultation') {
    return (
      <div className="space-y-4">
        {/* Video Consultation Interface */}
        <Card className="border-2 border-green-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3">
                <Video className="h-6 w-6 text-green-600" />
                Live Consultation with Dr. Sarah Smith
                <Badge className="bg-red-500 text-white animate-pulse">LIVE</Badge>
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                {formatTime(consultationTime)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Video Area */}
              <div className="lg:col-span-2 space-y-4">
                {/* Doctor's Video */}
                <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="h-12 w-12" />
                      </div>
                      <p className="text-lg font-semibold">Dr. Sarah Smith</p>
                      <p className="text-sm opacity-75">Longevity Medicine Specialist</p>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-500 text-white">
                      <Zap className="h-3 w-3 mr-1" />
                      HD Quality
                    </Badge>
                  </div>
                </div>

                {/* Patient's Video (Picture-in-Picture) */}
                <div className="relative">
                  <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden border-2 border-white shadow-lg">
                    <div className="bg-gradient-to-br from-green-500 to-blue-500 h-full flex items-center justify-center">
                      <div className="text-center text-white">
                        <User className="h-6 w-6 mx-auto mb-1" />
                        <p className="text-xs">You</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4 p-4 bg-gray-100 rounded-lg">
                  <Button
                    variant={isAudioOn ? "default" : "destructive"}
                    size="sm"
                    onClick={() => setIsAudioOn(!isAudioOn)}
                  >
                    {isAudioOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant={isVideoOn ? "default" : "destructive"}
                    size="sm"
                    onClick={() => setIsVideoOn(!isVideoOn)}
                  >
                    {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Screen
                  </Button>
                  <Button variant="destructive" size="sm" onClick={endConsultation}>
                    <PhoneOff className="h-4 w-4 mr-2" />
                    End Call
                  </Button>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Real-Time Health Data */}
                <Card className="border border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Monitor className="h-4 w-4 text-blue-600" />
                      Live Health Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Heart Rate</span>
                      <span className="text-sm font-semibold text-red-600">72 BPM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Blood Pressure</span>
                      <span className="text-sm font-semibold text-blue-600">128/82</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Stress Level</span>
                      <span className="text-sm font-semibold text-yellow-600">Moderate</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Biological Age</span>
                      <span className="text-sm font-semibold text-orange-600">38.5 years</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Chat */}
                <Card className="border border-purple-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-purple-600" />
                      Consultation Chat
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-40 overflow-y-auto mb-3">
                      {chatMessages.map((msg, index) => (
                        <div key={index} className={`text-xs p-2 rounded ${
                          msg.type === 'doctor' ? 'bg-blue-50 border-l-2 border-blue-400' : 'bg-green-50 border-l-2 border-green-400'
                        }`}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{msg.sender}</span>
                            <span className="text-gray-500">{msg.time}</span>
                          </div>
                          <p>{msg.message}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        className="text-xs"
                      />
                      <Button size="sm" onClick={sendMessage}>
                        <Send className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                      <FileText className="h-3 w-3 mr-2" />
                      Share Lab Results
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                      <Camera className="h-3 w-3 mr-2" />
                      Take Photo
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                      <Calendar className="h-3 w-3 mr-2" />
                      Schedule Follow-up
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentView === 'summary') {
    return (
      <div className="space-y-6">
        {/* Consultation Summary */}
        <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              Consultation Complete
              <Badge className="bg-green-500 text-white">SUCCESS</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Consultation Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Session Summary</h3>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-semibold">{formatTime(consultationTime)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Doctor:</span>
                      <span className="font-semibold">Dr. Sarah Smith</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Consultation Type:</span>
                      <span className="font-semibold">Longevity Optimization</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Treatment Plan */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personalized Treatment Plan</h3>
                <div className="bg-white p-4 rounded-lg border">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Metabolic Optimization Protocol</p>
                        <p className="text-xs text-gray-600">Continuous glucose monitoring for 2 weeks</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Anti-Inflammatory Diet Plan</p>
                        <p className="text-xs text-gray-600">Mediterranean diet with omega-3 supplementation</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Exercise Prescription</p>
                        <p className="text-xs text-gray-600">HIIT 3x/week + strength training 2x/week</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Follow-up Appointment</p>
                        <p className="text-xs text-gray-600">4 weeks - Progress evaluation</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Expected Outcomes */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Expected Outcomes</h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <p className="font-semibold text-blue-600">2-3 Years</p>
                  <p className="text-blue-700">Biological Age Reduction</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-green-600">15-20%</p>
                  <p className="text-green-700">Vitality Score Improvement</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-purple-600">6-8 Weeks</p>
                  <p className="text-purple-700">Noticeable Health Improvements</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <Button className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download Treatment Plan
              </Button>
              <Button variant="outline" className="flex-1">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Follow-up
              </Button>
              <Button variant="outline" onClick={() => setCurrentView('lobby')}>
                <Video className="mr-2 h-4 w-4" />
                New Consultation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default TelemedicineDemo;