import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { submitSupportConcern } from '../../services/api';
import { MOCK_FAQS } from '../../data/mockBillingData';
import { SELF_SERVICE_GUIDES_LIST } from '../../data/adminMockData';
import { 
  Paperclip, CheckCircle2, Search, Send, Mail, Headphones, 
  Phone, Smartphone, Megaphone, ChevronRight, ChevronDown, Lock, AlertTriangle, BookOpen 
} from 'lucide-react';

export const SupportView: React.FC = () => {
  const { selectedAccount } = useApp();

  const [activeTab, setActiveTab] = useState<'TICKET' | 'FAQS' | 'GUIDES' | 'OUTAGES'>('TICKET');

  // Concern Form State
  const [category, setCategory] = useState<'Billing Concern' | 'Service Complaint' | 'Payment Concern' | 'Meter Concern' | 'Power Outage' | 'Others'>('Billing Concern');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<any>(null);

  // FAQ Search
  const [faqQuery, setFaqQuery] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachmentName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccount) return;

    setIsSubmitting(true);
    const res = await submitSupportConcern({
      accountNumber: selectedAccount.accountNumber,
      category,
      subject,
      description,
      attachmentName: attachmentName || undefined,
    });
    setIsSubmitting(false);

    if (res.success && res.ticket) {
      setSubmittedTicket(res.ticket);
      setSubject('');
      setDescription('');
      setAttachmentName(null);
    }
  };

  const filteredFaqs = MOCK_FAQS.filter(
    f => f.question.toLowerCase().includes(faqQuery.toLowerCase()) || f.answer.toLowerCase().includes(faqQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-20 md:pb-12 w-full max-w-6xl mx-auto">
      {/* Top Tab Bar Navigation */}
      <div className="bg-[#F0F2F5] p-1.5 rounded-2xl flex items-center justify-center gap-1 text-xs font-bold w-full max-w-lg mx-auto">
        <button
          type="button"
          onClick={() => setActiveTab('TICKET')}
          className={`flex-1 py-2.5 px-3 md:px-4 rounded-xl text-center whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'TICKET'
              ? 'bg-white text-[#FF5401] shadow-xs font-extrabold border-t-2 border-[#FF5401]'
              : 'text-slate-600 hover:text-[#2B2B2B] hover:bg-white/50'
          }`}
        >
          Concern
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('FAQS')}
          className={`flex-1 py-2.5 px-3 md:px-4 rounded-xl text-center whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'FAQS'
              ? 'bg-white text-[#FF5401] shadow-xs font-extrabold border-t-2 border-[#FF5401]'
              : 'text-slate-600 hover:text-[#2B2B2B] hover:bg-white/50'
          }`}
        >
          FAQs
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('GUIDES')}
          className={`flex-1 py-2.5 px-3 md:px-4 rounded-xl text-center whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'GUIDES'
              ? 'bg-white text-[#FF5401] shadow-xs font-extrabold border-t-2 border-[#FF5401]'
              : 'text-slate-600 hover:text-[#2B2B2B] hover:bg-white/50'
          }`}
        >
          Self-Help
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('OUTAGES')}
          className={`flex-1 py-2.5 px-3 md:px-4 rounded-xl text-center whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'OUTAGES'
              ? 'bg-white text-[#FF5401] shadow-xs font-extrabold border-t-2 border-[#FF5401]'
              : 'text-slate-600 hover:text-[#2B2B2B] hover:bg-white/50'
          }`}
        >
          Outages
        </button>
      </div>

      {/* 1. SUBMIT CONCERN TAB CONTENT */}
      {activeTab === 'TICKET' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Form Container (Top on Mobile) */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 order-1 lg:order-2 bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-xs space-y-5">
            <div>
              <h2 className="text-base md:text-lg font-extrabold text-[#2B2B2B]">Concern</h2>
              <p className="text-xs text-slate-500">Fill out the form below to send us your concern.</p>
            </div>

            <div className="space-y-4">
              {/* Concern Category */}
              <div>
                <label className="block text-xs font-bold text-[#2B2B2B] mb-1.5">Concern Category</label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 text-xs font-medium text-[#2B2B2B] focus:outline-none focus:border-[#FF5401] focus:bg-white appearance-none pr-10 cursor-pointer"
                  >
                    <option value="Billing Concern">Billing Concern (Unclear charges, high reading)</option>
                    <option value="Service Complaint">Service Complaint (Voltage fluctuation, tree trimming)</option>
                    <option value="Payment Concern">Payment Concern (Unposted payment, OR missing)</option>
                    <option value="Meter Concern">Meter Concern (Digital meter fault, seal broken)</option>
                    <option value="Power Outage">Power Outage (Unscheduled blackouts, line trip)</option>
                    <option value="Others">Others</option>
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                    ▼
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-[#2B2B2B] mb-1.5">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Brief summary of your inquiry"
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-xs text-[#2B2B2B] placeholder:text-slate-400 focus:outline-none focus:border-[#FF5401] focus:bg-white"
                  required
                />
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-xs font-bold text-[#2B2B2B] mb-1.5">Detailed Description</label>
                <div className="relative">
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    maxLength={1000}
                    rows={5}
                    placeholder="Provide details, dates, or specific meter readings..."
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 text-xs text-[#2B2B2B] placeholder:text-slate-400 focus:outline-none focus:border-[#FF5401] focus:bg-white resize-none"
                    required
                  ></textarea>
                  <div className="text-[10px] text-slate-400 text-right mt-1 font-medium">
                    {description.length}/1000
                  </div>
                </div>
              </div>

              {/* Optional Attachment */}
              <div>
                <label className="block text-xs font-bold text-[#2B2B2B] mb-1.5">Optional Photo/Document Attachment</label>
                <label className="flex flex-col items-center justify-center p-4 border border-slate-200 hover:border-[#FF5401]/60 rounded-xl cursor-pointer bg-[#F8FAFC] hover:bg-orange-50/40 text-xs transition-colors">
                  <div className="flex items-center gap-2 text-[#FF5401] font-bold text-xs mb-0.5">
                    <Paperclip className="w-4 h-4" />
                    <span>{attachmentName ? attachmentName : 'Attach Photo or Billing Statement (Optional)'}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">JPG, PNG, PDF up to 10MB</span>
                  <input type="file" onChange={handleFileChange} className="hidden" accept="image/*,.pdf" />
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#FF5401] hover:bg-[#E54A00] text-white font-extrabold text-xs py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Sending Ticket...' : 'Submit Concern to CEDC'}</span>
              </button>

              {/* Footer Note */}
              <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[11px] pt-1">
                <Lock className="w-3.5 h-3.5" />
                <span>Your information is safe and secure.</span>
              </div>
            </div>
          </form>

          {/* Left Side: Help info, hotlines, and power outage link */}
          <div className="lg:col-span-5 order-2 lg:order-1 space-y-4">
            {/* We're Here to Help Card */}
            <div className="bg-[#FFF9F5] rounded-2xl p-5 border border-[#FEE8D6] space-y-4 relative overflow-hidden">
              <div className="flex items-start justify-between gap-3 relative z-10">
                <div className="space-y-1">
                  <h3 className="text-base md:text-lg font-extrabold text-[#2B2B2B]">We're here to help!</h3>
                  <p className="text-xs text-slate-500 leading-snug">
                    Submit your concern and our team will get back to you as soon as possible.
                  </p>
                </div>
                {/* Decorative Headset Illustration */}
                <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center shrink-0 text-[#FF5401]">
                  <Headphones className="w-8 h-8 stroke-[1.75]" />
                </div>
              </div>

              {/* Direct Customer Care Box */}
              <div className="bg-[#FFF3EB] border border-[#FDBA74]/30 rounded-2xl p-4 text-xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#FEE8D6] text-[#FF5401] flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-[#2B2B2B] text-xs">Direct Customer Care Forwarding</h4>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Submitted concerns are logged in CEDC Ticketing System and automatically dispatched to{' '}
                    <strong className="text-[#FF5401] font-bold">customercare@clarkelectric.ph</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Need Immediate Attention Hotlines Card */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-xs space-y-4">
              <div>
                <h3 className="font-extrabold text-sm text-[#2B2B2B]">Need immediate attention?</h3>
                <p className="text-xs text-slate-500">Contact our Customer Care Hotlines</p>
              </div>

              <div className="space-y-3.5">
                {/* Phone 1 */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-orange-50 text-[#FF5401] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-extrabold text-xs text-[#2B2B2B]">(045) 499-7400</p>
                    <p className="text-[11px] text-slate-500">Mon - Fri: 7:00 AM - 6:00 PM</p>
                  </div>
                </div>

                {/* Phone 2 */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-orange-50 text-[#FF5401] flex items-center justify-center shrink-0">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-extrabold text-xs text-[#2B2B2B]">0917 123 4567</p>
                    <p className="text-[11px] text-slate-500">Mon - Fri: 7:00 AM - 6:00 PM</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-orange-50 text-[#FF5401] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-extrabold text-xs text-[#2B2B2B]">customercare@clarkelectric.ph</p>
                    <p className="text-[11px] text-slate-500">We'll respond within 24 hours.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Report a Power Outage Card */}
            <button
              type="button"
              onClick={() => setActiveTab('OUTAGES')}
              className="w-full bg-[#FFF9F5] hover:bg-[#FFEFE5] border border-[#FEE8D6] rounded-2xl p-4 flex items-center justify-between gap-3 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#FF5401] flex items-center justify-center shrink-0">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-[#2B2B2B]">Report a Power Outage</h4>
                  <p className="text-[11px] text-slate-500">Check and report outages in your area.</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#FF5401] group-hover:translate-x-1 transition-transform shrink-0" />
            </button>

            {/* Ticket Confirmation Banner if submitted */}
            {submittedTicket && (
              <div className="bg-emerald-50 border border-[#22C55E]/30 rounded-2xl p-4 text-xs space-y-2 text-emerald-950 animate-fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                  <span className="font-bold text-sm">Ticket Received!</span>
                </div>
                <p>
                  Ticket <strong>#{submittedTicket.ticketNumber}</strong> has been logged for Account #{submittedTicket.accountNumber}.
                </p>
                <p className="text-[11px] text-emerald-800">
                  A customer care representative will review your inquiry within 24 hours.
                </p>
                <button
                  onClick={() => setSubmittedTicket(null)}
                  className="text-[11px] font-bold text-emerald-700 underline pt-1 block cursor-pointer"
                >
                  Submit another ticket
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. FAQS TAB */}
      {activeTab === 'FAQS' && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={faqQuery}
              onChange={e => setFaqQuery(e.target.value)}
              placeholder="Search FAQs (billing, payment, meter)..."
              className="w-full bg-white border border-[#E5E7EB] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#2B2B2B] focus:outline-none focus:border-[#FF5401]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredFaqs.map(faq => (
              <details key={faq.id} className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs p-4 group">
                <summary className="font-bold text-xs text-[#2B2B2B] cursor-pointer list-none flex justify-between items-center gap-2">
                  <span>{faq.question}</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform shrink-0">▼</span>
                </summary>
                <p className="text-xs text-slate-600 mt-2.5 pt-2 border-t border-[#E5E7EB] leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* 3. SELF-HELP GUIDES */}
      {activeTab === 'GUIDES' && (
        <div className="space-y-3">
          {SELF_SERVICE_GUIDES_LIST.map(guide => (
            <details key={guide.id} className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs p-4 group">
              <summary className="font-bold text-xs text-[#2B2B2B] cursor-pointer list-none flex justify-between items-center gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 bg-orange-50 text-[#FF5401] rounded-md uppercase shrink-0">
                    {guide.category}
                  </span>
                  <span className="truncate">{guide.title}</span>
                </div>
                <span className="text-slate-400 group-open:rotate-180 transition-transform shrink-0">▼</span>
              </summary>
              <div className="text-xs text-slate-600 mt-3 pt-2.5 border-t border-[#E5E7EB] leading-relaxed space-y-2">
                <p className="font-medium text-slate-700">{guide.summary}</p>
                {guide.content && (
                  <div className="bg-[#F8FAFC] p-3 rounded-xl border border-slate-200/80 text-slate-800 whitespace-pre-line mt-2">
                    {guide.content}
                  </div>
                )}
                <div className="text-[10px] text-slate-400 pt-1 flex justify-between items-center">
                  <span>Estimated read: {guide.readTime}</span>
                  <span>{guide.viewsCount} readers</span>
                </div>
              </div>
            </details>
          ))}
        </div>
      )}

      {/* 4. LIVE OUTAGE STATUS */}
      {activeTab === 'OUTAGES' && (
        <div className="space-y-3">
          <div className="bg-emerald-50 border border-[#22C55E]/30 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#22C55E] text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-emerald-950">Clark Freeport Zone Substation Status</h4>
              <p className="text-[11px] text-emerald-800">All 5 Main Feeders Operating Normally (100% Grid Power)</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-[#E5E7EB] shadow-xs space-y-2">
            <h4 className="font-bold text-xs text-[#2B2B2B] uppercase tracking-wider">Scheduled Substation Preventive Maintenance</h4>
            <div className="p-3 bg-[#F5F5F5] rounded-xl border border-[#E5E7EB] text-xs text-slate-700 space-y-1">
              <div className="flex justify-between font-bold">
                <span>Feeder 3 - Berthaphil Industrial Zone</span>
                <span className="text-[#F59E0B]">Aug 08, 2026</span>
              </div>
              <p className="text-[11px] text-slate-500">Duration: 08:00 AM - 12:00 PM (4 hours)</p>
              <p className="text-[11px] text-slate-600">Scope: High-voltage insulator replacement & line clearing.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

