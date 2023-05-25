import React, { useEffect, useState, useRef } from 'react'
import Header from '../Header'
import Slidebar from '../Slidebar'
import API, { endpoints } from '../../../API';
import { Link } from 'react-router-dom';
import { Button, Label, Modal } from 'flowbite-react';
import { useTranslation } from 'react-i18next';
import { Pagination } from 'evergreen-ui';

function FormatJournal() {
    const [t] = useTranslation("common");
    const [journalWatingFormat, setJournalWaitingFormat] = useState([]);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [idSelectedItem, setIdSelectedItem] = useState('');
    const content = useRef();
    const [pageNumber, setPageNumber] = useState(1);
    const [pageTotal, setPageTotal] = useState(1);
    const [loading, setLoading] = useState(true);

    const init = () => {

        setLoading(true);

        API.get(endpoints['journal-waiting-format-pagination'](0)).then(res => {

            setJournalWaitingFormat(res.data.content);
            setPageTotal(res.data.totalPages);
            setPageNumber(1);
            console.log(res.data);
            setLoading(false);
        }
        ).catch(err => {

            console.log(err)
            setLoading(false);
        });
    }

    useEffect(() => {
        
        init();
    }, []);

    const handlePageChange = (pageNumberChangeTo) =>{
        setPageNumber(pageNumberChangeTo);
        let url = endpoints['journal-waiting-handle-pagination'](pageNumberChangeTo-1);    

        API.get(url).then(res => {
            setJournalWaitingFormat(res.data.content);
            
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
                                <span className='font-bold text-3xl uppercase'>{t("format-journal.header")}</span>
                            </div>
                            <div className='flex'>
                                <div className='cursor-pointer on-select px-4 py-2'>
                                    <span><Link to='/management/format-journals'>{t("format-journal.waiting-handle")}</Link></span>
                                </div>
                            </div>
                            <div className='mt-8'>
                                <div className='mb-5'>
                                    <span className='text-xl'>{t("format-journal.title")}</span>
                                </div>
                                <Pagination page={pageNumber} totalPages={pageTotal} onPageChange={(evt) => handlePageChange(evt)} onPreviousPage={() => handlePrevPage(pageNumber)} onNextPage={() => handleNextPage(pageNumber)}></Pagination>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>{t("format-journal.journal-id")}</th>
                                            <th>{t("format-journal.journal-title")}</th>
                                            <th>{t("format-journal.journal-file")}</th>
                                            <th>{t("format-journal.journal-function")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            journalWatingFormat.map((item, index) =>
                                                <tr key={item.id} id={'row' + item.id}>
                                                    <td>{item.id}</td>
                                                    <td>{item.title}</td>
                                                    <td><a href={item.fileDownloadUrl}>{item.fileName}</a></td>
                                                    <td>
                                                        <div className='flex gap-4 justify-center'>
                                                            <div
                                                            className='px-2 py-2 bg-red-700 text-white cursor-pointer rounded-md'>
                                                                <Link to={"/management/format-journal-process/"+item.id}>{t("format-journal.journal-function-label")}</Link>
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

export default FormatJournal