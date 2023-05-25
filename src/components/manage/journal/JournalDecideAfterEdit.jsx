import React, { useEffect, useState } from 'react'
import Header from '../Header'
import Slidebar from '../Slidebar'
import API, { endpoints } from '../../../API';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Pagination } from 'evergreen-ui';
import { STATUS_201_CREATED } from "./../../const/data_const"
import { integerPropType } from '@mui/utils';

function JournalDecideAfterEdit() {
    const [journalWaitingDecide, setJournalWaitingDecide] = useState([]);
    const [t] = useTranslation("common");
    const [pageNumber, setPageNumber] = useState(1);
    const [pageTotal, setPageTotal] = useState(1);

    const init = () => {

        API.get(endpoints['journal-waiting-decide-after-edit-pagination'](0)).then(res => {
            setJournalWaitingDecide(res.data.content);
            setPageTotal(res.data.totalPages);
            setPageNumber(1);
            console.log(res.data);
        }
        ).catch(err => console.log(err));
    }

    useEffect(() => {

        init();
    }, []);

    const handlePageChange = (pageNumberChangeTo) =>{
        setPageNumber(pageNumberChangeTo);
        let url = endpoints['journal-waiting-decide-after-edit-pagination'](pageNumberChangeTo-1);
        console.log(url);
        

        API.get(url).then(res => {
            setJournalWaitingDecide(res.data.content);
            
            console.log(res.data);
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

    const handleAccept = async (id) => {

        await API.post(endpoints['accept-journal-publish'](id)).then(res => {
            console.log(res.data)
            if (res.status === STATUS_201_CREATED) {
                alert(t('journals.message-accept-journal-success'));
            }
            else {
                alert(t('journals.message-accept-journal-failed'));
            }
        });
        init();
    }

    const handleEditMore = async (id) => {

        await API.get(endpoints['accept-journal']+ '/' +id).then(res => {
            console.log(res.data)
            if (res.status === STATUS_201_CREATED) {
                alert(t('journals.message-revise-journal-success'));
            }
            else {
                alert(t('journals.message-revise-journal-failed'));
            }
        });
        init();
    }

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
                        {/* wrapper content */}
                        <div className='mx-8 my-4'>
                            <div className='flex justify-center'>
                                <span className='font-bold text-3xl uppercase'>{t('journals.header')}</span>
                            </div>
                            <div className='flex'>
                                <div className='cursor-pointer px-4 py-2 bg-slate-300'>
                                    <span><Link to='/management/journal-waiting-handle'>{t('journals.waiting-accept')}</Link></span>
                                </div>
                                <div className='cursor-pointer px-4 py-2 bg-slate-300'>
                                    <span><Link to='/management/journal-waiting-spec'>{t('journals.waiting-select')}</Link></span>
                                </div>
                                <div className='cursor-pointer px-4 py-2 bg-slate-300'>
                                    <span><Link to='/management/journal-waiting-decide'>{t('journals.waiting-decide')}</Link></span>
                                </div>
                                <div className='cursor-pointer px-4 py-2 on-select'>
                                    <span><Link to='/management/journal-waiting-decide-after-edit'>{t('journals.waiting-decide-after-edit')}</Link></span>
                                </div>
                            </div>
                            <div className='mt-8'>
                                <div className='mb-5'>
                                    <span className='text-xl'>{t('journals.title')}</span>
                                </div>
                                <Pagination page={pageNumber} totalPages={pageTotal} onPageChange={(evt) => handlePageChange(evt)} onPreviousPage={() => handlePrevPage(pageNumber)} onNextPage={() => handleNextPage(pageNumber)}></Pagination>
                                <div>
                                    {
                                        journalWaitingDecide.map((item) =>
                                            <div id={item + item.id} key={item.id} className='bg-gray-200 rounded-sm'>
                                                <div className='flex justify-between mr-16 gap-4 py-3 ml-2'>
                                                    <div className='flex'>
                                                        <svg id={'icon' + item.id} onClick={() => {
                                                            document.getElementById('row' + item.id).classList.toggle('hidden');
                                                            document.getElementById('icon' + item.id).classList.toggle('rotate-90');
                                                        }}
                                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                                            className="w-6 h-6 cursor-pointer duration-300">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                                        </svg>
                                                        <span className='font-bold'>{t("journals.journal-id")}: {item.id} - {t("journals.journal-title")}: {item.title}</span>
                                                    </div>
                                                    <div className='flex gap-8'>
                                                        <span>{item.fileName}</span>
                                                        <a href={item.fileDownloadUrl}>{t("journals.download")}</a>
                                                        <span>{item.type}</span>
                                                    </div>
                                                </div>
                                                <div id={'row' + item.id} className='ml-8 hidden'>
                                                    <div className=''>
                                                        <span className='font-bold text-xl'>{t("journals.review-history")}</span>
                                                        <table>
                                                            {item.peerReviewSet.map(item =>
                                                                <tr key={item.id} className=''>
                                                                    <td>{item.recomendation}</td>
                                                                    <td><a href={item.report}>{t("journals.report")}</a></td>
                                                                </tr>
                                                            )}
                                                        </table>
                                                    </div>
                                                    <div className='my-4 pb-4'>
                                                        <span onClick={() => handleAccept(item.id)}
                                                            className='p-4 text-cyan-700 font-bold cursor-pointer'>{t("journals.accept")}</span>
                                                        <span onClick={() => {
                                                            handleEditMore(item.id);
                                                        }} className='p-4 text-red-700 font-bold cursor-pointer'>{t("journals.revision-again")}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default JournalDecideAfterEdit