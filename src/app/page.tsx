import { useTranslations } from 'next-intl';
import Link from 'next/link';



export default function Home() {
  const t = useTranslations('Home');
  return (
    <div className="flex  justify-center-safe bg-white font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col justify-between py-10 px-10 bg-white dark:bg-black sm:items-start">

        <div className="flex flex-col sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Just FPS2.me lah<br/>
            轉數快，快到我
          </h1>
          <p className="max-w-md text-lg leading-tight text-zinc-600 dark:text-zinc-400">
            {t('intro')}
          </p>
          <Link href="/qr" passHref className='py-5'>
            <button
              className="dark:highlight-white/5 relative mx-auto flex max-w-md items-center  rounded-xl bg-white shadow-lg ring-1 ring-black/5 dark:bg-gray-800">
                <div className='min-w-0 py-2 pr-3 pl-3 font-600'>
                ⚡ {t('button.jump_to_qr')}
                </div>
            </button>
          </Link>
          <h2 className=" text-3xl font-semibold leading-tight py-7 tracking-tight text-black dark:text-zinc-50">
            💡 {t('how_to.title')}
          </h2>
          <p 
            className=" text-xl leading-6 text-zinc-600 dark:text-zinc-400" 
            style={{ 
              whiteSpace: 'pre-line' 
            }}
            >
            {t.rich('how_to.steps',{
              'p-with-spacing': (chunks) => <p className="leading-tight">{chunks}</p>
            })}
          </p>
          </div>
        
      </main>
    </div>
  );
}
