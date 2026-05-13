'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const API_URL = 'https://fittrack-2210991756.onrender.com/api'

const getTimeSlot = (timeStr) => {
  if (!timeStr) return 'Night'
  const [h] = timeStr.split(':').map(Number)
  if (h >= 6  && h < 12) return 'Morning'
  if (h >= 12 && h < 16) return 'Afternoon'
  return 'Night'
}

const SECTION_META = {
  Morning:   { label: 'Morning',   color: '#F97316', light: '#FFF7ED', border: '#FED7AA', range: '6 AM – 12 PM' },
  Afternoon: { label: 'Afternoon', color: '#EAB308', light: '#FEFCE8', border: '#FDE68A', range: '12 PM – 4 PM' },
  Night:     { label: 'Night',     color: '#8B5CF6', light: '#F5F3FF', border: '#DDD6FE', range: '4 PM onwards' },
}

const SectionIcon = ({ slot, color }) => {
  if (slot === 'Morning') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/>
      <line x1="12" y1="2" x2="12" y2="5"/>
      <line x1="12" y1="19" x2="12" y2="22"/>
      <line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/>
      <line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/>
      <line x1="2" y1="12" x2="5" y2="12"/>
      <line x1="19" y1="12" x2="22" y2="12"/>
      <line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/>
      <line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/>
    </svg>
  )
  if (slot === 'Afternoon') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  )
  // Night — moon
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

const DEFAULT_TIME = '08:00'
const todayStr = () => new Date().toISOString().split('T')[0]
const getCurrentUser = () => localStorage.getItem('username') || 'guest'

