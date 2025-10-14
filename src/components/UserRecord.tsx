import React, { useEffect, useMemo, useState } from "react";
import { User, BriefcaseMedical, Zap, Award, Gauge, CalendarClock, MessageSquare, HeartPulse } from 'lucide-react';
import { db } from "@/firebase";
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useLocation } from "react-router-dom";

type StudentInfo = {
  name: string;
  disease: string;
  streak: number;
  moodScore: number;
  sessions: number;
  achievements: number;
};

const student: StudentInfo = {
  name: "Nikita Jadhav",
  disease: "Depression",
  streak: 7,
  moodScore: 8.2,
  sessions: 12,
  achievements: 5,
};

const stats = [
  {
    label: "Streak",
    value: `${student.streak} days`,
    color: "bg-blue-50 text-blue-700",
    icon: (
      <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <circle cx="12" cy="12" r="4" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: "Mood Score",
    value: `${student.moodScore}/10`,
    color: "bg-green-50 text-green-700",
    icon: (
      <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
        <path d="M9 14s1 2 3 2 3-2 3-2" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    label: "Sessions",
    value: student.sessions,
    color: "bg-yellow-50 text-yellow-700",
    icon: (
      <svg className="w-8 h-8 text-yellow-400" fill="none" viewBox="0 0 24 24">
        <polyline points="3 17 9 11 13 15 21 7" stroke="currentColor" strokeWidth="2" fill="none"/>
      </svg>
    ),
  },
  {
    label: "Achievements",
    value: student.achievements,
    color: "bg-green-50 text-green-700",
    icon: (
      <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
        <rect x="6" y="16" width="12" height="4" rx="2" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
];

const weeklyProgress = [
  { label: "Mood Tracking", done: 7, total: 7, units: "days", color: "bg-blue-500" },
  { label: "Mindfulness", done: 5, total: 7, units: "days", color: "bg-blue-500" },
  { label: "CBT Exercises", done: 3, total: 5, units: "completed", color: "bg-blue-500" },
];

const upcomingEvents = [
  {
    label: "Counseling Session",
    description: "Tomorrow at 2:00 PM",
    color: "bg-blue-100",
    text: "text-blue-700"
  },
  {
    label: "Weekly Check-in",
    description: "Friday at 10:00 AM",
    color: "bg-green-100",
    text: "text-green-700"
  },
];

// New data from the screenshot
const recentAssessments = [
  { name: "PHQ-9 Depression Scale", status: "Completed 2 days ago", score: "Minimal (Score: 3)" },
  { name: "GAD-7 Anxiety Scale", status: "Completed 5 days ago", score: "Mild (Score: 6)" },
];

const achievementBadges = [
  { name: "7-Day Streak", color: "bg-green-100 text-green-700", icon: <Award size={16} /> },
  { name: "Mindful Week", color: "bg-green-100 text-green-700", icon: <Award size={16} /> },
  { name: "First Assessment", color: "bg-yellow-100 text-yellow-700", icon: <Award size={16} /> },
];

// Progress bar subcomponent
const ProgressBar = ({ value, max, color }: { value: number, max: number, color: string }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
    <div className={`${color} h-2.5 rounded-full`} style={{ width: `${(value / max) * 100}%` }} />
  </div>
);

type UserRecordProps = {
  user: any;
};

const UserRecord = ({ user }: UserRecordProps) => {
  const [profileLoading, setProfileLoading] = useState(true);
  const [profile, setProfile] = useState<any | null>(null);
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [lastDiagnosticResult, setLastDiagnosticResult] = useState<string | null>(null);
  const location = useLocation();

  // Simple MCQ diagnostic definition
  const questions = useMemo(() => ([
    {
      id: "q1",
      text: "Over the past 2 weeks, how often have you felt down, depressed, or hopeless?",
      weights: { Depression: 2, Anxiety: 1, Stress: 1 },
    },
    {
      id: "q2",
      text: "Over the past 2 weeks, how often have you felt nervous, anxious, or on edge?",
      weights: { Depression: 1, Anxiety: 2, Stress: 1 },
    },
    {
      id: "q3",
      text: "Over the past 2 weeks, how often have you found it hard to relax?",
      weights: { Depression: 1, Anxiety: 1, Stress: 2 },
    },
    {
      id: "q4",
      text: "Have you experienced loss of interest or pleasure in doing things?",
      weights: { Depression: 2, Anxiety: 0, Stress: 1 },
    },
    {
      id: "q5",
      text: "Have you experienced restlessness or constant worrying?",
      weights: { Depression: 0, Anxiety: 2, Stress: 1 },
    },
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
      setProfileLoading(true);
      try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          // Initialize profile if missing
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
            const fromSignup = Boolean((location.state as any)?.newSignup);
            setShowDiagnostic(fromSignup || Boolean(data.requiresDiagnostic || data.disease == null));
            setLastDiagnosticResult(data.disease ?? null);
          }
        }
      } catch (e) {
        // In case of error, still allow UI
        if (isMounted) {
          setProfile(null);
        }
      } finally {
        if (isMounted) setProfileLoading(false);
      }
    }
    loadProfile();
    return () => { isMounted = false; };
  }, [user, location.state]);

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
    for (const key of Object.keys(scores) as (keyof typeof scores)[]) {
      if (scores[key] > scores[best]) best = key;
    }
    return best;
  }

  async function submitDiagnostic() {
    const result = computeDisease(answers);
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        disease: result,
        requiresDiagnostic: false,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      setProfile((prev: any) => ({ ...(prev || {}), disease: result, requiresDiagnostic: false }));
      setShowDiagnostic(false);
      setLastDiagnosticResult(result);
    } catch (e) {
      // keep diagnostic open if save failed
    }
  }

  function startRetake() {
    setAnswers({});
    setShowDiagnostic(true);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center p-8 font-sans">
      <div className="w-full max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Mental Health Dashboard</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area */}
          <div className="flex-1 space-y-8">
            {/* Diagnostic Modal/Card */}
            {showDiagnostic && (
              <div className="p-6 bg-white rounded-xl shadow-md border-l-4 border-indigo-500">
                <h2 className="text-xl font-semibold mb-4">Initial Diagnostic</h2>
                <p className="text-sm text-gray-600 mb-4">Please answer the following questions to help us understand your current state. You can retake this any time.</p>
                <div className="space-y-4">
                  {questions.map((q) => (
                    <div key={q.id} className="border-b pb-4">
                      <div className="font-medium mb-2">{q.text}</div>
                      <div className="flex flex-wrap gap-2">
                        {options.map((opt) => (
                          <button
                            key={opt.key}
                            className={`px-3 py-1 rounded-full border ${answers[q.id] === opt.key ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300'}`}
                            onClick={(e) => { e.preventDefault(); setAnswers(prev => ({ ...prev, [q.id]: opt.key })); }}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-3">
                  <button
                    className={`px-4 py-2 rounded-md ${allAnswered ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
                    disabled={!allAnswered}
                    type="button"
                    onClick={(e) => { e.preventDefault(); submitDiagnostic(); }}
                  >
                    Submit Diagnostic
                  </button>
                  <button
                    className="px-4 py-2 rounded-md bg-gray-100 text-gray-800"
                    type="button"
                    onClick={(e) => { e.preventDefault(); setShowDiagnostic(false); }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {/* Diagnostic Result Banner */}
            {!showDiagnostic && lastDiagnosticResult && (
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-sm text-indigo-700">Latest diagnostic result</div>
                  <div className="text-lg font-semibold text-indigo-900">{lastDiagnosticResult}</div>
                </div>
                <button
                  className="px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                  onClick={(e) => { e.preventDefault(); startRetake(); }}
                  type="button"
                >
                  Retake
                </button>
              </div>
            )}
            {/* Top Info Cards */}
            <div className="p-6 bg-white rounded-xl shadow-md border-l-4 border-indigo-500">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-2">
                  <User size={20} className="text-gray-600" />
                  <span className="text-lg font-bold text-gray-800">Name:</span> 
                  <span className="text-lg text-gray-600">{profileLoading ? 'Loading...' : displayName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BriefcaseMedical size={20} className="text-gray-600" />
                  <span className="text-lg font-bold text-gray-800">Disease:</span> 
                  <span className="text-lg text-gray-600">{profileLoading ? 'Loading...' : disease}</span>
                </div>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className={`rounded-xl shadow p-6 flex flex-col items-start space-y-2 ${stat.color}`}
                >
                  <div className="flex items-center space-x-2">
                    {stat.icon}
                    <span className="font-semibold">{stat.label}</span>
                  </div>
                  <span className="text-4xl font-extrabold">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Recent Assessments Section */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                <Gauge size={20} className="mr-2 text-gray-700" />
                Recent Assessments
              </h3>
              <div className="space-y-4">
                {recentAssessments.map((assessment, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                    <div>
                      <div className="font-semibold text-gray-800">{assessment.name}</div>
                      <div className="text-sm text-gray-500">{assessment.status}</div>
                    </div>
                    <div className="text-sm font-medium px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">{assessment.score}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Progress & Upcoming */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Weekly Progress */}
              <div className="flex-1 bg-white rounded-xl shadow p-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                  <CalendarClock size={20} className="mr-2 text-blue-500" />
                  Weekly Progress
                </h3>
                {weeklyProgress.map((item) => (
                  <div key={item.label} className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-gray-800">{item.label}</span>
                      <span className="text-gray-500 text-sm">
                        {item.done}/{item.total} {item.units}
                      </span>
                    </div>
                    <ProgressBar value={item.done} max={item.total} color={item.color} />
                  </div>
                ))}
              </div>
              
              {/* Upcoming */}
              <div className="w-full md:w-72 bg-white rounded-xl shadow p-6 h-fit">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                  <HeartPulse size={20} className="mr-2 text-red-500" />
                  Upcoming
                </h3>
                <div className="flex flex-col gap-3">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.label}
                      className={`rounded-lg ${event.color} ${event.text} px-4 py-3 shadow-sm`}
                    >
                      <div className="font-semibold">{event.label}</div>
                      <div className="text-sm">{event.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-96 space-y-8">
            {/* Achievements */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                <Award size={20} className="mr-2 text-green-500" />
                Achievements
              </h3>
              <div className="space-y-3">
                {achievementBadges.map((badge, index) => (
                  <div key={index} className={`rounded-full px-4 py-2 flex items-center space-x-2 ${badge.color}`}>
                    {badge.icon}
                    <span className="text-sm font-medium">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                <Zap size={20} className="mr-2 text-yellow-500" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full py-3 px-4 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <MessageSquare size={20} />
                  <span>Start AI Chat</span>
                </button>
                <button
                  className="w-full py-3 px-4 rounded-lg bg-gray-100 text-gray-800 font-semibold shadow-md hover:bg-gray-200 transition-colors duration-200"
                  onClick={(e) => { e.preventDefault(); startRetake(); }}
                >
                  Retake Diagnostic
                </button>
                <button className="w-full py-3 px-4 rounded-lg bg-gray-100 text-gray-800 font-semibold shadow-md hover:bg-gray-200 transition-colors duration-200">
                  Log Mood
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRecord;
