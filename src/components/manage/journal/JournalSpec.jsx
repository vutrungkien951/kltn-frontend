import React, { useEffect, useState } from 'react'
import Header from '../Header'
import Slidebar from '../Slidebar'
import API, { endpoints } from '../../../API';
import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { useTranslation } from 'react-i18next';
import { Pagination } from 'evergreen-ui';

function JournalSpec() {
    const [t] = useTranslation("common");
    const [journalWatingSpec, setJournalWatingSpec] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageTotal, setPageTotal] = useState(1);

    useEffect(() => {
        // API.get(endpoints['journal-waiting-spec']).then(res => {
        //     setJournalWatingSpec(res.data);
        //     console.log(res.data);
        // }
        // ).catch(err => console.log(err));
        //goi lan dau se truyen page = 1
        API.get(endpoints['journal-waiting-spec-pagination'](0)).then(res => {
            setJournalWatingSpec(res.data.content);
            setPageTotal(res.data.totalPages);
            console.log(res.data);
        }
        ).catch(err => console.log(err));
    }, []);

    const handlePageChange = (pageNumberChangeTo) =>{
        setPageNumber(pageNumberChangeTo);
        let url = endpoints['journal-waiting-spec-pagination'](pageNumberChangeTo-1);

        API.get(url).then(res => {
            setJournalWatingSpec(res.data.content);
            
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
            <div className='w-full relative m-auto min-h-screen text-base '>
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
                                <span className='font-bold text-3xl uppercase'>{t("journals.header")}</span>
                            </div>
                            <div className='flex'>
                                <div className='cursor-pointer px-4 py-2 bg-slate-300'>
                                    <span><Link to='/management/journal-waiting-handle'>{t("journals.waiting-accept")}</Link></span>
                                </div>
                                <div className='cursor-pointer on-select px-4 py-2'>
                                    <span><Link to='/management/journal-waiting-spec'>{t("journals.waiting-select")}</Link></span>
                                </div>
                                <div className='cursor-pointer px-4 py-2 bg-slate-300'>
                                    <span><Link to='/management/journal-waiting-decide'>{t("journals.waiting-decide")}</Link></span>
                                </div>
                                <div className='cursor-pointer px-4 py-2 bg-slate-300'>
                                    <span><Link to='/management/journal-waiting-decide-after-edit'>{t("journals.waiting-decide-after-edit")}</Link></span>
                                </div>
                            </div>
                            <div className='mt-8'>
                                <div className='mb-5'>
                                    <span className='text-xl'>{t("journals.title")}</span>
                                </div>
                                <Pagination page={pageNumber} totalPages={pageTotal} onPageChange={(evt) => handlePageChange(evt)} onPreviousPage={() => handlePrevPage(pageNumber)} onNextPage={() => handleNextPage(pageNumber)}></Pagination>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>{t("journals.journal-id")}</th>
                                            <th>{t("journals.journal-title")}</th>
                                            <th>{t("journals.journal-file")}</th>
                                            <th>{t("journals.journal-functions")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            journalWatingSpec.map((item, index) =>
                                                <tr key={item.id} id={'row' + item.id}>
                                                    <td>{item.id}</td>
                                                    <td>{item.title}</td>
                                                    <td><a href={item.fileDownloadUrl}>{item.fileName}</a></td>
                                                    <td>
                                                        <div className='flex justify-center'>
                                                            <Button onClick={() => {}}>
                                                                <Link to={"/management/journal-waiting-spec/"+item.id}>{t("journals.select-reviewer")}</Link>
                                                            </Button>
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

export default JournalSpec