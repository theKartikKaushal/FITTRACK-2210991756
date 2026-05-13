'use client'

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Plus, ChevronRight, ChevronLeft, CheckCircle2, Clock, Flame, Trophy } from 'lucide-react';
import DatePicker from 'react-datepicker';

import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';
import FitnessQuiz from './Fitnessquiz';

const API_URL = 'https://fittrack-2210991756.onrender.com/api';

const Feature = () => {
    const [activeSection, setActiveSection] = useState('quiz');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [quizCompleted, setQuizCompleted] = useState(false);
    const navigate = useNavigate();
    const [leaderboard, setLeaderboard] = useState([]);
    const [showOnLeaderboard, setShowOnLeaderboard] = useState(true);

    // Ref to skip saving during initial data load from backend
    const isInitialLoad = useRef(true);
    // Ref to always have latest userData in async callbacks (avoids stale closures)
    const userDataRef = useRef(null);

    const loggedInUser = localStorage.getItem('username');

    const [userData, setUserData] = useState({
      exercises: [],
      totalPoints: 0,
      achievements: [],
      dailyProgress: {},
      completedByDate: {},
      waterIntake: {},
      waterIntakeGoal: 2000,
      sleepHours: {},
      moodTracker: {},
      quizAnswers: null,
    });

    // Keep ref in sync with state
    useEffect(() => {
      userDataRef.current = userData;
    }, [userData]);

    useEffect(() => {
      if (!loggedInUser) {
        navigate('/login');
        return;
      }
      fetchUserData();
    }, []);

    useEffect(() => {
      const handleLogout = () => {
        setQuizCompleted(false);
        setActiveSection('quiz');
        isInitialLoad.current = true;
        setUserData({
          exercises: [],
          totalPoints: 0,
          achievements: [],
          dailyProgress: {},
          completedByDate: {},
          waterIntake: {},
          waterIntakeGoal: 2000,
          sleepHours: {},
          moodTracker: {},
          quizAnswers: null,
        });
        navigate('/');
      };
      window.addEventListener('userLoggedOut', handleLogout);
      return () => window.removeEventListener('userLoggedOut', handleLogout);
    }, []);

    // Skip save on initial load; only save on real user-driven changes
    useEffect(() => {
      if (isInitialLoad.current) return;
      if (quizCompleted) saveUserData();
    }, [userData, quizCompleted]);

    // Auto-sync leaderboard visibility whenever weekly points change
    useEffect(() => {
      if (!quizCompleted || !showOnLeaderboard) return;
      updateLeaderboardVisibility(true);
    }, [userData.totalPoints]);

    const getWeekDates = (date = new Date()) => {
      const d = new Date(date);
      const day = d.getDay();
      const diffToMonday = (day === 0 ? -6 : 1 - day);
      const monday = new Date(d);
      monday.setDate(d.getDate() + diffToMonday);
      return Array.from({ length: 7 }, (_, i) => {
        const dd = new Date(monday);
        dd.setDate(monday.getDate() + i);
        return dd.toISOString().split('T')[0];
      });
    };

    const getWeekPoints = (completedByDate, exercises, weekDates) => {
      return weekDates.reduce((total, ds) => {
        const ids = completedByDate[ds] || [];
        return total + ids.reduce((sum, exId) => {
          const ex = exercises.find(e => e.id === exId);
          return sum + (ex ? ex.points : 0);
        }, 0);
      }, 0);
    };

    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_URL}/feature/${loggedInUser}`);
        const data = await response.json();
        if (data && Object.keys(data).length > 0 && data.quizAnswers) {
          if (!data.completedByDate) data.completedByDate = {};

          // Rehydrate dailyProgress from completedByDate so exercises show completed on refresh
          const rehydratedDailyProgress = { ...(data.dailyProgress || {}) };
          Object.entries(data.completedByDate).forEach(([dateStr, completedIds]) => {
            rehydratedDailyProgress[dateStr] = {
              ...rehydratedDailyProgress[dateStr],
              completed: completedIds.length,
              total: data.exercises.length,
            };
          });
          data.dailyProgress = rehydratedDailyProgress;

          const currentWeekDates = getWeekDates(new Date());
          const weekPoints = getWeekPoints(data.completedByDate, data.exercises, currentWeekDates);
          data.totalPoints = weekPoints;
          data.achievements = getAchievements(weekPoints);

          // Set flag BEFORE setState so the save useEffect doesn't fire during load
          isInitialLoad.current = true;
          setUserData(data);
          setQuizCompleted(true);
          setActiveSection('dashboard');

          // Clear flag after React has processed the state update
          setTimeout(() => {
            isInitialLoad.current = false;
          }, 0);
        } else {
          isInitialLoad.current = false;
          setQuizCompleted(false);
          setActiveSection('quiz');
          setUserData({
            exercises: [],
            totalPoints: 0,
            achievements: [],
            dailyProgress: {},
            completedByDate: {},
            waterIntake: {},
            waterIntakeGoal: 2000,
            sleepHours: {},
            moodTracker: {},
            quizAnswers: null,
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        isInitialLoad.current = false;
        setQuizCompleted(false);
        setActiveSection('quiz');
      }
    };

    // Always saves latest data via ref (no stale closure issue)
    const saveUserData = async () => {
      try {
        const dataToSave = userDataRef.current;
        if (!dataToSave) return;
        await fetch(`${API_URL}/feature/${loggedInUser}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSave),
        });
      } catch (error) {
        console.error('Error saving user data:', error);
      }
    };

    const initializeDataForDate = (date) => {
      const dateString = date.toISOString().split('T')[0];
      if (!userData.dailyProgress[dateString]) {
        setUserData(prev => {
          const completedCount = (prev.completedByDate[dateString] || []).length;
          return {
            ...prev,
            dailyProgress: {
              ...prev.dailyProgress,
              [dateString]: { completed: completedCount, total: prev.exercises.length }
            },
            waterIntake: { ...prev.waterIntake, [dateString]: prev.waterIntake[dateString] ?? 0 },
            sleepHours: { ...prev.sleepHours, [dateString]: prev.sleepHours[dateString] ?? 0 },
            moodTracker: { ...prev.moodTracker, [dateString]: prev.moodTracker[dateString] ?? 'neutral' },
          };
        });
      }
    };

    const [confirmExercise, setConfirmExercise] = useState(null);

    useEffect(() => {
      initializeDataForDate(selectedDate);
    }, [selectedDate, userData.exercises]);

    const getCompletedIdsForDate = (date) => {
      const dateString = date.toISOString().split('T')[0];
      return userData.completedByDate[dateString] || [];
    };

    const updateExercise = (id) => {
      const dateString = selectedDate.toISOString().split('T')[0];
      const alreadyCompleted = (userData.completedByDate[dateString] || []).includes(id);
      if (alreadyCompleted) return;

      setUserData(prev => {
        const prevCompleted = prev.completedByDate[dateString] || [];
        const newCompleted = [...prevCompleted, id];
        const updatedCompletedByDate = { ...prev.completedByDate, [dateString]: newCompleted };

        const currentWeekDates = getWeekDates(new Date());
        const weekPoints = getWeekPoints(updatedCompletedByDate, prev.exercises, currentWeekDates);
        const achievements = getAchievements(weekPoints);

        const dailyProgress = {
          ...prev.dailyProgress,
          [dateString]: {
            ...prev.dailyProgress[dateString],
            completed: newCompleted.length,
            total: prev.exercises.length,
          }
        };

        return {
          ...prev,
          completedByDate: updatedCompletedByDate,
          totalPoints: weekPoints,
          achievements,
          dailyProgress,
        };
      });
    };

    useEffect(() => {
      if (quizCompleted && activeSection === 'achievements') {
        fetch(`${API_URL}/leaderboard`)
          .then(r => r.json())
          .then(data => setLeaderboard(data || []))
          .catch(console.error);
      }
    }, [activeSection, quizCompleted]);

    // ✅ FIX: Only sends leaderboardVisible, NOT points — points are managed by the main save
    const updateLeaderboardVisibility = async (visible) => {
      try {
        await fetch(`${API_URL}/leaderboard/${loggedInUser}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visible }),
        });
      } catch (error) {
        console.error('Error updating leaderboard:', error);
      }
    };

    const getAchievements = (points) => {
      const achievements = [];
      if (points >= 100) achievements.push({ name: 'Century', icon: '🏅' });
      if (points >= 500) achievements.push({ name: 'Fitness Enthusiast', icon: '🏆' });
      if (points >= 1000) achievements.push({ name: 'Workout Warrior', icon: '💪' });
      return achievements;
    };

    const submitQuiz = (answers) => {
      const exercisesForLevel = {
        beginner: [
          { id: 1, name: 'Walking', points: 3 },
          { id: 2, name: 'Stretching', points: 2 },
          { id: 3, name: 'Light Yoga', points: 4 },
        ],
        intermediate: [
          { id: 1, name: 'Jogging', points: 5 },
          { id: 2, name: 'Push-ups', points: 4 },
          { id: 3, name: 'Bodyweight Squats', points: 4 },
        ],
        advanced: [
          { id: 1, name: 'HIIT Workout', points: 8 },
          { id: 2, name: 'Weight Training', points: 7 },
          { id: 3, name: 'Advanced Yoga', points: 6 },
        ],
      };
      isInitialLoad.current = false;
      setUserData(prev => ({
        ...prev,
        quizAnswers: answers,
        exercises: exercisesForLevel[answers.fitnessLevel] || [],
      }));
      setQuizCompleted(true);
      setActiveSection('dashboard');
    };

    const goToPreviousDay = () => {
      setSelectedDate(prev => {
        const d = new Date(prev);
        d.setDate(d.getDate() - 1);
        return d;
      });
    };

    const goToNextDay = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const next = new Date(selectedDate);
      next.setDate(next.getDate() + 1);
      if (next <= today) setSelectedDate(next);
    };

    const goToToday = () => setSelectedDate(new Date());

    const isToday = () => {
      const today = new Date();
      return (
        selectedDate.getDate() === today.getDate() &&
        selectedDate.getMonth() === today.getMonth() &&
        selectedDate.getFullYear() === today.getFullYear()
      );
    };

    const renderDashboard = () => {
      const dateString = selectedDate.toISOString().split('T')[0];
      const recentDates = Array(7).fill().map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
      });

      return (
        <div className="space-y-8">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h3 className="text-2xl font-bold">Dashboard — Welcome, {loggedInUser}! 👋</h3>
            <DatePicker selected={selectedDate} onChange={date => setSelectedDate(date)} maxDate={new Date()} className="p-2 border rounded" />
          </div>

          <div className="flex items-center justify-between bg-gray-100 rounded-xl p-3">
            <button onClick={goToPreviousDay} className="p-2 rounded-full bg-white shadow hover:bg-gray-200 transition">
              <ChevronLeft size={20} />
            </button>
            <div className="flex space-x-2 overflow-x-auto px-2">
              {recentDates.map(date => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(new Date(date))}
                  className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition ${
                    date === dateString ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {!isToday() && (
                <button onClick={goToToday} className="px-3 py-1 rounded-full bg-purple-500 text-white text-sm hover:bg-purple-600 transition">
                  Today
                </button>
              )}
              <button
                onClick={goToNextDay}
                disabled={isToday()}
                className={`p-2 rounded-full shadow transition ${isToday() ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-200'}`}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div className="bg-white p-6 rounded-xl shadow-lg" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <h4 className="text-xl font-semibold mb-4">Today's Progress</h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Completed', value: userData.dailyProgress[dateString]?.completed || 0 },
                      { name: 'Remaining', value: (userData.dailyProgress[dateString]?.total || 0) - (userData.dailyProgress[dateString]?.completed || 0) }
                    ]}
                    cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value"
                  >
                    <Cell fill="#4CAF50" />
                    <Cell fill="#FFA726" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div className="bg-white p-6 rounded-xl shadow-lg" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <h4 className="text-xl font-semibold mb-4">Weekly Overview</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={recentDates.map(date => ({
                  date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
                  completed: userData.dailyProgress[date]?.completed || 0,
                  total: userData.dailyProgress[date]?.total || 0
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#4CAF50" />
                  <Bar dataKey="total" fill="#FFA726" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {(() => {
            const allDates = Object.keys(userData.dailyProgress).sort();

            let streak = 0;
            const checkDate = new Date();
            while (true) {
              const ds = checkDate.toISOString().split('T')[0];
              const p = userData.dailyProgress[ds];
              if (p && p.total > 0 && p.completed > 0) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
              } else break;
            }

            const last30 = Array(30).fill(null).map((_, i) => {
              const d = new Date();
              d.setDate(d.getDate() - i);
              return d.toISOString().split('T')[0];
            });
            const last30WithData = last30.filter(d => userData.dailyProgress[d]?.total > 0);
            const avg = last30WithData.length > 0
              ? Math.round(last30WithData.reduce((sum, d) => {
                  const p = userData.dailyProgress[d];
                  return sum + (p.completed / p.total) * 100;
                }, 0) / last30WithData.length)
              : 0;

            const thisMonth = new Date().toISOString().slice(0, 7);
            const thisMonthDays = allDates.filter(d => d.startsWith(thisMonth));
            let bestDay = null;
            let bestPct = 0;
            thisMonthDays.forEach(d => {
              const p = userData.dailyProgress[d];
              if (p?.total > 0) {
                const pct = (p.completed / p.total) * 100;
                if (pct > bestPct) { bestPct = pct; bestDay = d; }
              }
            });

            const thisMonthTotal = thisMonthDays.reduce((sum, d) => {
              return sum + (userData.dailyProgress[d]?.completed || 0);
            }, 0);

            const lastMonthDate = new Date();
            lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
            const lastMonth = lastMonthDate.toISOString().slice(0, 7);
            const lastMonthTotal = allDates
              .filter(d => d.startsWith(lastMonth))
              .reduce((sum, d) => sum + (userData.dailyProgress[d]?.completed || 0), 0);

            const diff = thisMonthTotal - lastMonthTotal;

            return (
              <div>
                <h4 className="text-xl font-semibold mb-4">Your Progress Overview</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                    <p className="text-xs text-orange-500 font-semibold mb-1">Current Streak</p>
                    <p className="text-2xl font-bold text-orange-600">{streak} days</p>
                    <p className="text-xs text-orange-400 mt-1">Keep it up!</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <p className="text-xs text-blue-500 font-semibold mb-1">Avg Completion</p>
                    <p className="text-2xl font-bold text-blue-600">{avg}%</p>
                    <p className="text-xs text-blue-400 mt-1">last 30 days</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                    <p className="text-xs text-purple-500 font-semibold mb-1">Best Day</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {bestDay ? new Date(bestDay).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                    </p>
                    <p className="text-xs text-purple-400 mt-1">{bestDay ? `${Math.round(bestPct)}% done` : 'no data yet'}</p>
                  </div>
                  <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                    <p className="text-xs text-green-500 font-semibold mb-1">This Month</p>
                    <p className="text-2xl font-bold text-green-600">{thisMonthTotal} done</p>
                    <p className="text-xs text-green-400 mt-1">
                      {diff === 0 ? 'same as last month' : diff > 0 ? `+${diff} vs last month` : `${diff} vs last month`}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                  <p className="text-sm font-semibold text-gray-700 mb-4">Activity — last 3 months</p>
                  <div className="flex gap-1 overflow-x-auto pb-2">
                    <div className="flex flex-col gap-1 mr-1" style={{ marginTop: '20px' }}>
                      {['S','M','T','W','T','F','S'].map((d, i) => (
                        <div key={i} style={{ width: '12px', height: '14px', fontSize: '10px', color: '#9ca3af', lineHeight: '14px' }}>{d}</div>
                      ))}
                    </div>
                    {(() => {
                      const cells = [];
                      for (let i = 89; i >= 0; i--) {
                        const d = new Date();
                        d.setDate(d.getDate() - i);
                        const ds = d.toISOString().split('T')[0];
                        const p = userData.dailyProgress[ds];
                        const pct = p?.total > 0 ? (p.completed / p.total) * 100 : 0;
                        cells.push({ date: d, ds, pct, hasData: !!p });
                      }
                      const firstDay = cells[0].date.getDay();
                      const padded = [...Array(firstDay).fill(null), ...cells];
                      const weeks = [];
                      for (let i = 0; i < padded.length; i += 7) {
                        weeks.push(padded.slice(i, i + 7));
                      }
                      const getColor = (cell) => {
                        if (!cell || !cell.hasData) return '#f3f4f6';
                        if (cell.pct === 0) return '#e5e7eb';
                        if (cell.pct <= 25) return '#bbf7d0';
                        if (cell.pct <= 50) return '#86efac';
                        if (cell.pct <= 75) return '#4ade80';
                        return '#16a34a';
                      };
                      return weeks.map((week, wi) => {
                        const firstReal = week.find(c => c !== null);
                        const showMonth = firstReal && firstReal.date.getDate() <= 7;
                        return (
                          <div key={wi} className="flex flex-col gap-1">
                            <div style={{ height: '16px', fontSize: '10px', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                              {showMonth ? firstReal.date.toLocaleDateString('en-US', { month: 'short' }) : ''}
                            </div>
                            {week.map((cell, di) => (
                              <div
                                key={di}
                                title={cell ? `${cell.ds}: ${Math.round(cell.pct)}%` : ''}
                                style={{
                                  width: '14px', height: '14px',
                                  borderRadius: '3px',
                                  backgroundColor: getColor(cell),
                                  cursor: cell ? 'pointer' : 'default',
                                  flexShrink: 0,
                                }}
                              />
                            ))}
                          </div>
                        );
                      });
                    })()}
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs text-gray-400">Less</span>
                    {['#e5e7eb','#bbf7d0','#86efac','#4ade80','#16a34a'].map((c, i) => (
                      <div key={i} style={{ width: '14px', height: '14px', borderRadius: '3px', backgroundColor: c, flexShrink: 0 }} />
                    ))}
                    <span className="text-xs text-gray-400">More</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      );
    };

    const renderExercises = () => {
      const completedIds = getCompletedIdsForDate(selectedDate);
      const pendingExercises = userData.exercises.filter(ex => !completedIds.includes(ex.id));
      const completedExercises = userData.exercises.filter(ex => completedIds.includes(ex.id));
      const totalExercises = userData.exercises.length;
      const progressPercent = totalExercises > 0 ? Math.round((completedExercises.length / totalExercises) * 100) : 0;

      return (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Your Exercise Routine</h3>
              <p className="text-sm text-gray-500 mt-1">{completedExercises.length} of {totalExercises} exercises done today</p>
            </div>
            {totalExercises > 0 && (
              <div className="flex items-center gap-3">
                <div className="w-36 bg-gray-200 rounded-full h-3">
                  <motion.div
                    className="h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-600">{progressPercent}%</span>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock size={18} className="text-orange-500" />
              <h4 className="text-lg font-semibold text-gray-700">Pending</h4>
              <span className="ml-auto text-xs bg-orange-100 text-orange-600 font-semibold px-2 py-0.5 rounded-full">
                {pendingExercises.length} left
              </span>
            </div>
            {pendingExercises.length === 0 ? (
              <motion.div
                className="flex flex-col items-center justify-center py-8 bg-green-50 rounded-xl border border-green-200"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Trophy size={36} className="text-yellow-500 mb-2" />
                <p className="text-green-700 font-semibold text-lg">All done for today!</p>
                <p className="text-green-500 text-sm">You crushed every exercise 💪</p>
              </motion.div>
            ) : (
              <div className="grid gap-3">
                {pendingExercises.map(exercise => (
                  <motion.div
                    key={exercise.id}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <Flame size={18} className="text-orange-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{exercise.name}</p>
                        <p className="text-xs text-gray-400">{exercise.points} pts on completion</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setConfirmExercise(exercise)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors"
                    >
                      <CheckCircle2 size={16} />
                      Done
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {completedExercises.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 size={18} className="text-green-500" />
                <h4 className="text-lg font-semibold text-green-700">Completed</h4>
                <span className="ml-auto text-xs bg-green-100 text-green-600 font-semibold px-2 py-0.5 rounded-full">
                  {completedExercises.length} done
                </span>
              </div>
              <div className="grid gap-3">
                <AnimatePresence>
                  {completedExercises.map(exercise => (
                    <motion.div
                      key={exercise.id}
                      className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center">
                          <CheckCircle2 size={18} className="text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-green-800 line-through">{exercise.name}</p>
                          <p className="text-xs text-green-500">+{exercise.points} pts earned</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">✓ Done</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          <AnimatePresence>
            {confirmExercise && (
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full"
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.85, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-1">
                      <Flame size={32} className="text-orange-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Confirm Completion</h3>
                    <p className="text-gray-500 text-sm">
                      Did you actually complete{' '}
                      <span className="font-semibold text-gray-700">"{confirmExercise.name}"</span>?
                      <br />
                      <span className="text-orange-500 font-medium">This cannot be undone.</span>
                    </p>
                    <p className="text-sm bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 text-yellow-700 font-medium">
                      🏅 You'll earn <strong>{confirmExercise.points} pts</strong> for this!
                    </p>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setConfirmExercise(null)}
                      className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-600 font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Not yet
                    </button>
                    <button
                      onClick={() => { updateExercise(confirmExercise.id); setConfirmExercise(null); }}
                      className="flex-1 py-2.5 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors"
                    >
                      Yes, Done! ✓
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    };

    const renderAchievements = () => {
      const MILESTONES = [
        { name: 'Century',            icon: '🏅', threshold: 100,  desc: 'Earn 100 pts'  },
        { name: 'Fitness Enthusiast', icon: '🏆', threshold: 500,  desc: 'Earn 500 pts'  },
        { name: 'Workout Warrior',    icon: '💪', threshold: 1000, desc: 'Earn 1000 pts' },
        { name: 'On Fire',            icon: '🔥', threshold: 250,  desc: '7-day streak'  },
      ];

      const nextMilestone = MILESTONES.find(m => userData.totalPoints < m.threshold);
      const prevMilestone = MILESTONES.filter(m => userData.totalPoints >= m.threshold).at(-1);
      const progressToNext = nextMilestone
        ? Math.round((userData.totalPoints / nextMilestone.threshold) * 100)
        : 100;

      const handleToggle = async (e) => {
        const checked = e.target.checked;
        setShowOnLeaderboard(checked);
        await updateLeaderboardVisibility(checked);
      };

      const avatarColors = [
        'bg-purple-100 text-purple-700',
        'bg-teal-100 text-teal-700',
        'bg-pink-100 text-pink-700',
        'bg-blue-100 text-blue-700',
        'bg-green-100 text-green-700',
      ];

      const merged = showOnLeaderboard
        ? [...leaderboard.filter(u => u.username !== loggedInUser),
           { username: loggedInUser, points: userData.totalPoints, isYou: true }]
            .sort((a, b) => b.points - a.points)
        : leaderboard.filter(u => u.username !== loggedInUser)
                     .sort((a, b) => b.points - a.points);

      return (
        <div className="space-y-8 max-w-2xl mx-auto">
          <div className="flex items-center gap-6 bg-purple-50 rounded-2xl p-5 border border-purple-100">
            <div>
              <p className="text-4xl font-bold text-purple-600">{userData.totalPoints}</p>
              <p className="text-sm text-purple-400 mt-0.5">points this week</p>
              {nextMilestone && (
                <p className="text-xs text-purple-400 mt-1">
                  {nextMilestone.threshold - userData.totalPoints} pts to <strong>{nextMilestone.name}</strong>
                </p>
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs text-purple-400 mb-1">
                <span>{prevMilestone?.threshold ?? 0}</span>
                <span>{nextMilestone?.threshold ?? '🏁'}</span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <motion.div
                  className="h-2 rounded-full bg-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNext}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              <p className="text-xs text-purple-400 mt-1">{progressToNext}% to next milestone</p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-4">Badges</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {MILESTONES.map((m, i) => {
                const earned = userData.totalPoints >= m.threshold;
                const pct = Math.min(100, Math.round((userData.totalPoints / m.threshold) * 100));
                return (
                  <motion.div
                    key={i}
                    className={`rounded-xl p-4 text-center border transition-all ${
                      earned ? 'bg-white border-purple-200 shadow-sm' : 'bg-gray-50 border-gray-200 opacity-50 grayscale'
                    }`}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: earned ? 1 : 0.5, scale: 1 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <div className="text-3xl mb-2">{m.icon}</div>
                    <p className="text-sm font-semibold text-gray-800">{m.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{m.desc}</p>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${earned ? 'bg-green-400' : 'bg-purple-400'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-3">Community Leaderboard</h4>
            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-700">Show me on the leaderboard</p>
                <p className="text-xs text-gray-400 mt-0.5">Others can see your name and points</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={showOnLeaderboard} onChange={handleToggle} />
                <div className="w-10 h-5 bg-gray-300 peer-checked:bg-purple-500 rounded-full peer-focus:outline-none transition-colors duration-200" />
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform duration-200" />
              </label>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {merged.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-8">No one on the board yet. Be the first!</p>
              )}
              {merged.map((user, idx) => {
                const isYou = user.username === loggedInUser;
                const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : null;
                const initials = user.username.slice(0, 2).toUpperCase();
                const colorClass = avatarColors[idx % avatarColors.length];
                return (
                  <motion.div
                    key={user.username}
                    className={`flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-b-0 ${isYou ? 'bg-purple-50' : ''}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <span className="text-sm font-semibold text-gray-400 w-6 text-center">{medal ?? `${idx + 1}`}</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${colorClass}`}>
                      {initials}
                    </div>
                    <span className="flex-1 text-sm font-semibold text-gray-800">
                      {user.username}
                      {isYou && <span className="ml-2 text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">you</span>}
                    </span>
                    <span className="text-sm font-bold text-gray-700">{user.points} pts</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      );
    };

    const sectionVariants = {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      exit: { opacity: 0, y: -50, transition: { duration: 0.5 } }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            className="text-5xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Your Fitness Journey
          </motion.h1>

          {quizCompleted && (
            <div className="flex justify-center space-x-4 mb-12 flex-wrap">
              {['dashboard', 'exercises', 'achievements'].map((section) => (
                <motion.button
                  key={section}
                  className={`px-6 py-2 rounded-full ${activeSection === section ? 'bg-purple-600 text-white' : 'bg-white text-purple-600'} m-2`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveSection(section)}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </motion.button>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white p-8 rounded-xl shadow-xl"
            >
              {!quizCompleted && <FitnessQuiz onSubmit={submitQuiz} />}
              {quizCompleted && activeSection === 'dashboard' && renderDashboard()}
              {quizCompleted && activeSection === 'exercises' && renderExercises()}
              {quizCompleted && activeSection === 'achievements' && renderAchievements()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
};

export default Feature;