import React, { useEffect, useRef, useState } from 'react'
import Header from '../Header'
import Slidebar from '../Slidebar'
import API, { endpoints } from '../../../API';
import { Link } from 'react-router-dom';
import { Button, Label, Modal, Spinner, TextInput } from 'flowbite-react';
import { useTranslation } from 'react-i18next';
import { Pagination } from 'evergreen-ui';
import { STATUS_201_CREATED, STATUS_204_NO_CONTENT } from '../../const/data_const';

function JournalDecide() {
    
    const [journalWaitingDecide, setJournalWaitingDecide] = useState([]);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [idSelectedItem, setIdSelectedItem] = useState('');
    const content = useRef();
    const [t] = useTranslation("common");
    const [pageNumber, setPageNumber] = useState(1);
    const [pageTotal, setPageTotal] = useState(1);
    const [loading, setLoading] = useState(true);

    const init = () => {

        setLoading(true);

        API.get(endpoints['journal-waiting-decide-pagination'](0)).then(res => {
            setJournalWaitingDecide(res.data.content);
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
        let url = endpoints['journal-waiting-decide-pagination'](pageNumberChangeTo-1);
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

        setLoading(true);

        await API.post(endpoints['accept-journal-publish'](id)).then(res => {

            console.log(res.data)
            if (res.status === STATUS_201_CREATED) {
                alert(t("journals.message-accept-journal-success"));
            }
            else {
                alert(t("journals.message-accept-journal-failed"));
            }
            setLoading(false);
        }).catch(err => {
            
            console.log(err);
            setLoading(false);
        });
        
        init();
    }

    const handleEdit = async (id) => {

        const form_data = new FormData();
        form_data.append('fileRequest', content.current.files[0]);
        setLoading(true);

        await API.post(endpoints['edit-journal-publish'](id), form_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then(res => {

            console.log(res.data)
            if (res.status === STATUS_201_CREATED) {
                alert(t("journals.message-revise-journal-success"));
            }
            else {
                alert(t("journals.message-revise-journal-failed"));
            }
            setLoading(false);
        }).catch(err => {

            console.log(err);
            setLoading(false);
        });

        init();
    }

    const handleReject = async (id) => {

        const json = JSON.stringify({
            reason: document.getElementById('reason').value,
        });

        setLoading(true);

        await API.post(endpoints['reject-journal-publish'](id), json, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => {

            console.log(res.data)

            if (res.status === STATUS_204_NO_CONTENT) {
                alert(t("journals.message-reject-journal-success"));
            }
            else {
                alert(t("journals.message-reject-journal-failed"));
            }

            setLoading(false);
        }).catch(err => {

            console.log(err);
            setLoading(false);
        });

        init();
    }

    if(loading) {

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
                                    <div className='cursor-pointer px-4 py-2 bg-slate-300'>
                                        <span><Link to='/management/journal-waiting-handle'>{t('journals.waiting-accept')}</Link></span>
                                    </div>
                                    <div className='cursor-pointer px-4 py-2 bg-slate-300'>
                                        <span><Link to='/management/journal-waiting-spec'>{t('journals.waiting-select')}</Link></span>
                                    </div>
                                    <div className='cursor-pointer px-4 py-2 on-select'>
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
                                                            <span className='font-bold'>{t("journals.journal-id")}:{item.id} - {t("journals.journal-title")} {item.title}</span>
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
                                                                        {/* <td>{item.reviewerId.username}</td> */}
                                                                        <td>{item.recommendation}</td>
                                                                        <td><a href={item.report}>{t("journals.report")}</a></td>
                                                                    </tr>
                                                                )}
                                                            </table>
                                                        </div>
                                                        <div className='my-4 pb-4'>
                                                            <span onClick={() => handleAccept(item.id)}
                                                                className='p-4 text-cyan-700 font-bold cursor-pointer'>{t("journals.accept")}</span>
                                                            <span onClick={() => {
                                                                setEditModalVisible(true);
                                                                setIdSelectedItem(item.id);
                                                            }} className='p-4 text-gray-700 font-bold cursor-pointer'>{t("journals.revision")}</span>
                                                            <Modal
                                                                show={editModalVisible}
                                                                size="md"
                                                                popup={true}
                                                                onClose={() => setEditModalVisible(false)}
                                                            >
                                                                <Modal.Header />
                                                                <Modal.Body>
                                                                    <div className="text-center">
                                                                        <div className='flex justify-center'>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                                                            </svg>
                                                                        </div>
                                                                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                                                            {t("journals.confirm")}<br /> {t("journals.revise-journal-before-publish")}
                                                                        </h3>
                                                                        <div className='mb-8'>
                                                                            <div className="mb-2 block">
                                                                                <Label
                                                                                    htmlFor="fileUpload"
                                                                                    value={t("journals.revision-content")}
                                                                                />
                                                                            </div>
                                                                            <div id="fileUpload">
                                                                                <input type="file" ref={content} />
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex justify-center gap-4">
                                                                            <Button
                                                                                color="failure"
                                                                                onClick={() => {
                                                                                    setEditModalVisible(false);
                                                                                    handleEdit(idSelectedItem);
                                                                                    setIdSelectedItem('');
                                                                                }}
                                                                            >
                                                                                {t("journals.yes")}
                                                                            </Button>
                                                                            <Button
                                                                                color="gray"
                                                                                onClick={() => setEditModalVisible(false)}
                                                                            >
                                                                                {t("journals.no")}
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                </Modal.Body>
                                                            </Modal>
                                                            <span onClick={() => {
                                                                setDeleteModalVisible(true);
                                                                setIdSelectedItem(item.id);
                                                            }} className='p-4 text-red-700 font-bold cursor-pointer'>{t("journals.reject")}</span>
                                                            <Modal
                                                                show={deleteModalVisible}
                                                                size="md"
                                                                popup={true}
                                                                onClose={() => setDeleteModalVisible(false)}
                                                            >
                                                                <Modal.Header />
                                                                <Modal.Body>
                                                                    <div className="text-center">
                                                                        <div className='flex justify-center'>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                                                                className="w-12 h-12">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                                                                            </svg>
                                                                        </div>
                                                                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                                                            {t("journals.confirm")}<br /> {t("journals.reject-journal")}
                                                                        </h3>
                                                                        <div className='mb-8'>
                                                                            <div className="mb-2 block">
                                                                                <Label
                                                                                    htmlFor="reason"
                                                                                    value={t("journals.reason-reject-journal")}
                                                                                />
                                                                            </div>
                                                                            <TextInput
                                                                                id="reason"
                                                                                placeholder={t("journals.reason-reject-journal-placeholder")}
                                                                                required={true}
                                                                            />
                                                                        </div>
                                                                        <div className="flex justify-center gap-4">
                                                                            <Button
                                                                                color="failure"
                                                                                onClick={() => {
                                                                                    setDeleteModalVisible(false);
                                                                                    handleReject(idSelectedItem);
                                                                                    setIdSelectedItem('');
                                                                                }}
                                                                            >
                                                                                {t("journals.yes")}
                                                                            </Button>
                                                                            <Button
                                                                                color="gray"
                                                                                onClick={() => setDeleteModalVisible(false)}
                                                                            >
                                                                                {t("journals.no")}
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                </Modal.Body>
                                                            </Modal>
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
}

export default JournalDecide