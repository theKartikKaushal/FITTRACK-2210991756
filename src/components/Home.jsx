import React from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import {
  ChevronDown, Dumbbell, BarChart2, Pill,
  Zap, Smartphone, Users, Lock, ArrowRight,
  Phone, Mail, MapPin,
} from 'lucide-react'
import o1  from "../assets/images/a10.jpg"
import o2  from "../assets/images/o7.jpg"
import o11 from "../assets/images/ph2.jpg"

const features = [
  {
    icon: Dumbbell,
    color: '#A78BFA',
    title: 'Workout Tracking',
    desc: 'Log every rep, set and session. Track your exercises daily and build consistent habits that get results.',
  },
  {
    icon: BarChart2,
    color: '#38BDF8',
    title: 'Data Visualisation',
    desc: 'Beautiful graphs and charts give you a clear picture of your progress — calories, steps, weight trends and more.',
  },
  {
    icon: Pill,
    color: '#F472B6',
    title: 'Medicine Tracker',
    desc: 'Never miss a dose. Smart reminders sorted by Morning, Afternoon and Night keep your health on track.',
  },
]

export default function Home() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  return (
    <div style={{ minHeight: '100vh', background: '#0F0A1E', color: '#fff', fontFamily: '"Sora","Inter",sans-serif', overflowX: 'hidden' }}>

      {/* Scroll progress bar */}
      <motion.div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 50,
        background: 'linear-gradient(90deg,#7C3AED,#EC4899)', transformOrigin: '0%', scaleX,
      }} />

      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src={o1} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#0F0A1E 0%,rgba(124,58,237,0.4) 50%,#0F0A1E 100%)' }} />
        </div>
        <div style={{ position: 'absolute', top: '15%', left: '8%', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.25) 0%,transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '8%', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle,rgba(236,72,153,0.2) 0%,transparent 70%)', filter: 'blur(40px)' }} />

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 20px', maxWidth: 860, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)',
              borderRadius: 100, padding: '7px 18px', fontSize: 13, fontWeight: 600,
              color: '#C4B5FD', marginBottom: 28, letterSpacing: '0.04em',
            }}
          >
            <Zap size={13} /> YOUR ULTIMATE FITNESS COMPANION
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
            style={{ fontSize: 'clamp(40px,7vw,76px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 22 }}
          >
            Revolutionize Your<br />
            <span style={{ background: 'linear-gradient(90deg,#A78BFA,#F472B6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Fitness Journey
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.28 }}
            style={{ fontSize: 'clamp(16px,2.2vw,20px)', color: 'rgba(255,255,255,0.65)', marginBottom: 40, lineHeight: 1.7 }}
          >
            FitTrack adapts to your unique needs — track workouts, visualise your data,
            and manage your medicine in one beautiful place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}
          >
            <a href="#features" style={{
              background: 'linear-gradient(135deg,#7C3AED,#EC4899)',
              color: '#fff', padding: '14px 32px', borderRadius: 100,
              fontWeight: 700, fontSize: 15, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              boxShadow: '0 8px 32px rgba(124,58,237,0.4)',
              transition: 'transform .2s,box-shadow .2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(124,58,237,0.55)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(124,58,237,0.4)' }}
            >
              Discover Features <ArrowRight size={16} />
            </a>
            <a href="#about" style={{
              background: 'transparent', border: '1.5px solid rgba(255,255,255,0.25)',
              color: '#fff', padding: '14px 32px', borderRadius: 100,
              fontWeight: 600, fontSize: 15, textDecoration: 'none',
              transition: 'background .2s,border-color .2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)' }}
            >
              Learn More
            </a>
          </motion.div>
        </div>

        <div style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', animation: 'bounce 2s infinite' }}>
          <ChevronDown size={28} color="rgba(255,255,255,0.45)" />
        </div>
        <style>{`@keyframes bounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(8px)}}`}</style>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding: '100px 20px', background: '#0F0A1E' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 60, alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
            style={{ flex: '1 1 380px' }}
          >
            <div style={{ display: 'inline-block', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 100, padding: '5px 16px', fontSize: 12, fontWeight: 700, color: '#C4B5FD', letterSpacing: '0.08em', marginBottom: 20 }}>
              ABOUT FITTRACK
            </div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 20 }}>
              Built for people who<br />
              <span style={{ background: 'linear-gradient(90deg,#A78BFA,#F472B6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                take health seriously
              </span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 17, lineHeight: 1.8, marginBottom: 32 }}>
              FitTrack was born from a passion for health and a vision of accessible fitness for all. Our team
              of fitness enthusiasts and engineers built a comprehensive platform that adapts to you.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {['Founded in 2020', 'Over 1 million active users', 'Partnered with 500+ fitness professionals', 'Continuously evolving with user feedback'].map((item, i) => (
                <motion.li key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'rgba(255,255,255,0.8)', fontSize: 15 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="10" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5l3.5 3.5L11 1" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
            style={{ flex: '1 1 340px', position: 'relative' }}
          >
            <div style={{ borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
              <img src={o2} alt="About FitTrack" style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
            </div>
            <div style={{
              position: 'absolute', bottom: -20, left: -20,
              background: 'linear-gradient(135deg,#7C3AED,#EC4899)',
              borderRadius: 18, padding: '20px 28px',
              boxShadow: '0 12px 40px rgba(124,58,237,0.45)',
            }}>
              <div style={{ fontSize: 32, fontWeight: 800 }}>1M+</div>
              <div style={{ fontSize: 14, opacity: 0.85, marginTop: 2 }}>Active Users</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '100px 20px', background: 'linear-gradient(180deg,#0F0A1E,#1A0F35)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ display: 'inline-block', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 100, padding: '5px 16px', fontSize: 12, fontWeight: 700, color: '#C4B5FD', letterSpacing: '0.08em', marginBottom: 16 }}>
              FEATURES
            </div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800 }}>
              Everything you need,<br />
              <span style={{ background: 'linear-gradient(90deg,#A78BFA,#F472B6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>in one place</span>
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24 }}>
            {features.map(({ icon: Icon, color, title, desc }, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 24, padding: '36px 30px', cursor: 'default',
                  transition: 'border-color .25s,background .25s',
                }}
                whileHover={{ y: -6, borderColor: color + '66', backgroundColor: 'rgba(255,255,255,0.07)' }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: color + '18', border: `1px solid ${color}33`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22,
                }}>
                  <Icon size={26} color={color} />
                </div>
                <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 12, color: '#fff' }}>{title}</h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APP PREVIEW ── */}
      <section id="app-preview" style={{ padding: '100px 20px', background: '#0F0A1E' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 60, alignItems: 'center' }}>
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ flex: '1 1 360px' }}>
            <div style={{ display: 'inline-block', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 100, padding: '5px 16px', fontSize: 12, fontWeight: 700, color: '#C4B5FD', letterSpacing: '0.08em', marginBottom: 20 }}>
              APP EXPERIENCE
            </div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 20 }}>
              Intuitive design,<br />
              <span style={{ background: 'linear-gradient(90deg,#A78BFA,#F472B6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                powerful features
              </span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>
              Our clean interface puts every tool at your fingertips. From workout tracking to medicine reminders,
              managing your fitness journey has never been easier.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: Smartphone, text: 'Available on iOS and Android',       color: '#A78BFA' },
                { icon: Zap,        text: 'Sync seamlessly across all devices', color: '#38BDF8' },
                { icon: Users,      text: 'Connect with friends and trainers',  color: '#4ADE80' },
                { icon: Lock,       text: 'Bank-level data security',           color: '#FBBF24' },
              ].map(({ icon: Icon, text, color }, i) => (
                <motion.li key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 15, color: 'rgba(255,255,255,0.8)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: color + '18', border: `1px solid ${color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} color={color} />
                  </div>
                  {text}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ flex: '1 1 320px', position: 'relative' }}>
            <div style={{ borderRadius: 28, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>
              <img src={o11} alt="FitTrack App" style={{ width: '100%', display: 'block' }} />
            </div>
            <div style={{
              position: 'absolute', top: -16, right: -16,
              background: 'linear-gradient(135deg,#FBBF24,#F59E0B)',
              borderRadius: 18, padding: '14px 18px', textAlign: 'center',
              boxShadow: '0 8px 24px rgba(251,191,36,0.35)', color: '#1c1000',
            }}>
              <div style={{ fontSize: 16, fontWeight: 800 }}>4.9★</div>
              <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.7 }}>Rating</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: '100px 20px', background: 'linear-gradient(180deg,#0F0A1E,#1A0F35)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ display: 'inline-block', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 100, padding: '5px 16px', fontSize: 12, fontWeight: 700, color: '#C4B5FD', letterSpacing: '0.08em', marginBottom: 16 }}>
              CONTACT
            </div>
            <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800 }}>Get in touch</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 28, overflow: 'hidden', display: 'flex', flexWrap: 'wrap' }}
          >
            <div style={{ flex: '1 1 240px', background: 'linear-gradient(135deg,rgba(124,58,237,0.5),rgba(236,72,153,0.3))', padding: '40px 36px' }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Contact Information</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.7, marginBottom: 32 }}>
                Fill out the form and our team will get back to you within 24 hours.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[
                  { icon: Phone,  text: '+1 (555) 123-4567' },
                  { icon: Mail,   text: 'support@fittrack.com' },
                  { icon: MapPin, text: '123 Fitness Street, Healthy City' },
                ].map(({ icon: Icon, text }, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>
                    <Icon size={16} style={{ marginTop: 2, flexShrink: 0 }} />
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ flex: '1 1 300px', padding: '40px 36px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {[
                  { id: 'name',  label: 'Name',  type: 'text',  placeholder: 'Your name' },
                  { id: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
                ].map(({ id, label, type, placeholder }) => (
                  <div key={id}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em', marginBottom: 8 }}>{label.toUpperCase()}</label>
                    <input type={type} placeholder={placeholder} style={{
                      width: '100%', background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12,
                      color: '#fff', fontSize: 14, padding: '12px 16px',
                      outline: 'none', boxSizing: 'border-box',
                    }} />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em', marginBottom: 8 }}>MESSAGE</label>
                  <textarea rows={4} placeholder="How can we help?" style={{
                    width: '100%', background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12,
                    color: '#fff', fontSize: 14, padding: '12px 16px',
                    outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit',
                  }} />
                </div>
                <button style={{
                  background: 'linear-gradient(135deg,#7C3AED,#EC4899)',
                  color: '#fff', border: 'none', borderRadius: 12,
                  padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 6px 24px rgba(124,58,237,0.35)', transition: 'transform .2s,box-shadow .2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(124,58,237,0.5)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(124,58,237,0.35)' }}
                >
                  Send Message
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '100px 20px', background: '#0F0A1E', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.18) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 style={{ fontSize: 'clamp(28px,5vw,52px)', fontWeight: 800, lineHeight: 1.15, marginBottom: 20 }}>
              Ready to transform<br />
              <span style={{ background: 'linear-gradient(90deg,#A78BFA,#F472B6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                your fitness journey?
              </span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 17, lineHeight: 1.7, marginBottom: 40 }}>
              Join FitTrack today and take the first step towards a healthier you.
            </p>
            <a href="/feature" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              color: '#C4B5FD', fontSize: 17, fontWeight: 600, textDecoration: 'none',
              borderBottom: '1.5px solid rgba(167,139,250,0.4)',
              paddingBottom: 3, transition: 'color .2s, border-color .2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#C4B5FD'; e.currentTarget.style.borderColor = 'rgba(167,139,250,0.4)' }}
            >
              Go to Workout <ArrowRight size={16} />
            </a>
          </motion.div>
        </div>
      </section>

    </div>
  )
}