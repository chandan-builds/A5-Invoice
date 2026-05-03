import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Trash2, Printer, Settings } from 'lucide-react';

// --- Types ---
interface InvoiceItem {
  id: string;
  sn: number;
  particulars: string;
  mrp: number;
  qty: number;
  unit: string;
  rate: number;
  schePercent: number;
  cdPercent: number;
}

interface InvoiceHeader {
  storeName: string;
  customerName: string;
  customerLocation: string;
  docType: string; // 'CREDIT NO.'
  docNumber: string; // '0070706'
  date: string;
}

interface InvoiceExtra {
  hc: number;
  crDrNote: number;
  footerText: string;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export default function App() {
  // --- State ---
  const [header, setHeader] = useState<InvoiceHeader>({
    storeName: 'RADHE KRISHNA',
    customerName: 'RAMESHWARI BOOK DEPOT',
    customerLocation: 'BANBASSA',
    docType: 'CREDIT NO.',
    docNumber: '0070706',
    date: '26/03/2026',
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: generateId(),
      sn: 1,
      particulars: 'CALCULATER DELI',
      mrp: 0.0,
      qty: 10,
      unit: 'PCS',
      rate: 495.0,
      schePercent: 25.0,
      cdPercent: 3.0,
    },
  ]);

  const [extra, setExtra] = useState<InvoiceExtra>({
    hc: 0.0,
    crDrNote: 0.0,
    footerText: 'MARG ERP NANO @RS.5400 | Manage Stock,Accounts,GST,Barcodeing | Call 9837000298',
  });

  // --- Calculations ---
  const computedItems = useMemo(() => {
    return items.map((item, index) => {
      const amount = item.qty * item.rate;
      const scheAmt = amount * (item.schePercent / 100);
      const afterSche = amount - scheAmt;
      const cdAmt = afterSche * (item.cdPercent / 100);
      const netAmt = afterSche - cdAmt;

      return {
        ...item,
        sn: index + 1,
        amount,
        scheAmt,
        cdAmt,
        netAmt,
      };
    });
  }, [items]);

  const totals = useMemo(() => {
    let subTotal = 0;
    let totalScheme = 0;
    let totalDiscount = 0;
    let netTotal = 0;

    computedItems.forEach((item) => {
      subTotal += item.amount;
      totalScheme += item.scheAmt;
      totalDiscount += item.cdAmt;
      netTotal += item.netAmt;
    });

    netTotal = netTotal + extra.hc + extra.crDrNote;
    const partyTotal = Math.round(netTotal);

    return {
      subTotal,
      totalScheme,
      totalDiscount,
      netTotal,
      partyTotal,
      itemCount: items.length,
    };
  }, [computedItems, extra]);

