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
import { STATUS_200_OK } from './../const/data_const'
import { Pagination } from 'evergreen-ui'

function AllMagazine() {

    const [magazineReleased, setMagazineReleased] = useState([]);

    const [loading, setLoading] = useState(true);

    const [t] = useTranslation("common");

    const [pageNumber, setPageNumber] = useState(1);
    const [pageTotal, setPageTotal] = useState(1);

    useEffect(() => {

        setLoading(true);
        
        API.get(endpoints['magazine-released-pagination'](0)).then((res) => {

            if(res.status === STATUS_200_OK) {

                setMagazineReleased(res.data.content);
                setPageTotal(res.data.totalPages);
            }

            setLoading(false);
        }
        ).catch(err => console.log(err));
    }, []);

    const handlePageChange = (pageNumberChangeTo) => {
        setPageNumber(pageNumberChangeTo);
        let url = endpoints['magazine-released-pagination'](pageNumberChangeTo - 1);

        API.get(url).then(res => {
            setMagazineReleased(res.data.content);
        }
        ).catch(err => console.log(err));
    }

    const handleNextPage = (pageNumber) => {

        setPageNumber(pageNumber + 1);

        handlePageChange(pageNumber + 1);
    }

    const handlePrevPage = (pageNumber) => {

        setPageNumber(pageNumber - 1);

        handlePageChange(pageNumber - 1);
    }

    if (loading === true) {
        return (
            <>
                <Spinner />
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
                        </div>
                        <Pagination page={pageNumber} totalPages={pageTotal} onPageChange={(evt) => handlePageChange(evt)} onPreviousPage={() => handlePrevPage(pageNumber)} onNextPage={() => handleNextPage(pageNumber)}></Pagination>
                        {
                            magazineReleased.map((item) => 
                                <>
                                    <p className="font-bold text-xl text-gray-700 dark:text-gray-400 mt-4">
                                        {item.magazineNumberName}
                                    </p>
                                    <p className="font-bold text-xl text-gray-700 dark:text-gray-400">
                                        {t("home.released-date")}: {new Date(Date.parse(item.releaseDate)).toLocaleDateString()}
                                    </p>
                                    <div>
                                        {
                                            item.journalSet.map((item) => <>
                                                <div className='mt-2'>{item.title}</div>
                                                <div className='mt-2'>{item.listAuthor}</div>
                                                <span className='mt-2 px-4 py-2 rounded-md border border-cyan-300 hover:bg-cyan-300 flex justify-center items-center w-24'>
                                                    <Link to={'/view-journal/' + item.id} state={ {magazineId : magazineReleased[0].id } } >
                                                        <span>{t("home.view")}</span>
                                                    </Link>
                                                </span>
                                            </>
                                            )
                                        }
                                    </div>
                                </>
                            )
                        }

                    </div>

                    <MyFooter />
                </div>
            </>
        )
    }
}
export default AllMagazine