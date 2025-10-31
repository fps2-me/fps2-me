'use client';

import { useState, useEffect, useMemo } from 'react';
import { QRCodeCanvas } from "qrcode.react"; 
import { Sparkles, Loader2, Mail, Hash, Smartphone, IdCard } from 'lucide-react';
import { useTranslations } from 'next-intl';
import HKQR from 'hkqr-fps'; 


export default function QrGeneratorPage() {
  // Define the type for the identifier
  type IdentifierType = 'fpsId' | 'mobile' | 'email';
  const t = useTranslations('QrGenerator');

  // State for user inputs
  const [idValue, setIdValue] = useState('');
  const [confirmIdValue, setConfirmIdValue] = useState('');
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null);
  
  // State for QR generation
  const [finalQrString, setFinalQrString] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [logoImage, setLogoImage] = useState('');

  // --- 魔法發生的地方！自動偵測輸入類型 ---
  const detectedIdType: IdentifierType | null = useMemo(() => {
    const value = idValue.trim();
    if (!value) return null;


    // 規則 1: 包含 @ -> Email
    if (value.includes('@')) {
      return 'email';
    }
    // 規則 2: 9位純數字 -> FPS ID
    if (/^\d{9}$/.test(value)) {
      return 'fpsId';
    }
    // 規則 3: 8位純數字 -> 香港電話號碼
    if (/^(\d{8})$/.test(value)) {
      return 'mobile';
    }
    // 規則 4: 中國內地手提號碼
    else if (/^86(\d{11})$/.test(value)) {
      setIdValue(`+86-${value.replace(/^86(\d{11})$/, "$1")}`);
    }
    else if (/^\+86-(\d{11})$/.test(value)) {
      return 'mobile';
    }
    

    return null; // 不符合任何規則
  }, [idValue]);

  const formatConfirmId = (v: string | null) => {
    if (v === null || v === undefined) return;
    const value = v.trim();

    if (value === '') {
      setConfirmIdValue('');
      return;
    }

    if (/^86(\d{11})$/.test(value)) {
      setConfirmIdValue(`+86-${value.replace(/^86(\d{11})$/, "$1")}`);
      return;
    }
    
    setConfirmIdValue(value);
  };

  // Logo Generation Effect (no changes needed)
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const text = "fps2.me";
      const font = "600 96px 'Noto Sans HK', system-ui, sans-serif";
      ctx.font = font;
      const textMetrics = ctx.measureText(text);
      canvas.width = textMetrics.width + 5;
      canvas.height = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent + 5;
      ctx.font = font;
      ctx.strokeStyle = "white";
      ctx.strokeText(text, canvas.width / 2, canvas.height / 2);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);
      setLogoImage(canvas.toDataURL('image/png'));
    }
  }, []);

  // --- 更新過的 QR 產生邏輯 ---
  const handleGenerateClick = () => {
    if (idValue !== confirmIdValue) {
      alert(t('error.values_do_not_match'));
      setFinalQrString('');
      return;
    }
    if (isLoading || !idValue) return;
    
    if (!detectedIdType) {
      alert(t('error.invalid_identifier'));
      return;
    }

    setIsLoading(true);
    setFinalQrString('');

    setTimeout(() => {
      try {
        const qr = new HKQR();
        qr.setMerchantName("NA");

        // 使用我們自動偵測到的類型
        switch (detectedIdType) {
          case 'fpsId':
            qr.setMerchantAccountFPSId(idValue);
            break;
          case 'mobile':
            qr.setMerchantAccountMobile(idValue);
            break;
          case 'email':
            qr.setMerchantAccountEmail(idValue);
            break;
        }

        if (paymentAmount && paymentAmount > 0) {
          qr.setTransactionAmount(paymentAmount);
        }

        const result = qr.generate(); 

        if (result.isError()) {
          console.error("HKQR Library Error:", result.message);
          alert(t('generate_error') + result.message);
          setFinalQrString('');
        } else {
          setFinalQrString(result.data as string);
        }

      } catch (error) {
        console.error("General Error:", error);
        alert(t('normal_error') + "：" + error);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };
  
  // --- 用來顯示偵測到的類型圖示和文字 ---
  const DetectedTypeIndicator = () => {
    if (!detectedIdType) return null;
    
    const typeInfo = {
      email: { icon: <Mail size={16} className="text-slate-500"/>, text: t('label.type.email') },
      mobile: { icon: <Smartphone size={16} className="text-slate-500"/>, text: t('label.type.mobile_number') },
      fpsId: { icon: <Hash size={16} className="text-slate-500"/>, text: t('label.type.fps_id') },
      hkid: { icon: <IdCard size={16} className='text-slate-500'/>, text: t('label.type.hkid')}
    }[detectedIdType];

    return (
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 px-1">
        {typeInfo.icon}
        <span>{t('label.hint.detected_type')}: {typeInfo.text}</span>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-slate-900">
      <main className="flex flex-col gap-8 items-center bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl w-full max-w-md">
        
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 tracking-wide">
          {t('page_title')}
        </h1>

        <div className="w-full space-y-6">
          {/* --- 移除了下拉選單，簡化介面 --- */}
          <div>
            {/* 修正了這個 label 的 className */}
            <label htmlFor="id-value" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('label.value')}</label>
            <input
              type="text"
              id="id-value"
              value={idValue}
              onChange={(e) => setIdValue(e.target.value)}
              placeholder={t('label.hint.unified')}
              className="mt-1 block w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="h-6 mt-1">
              <DetectedTypeIndicator />
            </div>
          </div>
          
          <div>
            <label htmlFor="id-value-confirm" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t('label.confirm_value')}</label>
            <input
              type="text"
              id="id-value-confirm"
              value={confirmIdValue}
              onChange={(e) => formatConfirmId(e.target.value)}
              placeholder={t('label.hint.confirm')}
              className="mt-1 block w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="payment-amount" className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1'>{t('label.transaction_amount')}</label>
            <input
              type="number"
              id="payment-amount"
              value={paymentAmount === null ? '' : paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value === '' ? null : Number(e.target.value))}
              placeholder={t('label.hint.transaction_amount')}
              className="mt-1 block w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <button
          onClick={handleGenerateClick}
          disabled={isLoading || !idValue || !detectedIdType || idValue !== confirmIdValue}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold h-12 px-6 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 transition-all duration-200 ease-in-out transform active:scale-95 disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
          {isLoading ? t('label.button.generating') : t('label.button.generate_qr_code')}
        </button>

        <div className="w-full max-w-xs aspect-square p-4 bg-white rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center">
          {finalQrString ? (
            <QRCodeCanvas 
              value={finalQrString} 
              size={256} 
              className="w-full h-full"
              level={"H"}
              imageSettings={{
                src: logoImage, 
                height: 24,     
                width: 100,    
                excavate: true, 
              }}
            />
          ) : (
            <div className="text-center text-slate-500">
              <p>{t('label.text_qr_code_display')}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
