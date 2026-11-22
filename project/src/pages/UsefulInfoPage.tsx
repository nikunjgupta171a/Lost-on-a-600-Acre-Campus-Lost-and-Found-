import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Img } from '../components/Img';
import { Link } from '../router';
import { IMAGES, FAQS } from '../data';
import {
  ShieldCheck, MapPin, Package, Search, Lock, HelpCircle, Mail, Phone,
  ChevronDown, Info as InfoIcon, BookOpen, Users, ArrowRight, Clock,
} from 'lucide-react';

export function UsefulInfoPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const sections = [
    { icon: Search, title: 'How Campus Lost & Found Works', desc: 'Report lost items, post found items, and get matched automatically.', img: IMAGES.howItWorks },
    { icon: MapPin, title: 'Security Desk Locations', desc: 'Main Administrative Block, Ground Floor. Open 8 AM – 10 PM.', img: IMAGES.securityDesk },
    { icon: Package, title: 'Campus Drop Points', desc: 'QR-enabled drop points at Library, Mess B, Student Centre, and Main Gate.', img: IMAGES.studentCentre },
    { icon: Lock, title: 'Item Verification Guidelines', desc: 'Three-question verification protects against fraudulent claims.', img: IMAGES.library },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title="Useful Information" subtitle="Everything you need to know about the Campus Lost & Found system." />

      {/* Info cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {sections.map((s, i) => (
          <div key={s.title} className="card group overflow-hidden transition hover:shadow-lift">
            <div className="relative h-44 overflow-hidden">
              <Img src={s.img} alt={s.title} fallbackIndex={i} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-700/80 to-transparent" />
              <div className="absolute bottom-3 left-4 flex items-center gap-2 text-white">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold">{s.title}</h3>
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm text-muted">{s.desc}</p>
              <Link to={i === 1 || i === 2 ? '/map' : i === 3 ? '/find' : '/'} className="mt-3 flex items-center gap-1 text-sm font-semibold text-orange-600 hover:gap-2">
                Learn more <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* How it works steps */}
      <div className="card p-6">
        <h2 className="font-display text-lg font-semibold text-ink">How to Claim an Item</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
          {[
            { icon: Search, t: 'Find your item', d: 'Browse the Find Items board.' },
            { icon: ShieldCheck, t: 'Click Claim', d: 'Start verification from item page.' },
            { icon: Lock, t: 'Answer 3 questions', d: 'Prove ownership with details.' },
            { icon: Package, t: 'Collect', d: 'Pick up from Security Desk.' },
          ].map((step, i) => (
            <div key={i} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-navy-50 text-navy-600">
                <step.icon className="h-6 w-6" />
              </div>
              <p className="mt-2 text-sm font-semibold text-ink">{i + 1}. {step.t}</p>
              <p className="text-xs text-muted">{step.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-line px-6 py-4">
          <HelpCircle className="h-5 w-5 text-orange-600" />
          <h2 className="font-display text-lg font-semibold text-ink">Frequently Asked Questions</h2>
        </div>
        <div className="divide-y divide-line">
          {FAQS.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-4 text-left transition hover:bg-canvas"
              >
                <span className="text-sm font-semibold text-ink">{faq.q}</span>
                <ChevronDown className={`h-5 w-5 shrink-0 text-muted transition ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-6 pb-4 text-sm leading-relaxed text-muted animate-slide-up">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact support */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="card flex items-center gap-4 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold text-ink">Email Support</p>
            <p className="text-sm text-muted">lostfound@lpu.co.in</p>
          </div>
        </div>
        <div className="card flex items-center gap-4 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-50 text-navy-600">
            <Phone className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold text-ink">Security Desk Helpline</p>
            <p className="text-sm text-muted">+91-181-244-2104 (ext. 2104)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
