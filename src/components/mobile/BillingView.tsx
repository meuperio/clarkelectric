import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { fetchBillingHistory, fetchConsumptionHistory } from '../../services/api';
import { BillingHistoryItem, ConsumptionData } from '../../types';
import { FileText, History, BarChart3, Info, Download, CheckCircle2, ChevronRight, Zap, ArrowDownToLine } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const BillingView: React.FC = () => {
  const { selectedAccount, setPaymentModalOpen } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'CURRENT' | 'HISTORY' | 'CONSUMPTION' | 'INFO'>('CURRENT');

  const [historyList, setHistoryList] = useState<BillingHistoryItem[]>([]);
  const [consumptionList, setConsumptionList] = useState<ConsumptionData[]>([]);
  const [selectedHistoryReceipt, setSelectedHistoryReceipt] = useState<BillingHistoryItem | null>(null);

  useEffect(() => {
    if (!selectedAccount) return;
    fetchBillingHistory(selectedAccount.accountNumber).then(res => {
      if (res.history) setHistoryList(res.history);
    });
    fetchConsumptionHistory(selectedAccount.accountNumber).then(res => {
      if (res.consumption) setConsumptionList(res.consumption);
    });
  }, [selectedAccount]);

  if (!selectedAccount) return null;

  const currentBill = selectedAccount.currentBill;

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-20 md:pb-12 w-full">
      {/* Subtab navigation pills */}
      <div className="bg-[#F0F2F5] p-1.5 rounded-2xl flex items-center justify-center gap-1 text-xs font-bold w-full max-w-lg mx-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab('CURRENT')}
          className={`flex-1 py-2.5 px-3 md:px-4 rounded-xl text-center whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'CURRENT'
              ? 'bg-white text-[#FF5401] shadow-xs font-extrabold border-t-2 border-[#FF5401]'
              : 'text-slate-600 hover:text-[#2B2B2B] hover:bg-white/50'
          }`}
        >
          Bill
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('HISTORY')}
          className={`flex-1 py-2.5 px-3 md:px-4 rounded-xl text-center whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'HISTORY'
              ? 'bg-white text-[#FF5401] shadow-xs font-extrabold border-t-2 border-[#FF5401]'
              : 'text-slate-600 hover:text-[#2B2B2B] hover:bg-white/50'
          }`}
        >
          History
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('CONSUMPTION')}
          className={`flex-1 py-2.5 px-3 md:px-4 rounded-xl text-center whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'CONSUMPTION'
              ? 'bg-white text-[#FF5401] shadow-xs font-extrabold border-t-2 border-[#FF5401]'
              : 'text-slate-600 hover:text-[#2B2B2B] hover:bg-white/50'
          }`}
        >
          Consumption
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('INFO')}
          className={`flex-1 py-2.5 px-3 md:px-4 rounded-xl text-center whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'INFO'
              ? 'bg-white text-[#FF5401] shadow-xs font-extrabold border-t-2 border-[#FF5401]'
              : 'text-slate-600 hover:text-[#2B2B2B] hover:bg-white/50'
          }`}
        >
          Info
        </button>
      </div>

      {/* 1. CURRENT BILL BREAKDOWN */}
      {activeSubTab === 'CURRENT' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 md:p-7 border border-[#E5E7EB] shadow-xs space-y-4">
              <div className="flex justify-between items-start border-b border-[#E5E7EB] pb-4">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Statement of Account</span>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-[#FF5401] mt-1">
                    ₱{currentBill.amountDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block mb-0.5">Due Date</span>
                  <span className="text-xs font-bold text-[#2B2B2B]">{currentBill.dueDate}</span>
                </div>
              </div>

              <div className="text-xs space-y-2 text-slate-600">
                <div className="flex justify-between">
                  <span>Billing Period:</span>
                  <strong className="text-[#2B2B2B]">{currentBill.billingPeriod}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Total Consumption:</span>
                  <strong className="text-[#2B2B2B]">{currentBill.kwhConsumed} kWh ({currentBill.peakKw} kW Peak)</strong>
                </div>
              </div>
            </div>

            {currentBill.status !== 'Paid' && (
              <button
                onClick={() => setPaymentModalOpen(true)}
                className="w-full bg-[#FF5401] hover:bg-[#E54A00] text-white font-bold text-sm py-4 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Pay Bill Online Now</span>
              </button>
            )}
          </div>

          {/* Unbundled Rate Breakdown Card */}
          <div className="bg-white rounded-2xl p-6 md:p-7 border border-[#E5E7EB] shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-[#2B2B2B] uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#FF5401]" />
              Unbundled Rate Breakdown
            </h3>

            <div className="divide-y divide-[#E5E7EB] text-xs">
              {currentBill.breakdown.map((item, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-[#2B2B2B]">{item.category}</p>
                    <p className="text-[10px] text-slate-500">{item.description}</p>
                  </div>
                  <span className="font-semibold text-[#2B2B2B] font-mono">
                    ₱{item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E5E7EB] flex justify-between items-center text-sm font-bold text-[#2B2B2B]">
              <span>Total Amount Due</span>
              <span className="text-[#FF5401] text-base font-extrabold">
                ₱{currentBill.amountDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. BILLING HISTORY */}
      {activeSubTab === 'HISTORY' && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Payment & Bill History</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {historyList.map(item => (
              <div
                key={item.id}
                onClick={() => setSelectedHistoryReceipt(item)}
                className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs hover:border-[#FF5401]/50 cursor-pointer transition-all flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#2B2B2B]">{item.billingPeriod}</span>
                    <span className="bg-emerald-100 text-[#22C55E] text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Paid on {item.paymentDate} via {item.paymentMethod}
                  </p>
                </div>

                <div className="text-right flex items-center gap-2">
                  <div>
                    <span className="text-sm font-bold text-[#2B2B2B] block">
                      ₱{item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-[#FF5401] font-semibold flex items-center justify-end gap-0.5 mt-0.5">
                      <Download className="w-3 h-3" /> OR Receipt
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. CONSUMPTION GRAPH & ANALYTICS */}
      {activeSubTab === 'CONSUMPTION' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xs font-bold text-[#2B2B2B] uppercase tracking-wider">Monthly kWh Consumption</h3>
                <p className="text-[11px] text-slate-500">Historical usage comparison</p>
              </div>
              <span className="bg-orange-50 text-[#FF5401] text-[10px] font-bold px-2.5 py-1 rounded-lg border border-[#FF5401]/20">
                2026 Trend
              </span>
            </div>

            {/* Recharts Bar Chart */}
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={consumptionList} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#2B2B2B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#2B2B2B' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#2B2B2B', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                    formatter={(val: any) => [`${val} kWh`, 'Consumption']}
                  />
                  <Bar dataKey="kwh" fill="#FF5401" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <span className="text-[10px] text-slate-500 font-medium block">Average Monthly Usage</span>
              <span className="text-xl font-bold text-[#2B2B2B]">365 kWh</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs">
              <span className="text-[10px] text-slate-500 font-medium block">Peak kW Recorded</span>
              <span className="text-xl font-bold text-[#2B2B2B]">4.5 kW (Apr)</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. SERVICE ACCOUNT INFORMATION */}
      {activeSubTab === 'INFO' && (
        <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-xs space-y-3 text-xs max-w-2xl">
          <h3 className="text-xs font-bold text-[#2B2B2B] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">
            Service Account Details
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Account Number:</span>
              <span className="font-bold font-mono text-[#2B2B2B]">{selectedAccount.accountNumber}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Service Address:</span>
              <span className="font-semibold text-[#2B2B2B] text-right max-w-[260px]">{selectedAccount.serviceAddress}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Digital Meter Number:</span>
              <span className="font-bold font-mono text-[#2B2B2B]">{selectedAccount.meterNumber}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Service Classification:</span>
              <span className="font-bold text-[#FF5401]">{selectedAccount.serviceType}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Feeder Substation:</span>
              <span className="font-semibold text-[#2B2B2B]">CFZ Substation 3</span>
            </div>
          </div>
        </div>
      )}

      {/* Official Receipt Modal Sheet */}
      {selectedHistoryReceipt && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl animate-fade-in border border-[#E5E7EB]">
            <div className="text-center pb-2 border-b border-[#E5E7EB]">
              <div className="w-10 h-10 bg-emerald-100 text-[#22C55E] rounded-2xl mx-auto flex items-center justify-center mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-[#2B2B2B] text-base">CEDC Official Digital Receipt</h3>
              <p className="text-[11px] text-slate-500 font-mono">Ref: {selectedHistoryReceipt.receiptNumber}</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Account Number:</span>
                <span className="font-bold font-mono text-[#2B2B2B]">{selectedHistoryReceipt.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Billing Period:</span>
                <span className="font-semibold text-[#2B2B2B]">{selectedHistoryReceipt.billingPeriod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Channel:</span>
                <span className="font-bold text-[#FF5401]">{selectedHistoryReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Date:</span>
                <span className="font-semibold text-[#2B2B2B]">{selectedHistoryReceipt.paymentDate}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E5E7EB] font-bold text-sm text-[#2B2B2B]">
                <span>Amount Paid:</span>
                <span className="text-[#22C55E]">₱{selectedHistoryReceipt.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => alert(`Downloaded PDF Receipt: ${selectedHistoryReceipt.receiptNumber}.pdf`)}
                className="flex-1 bg-orange-50 text-[#FF5401] font-bold text-xs py-2.5 rounded-xl border border-[#FF5401]/30 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowDownToLine className="w-4 h-4" /> Download PDF
              </button>
              <button
                onClick={() => setSelectedHistoryReceipt(null)}
                className="w-1/3 bg-[#E5E7EB] text-[#2B2B2B] font-bold text-xs py-2.5 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
