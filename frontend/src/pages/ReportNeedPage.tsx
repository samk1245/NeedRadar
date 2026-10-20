import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  MapPin,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Upload,
  Shield,
  Sparkles,
  Info,
  Building,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCity } from '../context/CityContext';
import { api } from '../services/api';
import { NeedCategory, NeedUrgency, NeedScope, DuplicateSuggestion, Need } from '../types';

export const ReportNeedPage: React.FC = () => {
  const { user } = useAuth();
  const { currentCity, cityData, availableCities } = useCity();
  const navigate = useNavigate();

  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);
  const [checkingDuplicates, setCheckingDuplicates] = useState(false);
  const [duplicateSuggestions, setDuplicateSuggestions] = useState<DuplicateSuggestion[]>([]);
  const [submissionSuccess, setSubmissionSuccess] = useState<Need | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<NeedCategory>('education');
  const [subcategory, setSubcategory] = useState('');
  const [affectedCount, setAffectedCount] = useState<number>(1);
  const [imageUrl, setImageUrl] = useState('');

  // Location State
  const [city, setCity] = useState(currentCity);
  const currentCityObj = availableCities.find((c) => c.name.toLowerCase() === city.toLowerCase()) || cityData || availableCities[0];
  const [locality, setLocality] = useState(currentCityObj.localities[0]?.name || 'Central');
  const [latitude, setLatitude] = useState<number>(currentCityObj.localities[0]?.lat || currentCityObj.lat);
  const [longitude, setLongitude] = useState<number>(currentCityObj.localities[0]?.lon || currentCityObj.lon);
  const [isLocationApproximate, setIsLocationApproximate] = useState(false);

  // Context State
  const [scope, setScope] = useState<NeedScope>('community');
  const [urgency, setUrgency] = useState<NeedUrgency>('medium');
  const [desiredTimeframe, setDesiredTimeframe] = useState('Within 2 weeks');
  const [isSensitive, setIsSensitive] = useState(false);
  const [publicContactPreference, setPublicContactPreference] = useState('in_app');

  const handleCityChange = (newCityName: string) => {
    setCity(newCityName);
    const targetCity = availableCities.find((c) => c.name.toLowerCase() === newCityName.toLowerCase());
    if (targetCity && targetCity.localities.length > 0) {
      setLocality(targetCity.localities[0].name);
      setLatitude(targetCity.localities[0].lat);
      setLongitude(targetCity.localities[0].lon);
    }
  };

  const handleLocalitySelect = (locName: string) => {
    setLocality(locName);
    const found = currentCityObj.localities.find((l) => l.name === locName);
    if (found) {
      setLatitude(found.lat);
      setLongitude(found.lon);
    }
  };

  // Step 4 Duplicate Check
  const runDuplicateCheck = async () => {
    setCheckingDuplicates(true);
    try {
      const suggestions = await api.post<DuplicateSuggestion[]>('/needs/check-duplicates', {
        title,
        description,
        category,
        locality,
        latitude,
        longitude,
        affected_count: affectedCount,
      });
      setDuplicateSuggestions(suggestions);
    } catch (err) {
      console.warn('Duplicate check could not complete:', err);
    } finally {
      setCheckingDuplicates(false);
    }
  };

  const handleNextStep = () => {
    setErrorMsg(null);
    if (step === 1) {
      if (title.trim().length < 5) {
        setErrorMsg('Please enter a clear title with at least 5 characters.');
        return;
      }
      if (description.trim().length < 20) {
        setErrorMsg('Please provide a detailed description (at least 20 characters).');
        return;
      }
    }
    if (step === 2) {
      if (!locality.trim()) {
        setErrorMsg('Please specify a locality or neighbourhood.');
        return;
      }
    }
    if (step === 3) {
      runDuplicateCheck();
    }
    setStep((prev) => Math.min(4, prev + 1));
  };

  const handleSubmit = async () => {
    if (!user) {
      setErrorMsg('Please sign in to submit this community report.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const created = await api.post<Need>('/needs', {
        title,
        description,
        category,
        subcategory: subcategory || undefined,
        affected_count: Number(affectedCount),
        image_url: imageUrl || undefined,
        city,
        locality,
        latitude,
        longitude,
        is_location_approximate: isLocationApproximate || isSensitive,
        scope,
        urgency,
        desired_timeframe: desiredTimeframe,
        is_sensitive: isSensitive,
        public_contact_preference: publicContactPreference,
      });

      setSubmissionSuccess(created);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submissionSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Report Successfully Published!</h2>
          <p className="text-sm text-slate-600 mb-6">
            Your community need has been recorded on the civic intelligence radar. Nearby verified providers and community members can now review, respond, and support.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2 mb-6">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Report ID:</span>
              <span className="font-mono font-bold text-slate-800">{submissionSuccess.id}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Title:</span>
              <span className="font-medium text-slate-900">{submissionSuccess.title}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Locality:</span>
              <span className="font-medium text-slate-900">{submissionSuccess.locality}, {submissionSuccess.city}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Initial Unmet Demand Score:</span>
              <span className="font-bold text-teal-700 font-mono">{submissionSuccess.unmet_demand_score.toFixed(1)} / 100</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(`/needs/${submissionSuccess.id}`)}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold text-sm transition-colors shadow-sm"
            >
              View Report Details
            </button>
            <button
              onClick={() => navigate('/discovery')}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-sm transition-colors"
            >
              Explore Discovery Map
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Wizard Header */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Report an Unmet Community Need
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Surface urgent local needs in Bengaluru to verified NGOs, providers, and community volunteers.
        </p>

        {/* Stepper Tabs */}
        <div className="flex items-center justify-between max-w-xl mx-auto sm:mx-0 mt-6 border-b border-slate-200 pb-4">
          {[
            { num: 1, label: 'Describe', icon: FileText },
            { num: 2, label: 'Location', icon: MapPin },
            { num: 3, label: 'Context', icon: SlidersHorizontal },
            { num: 4, label: 'Review', icon: CheckCircle2 },
          ].map(({ num, label, icon: Icon }) => (
            <div
              key={num}
              className={`flex items-center gap-2 cursor-pointer ${
                step === num ? 'text-teal-600 font-bold' : step > num ? 'text-slate-900 font-medium' : 'text-slate-400'
              }`}
              onClick={() => {
                if (num < step) setStep(num);
              }}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                  step === num
                    ? 'bg-teal-600 text-white ring-4 ring-teal-50'
                    : step > num
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {step > num ? '✓' : num}
              </div>
              <span className="hidden sm:inline text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Wizard Card Body */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
        {/* STEP 1: DESCRIBE THE NEED */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-slate-900">Step 1: Describe the Need</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Title of Need *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Free 10th Grade Math Tutoring for 14 Municipal Students"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Provide a clear, descriptive headline. Minimum 5 characters.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as NeedCategory)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="education">Education & Tutoring</option>
                  <option value="healthcare">Healthcare & Blood Coordination</option>
                  <option value="supplies">Essential Supplies & Food Aid</option>
                  <option value="infrastructure">Public Infrastructure & Roads</option>
                  <option value="repairs">Repairs & Local Services</option>
                  <option value="shelter">Shelter & Basic Necessities</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Estimated People Affected
                </label>
                <input
                  type="number"
                  min="1"
                  max="100000"
                  value={affectedCount}
                  onChange={(e) => setAffectedCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Detailed Description *
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what is needed, who is impacted, current obstacles, and what assistance would solve the problem..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Do not include personal home addresses or private phone numbers in public text. Minimum 20 characters.
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: LOCATION */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-slate-900">Step 2: Add Location & Privacy</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  City *
                </label>
                <select
                  value={city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold text-slate-900"
                >
                  {availableCities.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name} ({c.state})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Neighbourhood / Locality in {city} *
                </label>
                <select
                  value={locality}
                  onChange={(e) => handleLocalitySelect(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {currentCityObj.localities.map((loc) => (
                    <option key={loc.name} value={loc.name}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-700 font-mono">
                <span>Latitude: {latitude.toFixed(4)}</span>
                <span>Longitude: {longitude.toFixed(4)}</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Geographic coordinates are auto-pinned to the selected ward/locality center for cluster indexing.
              </p>
            </div>

            {/* Privacy Obfuscation Option */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isLocationApproximate}
                  onChange={(e) => setIsLocationApproximate(e.target.checked)}
                  className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                />
                <div>
                  <span className="text-xs font-bold text-amber-950 block">
                    Use Approximate Location Visibility
                  </span>
                  <span className="text-[11px] text-amber-900/80 block mt-0.5">
                    Recommended for sensitive individual requests (shelter, home health). Obfuscates public map pin by ~300 meters while preserving aggregate district analytics.
                  </span>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* STEP 3: CONTEXT & TIMEFRAME */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-slate-900">Step 3: Urgency & Delivery Context</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Scope
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setScope('community')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                      scope === 'community'
                        ? 'border-teal-600 bg-teal-50 text-teal-900'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Community-Wide
                  </button>
                  <button
                    type="button"
                    onClick={() => setScope('individual')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                      scope === 'individual'
                        ? 'border-teal-600 bg-teal-50 text-teal-900'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Individual / Family
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                  Urgency Level
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as NeedUrgency)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="low">Low (1-2 months)</option>
                  <option value="medium">Medium (Within 2-3 weeks)</option>
                  <option value="high">High (Urgent - Within days)</option>
                  <option value="critical">Critical (Immediate social support)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Desired Timeframe
              </label>
              <input
                type="text"
                value={desiredTimeframe}
                onChange={(e) => setDesiredTimeframe(e.target.value)}
                placeholder="e.g. Before upcoming semester exams / next weekend"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Public Contact Preference
              </label>
              <select
                value={publicContactPreference}
                onChange={(e) => setPublicContactPreference(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="in_app">In-App Secure Messaging (Safe & Private)</option>
                <option value="masked_email">Relayed Community Email</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & DUPLICATE SUGGESTIONS */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-slate-900">Step 4: Review & Community Check</h3>

            {/* AI Duplicate Detection Notice */}
            {checkingDuplicates ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></span>
                <span>Checking community radar for similar existing requests...</span>
              </div>
            ) : duplicateSuggestions.length > 0 ? (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Found {duplicateSuggestions.length} Similar Existing Need(s) in {locality}</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  You can support an existing request to boost its unmet demand score instead of creating duplicates:
                </p>
                <div className="space-y-2">
                  {duplicateSuggestions.map((dup) => (
                    <div
                      key={dup.id}
                      className="bg-white p-3 rounded-lg border border-amber-200 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">{dup.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{dup.reason}</p>
                      </div>
                      <Link
                        to={`/needs/${dup.id}`}
                        target="_blank"
                        className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded font-semibold text-[11px] flex-shrink-0"
                      >
                        Support This Instead
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>No direct duplicates detected in {locality}. Your report appears to be a unique community need.</span>
              </div>
            )}

            {/* Complete Report Summary */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2.5">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Title:</span>
                <span className="font-bold text-slate-900 text-right">{title}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Category:</span>
                <span className="capitalize font-semibold text-slate-800">{category}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Location:</span>
                <span className="font-semibold text-slate-800">{locality}, Bengaluru</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Scope & Urgency:</span>
                <span className="capitalize font-semibold text-slate-800">{scope} • {urgency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Location Visibility:</span>
                <span className="font-semibold text-slate-800">
                  {isLocationApproximate || isSensitive ? 'Approximate Pin (~300m protected)' : 'Locality Center Pin'}
                </span>
              </div>
            </div>

            {/* Privacy Confirmation */}
            <div className="p-3 rounded-lg bg-slate-100 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
              <Shield className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
              <span>
                By submitting, you confirm that this report describes genuine community requirements and does not disclose sensitive private identity documents or personal financial numbers publicly.
              </span>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((p) => p - 1)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Previous
            </button>
          ) : (
            <div></div>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              Next Step
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
            >
              {submitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Persisting to Database...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Publish Report</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
