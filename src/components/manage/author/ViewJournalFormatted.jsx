import React, { useEffect, useRef, useState } from 'react'
import Header from '../Header'
import Slidebar from '../Slidebar'
import API, { authAxios, endpoints } from '../../../API';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Spinner } from 'flowbite-react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { STATUS_200_OK } from '../../const/data_const';

function ViewJournalFormatted() {

    const [t] = useTranslation("common");
    const [data, setData] = useState(null);
    const { journalId } = useParams();
    const [journal, setJournal] = useState(null);
    const [loading, setLoading] = useState(true);
    const nav = useNavigate();

    useEffect(() => {
        API.get(endpoints['journal-info'](journalId)).then(res => {
            setJournal(res.data);
            setData(res.data.contentHtml);
            setLoading(false);
        }
        ).catch(err => console.log(err));

    }, []);

    const handleSubmitClick = () => {
        const json = JSON.stringify({
            contentHtml: data,
        });

        if(window.confirm(t("format-journal-process.confirm-submit")) === false){
            return;
        }

        setLoading(true);

        API.post(endpoints['submit-formatted-journal-publish'](journalId), json, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => {

            console.log(res.data);
            setLoading(false);

            if (res.status === STATUS_200_OK) {

                alert(t("format-journal-process.confirm-success"))
            } else {

                alert(t("format-journal-process.confirm-failed"))
            }
        }).catch(evt => setLoading(false));
    }

    const handleSaveClick = () => {
        const json = JSON.stringify({
            contentHtml: data,
        });

        API.post(endpoints['update-format-journal-publish'](journalId), json, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => {

            console.log(res);
            if (res.status === STATUS_200_OK) {

                alert(t("format-journal-process.save-success"));
            } else {
                alert(t("format-journal-process.save-failed"));
            }
        })
    }

    function uploadAdapter(loader){
        return{
            
            upload: () => {
                
                return new Promise((resolve, reject) => {
                    
                    const body = new FormData();
                    
                    loader.file.then((file) => {

                        body.append("uploadImg", file);

                        fetch(`http://localhost:8080/upload-image`, {
                            
                            method : "post",
                            body : body
                        }).then((res) => {
                            console.log(res);
                            resolve({ default : res.fileDownloadUri })
                        })
                    })
                })
            }
        }
    }

    function uploadPlugin(editor) {
        
        editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {

            return uploadAdapter(loader);
        }
    }

    if (loading === true) {
        return (
            <>
                <div className=''>
                    <div className=''>
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
                                {/*  */}
                                <div className='flex justify-center'>
                                    <span className='font-bold text-3xl uppercase'>{t("format-journal-process.header")}</span>
                                </div>
                                <div className='flex justify-between items-center'>
                                    <div>
                                        <span>{t("format-journal-process.format-journal")}</span>
                                    </div>
                                    {/* button Save */}
                                    <div className='flex justify-center items-center gap-4'>
                                        <div
                                            className='bg-slate-700 px-8 py-2 text-blue-200 flex rounded-lg cursor-pointer hover:bg-slate-300 hover:text-black'
                                            onClick={() => handleSaveClick()}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9" />
                                            </svg>
                                            <span>{t("format-journal-process.save")}</span>
                                        </div>

                                        <div
                                            className='bg-amber-700 px-8 py-2 text-blue-200 flex rounded-lg cursor-pointer hover:bg-amber-300 hover:text-black'
                                            onClick={() => handleSubmitClick()}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                            </svg>
                                            <span>{t("format-journal-process.submit")}</span>
                                        </div>
                                    </div>

                                </div>
                                <div className='bg-gray-200 rounded-sm my-4'>
                                    <div className='flex gap-4 py-3 ml-2'>
                                        <svg id={'icon'} onClick={() => {
                                            document.getElementById('row').classList.toggle('hidden');
                                            document.getElementById('icon').classList.toggle('rotate-90');
                                        }}
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                            className="w-6 h-6 cursor-pointer duration-300">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                        </svg>
                                        <span>
                                            {journal.title}
                                        </span>
                                    </div>
                                    <div id={'row'} className='flex gap-3 ml-8 hidden'>
                                        <table>
                                            <tr>
                                                <td>ID</td>
                                                <td>{journal.id}</td>
                                            </tr>
                                            <tr>
                                                <td>{t("my-journal.journal-title")}</td>
                                                <td>{journal.title}</td>
                                            </tr>
                                            <tr>
                                                <td>File</td>
                                                <td><a href={journal.fileDownloadUrl}>{journal.fileName}</a></td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                {/* wrapper ckeditor */}
                                <div className="App">
                                    <CKEditor
                                        editor={ ClassicEditor }
                                        data={data}
                                        onChange={ ( event, editor ) => {
                                            setData(editor.getData());
                                        } }
                                        config={{
                                            extraPlugins : [uploadPlugin],

                                        }}
                                        onReady={editor => {
                                            // You can store the "editor" and use when it is needed.
                                            console.log('Editor is ready to use!', editor);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default ViewJournalFormatted