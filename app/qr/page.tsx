// src/app/qr-generator/page.tsx

// 标记为客户端组件，因为我们需要状态和事件处理
'use client';

// ✨ 新增: 导入 useEffect 用于处理副作用（比如生成logo）
import { useState, useEffect } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);

  // ✨ 新增点 1: 创建一个 state 来存储我们用文字生成的 logo 图片 (Data URL)
  const [logoImage, setLogoImage] = useState('');

  // ✨ 新增点 2: 使用 useEffect 在组件加载时，将文字 "fps2.me" 转换成图片
  // 这个 effect 只会在组件第一次加载时运行一次
  useEffect(() => {
    // 创建一个内存中的 canvas 元素，它不会显示在页面上
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const text = "fps2.me";
      const font = "bold 26px Arial"; // 字体样式
      ctx.font = font;

      // 测量文字宽度，以便创建合适大小的 canvas
      const textMetrics = ctx.measureText(text);
      canvas.width = textMetrics.width + 10; // 宽度加一点点边距
      canvas.height = 30; // 高度

      // 注意：canvas 尺寸改变后，字体设置会丢失，需要重新设置一遍
      ctx.font = font;
      ctx.fillStyle = "#4F46E5"; // 使用和按钮一样的靛蓝色，看起来更协调
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // 将文字绘制在 canvas 的正中间
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);

      // 将 canvas 的内容转换为 PNG 格式的 Data URL，并存入 state
      setLogoImage(canvas.toDataURL('image/png'));
    }
  }, []); // 空依赖数组意味着这个 effect 只运行一次

  const handleGenerateClick = () => {
    if (isLoading) return;
    if (!inputValue) {
      setFinalQrString('');
      return;
    }
    setIsLoading(true);
    setFinalQrString('');

    setTimeout(() => {
      try {
        const qr = new HKQR();
        qr.setMerchantName("NA");

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

        const result = qr.generate(); 

        if (result.isError()) {
          console.error("HKQR Library Error:", result.message);
          alert(`生成失败: ${result.message}`);
        } else {
          setFinalQrString(result.data as string);
        }

      } catch (error) {
        console.error("General Error:", error);
        alert("发生了错误："+ error);
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 p-4">
      <main className="flex flex-col gap-8 items-center bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-sm">
        
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 tracking-wide">
          HKFPS QR Generator
        </h1>

        <div className="w-full space-y-6">
          {/* ... 表单部分代码保持不变 ... */}
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
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold h-12 px-6 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 transition-all duration-200 ease-in-out transform active:scale-95 disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Sparkles size={20} />
          )}
          {isLoading ? '正在生成...' : '生成二维码'}
        </button>

        <div className="w-full aspect-square max-w-[280px] p-4 bg-white rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center">
          {/* ✨ 修改点 3: 渲染二维码的逻辑 */}
          {finalQrString ? (
            <QRCodeCanvas 
              value={finalQrString} 
              size={256} 
              className="w-full h-full"
              // ✨ 提高容错率到最高，确保logo遮挡后也能扫描
              level={"H"}
              // ✨ 传入我们生成的 logo 图片和相关设置
              imageSettings={{
                src: logoImage, // 我们用文字生成的图片
                x: undefined,   // 不设置，让库自动居中
                y: undefined,   // 不设置，让库自动居中
                height: 24,     // logo 的高度
                width: 120,     // logo 的宽度
                excavate: true, // 挖空 logo 背景区域，非常重要！
              }}
            />
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
