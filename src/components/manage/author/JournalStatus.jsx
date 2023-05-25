import React, { useEffect, useRef, useState } from 'react'
import Header from '../Header'
import Slidebar from '../Slidebar'
import API, { authAxios, endpoints } from '../../../API';
import { Link } from 'react-router-dom';
import { Button, Label, Modal } from 'flowbite-react';
import { Pagination } from 'evergreen-ui';
import { useTranslation } from 'react-i18next';

function JournalStatus() {
    const [myJournal, setMyJournal] = useState([]);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [idSelectedItem, setIdSelectedItem] = useState('');
    const content = useRef();
    const [pageNumber, setPageNumber] = useState(1);
    const [pageTotal, setPageTotal] = useState(1);
    const [t] = useTranslation("common");

    const init = () => {

        authAxios().get(endpoints['my-journal-pagination'](0)).then(res => {
            setMyJournal(res.data.content);
            setPageTotal(res.data.totalPages);
            setPageNumber(1);
            // console.log(res.data);
        }
        ).catch(err => console.log(err));
    }

    useEffect(() => {
        
        init();
    }, []);

    const handlePageChange = (pageNumberChangeTo) =>{
        setPageNumber(pageNumberChangeTo);
        let url = endpoints['my-journal-pagination'](pageNumberChangeTo-1);
        console.log(url);

        authAxios().get(url).then(res => {
            setMyJournal(res.data.content);
            
            console.log(res.data);
        }
        ).catch(err => console.log(err));
    }

    const handleEdit = async (id) => {
        const form_data = new FormData();
        form_data.append('fileRequest', content.current.files[0]);

        await API.post(endpoints['submit-edit-journal-publish'](id), form_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then(res => {
            console.log(res.data)
            if (res.status === 201) {
                alert(t("journals.message-revise-journal-success"));
            }
            else {
                alert(t("journals.message-revise-journal-failed"));
            }
        });
        init();
        setEditModalVisible(false);
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
                                <span className='font-bold text-3xl uppercase'>{t("my-journal.title")}</span>
                            </div>
                            <div className='flex'>
                                <div className='cursor-pointer on-select px-4 py-2'>
                                    <span><Link to='/management/status-journals'>{t("my-journal.status")}</Link></span>
                                </div>
                            </div>
                            <div className='mt-8'>
                                <div className='mb-5'>
                                    <span className='text-xl'>{t("my-journal.list-of-journals-status")}</span>
                                </div>
                                <Pagination page={pageNumber} totalPages={pageTotal} onPageChange={(evt) => handlePageChange(evt)}  onPreviousPage={() => handlePrevPage(pageNumber)} onNextPage={() => handleNextPage(pageNumber)}></Pagination>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>{t("my-journal.journal-id")}</th>
                                            <th>{t("my-journal.journal-title")}</th>
                                            <th>{t("my-journal.journal-file")}</th>
                                            <th>{t("my-journal.journal-status")}</th>
                                            <th>{t("my-journal.journal-function")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            myJournal.map((item, index) =>
                                                <tr key={item.id} id={'row' + item.id}>
                                                    <td>{item.id}</td>
                                                    <td>{item.title}</td>
                                                    <td><a href={item.fileDownloadUrl}>{item.fileName}</a></td>
                                                    <td>{item.state}</td>
                                                    <td>
                                                        {(item.state === "CHỈNH SỬA TRƯỚC XUẤT BẢN") ?
                                                            <div className='flex gap-4 justify-center'>
                                                            <div onClick={() => {
                                                                setEditModalVisible(true);
                                                                setIdSelectedItem(item.id);
                                                                }} className='px-2 py-2 bg-red-700 text-white cursor-pointer rounded-md'>
                                                                <span>{t("my-journal.edit")}</span>
                                                            </div>
                                                        </div> : <div></div>
                                                        }
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
                                                                        {t("journals.confirm")}<br /> {t("journals.submit-journal-after-edit")}
                                                                    </h3>
                                                                    <div className='mb-8'>
                                                                        <div className="mb-2 block">
                                                                            <Label
                                                                                htmlFor="fileUpload"
                                                                                value={t("journals.edit-content")}
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
                                                        {(item.state === "CHỜ TÁC GIẢ PHẢN HỒI XUẤT BẢN SAU CHỈNH SỬA") ?
                                                            <div className='flex gap-4 justify-center'>
                                                            <div className='px-2 py-2 bg-lime-500 text-red-900 cursor-pointer rounded-md'>
                                                                <span><Link to={"/management/view-formatted-journal/"+item.id}>{t("my-journal.view")}</Link></span>
                                                            </div>
                                                        </div> : <div></div>
                                                        }
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

export default JournalStatus