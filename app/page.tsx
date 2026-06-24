import Link from "next/link";
import {
  Brain, Users, Megaphone, BarChart3, Globe, MessageSquare, Phone,
  FileText, CheckCircle2, ArrowRight, Sparkles, Zap, Shield, Star,
  Building2, ShoppingCart, Home, HeartPulse, Scale, GraduationCap, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const NAV_LINKS = ["Features", "Solutions", "Pricing", "Testimonials"];

const FEATURES = [
  { icon: Brain, title: "AI CEO Mode", description: "Give a goal. Watch it happen. Your AI CEO analyzes data, proposes ranked strategies, and executes them — automatically.", color: "text-violet-600", bg: "bg-violet-50" },
  { icon: Users, title: "AI CRM", description: "Auto-capture leads from every channel. AI lead scoring 0–100, smart follow-up sequences, and full pipeline management.", color: "text-blue-600", bg: "bg-blue-50" },
  { icon: Megaphone, title: "AI Marketing Engine", description: "Campaigns that write themselves, optimize spend, and report results across Facebook, Google, Email, and SEO.", color: "text-orange-600", bg: "bg-orange-50" },
  { icon: Globe, title: "AI Website Builder", description: "Prompt to live website in 30 seconds. Edit with chat. One-click publish to your custom domain with SEO built-in.", color: "text-green-600", bg: "bg-green-50" },
  { icon: MessageSquare, title: "AI WhatsApp Agent", description: "Lead capture, FAQ automation, appointment booking — running 24/7 on WhatsApp with human handoff when needed.", color: "text-emerald-600", bg: "bg-emerald-50" },
  { icon: Phone, title: "AI Voice Agent", description: "Answer calls 24/7, qualify leads in real-time, and book appointments — with a natural ElevenLabs AI voice.", color: "text-pink-600", bg: "bg-pink-50" },
  { icon: BarChart3, title: "AI Analytics", description: "Ask questions in plain English. Get instant insights on revenue, campaigns, and customer behavior with ML forecasting.", color: "text-indigo-600", bg: "bg-indigo-50" },
  { icon: FileText, title: "Document Center", description: "AI-generated proposals, contracts, NDAs, and SOWs. Send for e-signature and auto-archive to client records.", color: "text-teal-600", bg: "bg-teal-50" },
  { icon: Shield, title: "AI Compliance Assistant", description: "GDPR, HIPAA, CCPA checklists. Contract clause scanner. Policy generator. Jurisdiction-aware compliance tracking.", color: "text-red-600", bg: "bg-red-50" },
];

const PLANS = [
  {
    name: "Starter", price: 49, annual: 39, users: "1 user", requests: "1,000 AI req/mo",
    features: ["CRM", "Website Builder", "Basic Analytics", "Invoice Management", "Email Support"],
    cta: "Start Free Trial", popular: false,
  },
  {
    name: "Professional", price: 149, annual: 119, users: "5 users", requests: "5,000 AI req/mo",
    features: ["Everything in Starter", "AI Marketing Engine", "WhatsApp Agent", "AI CEO Mode (Basic)", "Priority Support"],
    cta: "Start Free Trial", popular: true,
  },
  {
    name: "Business", price: 349, annual: 279, users: "20 users", requests: "20,000 AI req/mo",
    features: ["Everything in Professional", "Voice Agent", "AI CEO Mode (Full)", "Team Manager", "Document Center", "Dedicated Support"],
    cta: "Start Free Trial", popular: false,
  },
];

const TESTIMONIALS = [
  { name: "James Okonkwo", role: "Founder, GrowthLab Agency", avatar: "JO", rating: 5, text: "NEXORA replaced 6 tools we were paying for. Our client reporting that used to take 4 hours now takes 10 minutes. The AI CEO mode is genuinely impressive — it found a campaign opportunity we completely missed." },
  { name: "Priya Mehta", role: "CMO, ShopNova", avatar: "PM", rating: 5, text: "We launched a Facebook campaign using the AI marketing engine and got a 4.2x ROAS in the first week. The AI-generated ad copy outperformed our in-house creative team. Wild." },
  { name: "Carlos Reyes", role: "CEO, RealEdge Properties", avatar: "CR", rating: 5, text: "The WhatsApp agent qualifies leads while I sleep. I wake up to a CRM full of scored prospects with conversation summaries. Our conversion rate went up 31% in the first month." },
  { name: "Aisha Balogun", role: "Operations Head, MedBook", avatar: "AB", rating: 5, text: "Healthcare compliance is complex. NEXORA's compliance assistant keeps us HIPAA-aware and the voice agent handles appointment scheduling perfectly. Our front desk workload dropped 60%." },
  { name: "Tom Fischer", role: "Partner, LexAI Legal", avatar: "TF", rating: 5, text: "Document generation alone saves us 10+ hours a week. Proposals that used to take half a day are ready in 3 minutes. The e-signature integration is seamless." },
  { name: "Sarah Kim", role: "Director, EduScale", avatar: "SK", rating: 5, text: "We manage 2,000 student leads with a team of 3. NEXORA's CRM and WhatsApp agent make it possible. The AI CEO gave us a student retention strategy that increased enrollment by 18%." },
];

const SOLUTIONS = [
  { id: "agencies", icon: Building2, label: "Agencies", color: "text-violet-600", bg: "bg-violet-50", headline: "Run 10 clients like a 50-person agency", points: ["White label the entire platform under your brand", "AI-generated client reports in one click", "Manage all client campaigns from one dashboard", "Automated lead capture for every client website", "Resell to clients at your own pricing"] },
  { id: "ecommerce", icon: ShoppingCart, label: "E-commerce", color: "text-blue-600", bg: "bg-blue-50", headline: "Turn more visitors into customers, automatically", points: ["AI ad campaigns that optimize ROAS 24/7", "Abandoned cart recovery via WhatsApp + Email", "AI-generated product descriptions and blog content", "Revenue and cohort analytics in plain English", "Automated post-purchase follow-up sequences"] },
  { id: "realestate", icon: Home, label: "Real Estate", color: "text-green-600", bg: "bg-green-50", headline: "Never miss a lead. Close deals faster.", points: ["WhatsApp agent qualifies buyers and sellers 24/7", "CRM with AI lead scoring for every inquiry", "Automated property listing pages via website builder", "Voice agent for inbound call qualification", "Document center for contracts and agreements"] },
  { id: "healthcare", icon: HeartPulse, label: "Healthcare", color: "text-red-600", bg: "bg-red-50", headline: "Better patient experience. Less admin work.", points: ["HIPAA-aware compliance assistant built-in", "Voice agent handles appointment booking calls", "WhatsApp agent for patient FAQ and reminders", "GDPR-compliant data handling throughout", "Automated patient satisfaction surveys via voice"] },
  { id: "legal", icon: Scale, label: "Legal", color: "text-amber-600", bg: "bg-amber-50", headline: "Generate documents. Win more clients.", points: ["AI-generated proposals, contracts, and NDAs in minutes", "Contract clause risk scanner", "Client intake via WhatsApp agent", "E-signature integration (DocuSign / Anvil)", "Automated billing and invoice management"] },
  { id: "education", icon: GraduationCap, label: "Education", color: "text-indigo-600", bg: "bg-indigo-50", headline: "Scale student communications without scaling headcount.", points: ["WhatsApp agent handles student FAQ at any scale", "CRM for managing student leads and enrollment", "AI marketing for admissions campaigns", "Voice agent for inbound inquiry calls", "Analytics on enrollment funnel and retention"] },
];

const CASE_STUDIES = [
  { company: "GrowthLab Agency", industry: "Digital Agency", metric: "+340%", metricLabel: "Client retention revenue", description: "Switched from 8 tools to NEXORA. Used white label to resell to 12 clients at $399/month each." },
  { company: "ShopNova", industry: "E-commerce", metric: "4.2x", metricLabel: "ROAS on AI campaigns", description: "AI marketing engine generated and optimized Facebook and Google ads. Scaled from $5K to $40K monthly ad spend profitably." },
  { company: "RealEdge Properties", industry: "Real Estate", metric: "+31%", metricLabel: "Lead conversion rate", description: "WhatsApp agent pre-qualified 200+ leads per month. AI CRM scoring helped team focus on highest-value prospects." },
];

const FOOTER_LINKS = {
  Product: ["Features", "Pricing", "Changelog", "Roadmap", "Status"],
  Solutions: ["Agencies", "E-commerce", "Real Estate", "Healthcare", "Legal"],
  Resources: ["Documentation", "API Reference", "Blog", "Case Studies", "Webinars"],
  Company: ["About", "Careers", "Press", "Privacy Policy", "Terms of Service"],
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">NEXORA AI</span>
          </Link>
          <div className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                {l}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Link href="/sign-in"><Button variant="ghost" size="sm">Sign in</Button></Link>
            <Link href="/sign-up"><Button size="sm" className="gap-1.5">Start Free <span className="hidden sm:inline">Trial</span></Button></Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-950 via-gray-950 to-gray-900 px-4 sm:px-6 py-24 md:py-36 text-center">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl">
          <Badge className="mb-6 bg-violet-600/20 text-violet-300 border-violet-500/30 hover:bg-violet-600/20 cursor-default">
            <Zap className="mr-1 h-3 w-3" /> Now in Beta — 14-Day Free Trial, No Credit Card
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl leading-tight">
            The AI Operating System<br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-blue-400 bg-clip-text text-transparent">
              For Modern Businesses
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Describe your business. NEXORA launches it, runs it, and grows it — automatically.
            Replaces HubSpot, Salesforce, Shopify, and Notion in one AI-native platform.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/sign-up">
              <Button size="lg" className="gap-2 text-base px-8 h-12">
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="text-base px-8 h-12 border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent">
                View Live Demo
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">No credit card required · 14-day free trial · Cancel anytime</p>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {[
              { value: "10,000+", label: "Businesses" },
              { value: "$50M+", label: "Revenue Tracked" },
              { value: "99.9%", label: "Uptime SLA" },
              { value: "4.9★", label: "Avg. Rating" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="border-b border-gray-100 bg-gray-50 py-5">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-gray-500">
            <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-green-500" />SOC2 Ready</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />GDPR Compliant</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />HIPAA Aware</div>
            <div className="flex items-center gap-2"><Zap className="h-4 w-4 text-violet-500" />Powered by Claude 3.5</div>
            <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-blue-500" />AES-256 Encryption</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" />99.9% Uptime SLA</div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="px-4 sm:px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <Badge className="mb-4 bg-violet-100 text-violet-700 border-0">9 Powerful Modules</Badge>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Everything your business needs</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto text-lg">One subscription. One platform. Zero switching costs.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="group rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-lg hover:border-violet-200 transition-all">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${f.bg}`}>
                  <f.icon className={`h-6 w-6 ${f.color}`} />
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTIONS ── */}
      <section id="solutions" className="bg-gray-50 px-4 sm:px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <Badge className="mb-4 bg-blue-100 text-blue-700 border-0">Built For Your Industry</Badge>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Solutions for every vertical</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">NEXORA adapts to your business — not the other way around.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SOLUTIONS.map((sol) => (
              <div key={sol.id} className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-md hover:border-violet-200 transition-all">
                <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${sol.bg} mb-4`}>
                  <sol.icon className={`h-5 w-5 ${sol.color}`} />
                </div>
                <h3 className="font-semibold text-gray-900 text-base">{sol.label}</h3>
                <p className="text-sm font-medium text-violet-600 mt-1 mb-3">{sol.headline}</p>
                <ul className="space-y-2">
                  {sol.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />{pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CASE STUDIES ── */}
      <section className="px-4 sm:px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <Badge className="mb-4 bg-green-100 text-green-700 border-0">Real Results</Badge>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">What businesses achieved with NEXORA</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {CASE_STUDIES.map((cs) => (
              <div key={cs.company} className="rounded-2xl border border-gray-200 bg-white p-7 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700 font-bold text-sm shrink-0">
                    {cs.company.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{cs.company}</p>
                    <p className="text-xs text-gray-400">{cs.industry}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-4xl font-extrabold text-violet-600">{cs.metric}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{cs.metricLabel}</p>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{cs.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="bg-gray-50 px-4 sm:px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-14">
            <Badge className="mb-4 bg-amber-100 text-amber-700 border-0">Customer Love</Badge>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Trusted by business owners worldwide</h2>
            <p className="mt-3 text-gray-500">Real people. Real results. No fake reviews.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-2xl border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow flex flex-col">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="px-4 sm:px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <Badge className="mb-4 bg-violet-100 text-violet-700 border-0">Pricing</Badge>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Simple, transparent pricing</h2>
            <p className="mt-3 text-gray-500 text-lg">Start free. Scale as you grow. Save 20% with annual billing.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {PLANS.map((plan) => (
              <div key={plan.name} className={`relative rounded-2xl border p-7 flex flex-col ${plan.popular ? "border-violet-500 shadow-xl shadow-violet-100 ring-1 ring-violet-500 bg-white" : "border-gray-200 bg-white"}`}>
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge className="bg-violet-600 text-white text-xs px-3">Most Popular</Badge>
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{plan.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500">/mo</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">or ${plan.annual}/mo billed annually</p>
                  <p className="text-sm text-gray-500 mt-1">{plan.users} · {plan.requests}</p>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-violet-500" />{f}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/sign-up" className="mt-8 block">
                  <Button className="w-full h-11" variant={plan.popular ? "default" : "outline"}>{plan.cta}</Button>
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center text-sm text-gray-500 space-y-2">
            <p>All plans include a <strong>14-day free trial</strong>. No credit card required.</p>
            <p>Need more? <a href="mailto:sales@nexora.ai" className="text-violet-600 hover:underline font-medium">Contact us for Enterprise & White Label pricing →</a></p>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 to-indigo-700 px-4 sm:px-6 py-20 text-center">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Ready to run your business on AI?</h2>
          <p className="mt-4 text-lg text-violet-100">
            Join thousands of businesses using NEXORA to automate operations, close more deals, and grow faster.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sign-up">
              <Button size="lg" className="bg-white text-violet-700 hover:bg-gray-100 gap-2 h-12 px-8 font-semibold">
                Start Free Trial <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent h-12 px-8">
                View Live Demo
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-violet-300">14 days free · No credit card · Cancel anytime</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-200 bg-white px-4 sm:px-6 pt-16 pb-10">
        <div className="mx-auto max-w-7xl">
          {/* Top section */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5 mb-12">
            {/* Brand */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-gray-900">NEXORA AI</span>
              </Link>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                The AI-native Business Operating System. Build, automate, and scale everything from one platform.
              </p>
              <div className="flex items-center gap-3 mt-5">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-violet-600 hover:border-violet-300 transition-colors" aria-label="X / Twitter">
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-violet-600 hover:border-violet-300 transition-colors" aria-label="LinkedIn">
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-violet-600 hover:border-violet-300 transition-colors" aria-label="GitHub">
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Links */}
            {Object.entries(FOOTER_LINKS).map(([category, links]) => (
              <div key={category}>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-900 mb-4">{category}</p>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-gray-500 hover:text-violet-600 transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} NEXORA AI Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-600 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-gray-600 transition-colors">Cookie Policy</a>
              <a href="mailto:support@nexora.ai" className="hover:text-gray-600 transition-colors">support@nexora.ai</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