export default function Health() {
  const [medicines, setMedicines]   = useState([])
  const [loading, setLoading]       = useState(true)
  const [showForm, setShowForm]     = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [saveStatus, setSaveStatus] = useState('idle')
  const [form, setForm] = useState({ name: '', purpose: '', reminderTime: DEFAULT_TIME })

  const scheduledTimers = useRef([])
  const notifGranted    = useRef(false)

  // ── Notification permission ───────────────────────────────────────────────
  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission().then(p => { notifGranted.current = p === 'granted' })
    }
  }, [])

  // ── Load ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const res  = await fetch(`${API_URL}/health/${getCurrentUser()}`)
        const data = await res.json()
        if (data.medicines) {
          const sanitized = data.medicines.map(m => ({
            ...m,
            reminderTime: m.reminderTime ?? m.customTimes?.Morning ?? DEFAULT_TIME,
            logs: m.logs ?? {},
          }))
          setMedicines(sanitized)
        }
      } catch (e) { console.error('Fetch error:', e) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  // ── Save ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (loading) return
    const save = async () => {
      setSaveStatus('saving')
      try {
        await fetch(`${API_URL}/health/${getCurrentUser()}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ medicines }),
        })
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 1500)
      } catch { setSaveStatus('idle') }
    }
    save()
  }, [medicines])

  // ── Schedule notifications ────────────────────────────────────────────────
  useEffect(() => {
    scheduledTimers.current.forEach(clearTimeout)
    scheduledTimers.current = []
    if (!notifGranted.current) return
    const date = todayStr()
    medicines.forEach(med => {
      if (med.logs?.[date]?.taken) return
      const timeStr = med.reminderTime
      if (!timeStr) return
      const [h, m] = timeStr.split(':').map(Number)
      const fire   = new Date(); fire.setHours(h, m, 0, 0)
      const delay  = fire - Date.now()
      if (delay > 0) {
        const slot = getTimeSlot(timeStr)
        const t = setTimeout(() => {
          new Notification(`${med.name}`, {
            body: `${slot} dose — ${med.purpose || 'Time to take your medicine'}`,
            icon: '/favicon.ico',
          })
        }, delay)
        scheduledTimers.current.push(t)
      }
    })
  }, [medicines])

  // ── Form helpers ──────────────────────────────────────────────────────────
  const openAdd = () => {
    setForm({ name: '', purpose: '', reminderTime: DEFAULT_TIME })
    setEditTarget(null)
    setShowForm(true)
  }

  const getMedKey = m => m.id ?? String(m._id ?? '')

  const openEdit = med => {
    setForm({ name: med.name, purpose: med.purpose, reminderTime: med.reminderTime ?? DEFAULT_TIME })
    setEditTarget(getMedKey(med))
    setShowForm(true)
  }

  const submitForm = () => {
    if (!form.name.trim()) return
    if (editTarget) {
      setMedicines(prev => prev.map(m =>
        getMedKey(m) === editTarget ? { ...m, ...form } : m
      ))
    } else {
      setMedicines(prev => [...prev, {
        id: Date.now().toString(),
        name: form.name,
        purpose: form.purpose,
        reminderTime: form.reminderTime,
        logs: {},
      }])
    }
    setShowForm(false)
  }

  const deleteMed = id => setMedicines(prev => prev.filter(m => getMedKey(m) !== id))

  const markTaken = (medId) => {
    const date = todayStr()
    setMedicines(prev => prev.map(m => {
      if (getMedKey(m) !== medId) return m
      if (m.logs?.[date]?.taken) return m
      return { ...m, logs: { ...m.logs, [date]: { taken: true, at: new Date().toLocaleTimeString() } } }
    }))
  }

  // ── Stats ─────────────────────────────────────────────────────────────────
  const date       = todayStr()
  const totalDoses = medicines.length
  const takenDoses = medicines.filter(m => m.logs?.[date]?.taken).length
  const pct        = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0

  const streak = (() => {
    let count = 0, d = new Date()
    while (true) {
      const k = d.toISOString().split('T')[0]
      if (!medicines.length || !medicines.every(m => m.logs?.[k]?.taken)) break
      count++; d.setDate(d.getDate() - 1)
    }
    return count
  })()

  const sections = ['Morning', 'Afternoon', 'Night'].map(slot => ({
    ...SECTION_META[slot],
    slot,
    meds: medicines.filter(m => getTimeSlot(m.reminderTime) === slot),
  }))

  if (loading) return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#dbeafe,#ede9fe,#fce7f3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <p style={{ color: '#7C3AED', fontWeight: 600 }}>Loading…</p>
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#dbeafe 0%,#ede9fe 50%,#fce7f3 100%)',
      paddingTop: 88,
      paddingBottom: 48,
      paddingLeft: 16,
      paddingRight: 16,
      fontFamily: '"Inter",sans-serif',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}

        .section-box{
          background:#fff;border-radius:20px;
          border:1px solid #EDE9FE;
          margin-bottom:18px;
          overflow:hidden;
          box-shadow:0 2px 16px rgba(124,58,237,.06);
        }
        .section-header{
          display:flex;align-items:center;gap:10px;
          padding:16px 20px;
          border-bottom:1px solid #F3F4F6;
        }

        .med-row{
          display:flex;align-items:center;
          padding:14px 20px;
          border-bottom:1px solid #F9FAFB;
          gap:12px;
          transition:background .15s;
        }
        .med-row:last-child{border-bottom:none}
        .med-row:hover{background:#FAFAFA}

        .take-btn{
          border:none;cursor:pointer;font-family:inherit;
          border-radius:10px;padding:8px 16px;
          font-size:13px;font-weight:700;
          transition:all .18s;white-space:nowrap;
          flex-shrink:0;
        }
        .take-btn:not(:disabled):hover{transform:translateY(-1px);filter:brightness(.94)}
        .take-btn:disabled{cursor:not-allowed;opacity:.85}

        .hbtn{border:none;cursor:pointer;font-family:inherit;transition:all .18s}
        .hbtn:hover{filter:brightness(.93);transform:translateY(-1px)}

        input,select{
          background:#F5F3FF;border:1.5px solid #DDD6FE;
          border-radius:10px;color:#1e1b4b;
          font-family:inherit;font-size:14px;
          padding:10px 14px;width:100%;outline:none;
          transition:border-color .2s,background .2s;
        }
        input:focus,select:focus{border-color:#7C3AED;background:#fff}
        input[type=time]{cursor:pointer}
        select option{background:#fff}
        .fl{font-size:11px;color:#7C3AED;font-weight:700;
            text-transform:uppercase;letter-spacing:.05em;
            display:block;margin-bottom:5px}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:#DDD6FE;border-radius:4px}
        @media(max-width:640px){
          .sections-grid{grid-template-columns:1fr !important}
        }
      `}</style>

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: 'clamp(24px,5vw,36px)', fontWeight: 800,
            textAlign: 'center', marginBottom: 4,
            background: 'linear-gradient(90deg,#2563EB,#7C3AED)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}
        >
          Medicine Tracker
        </motion.h1>
        <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: 14, marginBottom: 28 }}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>

        {/* Summary card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          style={{
            background: '#fff', borderRadius: 24, padding: '20px 24px', marginBottom: 18,
            boxShadow: '0 4px 24px rgba(124,58,237,.10)', border: '1px solid #EDE9FE',
            display: 'flex', alignItems: 'center', gap: 20,
          }}
        >
          {/* Ring */}
          <div style={{ position: 'relative', width: 88, height: 88, flexShrink: 0 }}>
            <svg width="88" height="88" viewBox="0 0 88 88" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="44" cy="44" r="34" fill="none" stroke="#EDE9FE" strokeWidth="8"/>
              <circle cx="44" cy="44" r="34" fill="none"
                stroke="url(#rg)" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${2*Math.PI*34}`}
                strokeDashoffset={`${2*Math.PI*34*(1-pct/100)}`}
                style={{ transition: 'stroke-dashoffset .7s ease' }}
              />
              <defs>
                <linearGradient id="rg" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#2563EB"/>
                  <stop offset="100%" stopColor="#7C3AED"/>
                </linearGradient>
              </defs>
            </svg>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 17, fontWeight: 800, color: '#4F46E5' }}>{pct}%</span>
              <span style={{ fontSize: 10, color: '#9CA3AF' }}>today</span>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 8 }}>
              <span style={{ fontSize: 24, fontWeight: 800, color: '#7C3AED' }}>{takenDoses}</span>
              <span style={{ color: '#9CA3AF' }}> / {totalDoses} taken today</span>
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ background: '#FFF7ED', color: '#F97316', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 600 }}>
                {streak} day streak
              </span>
              <span style={{ background: '#F5F3FF', color: '#7C3AED', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 600 }}>
                {medicines.length} medicines
              </span>
            </div>
          </div>
        </motion.div>

        {/* Add button */}
        <button
          className="hbtn"
          onClick={openAdd}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg,#2563EB,#7C3AED)',
            color: '#fff', borderRadius: 14, padding: '13px',
            fontSize: 15, fontWeight: 700, marginBottom: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <span style={{ fontSize: 20, lineHeight: 1 }}>+</span> Add Medicine
        </button>

        {/* Empty state */}
        {medicines.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '52px 0',
            background: '#fff', borderRadius: 20,
            border: '1.5px dashed #DDD6FE',
          }}>
            <div style={{ marginBottom: 10, display: 'flex', justifyContent: 'center' }}>
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#C4B5FD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              </svg>
            </div>
            <p style={{ color: '#7C3AED', fontWeight: 700, fontSize: 16 }}>No medicines added yet</p>
            <p style={{ color: '#C4B5FD', fontSize: 13, marginTop: 4 }}>Click "Add Medicine" to get started</p>
          </div>
        )}

        {/* 3 time sections */}
        {medicines.length > 0 && (
          <div className="sections-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, alignItems: 'start' }}>
            {sections.map(({ slot, label, color, light, border, range, meds }) => (
              <motion.div
                key={slot}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="section-box"
                style={{ borderColor: border, marginBottom: 0 }}
              >
                {/* Section header */}
                <div className="section-header" style={{ background: light }}>
                  <SectionIcon slot={slot} color={color} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color }}>{label}</span>
                    <span style={{ fontSize: 12, color: '#9CA3AF', marginLeft: 8 }}>{range}</span>
                  </div>
                  <span style={{
                    background: '#fff', border: `1px solid ${border}`,
                    color, borderRadius: 8, padding: '3px 10px',
                    fontSize: 12, fontWeight: 700,
                  }}>
                    {meds.filter(m => m.logs?.[date]?.taken).length} / {meds.length}
                  </span>
                </div>

                {/* Medicine rows */}
                {meds.length === 0 ? (
                  <p style={{ padding: '16px 20px', fontSize: 13, color: '#C4B5FD' }}>
                    No medicines in this slot
                  </p>
                ) : (
                  meds.map(med => {
                    const taken   = !!med.logs?.[date]?.taken
                    const takenAt = med.logs?.[date]?.at

                    return (
                      <div key={med.id} className="med-row">
                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{
                              fontWeight: 700, fontSize: 15,
                              color: taken ? '#9CA3AF' : '#1E1B4B',
                              textDecoration: taken ? 'line-through' : 'none',
                            }}>
                              {med.name}
                            </span>
                            {med.reminderTime && (
                              <span style={{ fontSize: 12, color: '#9CA3AF' }}>&#9200; {med.reminderTime}</span>
                            )}
                          </div>
                          {med.purpose && (
                            <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{med.purpose}</p>
                          )}
                          {taken && takenAt && (
                            <p style={{ fontSize: 11, color: '#16A34A', marginTop: 2 }}>&#10003; Taken at {takenAt}</p>
                          )}
                        </div>

                        {/* Edit / Delete */}
                        {!taken && (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="hbtn" onClick={() => openEdit(med)}
                              style={{ background: '#F5F3FF', color: '#7C3AED', borderRadius: 8, padding: '5px 9px', fontSize: 13, display: 'flex', alignItems: 'center' }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                            </button>
                            <button className="hbtn" onClick={() => deleteMed(getMedKey(med))}
                              style={{ background: '#FEF2F2', color: '#EF4444', borderRadius: 8, padding: '5px 9px', fontSize: 13, display: 'flex', alignItems: 'center' }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                <path d="M10 11v6M14 11v6"/>
                                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                              </svg>
                            </button>
                          </div>
                        )}

                        {/* Take button */}
                        <button
                          className="take-btn"
                          onClick={() => !taken && markTaken(getMedKey(med))}
                          disabled={taken}
                          style={{
                            background: taken
                              ? '#DCFCE7'
                              : `linear-gradient(135deg,${color},${color}CC)`,
                            color: taken ? '#16A34A' : '#fff',
                            border: taken ? '1.5px solid #BBF7D0' : 'none',
                          }}
                        >
                          {taken ? 'Done' : 'Take'}
                        </button>
                      </div>
                    )
                  })
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Save toast — OUTSIDE sections grid */}
        <AnimatePresence>
          {saveStatus !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                background: saveStatus === 'saved' ? '#DCFCE7' : '#F5F3FF',
                color: saveStatus === 'saved' ? '#16A34A' : '#7C3AED',
                border: `1px solid ${saveStatus === 'saved' ? '#BBF7D0' : '#DDD6FE'}`,
                borderRadius: 10,
                padding: '9px 16px',
                fontSize: 13,
                fontWeight: 600,
                boxShadow: '0 2px 12px rgba(0,0,0,.08)',
              }}
            >
              {saveStatus === 'saving' ? 'Saving...' : 'Saved'}
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowForm(false)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(109,40,217,.15)',
              backdropFilter: 'blur(4px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 16, zIndex: 100,
            }}
          >
            <motion.div
              initial={{ scale: 0.92, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 24 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: '#fff', borderRadius: 24, padding: 28,
                width: '100%', maxWidth: 440,
                boxShadow: '0 20px 60px rgba(124,58,237,.18)',
                border: '1px solid #EDE9FE',
              }}
            >
              <h2 style={{
                fontWeight: 800, fontSize: 22, marginBottom: 22,
                background: 'linear-gradient(90deg,#2563EB,#7C3AED)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                {editTarget ? 'Edit Medicine' : 'Add Medicine'}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="fl">Medicine Name *</label>
                  <input placeholder="e.g. Paracetamol" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>

                <div>
                  <label className="fl">What is it for?</label>
                  <input placeholder="e.g. Fever / Pain relief" value={form.purpose}
                    onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))} />
                </div>

                <div>
                  <label className="fl">Reminder Time</label>
                  <input type="time" value={form.reminderTime}
                    onChange={e => setForm(f => ({ ...f, reminderTime: e.target.value }))} />
                  {(() => {
                    const slot = getTimeSlot(form.reminderTime)
                    const meta = SECTION_META[slot]
                    return (
                      <p style={{ fontSize: 12, color: meta.color, marginTop: 6, fontWeight: 600 }}>
                        Will appear in <strong>{meta.label}</strong> section ({meta.range})
                      </p>
                    )
                  })()}
                  <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
                    You'll get a browser notification at this time
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button className="hbtn" onClick={() => setShowForm(false)}
                    style={{ flex: 1, background: '#F5F3FF', color: '#7C3AED', borderRadius: 12, padding: '12px', fontSize: 14, fontWeight: 600 }}>
                    Cancel
                  </button>
                  <button className="hbtn" onClick={submitForm}
                    style={{ flex: 2, background: 'linear-gradient(135deg,#2563EB,#7C3AED)', color: '#fff', borderRadius: 12, padding: '12px', fontSize: 14, fontWeight: 700 }}>
                    {editTarget ? 'Save Changes' : 'Add Medicine'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}