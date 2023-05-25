import React from 'react'
import { useTranslation } from 'react-i18next';

import Header from './Header';
import Slidebar from './Slidebar';


function Management() {

  const [t] = useTranslation("common");

  return (
    <>
      <div className='w-full relative m-auto min-h-screen text-base'>
        {/* header */}
        <Header />
        {/* wrapper content */}
        <div className='h-full overflow-hidden'>
          {/* left navbar */}
          <Slidebar />
          {/* content */}
          <div className='ml-[251px]'>
              <div className='flex justify-center mt-8'>
                <span className='font-bold uppercase text-3xl'>{t("home.control-panel")}</span>
              </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Management