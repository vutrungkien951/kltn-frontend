import React, { useEffect, useRef, useState } from 'react'
import Header from '../Header'
import Slidebar from '../Slidebar'
import API, { authAxios, endpoints } from '../../../API';
import { Link } from 'react-router-dom';
import { Button, Label, Modal, Select, Spinner } from 'flowbite-react';
import { Pagination } from 'evergreen-ui';
import { useTranslation } from 'react-i18next';
import { STATUS_200_OK } from '../../const/data_const';

function Review() {
    const [journalWaitingReview, setJournalWaitingReview] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const content = useRef();
    const [pageNumber, setPageNumber] = useState(1);
    const [pageTotal, setPageTotal] = useState(1);
    const [t] = useTranslation("common");
    const [loading, setLoading] = useState(true);

    const init = () => {

        setLoading(true);
        
        authAxios().get(endpoints['journal-waiting-review-test-pagination'](0)).then(res => {

            setJournalWaitingReview(res.data.content);
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
        let url = endpoints['journal-waiting-review-test-pagination'](pageNumberChangeTo-1);

        authAxios().get(url).then(res => {
            setJournalWaitingReview(res.data.content);
            
            console.log(res.data);
        }
        ).catch(err => console.log(err));
    }

    const handleOnClickBtn = (id) => {
        const form_data = new FormData();
        form_data.append('file', content.current.files[0]);

        API.post(endpoints['uploadFilePeerReview'](id), form_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then(res => {
            // console.log(res.data)
            const fileDownloadUri = res.data.fileDownloadUri;

            const json = JSON.stringify({
                reportUrl: fileDownloadUri,
                recommendation: document.getElementById("recommendations").value,
            });

            console.log(json);
            return API.post(endpoints['review-journal'](id), json, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }).then(res => {

            console.log(res.data);
            if (res.status === STATUS_200_OK) {
                alert(t("journal.message-submit-success"));
                document.getElementById('row' + id).remove();
                init();
                setModalVisible(false);
            }else{
                
                setModalVisible(false);
                alert(t("journal.message-submit-failed"));
            }
        }).catch(err => {
            console.error(err);
        })
    }

    if (loading) {
        
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
                                    <span className='font-bold text-3xl uppercase'>{t("review.title")}</span>
                                </div>
                                <div className='flex'>
                                    <div className='cursor-pointer on-select px-4 py-2'>
                                        <span><Link to='/management/list-journal-review'>{t("review.waiting-review")}</Link></span>
                                    </div>
                                </div>
                                <div className='mt-8'>
                                    <div className='mb-5'>
                                        <span className='text-xl'>{t("review.list-journal-waiting-review")}</span>
                                    </div>
                                    <Pagination page={pageNumber} totalPages={pageTotal} onPageChange={(evt) => handlePageChange(evt)}></Pagination>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>{t("review.peer-review-id")}</th>
                                                <th>{t("review.journal-title")}</th>
                                                <th>{t("review.journal-file")}</th>
                                                <th>{t("review.journal-function")}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                journalWaitingReview.map((item, index) =>
                                                    <tr key={item[0]} id={'row' + item[0]}>
                                                        <td>{item[0]}</td>
                                                        <td>{item[3]}</td>
                                                        <td><a href={item[5]}>{item[4]}</a></td>
                                                        <td>
                                                            <div className='flex gap-4 justify-center'>
                                                                <div className='px-2 py-2'>
                                                                    <span>
                                                                        <Button onClick={() => setModalVisible(true)}>
                                                                            {t("review.review")}
                                                                        </Button>
                                                                        <Modal
                                                                            show={modalVisible}
                                                                            onClose={() => setModalVisible(false)}
                                                                        >
                                                                            <Modal.Header>
                                                                                {t("review.review-result")}
                                                                            </Modal.Header>
                                                                            <Modal.Body>
                                                                                <div className="space-y-6">
                                                                                    <div className="mb-2 block">
                                                                                        <Label
                                                                                            htmlFor="fileUpload"
                                                                                            value={t("review.review-result")}
                                                                                        />
                                                                                    </div>
                                                                                    <div id="fileUpload">
                                                                                        <input type="file" ref={content} />
                                                                                    </div>
                                                                                    <div className="mb-2 block">
                                                                                        <Label
                                                                                            htmlFor="recommendations"
                                                                                            value={t("review.recommendation")}
                                                                                        />
                                                                                    </div>
                                                                                    <Select
                                                                                        id="recommendations"
                                                                                        required={true}
                                                                                    >
                                                                                        <option>
                                                                                            {t("review.accept")}
                                                                                        </option>
                                                                                        <option>
                                                                                            {t("review.minor-revision")}
                                                                                        </option>
                                                                                        <option>
                                                                                            {t("review.major-revision")}
                                                                                        </option>
                                                                                        <option>
                                                                                            {t("review.reject")}
                                                                                        </option>
                                                                                    </Select>
                                                                                </div>
                                                                            </Modal.Body>
                                                                            <Modal.Footer>
                                                                                <Button onClick={() => handleOnClickBtn(item[0])}>
                                                                                    {t("review.submit")}
                                                                                </Button>
                                                                            </Modal.Footer>
                                                                        </Modal>
                                                                    </span>
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

export default Review