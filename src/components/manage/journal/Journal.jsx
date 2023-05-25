import React, { useEffect, useState } from 'react'
import Header from '../Header'
import Slidebar from '../Slidebar'
import API, { endpoints } from '../../../API';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Pagination } from 'evergreen-ui';
import { STATUS_201_CREATED } from '../../const/data_const';
import { Spinner } from 'flowbite-react';

function Journal() {

    const [journalWatingHandle, setJournalWaitingHandle] = useState([]);
    const [t] = useTranslation("common");
    const [pageNumber, setPageNumber] = useState(1);
    const [pageTotal, setPageTotal] = useState(1);
    const [loading, setLoading] = useState(true);


    const init = () => {

        setLoading(true);
        //goi lan dau se truyen page = 1
        API.get(endpoints['journal-waiting-handle-pagination'](0)).then(res => {
            setJournalWaitingHandle(res.data.content);
            setPageTotal(res.data.totalPages);
            console.log(res.data);

            setLoading(false);
        }
        ).catch(err => setLoading(false));
    }

    useEffect(() => {

        init();
    }, []);

    const handlePageChange = (pageNumberChangeTo) =>{
        setPageNumber(pageNumberChangeTo);
        let url = endpoints['journal-waiting-handle-pagination'](pageNumberChangeTo-1);
        console.log(url);
        

        API.get(url).then(res => {
            setJournalWaitingHandle(res.data.content);
            
            console.log(res.data);
        }
        ).catch(err => console.log(err));
    }

    const handleOnClickBtn = (endpoint, id) => {

        setLoading(true);

        API.get(endpoint).then(res => {
            console.log(res.data)
            if(res.status === STATUS_201_CREATED){
                alert(t("journal.message-accepted-at-the-table"));
            }else if(res.status === 204){
                alert(t("journal.message-rejected-at-the-table"));
            }else{
                alert(t("journal.message-process-failed"));
            }

            setLoading(false);
            init();
        });

        document.getElementById('row'+id).style.display = 'none';

        setJournalWaitingHandle(journalWatingHandle);
    }

    const handleNextPage = (pageNumber) => {

        setPageNumber(pageNumber + 1);

        handlePageChange(pageNumber + 1);
    }

    const handlePrevPage = (pageNumber) => {

        setPageNumber(pageNumber - 1);

        handlePageChange(pageNumber - 1);
    }

    if(loading){
        
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
                                    <div className='cursor-pointer on-select px-4 py-2'>
                                        <span><Link to='/management/journal-waiting-handle'>{t('journals.waiting-accept')}</Link></span>
                                    </div>
                                    <div className='cursor-pointer px-4 py-2 bg-slate-300'>
                                        <span><Link to='/management/journal-waiting-spec'>{t('journals.waiting-select')}</Link></span>
                                    </div>
                                    <div className='cursor-pointer px-4 py-2 bg-slate-300'>
                                        <span><Link to='/management/journal-waiting-decide'>{t('journals.waiting-decide')}</Link></span>
                                    </div>
                                    <div className='cursor-pointer px-4 py-2 bg-slate-300'>
                                        <span><Link to='/management/journal-waiting-decide-after-edit'>{t('journals.waiting-decide-after-edit')}</Link></span>
                                    </div>
                                </div>
                                <div className='mt-8'>
                                    <div className='mb-5'>
                                        <span className='text-xl'>{t('journals.title')}</span>
                                    </div>
                                    <Pagination page={pageNumber} totalPages={pageTotal} onPageChange={(evt) => handlePageChange(evt)} onPreviousPage={() => handlePrevPage(pageNumber)} onNextPage={() => handleNextPage(pageNumber)}></Pagination>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>{t('journals.journal-id')}</th>
                                                <th>{t('journals.journal-title')}</th>
                                                <th>{t('journals.journal-file')}</th>
                                                <th>{t('journals.journal-functions')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            journalWatingHandle.map((item, index) => 
                                            <tr key={item.id} id={'row'+item.id}>
                                                <td>{item.id}</td>
                                                <td>{item.title}</td>
                                                <td><a href={item.fileDownloadUrl}>{item.fileName}</a></td>
                                                <td>
                                                    <div className='flex gap-4 justify-center'>
                                                        <div onClick={() => handleOnClickBtn(endpoints["accept-journal"] + '/' + item.id, item.id)} className='px-2 py-2 bg-red-700 text-white cursor-pointer rounded-md'>
                                                            <span>{t('journals.journal-accept')}</span>
                                                        </div>
                                                        <div onClick={() => handleOnClickBtn(endpoints["reject-journal"] + '/' + item.id, item.id)} className='px-2 py-2 bg-gray-600 text-white cursor-pointer rounded-md'>
                                                            <span>{t('journals.journal-reject')}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            )
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

}

export default Journal