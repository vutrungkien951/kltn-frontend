import { Spinner } from 'flowbite-react'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import API, { endpoints } from '../../API'
import MyFooter from './Footer'
import LogoCard from './LogoCard'
import NavBar from './NavBar'
import { STATUS_200_OK } from "./../const/data_const"

function Home() {
    const [magazineReleased, setMagazineReleased] = useState([]);
    const [loading, setLoading] = useState(true);
    const [t] = useTranslation('common');


    useEffect(() => {

        setLoading(true);

        API.get(endpoints['magazine-released-pagination'](0)).then((res) => {

            if(res.status === STATUS_200_OK) {

                setMagazineReleased(res.data.content);
            }

            setLoading(false);
        }
        ).catch(err => console.log(err));
    }, []);

    if (loading === true) {
        return (
            <>
                <div className='m-auto min-h-screen'>
                    <div className='justify-center'>
                        <Spinner size='xl' />
                        <span className='pl-2'>Loading...</span>
                    </div>
                </div>
            </>
        )
    } else {
        return (
            <>
                <div className='m-auto min-h-screen'>
                    <NavBar />
                    <div className='wrapperContent mx-6 lg:mx-16 my-2 text-base'>
                        <span className='font-bold'>
                            {t('home.header')}
                        </span>
                        {/* card */}
                        <div className="max-w-sm mt-6">
                            <LogoCard />
                            <p className="font-bold text-xl text-gray-700 dark:text-gray-400 mt-4">
                                {magazineReleased[0].magazineNumberName}
                            </p>
                            <p className="font-bold text-xl text-gray-700 dark:text-gray-400">
                                {t("home.released-date")}: {new Date(Date.parse(magazineReleased[0].releaseDate)).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            {
                                magazineReleased[0].journalSet.map((item) => <>
                                    <div className='mt-2'>{item.title}</div>
                                    <div className='flex gap-3'>
                                    <span className='mt-2 px-4 py-2 rounded-md border border-cyan-300 hover:bg-cyan-300 flex justify-center items-center w-24'>
                                        <Link to={'/view-journal/' + item.id} state={ {magazineId : magazineReleased[0].id } } >
                                            <span>{t("home.view")}</span>
                                        </Link>
                                    </span>
                                    </div>
                                </>
                                )
                            }
                        </div>
                    </div>
                    <MyFooter />
                </div>
            </>
        )
    }
}

export default Home