  // --- Handlers ---
  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: generateId(),
        sn: items.length + 1,
        particulars: '',
        mrp: 0,
        qty: 1,
        unit: 'PCS',
        rate: 0,
        schePercent: 0,
        cdPercent: 0,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          // Parse numbers if applicable
          const numFields: (keyof InvoiceItem)[] = ['mrp', 'qty', 'rate', 'schePercent', 'cdPercent'];
          let finalValue = value;
          if (numFields.includes(field)) {
            finalValue = parseFloat(value as string) || 0;
          }
          return { ...item, [field]: finalValue };
        }
        return item;
      })
    );
  };

  const handlePrint = () => {
    // Set the document title for the PDF filename
    const originalTitle = document.title;
    document.title = 'A5-Invoice';
    
    // Trigger print dialog
    window.print();
    
    // Restore original title after print
    document.title = originalTitle;
  };

  // Helper for formatting numbers exactly as requested
  const formatNum = (num: number, hideZero = false) => {
    if (hideZero && num === 0) return '';
    return num.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F2] text-[#1A1A1A] flex flex-col md:flex-row antialiased font-sans h-screen overflow-hidden print:min-h-0 print:h-[148.5mm] print:w-[210mm] print:block print:bg-white print:m-0 print:p-0 print:overflow-hidden">
      {/* --- FORM SECTION (Hidden on print) --- */}
      <div className="w-full md:w-[400px] lg:w-[500px] bg-white border-r-[1px] border-[#1A1A1A] flex-shrink-0 flex flex-col h-full print:hidden overflow-y-auto">
        <div className="p-6 border-b-[1px] border-[#1A1A1A] flex items-center justify-between sticky top-0 z-10 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF5F1F] rounded-full flex items-center justify-center text-white font-bold text-xl italic">A5</div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic">Invoice<span className="text-[#FF5F1F]">.</span></h1>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] text-white font-black uppercase tracking-widest hover:bg-[#FF5F1F] transition-colors text-[10px]"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>

        <div className="p-6 space-y-8 flex-1">
          {/* Header Editor */}
          <section>
            <h2 className="text-[12px] font-black text-[#1A1A1A] uppercase tracking-widest mb-4">Header Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Store Name (Title)</label>
                <input
                  type="text"
                  className="w-full text-xs font-medium p-3 border-[1px] border-[#1A1A1A] bg-[#F7F7F2] outline-none focus:border-[#FF5F1F] transition-colors"
                  value={header.storeName}
                  onChange={(e) => setHeader({ ...header, storeName: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Customer Name</label>
                <input
                  type="text"
                  className="w-full text-xs font-medium p-3 border-[1px] border-[#1A1A1A] bg-[#F7F7F2] outline-none focus:border-[#FF5F1F] transition-colors"
                  value={header.customerName}
                  onChange={(e) => setHeader({ ...header, customerName: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Customer Location</label>
                <input
                  type="text"
                  className="w-full text-xs font-medium p-3 border-[1px] border-[#1A1A1A] bg-[#F7F7F2] outline-none focus:border-[#FF5F1F] transition-colors"
                  value={header.customerLocation}
                  onChange={(e) => setHeader({ ...header, customerLocation: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Doc Type</label>
                <input
                  type="text"
                  className="w-full text-xs font-medium p-3 border-[1px] border-[#1A1A1A] bg-[#F7F7F2] outline-none focus:border-[#FF5F1F] transition-colors"
                  value={header.docType}
                  onChange={(e) => setHeader({ ...header, docType: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Doc Number</label>
                <input
                  type="text"
                  className="w-full text-xs font-medium p-3 border-[1px] border-[#1A1A1A] bg-[#F7F7F2] outline-none focus:border-[#FF5F1F] transition-colors"
                  value={header.docNumber}
                  onChange={(e) => setHeader({ ...header, docNumber: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Date</label>
                <input
                  type="text"
                  className="w-full text-xs font-medium p-3 border-[1px] border-[#1A1A1A] bg-[#F7F7F2] outline-none focus:border-[#FF5F1F] transition-colors"
                  value={header.date}
                  onChange={(e) => setHeader({ ...header, date: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* Items Editor */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[12px] font-black text-[#1A1A1A] uppercase tracking-widest">Line Items</h2>
              <button
                onClick={handleAddItem}
                className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-1 text-[#1A1A1A] hover:text-[#FF5F1F] transition-colors"
              >
                <Plus className="w-3 h-3" /> Add Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={item.id} className="p-4 border-[1px] border-[#1A1A1A] bg-[#F7F7F2] relative group">
                  <div className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1.5 text-white bg-[#1A1A1A] hover:bg-[#FF5F1F] transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-8 h-8 flex-shrink-0 bg-[#FF5F1F] text-white flex items-center justify-center text-sm font-bold italic">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      className="flex-1 text-xs font-medium p-3 border-[1px] border-[#1A1A1A] bg-white outline-none w-full focus:border-[#FF5F1F] transition-colors"
                      placeholder="Particulars"
                      value={item.particulars}
                      onChange={(e) => handleItemChange(item.id, 'particulars', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] mb-1">M.R.P</label>
                      <input
                        type="number"
                        className="w-full text-xs font-medium p-2 border-[1px] border-[#1A1A1A] bg-white outline-none focus:border-[#FF5F1F] transition-colors"
                        value={item.mrp}
                        onChange={(e) => handleItemChange(item.id, 'mrp', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] mb-1">Qty</label>
                      <input
                        type="number"
                        className="w-full text-xs font-medium p-2 border-[1px] border-[#1A1A1A] bg-white outline-none focus:border-[#FF5F1F] transition-colors"
                        value={item.qty}
                        onChange={(e) => handleItemChange(item.id, 'qty', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] mb-1">Rate</label>
                      <input
                        type="number"
                        className="w-full text-xs font-medium p-2 border-[1px] border-[#1A1A1A] bg-white outline-none focus:border-[#FF5F1F] transition-colors"
                        value={item.rate}
                        onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)}
                      />
                    </div>
                    <div className="col-span-3 grid grid-cols-3 gap-2 mt-1">
                       <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] mb-1">Unit</label>
                        <input
                          type="text"
                          className="w-full text-xs font-medium p-2 border-[1px] border-[#1A1A1A] bg-white outline-none uppercase focus:border-[#FF5F1F] transition-colors"
                          value={item.unit}
                          onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] mb-1">Scheme %</label>
                        <input
                          type="number"
                          step="0.01"
                          className="w-full text-xs font-medium p-2 border-[1px] border-[#1A1A1A] bg-white outline-none focus:border-[#FF5F1F] transition-colors"
                          value={item.schePercent}
                          onChange={(e) => handleItemChange(item.id, 'schePercent', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] mb-1">CD %</label>
                        <input
                          type="number"
                          step="0.01"
                          className="w-full text-xs font-medium p-2 border-[1px] border-[#1A1A1A] bg-white outline-none focus:border-[#FF5F1F] transition-colors"
                          value={item.cdPercent}
                          onChange={(e) => handleItemChange(item.id, 'cdPercent', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Footer Editor */}
          <section>
            <h2 className="text-[12px] font-black text-[#1A1A1A] uppercase tracking-widest mb-4">Footer Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">H.C.</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full text-xs font-medium p-3 border-[1px] border-[#1A1A1A] bg-[#F7F7F2] outline-none focus:border-[#FF5F1F] transition-colors"
                  value={extra.hc}
                  onChange={(e) => setExtra({ ...extra, hc: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">CR/DR NOTE</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full text-xs font-medium p-3 border-[1px] border-[#1A1A1A] bg-[#F7F7F2] outline-none focus:border-[#FF5F1F] transition-colors"
                  value={extra.crDrNote}
                  onChange={(e) => setExtra({ ...extra, crDrNote: parseFloat(e.target.value) || 0 })}
                />
              </div>
               <div className="col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Footer Tagline</label>
                <input
                  type="text"
                  className="w-full text-xs font-medium p-3 border-[1px] border-[#1A1A1A] bg-[#F7F7F2] outline-none focus:border-[#FF5F1F] transition-colors"
                  value={extra.footerText}
                  onChange={(e) => setExtra({ ...extra, footerText: e.target.value })}
                />
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* --- PREVIEW SECTION (Visible on print) --- */}
      <div className="flex-1 relative bg-[#DEDDCF] p-8 flex items-start justify-center overflow-auto print:static print:p-0 print:m-0 print:bg-white print:overflow-visible print:block print:w-[210mm] print:h-[148.5mm] z-0">
        {/* Background Dot Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none print:hidden" style={{ backgroundImage: 'radial-gradient(#1A1A1A 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

        {/* Printable Paper Container */}
        <div className="bg-white p-6 shadow-[30px_30px_0px_rgba(0,0,0,0.05)] border-[1px] border-gray-200 print:shadow-none print:border-none mx-auto w-[210mm] h-[148.5mm] print:mx-0 print:w-[210mm] print:h-[148.5mm] print:max-w-none print:m-0 print:p-[4mm] relative font-mono text-[11px] leading-tight text-black z-10 flex flex-col box-border">
          
          <div className="flex-1 flex flex-col">
            {/* --- HEADER --- */}
            <div className="text-center mb-6 relative">
              <h1 className="text-[26px] font-bold font-serif uppercase inline-block border-b-2 border-black pb-0.5 tracking-wide">
                {header.storeName}
              </h1>
            </div>

            <div className="flex justify-between items-start mb-4 px-2">
               <div className="flex flex-col whitespace-pre-wrap w-[30%]">
                  <span className="uppercase">{header.customerName}</span>
                  <span className="uppercase">{header.customerLocation}</span>
               </div>
               <div className="flex-1 flex justify-center text-center">
                  <span className="uppercase whitespace-pre">{header.docType} : {header.docNumber}</span>
               </div>
               <div className="w-[30%] flex justify-end">
                  <span className="uppercase whitespace-pre">DT: {header.date}</span>
               </div>
            </div>

            {/* --- TABLE --- */}
            {/* Dashed Separator */}
            <div className="border-t border-dashed border-black mt-2 mb-1 opacity-70"></div>
            
            {/* Table Headers */}
            <div className="flex text-black font-semibold text-[11px] px-2 text-center">
              <div className="w-[4%]">SN</div>
              <div className="w-[25%] text-left pl-2">PARTICULARS</div>
              <div className="w-[9%]">M.R.P</div>
              <div className="w-[14%]">QUANTITY</div>
              <div className="w-[10%]">RATE</div>
              <div className="w-[12%]">AMOUNT</div>
              <div className="w-[7%]">SCHE%</div>
              <div className="w-[5%]">CD%</div>
              <div className="w-[14%]">NET AMT</div>
            </div>
            
            {/* Dashed Separator */}
            <div className="border-t border-dashed border-black mt-1 mb-2 opacity-70"></div>

            {/* Table Rows */}
            <div className="flex-1 min-h-[120px]">
              {computedItems.map((item) => (
                <div key={item.id} className="flex px-2 mb-1 items-start text-[11px] text-center">
                  <div className="w-[4%]">{item.sn}</div>
                  <div className="w-[25%] text-left pl-2 uppercase whitespace-nowrap overflow-hidden text-ellipsis">{item.particulars}</div>
                  <div className="w-[9%]">{formatNum(item.mrp)}</div>
                  <div className="w-[14%]">
                    {item.qty} <span className="ml-1 inline-block">{item.unit}</span>
                  </div>
                  <div className="w-[10%]">{formatNum(item.rate)}</div>
                  <div className="w-[12%]">{formatNum(item.amount)}</div>
                  <div className="w-[7%]">{formatNum(item.schePercent)}%</div>
                  <div className="w-[5%]">{formatNum(item.cdPercent)}%</div>
                  <div className="w-[14%]">{formatNum(item.netAmt)}</div>
                </div>
              ))}
            </div>

            {/* --- FOOTER TOTALS BOX --- */}
            <div className="mt-auto pt-4 font-mono text-sm leading-none opacity-80 whitespace-pre">
               {/* ASCII-like Table wrapper to match strict layout */}
              <div className="w-full flex text-center items-center border-t border-b border-black border-dashed text-[11px]">
                  <div className="w-[14%] py-1 flex flex-col justify-center border-r border-black border-dashed px-1">
                     <div className="h-4 text-center">SUB TOTAL</div>
                     <div className="h-4 text-center mt-1">{formatNum(totals.subTotal)}</div>
                  </div>
                  <div className="w-[11%] py-1 flex flex-col justify-center border-r border-black border-dashed px-1">
                     <div className="h-4 text-center">SCHEME</div>
                     <div className="h-4 text-center mt-1">{formatNum(totals.totalScheme)}</div>
                  </div>
                  <div className="w-[11%] py-1 flex flex-col justify-center border-r border-black border-dashed px-1">
                     <div className="h-4 text-center">DISCUNT</div>
                     <div className="h-4 text-center mt-1">{formatNum(totals.totalDiscount)}</div>
                  </div>
                  <div className="w-[8%] py-1 flex flex-col justify-center border-r border-black border-dashed px-1">
                     <div className="h-4 text-center">H.C.</div>
                     <div className="h-4 text-center mt-1">{formatNum(extra.hc)}</div>
                  </div>
                  <div className="w-[15%] py-1 flex flex-col justify-center border-r border-black border-dashed px-1">
                     <div className="h-4 text-center">CR/DR NOTE</div>
                     <div className="h-4 text-center mt-1">{formatNum(extra.crDrNote)}</div>
                  </div>
                  <div className="w-[15%] py-1 flex flex-col justify-center border-r border-black border-dashed px-1">
                     <div className="h-4 text-center">NET TOTAL</div>
                     <div className="h-4 text-center mt-1">{formatNum(totals.netTotal)}</div>
                  </div>
                  <div className="w-[18%] py-1 flex flex-col justify-center border-r border-black border-dashed px-1">
                     <div className="h-4 text-center">PARTY TOTAL</div>
                     <div className="h-4 text-center mt-1">{formatNum(totals.partyTotal)}</div>
                  </div>
                  <div className="w-[8%] py-1 flex flex-col justify-center px-1">
                     <div className="h-4 text-center">ITEMS</div>
                     <div className="h-4 text-center mt-1">{totals.itemCount}</div>
                  </div>
              </div>
            </div>
            
            {/* Tagline footer */}
            <div className="mt-2 text-[10px] font-bold opacity-80 uppercase tracking-tighter">
              {extra.footerText}
            </div>

          </div>
        </div>

        {/* Global Print Styles */}
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            @page {
              size: 210mm 148.5mm;
              margin: 0 !important;
            }
            html, body, #root {
              margin: 0 !important;
              padding: 0 !important;
              width: 210mm !important;
              height: 148.5mm !important;
              overflow: hidden !important;
              background: white !important;
            }
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .border-dashed {
              border-style: dashed !important;
            }
            ::-webkit-scrollbar {
              display: none;
            }
          }
        `}} />
      </div>
    </div>
  );
}
