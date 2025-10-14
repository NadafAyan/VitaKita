import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Shield, SmilePlus, Star, UsersRound } from "lucide-react";
import heroImage from "@/assets/hero-vitakita.jpg";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Local animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background image and gradient veil */}
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${heroImage})` }} />
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" style={{ animation: 'float 8s ease-in-out infinite' }} />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl" style={{ animation: 'float 9s ease-in-out infinite 0.4s' }} />
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="max-w-4xl">
              <span className="inline-flex items-center gap-2 text-primary font-medium bg-primary/10 text-primary-700 px-3 py-1 rounded-full" style={{ animation: 'fadeInUp .6s ease both' }}>Your private mental wellness companion</span>
              <h1 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900" style={{ animation: 'fadeInUp .7s ease both .05s' }}>
                Feel better, one small step at a time
              </h1>
              <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-2xl" style={{ animation: 'fadeInUp .8s ease both .1s' }}>
                VITAKITA blends compassionate AI support, evidence-based tools, and a caring community to help you manage stress, anxiety, and everyday challenges.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4" style={{ animation: 'fadeInUp .9s ease both .15s' }}>
                <Button size="lg" className="shadow-therapeutic" onClick={() => navigate('/?auth=1')}>
                  Join VITAKITA
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/?auth=1')}>Sign In</Button>
              </div>
              <div className="mt-4 text-sm text-slate-500" style={{ animation: 'fadeInUp 1s ease both .2s' }}>Confidential. Secure. Free for students.</div>
            </div>

            {/* Illustration */}
            <div className="relative">
              <div className="absolute -inset-8 bg-gradient-to-tr from-primary/10 to-emerald-100/40 rounded-3xl blur-xl" />
              <div className="relative rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-sm shadow-gentle p-6" style={{ animation: 'float 7.5s ease-in-out infinite' }}>
                <svg viewBox="0 0 400 260" className="w-full h-auto">
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6C63FF" />
                      <stop offset="100%" stopColor="#22C55E" />
                    </linearGradient>
                  </defs>
                  <rect x="16" y="20" width="368" height="180" rx="16" fill="#F8FAFC" stroke="#E2E8F0" />
                  <circle cx="72" cy="80" r="28" fill="url(#grad)" opacity="0.9" />
                  <rect x="120" y="62" width="180" height="14" rx="7" fill="#CBD5E1" />
                  <rect x="120" y="90" width="140" height="12" rx="6" fill="#E2E8F0" />
                  <rect x="120" y="112" width="200" height="8" rx="4" fill="#E2E8F0" />
                  <rect x="32" y="212" width="336" height="8" rx="4" fill="#E5E7EB" />
                  <g>
                    <rect x="32" y="146" width="112" height="44" rx="10" fill="#EEF2FF" />
                    <rect x="156" y="146" width="112" height="44" rx="10" fill="#ECFDF5" />
                    <rect x="280" y="146" width="56" height="44" rx="10" fill="#F1F5F9" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-gentle">
            <CardHeader>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><SmilePlus className="text-primary" size={20} /></div>
              <CardTitle>Compassionate AI</CardTitle>
              <CardDescription>24/7 supportive conversations that listen without judgement.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-0 shadow-gentle">
            <CardHeader>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><Star className="text-primary" size={20} /></div>
              <CardTitle>Evidence‑based tools</CardTitle>
              <CardDescription>CBT exercises, mindfulness, and guided journaling built‑in.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-0 shadow-gentle">
            <CardHeader>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><UsersRound className="text-primary" size={20} /></div>
              <CardTitle>Supportive community</CardTitle>
              <CardDescription>Connect anonymously with peers and learn from shared experiences.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Trust */}
      <section className="container mx-auto px-4 pb-20">
        <Card className="max-w-4xl mx-auto border-0 shadow-gentle">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 rounded-full bg-emerald-50">
              <Shield size={28} className="text-emerald-600" />
            </div>
            <CardTitle className="text-2xl">Confidential & secure</CardTitle>
            <CardDescription>We respect your privacy. Your conversations are protected and never shared without your consent.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><Heart size={16} className="text-primary" /> Always here for you</span>
              <span className="flex items-center gap-2"><Shield size={16} className="text-primary" /> Secure by design</span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Begin your wellness journey</h2>
        <p className="text-lg text-muted-foreground mb-6">Join thousands of students building healthier habits with VitaKita.</p>
        <Button size="lg" className="shadow-therapeutic" onClick={() => navigate('/?auth=1')}>
          Get Started
        </Button>
      </section>
    </div>
  );
};

export default HomePage;