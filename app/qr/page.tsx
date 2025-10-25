// src/app/qr-generator/page.tsx

// 标记为客户端组件，因为我们需要状态和事件处理
'use client';

import { useState } from 'react';
import { QRCodeCanvas } from "qrcode.react"; 
import { Sparkles, Loader2 } from 'lucide-react';


// 我们应该从包名导入，而不是直接从 src 文件夹！
// 这利用了 package.json 中 file: 协议的魔力，让项目像使用一个真正的 npm 包一样使用它。
import HKQR from 'hkqr-fps'; 

type IdentifierType = 'fpsId' | 'mobile' | 'email';

export default function QrGeneratorPage() {
  const [idType, setIdType] = useState<IdentifierType>('fpsId');
  const [inputValue, setInputValue] = useState('');
  const [finalQrString, setFinalQrString] = useState('');
  
  // ✨ 新增点: 添加一个加载状态，提升用户体验 ✨
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateClick = () => {
    // 如果正在生成，就不要重复点击
    if (isLoading) return;

    if (!inputValue) {
      setFinalQrString('');
      return;
    }

    setIsLoading(true); // 开始生成，进入加载状态
    setFinalQrString(''); // 清空旧的二维码

    // 使用 setTimeout 模拟网络延迟或计算耗时，让加载动画更明显
    // 在实际使用中，如果生成速度很快，可以去掉 setTimeout
    setTimeout(() => {
      try {
        const qr = new HKQR();
        qr.setMerchantName("NA"); // 根据 FPS 标准，个人收款可以设为 "NA"

        switch (idType) {
          case 'fpsId':
            qr.setMerchantAccountFPSId(inputValue);
            break;
          case 'mobile':
            qr.setMerchantAccountMobile(inputValue);
            break;
          case 'email':
            qr.setMerchantAccountEmail(inputValue);
            break;
        }

        // 1. 调用 generate() 方法，它会返回一个结果对象
        const result = qr.generate(); 

        // 2. 检查结果对象中的 isError() 方法
        if (result.isError()) {
          console.error("HKQR Library Error:", result.message);
          alert(`生成失败: ${result.message}`);
        } else {
          // 3. 如果没有错误，从 .data 属性中获取最终的字符串
          setFinalQrString(result.data as string);
        }

      } catch (error) {
        console.error("General Error:", error);
        // alert("发生了一个意外错误，请检查你的输入或联系管理员。");
        alert("发生了错误："+ error);
      } finally {
        // 无论成功还是失败，都要结束加载状态
        setIsLoading(false);
      }
    }, 500); // 延迟 500 毫秒
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 p-4">
      <main className="flex flex-col gap-8 items-center bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-sm">
        
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 tracking-wide">
          HKFPS QR Generator
        </h1>

        <div className="w-full space-y-6">
          <div>
            <label htmlFor="id-type" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">标识类型</label>
            <select
              id="id-type"
              value={idType}
              onChange={(e) => setIdType(e.target.value as IdentifierType)}
              className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md shadow-sm"
            >
              <option value="fpsId">转数快识别码 (FPS ID)</option>
              <option value="mobile">手机号码</option>
              <option value="email">电子邮箱</option>
            </select>
          </div>
          <div>
            <label htmlFor="id-value" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">你的标识</label>
            <input
              type="text"
              id="id-value"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                idType === 'fpsId' ? '例如: 123456789' :
                idType === 'mobile' ? '例如: 98765432/8613100001145' : '例如: you@example.com'
              }
              className="mt-1 block w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <button
          onClick={handleGenerateClick}
          disabled={isLoading} // ✨ 当加载时，禁用按钮防止重复点击
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold h-12 px-6 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 transition-all duration-200 ease-in-out transform active:scale-95 disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 size={20} className="animate-spin" /> // ✨ 加载时显示旋转图标
          ) : (
            <Sparkles size={20} />
          )}
          {isLoading ? '正在生成...' : '生成二维码'}
        </button>

        <div className="w-full aspect-square max-w-[280px] p-4 bg-white rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center">
          {finalQrString ? (
            <QRCodeCanvas value={finalQrString} size={256} className="w-full h-full" />
          ) : (
            <div className="text-center text-slate-500">
              <p>你的二维码将会出现在这里</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
