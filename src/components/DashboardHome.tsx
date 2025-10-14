import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, MessageCircle, BookOpen, Users, Shield, Award, Gauge, CalendarClock, MessageSquare, HeartPulse, Calendar, Video, Phone, Star } from "lucide-react";
import heroImage from "@/assets/hero-vitakita.jpg";
import React, { useEffect, useMemo, useState } from "react";
import { db } from "@/firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

interface DashboardHomeProps {
  setActiveSection: (section: string) => void;
  user: any;
}

const DashboardHome = ({ setActiveSection, user }: DashboardHomeProps) => {
  const features = [
    {
      icon: MessageCircle,
      title: "AI Support Chat",
      description: "24/7 empathetic support with crisis intervention guidance",
      action: () => setActiveSection('chat'),
    },
    {
      icon: BookOpen,
      title: "Wellness Resources",
      description: "Curated articles, videos, and guided relaxation content",
      action: () => setActiveSection('resources'),
    },
    {
      icon: Users,
      title: "Peer Community",
      description: "Anonymous forum for sharing experiences and support",
      action: () => setActiveSection('forum'),
    },
  ];

  // --- Merged from UserRecord: Diagnostic and Profile ---
  const [profileLoading, setProfileLoading] = useState(true);
  const [profile, setProfile] = useState<any | null>(null);
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [lastDiagnosticResult, setLastDiagnosticResult] = useState<string | null>(null);

  const questions = useMemo(() => ([
    { id: "q1", text: "Over the past 2 weeks, how often have you felt down, depressed, or hopeless?", weights: { Depression: 2, Anxiety: 1, Stress: 1 } },
    { id: "q2", text: "Over the past 2 weeks, how often have you felt nervous, anxious, or on edge?", weights: { Depression: 1, Anxiety: 2, Stress: 1 } },
    { id: "q3", text: "Over the past 2 weeks, how often have you found it hard to relax?", weights: { Depression: 1, Anxiety: 1, Stress: 2 } },
    { id: "q4", text: "Have you experienced loss of interest or pleasure in doing things?", weights: { Depression: 2, Anxiety: 0, Stress: 1 } },
    { id: "q5", text: "Have you experienced restlessness or constant worrying?", weights: { Depression: 0, Anxiety: 2, Stress: 1 } },
  ]), []);

  const options = [
    { key: "0", label: "Not at all", multiplier: 0 },
    { key: "1", label: "Several days", multiplier: 1 },
    { key: "2", label: "More than half the days", multiplier: 2 },
    { key: "3", label: "Nearly every day", multiplier: 3 },
  ];
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const allAnswered = useMemo(() => questions.every(q => answers[q.id] !== undefined), [answers, questions]);

  useEffect(() => {
    let isMounted = true;
    async function loadProfile() {
      if (!user?.uid) return;
      setProfileLoading(true);
      try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          const initProfile = {
            uid: user.uid,
            email: user.email,
            name: user.displayName || (user.email ? user.email.split('@')[0] : "User"),
            disease: null,
            requiresDiagnostic: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
          await setDoc(userRef, initProfile);
          if (isMounted) {
            setProfile({ ...initProfile, createdAt: new Date(), updatedAt: new Date() });
            setShowDiagnostic(true);
            setLastDiagnosticResult(null);
          }
        } else {
          const data = snap.data();
          if (isMounted) {
            setProfile(data);
            setShowDiagnostic(Boolean(data.requiresDiagnostic || data.disease == null));
            setLastDiagnosticResult(data.disease ?? null);
          }
        }
      } finally {
        if (isMounted) setProfileLoading(false);
      }
    }
    loadProfile();
    return () => { isMounted = false; };
  }, [user]);

  const displayName = useMemo(() => {
    if (profile?.name) return profile.name;
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return "User";
  }, [profile, user]);

  const disease = profile?.disease || "Unknown";

  function computeDisease(a: Record<string, string>) {
    const scores: Record<string, number> = { Depression: 0, Anxiety: 0, Stress: 0 };
    for (const q of questions) {
      const optKey = a[q.id];
      if (optKey == null) continue;
      const multiplier = options.find(o => o.key === optKey)?.multiplier ?? 0;
      for (const [cond, w] of Object.entries(q.weights)) {
        scores[cond] += w * multiplier;
      }
    }
    let best: keyof typeof scores = "Depression";
    (Object.keys(scores) as (keyof typeof scores)[]).forEach(k => { if (scores[k] > scores[best]) best = k; });
    return best;
  }

  async function submitDiagnostic() {
    const result = computeDisease(answers);
    if (!user?.uid) return;
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { disease: result, requiresDiagnostic: false, updatedAt: serverTimestamp() }, { merge: true });
    setProfile((prev: any) => ({ ...(prev || {}), disease: result, requiresDiagnostic: false }));
    setShowDiagnostic(false);
    setLastDiagnosticResult(result);
  }

  function startRetake() {
    setAnswers({});
    setShowDiagnostic(true);
  }

  // --- Merged from CounselingPage: Counselors and Sessions ---
  const counselors = [
    { id: 1, name: "Dr. Sarah Johnson", specialty: "Anxiety & Depression", days: "Mon, Wed, Fri", modes: ["In-person", "Video", "Phone"], rating: 4.9, experience: 8 },
    { id: 2, name: "Dr. Michael Chen", specialty: "Stress & Academic Pressure", days: "Tue, Thu, Sat", modes: ["In-person", "Video"], rating: 4.8, experience: 6 },
    { id: 3, name: "Dr. Emily Rodriguez", specialty: "Relationship & Social Issues", days: "Mon–Thu", modes: ["In-person", "Video"], rating: 4.9, experience: 10 },
  ];
  const sessions = [
    { id: 1, date: "Dec 8, 2024", time: "2:00 PM", counselor: "Dr. Sarah Johnson", status: "confirmed", mode: "Video Session" },
    { id: 2, date: "Dec 15, 2024", time: "10:00 AM", counselor: "Dr. Emily Rodriguez", status: "pending", mode: "In-person" },
  ];
  const [selectedCounselor, setSelectedCounselor] = useState<number | null>(null);

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="gradient-hero absolute inset-0 opacity-90" />
        
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary-foreground">
              VITAKITA
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 font-light">
              Your confidential digital mental health companion for higher education
            </p>
            <p className="text-lg mb-8 text-primary-foreground/80 max-w-2xl mx-auto">
              A safe, stigma-free space offering resources and tools to help you manage stress, anxiety, and mental wellness challenges.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => setActiveSection('chat')}
                className="shadow-therapeutic transition-therapeutic"
              >
                <MessageCircle className="mr-2" size={20} />
                Start AI Chat Support
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => setActiveSection('resources')}
                className="shadow-therapeutic transition-therapeutic"
              >
                <BookOpen className="mr-2" size={20} />
                Explore Resources
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Mental Wellness Toolkit</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive support designed specifically for students in higher education
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map(({ icon: Icon, title, description, action }, index) => (
            <Card
              key={index}
              className="group cursor-pointer shadow-gentle hover:shadow-therapeutic transition-therapeutic border-0 gradient-support"
              onClick={action}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-gentle">
                  <Icon size={32} className="text-primary" />
                </div>
                <CardTitle className="text-xl font-bold">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  {description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Merged: Diagnostic + Record */}
      <section className="container mx-auto px-4 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {showDiagnostic && (
              <div className="p-6 bg-white rounded-xl shadow-md border-l-4 border-indigo-500">
                <h3 className="text-xl font-semibold mb-4">Initial Diagnostic</h3>
                <p className="text-sm text-gray-600 mb-4">Answer a few questions to help tailor your experience. You can retake this anytime.</p>
                <div className="space-y-4">
                  {questions.map((q) => (
                    <div key={q.id} className="border-b pb-4">
                      <div className="font-medium mb-2">{q.text}</div>
                      <div className="flex flex-wrap gap-2">
                        {options.map((opt) => (
                          <button key={opt.key} className={`px-3 py-1 rounded-full border ${answers[q.id] === opt.key ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300'}`} onClick={(e) => { e.preventDefault(); setAnswers(prev => ({ ...prev, [q.id]: opt.key })); }}>{opt.label}</button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-3">
                  <button className={`px-4 py-2 rounded-md ${allAnswered ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`} disabled={!allAnswered} type="button" onClick={(e) => { e.preventDefault(); submitDiagnostic(); }}>Submit Diagnostic</button>
                  <button className="px-4 py-2 rounded-md bg-gray-100 text-gray-800" type="button" onClick={(e) => { e.preventDefault(); setShowDiagnostic(false); }}>Cancel</button>
                </div>
              </div>
            )}

            {!showDiagnostic && lastDiagnosticResult && (
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-sm text-indigo-700">Latest diagnostic result</div>
                  <div className="text-lg font-semibold text-indigo-900">{lastDiagnosticResult}</div>
                </div>
                <button className="px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700" onClick={(e) => { e.preventDefault(); startRetake(); }} type="button">Retake</button>
              </div>
            )}

            <div className="p-6 bg-white rounded-xl shadow-md border-l-4 border-indigo-500">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-2">
                  <Users size={20} className="text-gray-600" />
                  <span className="text-lg font-bold text-gray-800">Name:</span>
                  <span className="text-lg text-gray-600">{profileLoading ? 'Loading...' : displayName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <HeartPulse size={20} className="text-gray-600" />
                  <span className="text-lg font-bold text-gray-800">Disease:</span>
                  <span className="text-lg text-gray-600">{profileLoading ? 'Loading...' : disease}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[{ label: 'Streak', value: '7 days', color: 'bg-blue-50 text-blue-700' }, { label: 'Mood Score', value: '8.2/10', color: 'bg-green-50 text-green-700' }, { label: 'Sessions', value: '12', color: 'bg-yellow-50 text-yellow-700' }, { label: 'Achievements', value: '5', color: 'bg-green-50 text-green-700' }].map((stat) => (
                <div key={stat.label} className={`rounded-xl shadow p-6 flex flex-col items-start space-y-2 ${stat.color}`}>
                  <div className="flex items-center space-x-2">
                    <Gauge />
                    <span className="font-semibold">{stat.label}</span>
                  </div>
                  <span className="text-4xl font-extrabold">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar merged: Achievements + Quick Actions + Upcoming */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4"><Award size={20} className="mr-2 text-green-500" />Achievements</h3>
              <div className="space-y-3">
                {["7-Day Streak", "Mindful Week", "First Assessment"].map((name, i) => (
                  <div key={i} className={`rounded-full px-4 py-2 flex items-center space-x-2 ${i === 0 ? 'bg-green-100 text-green-700' : i === 1 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    <Award size={16} />
                    <span className="text-sm font-medium">{name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4"><MessageSquare size={20} className="mr-2 text-yellow-500" />Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full py-3 px-4 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"><MessageSquare size={20} /><span>Start AI Chat</span></button>
                <button className="w-full py-3 px-4 rounded-lg bg-gray-100 text-gray-800 font-semibold shadow-md hover:bg-gray-200 transition-colors duration-200" onClick={(e) => { e.preventDefault(); startRetake(); }}>Retake Diagnostic</button>
                <button className="w-full py-3 px-4 rounded-lg bg-gray-100 text-gray-800 font-semibold shadow-md hover:bg-gray-200 transition-colors duration-200">Log Mood</button>
              </div>
            </div>

            <div className="w-full bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4"><CalendarClock size={20} className="mr-2 text-blue-500" />Upcoming</h3>
              <div className="flex flex-col gap-3">
                {[{ label: 'Counseling Session', description: 'Tomorrow at 2:00 PM', color: 'bg-blue-100', text: 'text-blue-700' }, { label: 'Weekly Check-in', description: 'Friday at 10:00 AM', color: 'bg-green-100', text: 'text-green-700' }].map((event) => (
                  <div key={event.label} className={`rounded-lg ${event.color} ${event.text} px-4 py-3 shadow-sm`}>
                    <div className="font-semibold">{event.label}</div>
                    <div className="text-sm">{event.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Merged: Counseling Section */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white shadow-lg rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Choose Your Counselor</h2>
            <div className="space-y-4">
              {counselors.map((counselor) => (
                <div key={counselor.id} onClick={() => setSelectedCounselor(counselor.id)} className={`border rounded-xl p-4 cursor-pointer transition ${selectedCounselor === counselor.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{counselor.name}</h3>
                      <p className="text-sm text-gray-600">{counselor.specialty}</p>
                      <p className="text-sm text-gray-500 flex items-center mt-1"><Calendar className="w-4 h-4 mr-1" /> {counselor.days}</p>
                      <div className="flex gap-2 mt-2">
                        {counselor.modes.includes('In-person') && (<span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">In-person</span>)}
                        {counselor.modes.includes('Video') && (<span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded flex items-center"><Video className="w-3 h-3 mr-1" /> Video</span>)}
                        {counselor.modes.includes('Phone') && (<span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded flex items-center"><Phone className="w-3 h-3 mr-1" /> Phone</span>)}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="flex items-center text-yellow-500 font-medium"><Star className="w-4 h-4 mr-1 fill-yellow-400" />{counselor.rating}</p>
                      <p className="text-xs text-gray-500">{counselor.experience} years</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Upcoming Sessions</h2>
            <div className="space-y-3">
              {sessions.map((session) => (
                <div key={session.id} className="p-3 border rounded-xl flex flex-col gap-1">
                  <p className="font-medium">{session.date} - {session.time}</p>
                  <p className="text-sm text-gray-600">{session.counselor}</p>
                  <p className="text-sm text-gray-500">{session.mode}</p>
                  <span className={`text-xs font-medium px-2 py-1 rounded w-fit ${session.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{session.status}</span>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700">View All Appointments</button>
          </div>
        </div>
        {selectedCounselor && (
          <div className="md:col-span-3 bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
            <p className="text-sm text-blue-700">✅ Selected Counselor: <span className="font-semibold">{counselors.find(c => c.id === selectedCounselor)?.name}</span></p>
          </div>
        )}
      </section>

      {/* Trust & Safety Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto shadow-gentle border-0 gradient-calm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 rounded-full bg-accent/20">
              <Shield size={32} className="text-accent-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">Confidential & Secure</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Your privacy and wellbeing are our top priorities. All interactions are confidential, 
              and our AI is trained to provide supportive guidance while recognizing when professional 
              intervention may be needed.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Heart size={16} className="text-primary" />
                Anonymous Support
              </span>
              <span className="flex items-center gap-2">
                <Shield size={16} className="text-primary" />
                Secure Data
              </span>
              <span className="flex items-center gap-2">
                <Users size={16} className="text-primary" />
                Peer Moderation
              </span>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default DashboardHome;


