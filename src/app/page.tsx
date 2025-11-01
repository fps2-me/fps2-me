import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Home() {
  const t = useTranslations('Home');
  return (
    <div className="flex justify-center-safe">
      <div className="w-full max-w-3xl py-10 px-10">
        <div className="flex flex-col sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight">
            Just FPS2.me lah<br/>
            轉數快，快到我
          </h1>
          <div className="max-w-md text-lg leading-tight pt-5">
          <a>{t('intro')}</a> <a className='text-3xl whitespace-nowrap'>{t('intro_feature')}</a>
          </div>
          <Link href="/qr" passHref className='py-5'>
            <button
              style={{ backgroundColor: 'var(--primary)' }}
              className="relative mx-auto flex max-w-md items-center rounded-xl shadow-lg "
            >
                <div className='min-w-0 py-2 pr-3 pl-3 font-semibold text-white'>
                  {t('button.jump_to_qr')}
                </div>
            </button>
          </Link>
        </div>

        <div className="flex flex-col sm:items-start sm:text-left">
          <h2 className="text-3xl font-semibold leading-tight py-7 tracking-tight">
            💡 {t('how_to.title')}
          </h2>
          <p 
            className="text-xl leading-6" 
            style={{ 
              whiteSpace: 'pre-line' 
            }}
          >
            {t.rich('how_to.steps',{
              'p-with-spacing': (chunks) => <p className="leading-tight">{chunks}</p>
            })}
          </p>
        </div>
      </div >
    </div>
  );
}
