'use client';

import { useState, useEffect, useMemo } from 'react';
import { QRCodeCanvas } from "qrcode.react"; 
import { Sparkles, Loader2, Mail, Hash, Smartphone, IdCard } from 'lucide-react';
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { useTranslations } from 'next-intl';
import HKQR from 'hkqr-fps';
import { HKQR_CURRENCY } from 'hkqr-fps/dist/cjs/HKQR/config'; 


export default function QrGeneratorPage() {
  // Define the type for the identifier
  type IdentifierType = 'fpsId' | 'mobile' | 'email';
  const t = useTranslations('QrGenerator');

  // State for user inputs
  const [idValue, setIdValue] = useState('');
  const [confirmIdValue, setConfirmIdValue] = useState('');
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null);
  const [paymentCurrency, setPaymentCurrency] = useState<HKQR_CURRENCY>("HKD");
  
  // State for QR generation
  const [finalQrString, setFinalQrString] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [logoImage, setLogoImage] = useState('');

  // Detect input ID Type
  const detectedIdType: IdentifierType | null = useMemo(() => {
    const value = idValue.trim();
    if (!value) return null;


    // 1: Email
    if (value.includes('@')) {
      return 'email';
    }
    // 2: 9 digits -> FPS ID
    if (/^\d{9}$/.test(value)) {
      return 'fpsId';
    }
    // 3: 8 digits -> HK Phone Numbers
    if (/^(\d{8})$/.test(value)) {
      return 'mobile';
    }
    // 4: China Mainland Phone Numbers
    else if (/^86(\d{11})$/.test(value)) {
      setIdValue(`+86-${value.replace(/^86(\d{11})$/, "$1")}`);
    }
    else if (/^\+86-(\d{11})$/.test(value)) {
      return 'mobile';
    }
    

    return null;
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
  }, [logoImage]);

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

        qr.setTransactionCurrency(paymentCurrency);

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
  
  const DetectedTypeIndicator = () => {
    if (!detectedIdType) return (
      <div className="flex items-center gap-2 text-sm px-1">
        <span>{t('label.hint.detected_type')}: {} {t('label.type.unknown')}</span>
      </div>
    );
    
    const typeInfo = {
      email: { icon: <Mail size={16} />, text: t('label.type.email') },
      mobile: { icon: <Smartphone size={16} />, text: t('label.type.mobile_number') },
      fpsId: { icon: <Hash size={16} />, text: t('label.type.fps_id') },
      hkid: { icon: <IdCard size={16} />, text: t('label.type.hkid')},
    }[detectedIdType];

    return (
      <div className="flex items-center gap-2 text-sm px-1">
        {typeInfo.icon}
        <span>{t('label.hint.detected_type')}: {} {typeInfo.text}</span>
      </div>
    );
  };

  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col gap-8 items-center bg-[var(--background)] p-6 sm:p-8 rounded-2xl w-full max-w-lg shadow-lg">
        
        <h1 className="text-2xl font-semibold tracking-wide">
          {t('page_title')}
        </h1>

        <div className="w-full space-y-4">
          <div>
            <label htmlFor="id-value" className="block text-sm font-medium mb-1">{t('label.value')}</label>
            <input
              type="text"
              id="id-value"
              value={idValue}
              onChange={(e) => setIdValue(e.target.value)}
              placeholder={t('label.hint.unified')}
              className="mt-1 block w-full px-4 py-2.5 border rounded-md shadow-sm focus:outline-none focus:ring-2 bg-transparent">
              </input>

            <div className=" mt-1">
              <DetectedTypeIndicator />
            </div>
          </div>
          
          <div>
            <label htmlFor="id-value-confirm" className="block text-sm font-medium mb-1">{t('label.confirm_value')}</label>
            <input
              type="text"
              id="id-value-confirm"
              value={confirmIdValue}
              onChange={(e) => formatConfirmId(e.target.value)}
              placeholder={t('label.hint.confirm')}
              className="mt-1 block w-full px-4 py-2.5 border rounded-md shadow-sm focus:outline-none focus:ring-2 bg-transparent"
            />
          </div>
          <div>
            <label htmlFor="payment-amount" className='block text-sm font-medium mb-1'>{t('label.transaction_amount')}</label>
            <div className="mt-1 block w-full px-4 py-2.5 border rounded-md shadow-sm focus:outline-none focus:ring-2 bg-transparent">
                <div className="flex items-center rounded-md">
                  <input
                    id="price"
                    name="price"
                    type="text"
                    placeholder={t('label.hint.transaction_amount')}
                    onChange={(e) => setPaymentAmount(e.target.value === '' ? null : Number(e.target.value))}
                    className="flex-1 bg-transparent pr-3 pl-1 focus:outline-none"
                  />
                  <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                    <select
                      id="currency"
                      name="currency"
                      aria-label="Currency"
                      onChange={(e) => setPaymentCurrency(e.target.value as HKQR_CURRENCY)}
                      className="col-start-1 row-start-1 w-full appearance-none rounded-md  py-1.5 pr-7 pl-3 text-base focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 "
                    >
                      <option>HKD</option>
                      <option>CNY</option>
                    </select>
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end "
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

        <button
          onClick={handleGenerateClick}
          disabled={isLoading || !idValue || !detectedIdType || idValue !== confirmIdValue}
          style={{ backgroundColor: 'var(--primary)' }}
          className="w-full flex items-center justify-center gap-2 text-white font-semibold h-12 px-6 rounded-lg shadow-md transition-all duration-200 ease-in-out transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
          {isLoading ? t('label.button.generating') : t('label.button.generate_qr_code')}
        </button>

        <div className="w-full max-w-xs aspect-square p-4 bg-white dark:bg-black rounded-lg border flex items-center justify-center">
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
            <div className="text-center" style={{ color: 'var(--foreground)'}}>
              <p>{t('label.text_qr_code_display')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
