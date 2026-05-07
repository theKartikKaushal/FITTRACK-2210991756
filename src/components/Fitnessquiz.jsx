import React, { useState } from 'react';

const FitnessQuiz = ({ onSubmit }) => {
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({
    fitnessLevel: '',
    fitnessGoal: '',
    daysPerWeek: '',
    enjoyedExercises: [],
    healthConditions: '',
  });

  const steps = ['Fitness level', 'Your goal', 'Schedule', 'Preferences', 'Review'];
  const progress = ((quizStep + 1) / steps.length) * 100;

  const pick = (key, value) => setQuizAnswers(prev => ({ ...prev, [key]: value }));

  const toggleExercise = (val) => setQuizAnswers(prev => ({
    ...prev,
    enjoyedExercises: prev.enjoyedExercises.includes(val)
      ? prev.enjoyedExercises.filter(e => e !== val)
      : [...prev.enjoyedExercises, val]
  }));

  const handleNext = () => {
    if (quizStep === 0 && !quizAnswers.fitnessLevel) { alert('Please select your fitness level'); return; }
    if (quizStep === 1 && !quizAnswers.fitnessGoal) { alert('Please select a goal'); return; }
    if (quizStep === 2 && !quizAnswers.daysPerWeek) { alert('Please select days per week'); return; }
    setQuizStep(prev => prev + 1);
  };

  const OptionBtn = ({ label, sub, field, value }) => (
    <button
      type="button"
      onClick={() => pick(field, value)}
      className={`p-4 rounded-xl border text-left transition-all ${
        quizAnswers[field] === value
          ? 'border-purple-500 bg-purple-50 text-purple-800 font-medium'
          : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50 text-gray-700'
      }`}
    >
      <span className="block text-sm font-medium">
        {quizAnswers[field] === value && '✓ '}{label}
      </span>
      {sub && <span className="block text-xs text-gray-400 mt-0.5">{sub}</span>}
    </button>
  );

  const CheckBtn = ({ label, value }) => (
    <button
      type="button"
      onClick={() => toggleExercise(value)}
      className={`p-3 rounded-xl border text-left text-sm transition-all ${
        quizAnswers.enjoyedExercises.includes(value)
          ? 'border-purple-500 bg-purple-50 text-purple-800 font-medium'
          : 'border-gray-200 bg-white hover:border-purple-300 text-gray-700'
      }`}
    >
      {quizAnswers.enjoyedExercises.includes(value) && '✓ '}{label}
    </button>
  );

  return (
    <div className="max-w-xl mx-auto py-4">

      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-1 mb-6">
        <div
          className="bg-purple-500 h-1 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step dots */}
      <div className="flex justify-center gap-2 mb-8">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${i <= quizStep ? 'bg-purple-500' : 'bg-gray-200'}`}
          />
        ))}
      </div>

      {/* Step 1 — Fitness level */}
      {quizStep === 0 && (
        <div>
          <p className="text-sm text-gray-400 mb-1">Step 1 of 5</p>
          <h3 className="text-xl font-semibold mb-6 text-gray-800">What is your current fitness level?</h3>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <OptionBtn label="Beginner" sub="Just getting started" field="fitnessLevel" value="beginner" />
            <OptionBtn label="Intermediate" sub="Some experience" field="fitnessLevel" value="intermediate" />
            <OptionBtn label="Advanced" sub="Training regularly" field="fitnessLevel" value="advanced" />
          </div>
        </div>
      )}

      {/* Step 2 — Goal */}
      {quizStep === 1 && (
        <div>
          <p className="text-sm text-gray-400 mb-1">Step 2 of 5</p>
          <h3 className="text-xl font-semibold mb-6 text-gray-800">What is your primary fitness goal?</h3>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <OptionBtn label="Weight loss" field="fitnessGoal" value="weightLoss" />
            <OptionBtn label="Muscle gain" field="fitnessGoal" value="muscleGain" />
            <OptionBtn label="Endurance" field="fitnessGoal" value="endurance" />
            <OptionBtn label="Flexibility" field="fitnessGoal" value="flexibility" />
          </div>
        </div>
      )}

      {/* Step 3 — Days per week */}
      {quizStep === 2 && (
        <div>
          <p className="text-sm text-gray-400 mb-1">Step 3 of 5</p>
          <h3 className="text-xl font-semibold mb-6 text-gray-800">How many days per week can you exercise?</h3>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <OptionBtn label="1–2 days" sub="Light schedule" field="daysPerWeek" value="1-2" />
            <OptionBtn label="3–4 days" sub="Moderate" field="daysPerWeek" value="3-4" />
            <OptionBtn label="5–6 days" sub="Intensive" field="daysPerWeek" value="5-6" />
            <OptionBtn label="Every day" sub="Full commitment" field="daysPerWeek" value="7" />
          </div>
        </div>
      )}

      {/* Step 4 — Exercises + health */}
      {quizStep === 3 && (
        <div>
          <p className="text-sm text-gray-400 mb-1">Step 4 of 5</p>
          <h3 className="text-xl font-semibold mb-6 text-gray-800">What exercises do you enjoy?</h3>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <CheckBtn label="Cardio" value="cardio" />
            <CheckBtn label="Strength training" value="strength" />
            <CheckBtn label="Yoga" value="yoga" />
            <CheckBtn label="HIIT" value="hiit" />
          </div>
          <p className="text-sm text-gray-500 mb-2">
            Any injuries or health conditions? <span className="text-gray-400">(optional)</span>
          </p>
          <textarea
            value={quizAnswers.healthConditions}
            onChange={(e) => pick('healthConditions', e.target.value)}
            placeholder="e.g. knee pain, asthma..."
            className="w-full p-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-purple-400"
            rows={3}
          />
        </div>
      )}

      {/* Step 5 — Review */}
      {quizStep === 4 && (
        <div>
          <p className="text-sm text-gray-400 mb-1">Step 5 of 5 — Review</p>
          <h3 className="text-xl font-semibold mb-6 text-gray-800">Looks good?</h3>
          <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3">
            {[
              ['Fitness level', quizAnswers.fitnessLevel],
              ['Goal', quizAnswers.fitnessGoal],
              ['Days per week', quizAnswers.daysPerWeek],
              ['Exercises', quizAnswers.enjoyedExercises.length ? quizAnswers.enjoyedExercises.join(', ') : 'None selected'],
              ['Health notes', quizAnswers.healthConditions || 'None'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-sm border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                <span className="text-gray-500">{label}</span>
                <span className="text-gray-800 font-medium capitalize">{value}</span>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onSubmit(quizAnswers)}
            className="w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition"
          >
            Build my plan
          </button>
        </div>
      )}

      {/* Nav buttons */}
      <div className={`flex mt-4 ${quizStep > 0 ? 'justify-between' : 'justify-end'}`}>
        {quizStep > 0 && quizStep < 4 && (
          <button
            type="button"
            onClick={() => setQuizStep(prev => prev - 1)}
            className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            Back
          </button>
        )}
        {quizStep < 4 && (
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition"
          >
            Continue
          </button>
        )}
      </div>

    </div>
  );
};

export default FitnessQuiz;