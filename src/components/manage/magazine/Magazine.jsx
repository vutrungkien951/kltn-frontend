import React, { useEffect, useState } from 'react'
import Header from '../Header'
import Slidebar from '../Slidebar'
import API, { endpoints } from '../../../API';
import { Link } from 'react-router-dom';
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import { useTranslation } from 'react-i18next';

function Magazine() {

    const [modalVisible, setModalVisible] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [previewModalVisible, setPreviewModalVisible] = useState(false);
    const [publishModalVisible, setPublishModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [journalSelected, setJournalSelected] = useState('');
    const [datepick, setDatepick] = useState('');
    const [magazineUnpublished, setMagazineUnpublished] = useState([]);
    const [journalWaitingToAdd, setJournalWaitingToAdd] = useState([]);
    const [t] = useTranslation("common");

    const init = () => {

        API.get(endpoints['list-magazine-unpublished']).then(res => {

            setMagazineUnpublished(res.data);
        }
        ).then(() => {

            API.get(endpoints['journal-waiting-add-magazine']).then(res => {

                setJournalWaitingToAdd(res.data);
                console.log(res.data);
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }

    useEffect(() => {

        init();
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const json = JSON.stringify({
            magazineNumberName: document.getElementById('magazine_number_name').value,
        });

        await API.post(endpoints['create-magazine'], json, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => {
            console.log(res.data)
            if (res.status === 201) {

                alert(t("list-magazine.message-create-magazine-success"));
                init();
            } else {
                alert(t("list-magazine.message-create-magazine-failed"))
            }
        })

        setModalVisible(false);
    }

    const handleAddJournal = async (id) => {
        // console.log(journalSelected);
        const json = JSON.stringify({
            journalId: document.getElementById("journals").value
        });

        await API.post(endpoints['add-journal-magazine-unpublish'](id), json, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => {
            console.log(res.data)
            if (res.status === 201) {
                alert(t("list-magazine.message-add-journal-success"));
                init();
            } else {
                alert(t("list-magazine.message-add-journal-failed"))
            }
        })

        API.get(endpoints['list-magazine-unpublished']).then(res => {
            setMagazineUnpublished(res.data);
        }
        ).then(() => {
            API.get(endpoints['journal-waiting-add-magazine']).then(res => {
                setJournalWaitingToAdd(res.data);
                console.log(res.data);
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
        setAddModalVisible(false);
    }

    const handleRemoveJournal = async (id, journalId) => {
        // console.log(journalSelected);
        const json = JSON.stringify({
            journalId: journalId
        });

        await API.post(endpoints['remove-journal-magazine-unpublish'](id), json, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => {
            console.log(res.data)
            if (res.status === 201) {
                alert(t("list-magazine.message-remove-magazine-success"));
                init();
            } else {
                alert(t("list-magazine.message-remove-magazine-failed"))
            }
        })

        API.get(endpoints['list-magazine-unpublished']).then(res => {
            setMagazineUnpublished(res.data);
        }
        ).then(() => {
            API.get(endpoints['journal-waiting-add-magazine']).then(res => {
                setJournalWaitingToAdd(res.data);
                console.log(res.data);
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
        setDeleteModalVisible(false);
    }

    const handleSubmitPublish = async (e, id) => {
        e.preventDefault();
        const json = JSON.stringify({
            magazineId: id,
            dateString: datepick
        });
        console.log(json);

        await API.post(endpoints['publish-journal'], json, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => {
            console.log(res.data)
            if (res.status === 201) {
                alert(t("list-magazine.message-publish-magazine-success"));
                init();
            } else {
                alert(t("list-magazine.message-publish-magazine-failed"))
            }
        })
        
        setPublishModalVisible(false);
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
                                <span className='font-bold text-3xl uppercase'>{t("list-magazine.title")}</span>
                            </div>
                            <div className='flex'>
                                <div className='cursor-pointer on-select px-4 py-2'>
                                    <span><Link to='/management/list-magazine'>{t("list-magazine.magazine-unpublished")}</Link></span>
                                </div>
                                <div className='cursor-pointer px-4 py-2 bg-slate-300'>
                                    <span><Link to='/management/list-magazine-published'>{t("list-magazine.magazine-published")}</Link></span>
                                </div>
                            </div>
                            <div className='mt-8'>
                                <div className='mb-5 py-4 px-2 flex justify-between'>
                                    <span className='text-xl'>{t("list-magazine.magazine-unpublished")}</span>
                                    <div>
                                        <Button onClick={() => setModalVisible(true)}>
                                            {t("list-magazine.create-magazine")}
                                        </Button>
                                        <Modal
                                            show={modalVisible}
                                            onClose={() => setModalVisible(false)}
                                        >
                                            <Modal.Header>
                                                {t("list-magazine.create-magazine-title")}
                                            </Modal.Header>
                                            <Modal.Body>
                                                <div className="space-y-6">
                                                    <form onSubmit={(e) => handleFormSubmit(e)} className="flex flex-col gap-4">
                                                        <div>
                                                            <div className="mb-2 block">
                                                                <Label
                                                                    htmlFor="magazine_number_name"
                                                                    value={t("list-magazine.create-magazine-header")}
                                                                />
                                                            </div>
                                                            <TextInput
                                                                id="magazine_number_name"
                                                                placeholder={t("list-magazine.create-magazine-placeholder")}
                                                                required={true}
                                                            />
                                                        </div>
                                                        <Button type="submit">
                                                            {t("list-magazine.submit")}
                                                        </Button>
                                                    </form>
                                                </div>
                                            </Modal.Body>
                                        </Modal>
                                    </div>
                                </div>
                                {/* wrapper */}
                                <div>
                                    {
                                        magazineUnpublished.map((item) =>
                                            <div key={item.id} className='bg-gray-200 rounded-sm'>
                                                <div className='flex gap-4 py-3 ml-2'>
                                                    <svg id={'icon' + item.id} onClick={() => {
                                                        document.getElementById('row' + item.id).classList.toggle('hidden');
                                                        document.getElementById('icon' + item.id).classList.toggle('rotate-90');
                                                    }}
                                                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                                        className="w-6 h-6 cursor-pointer duration-300">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                                    </svg>
                                                    <span>{t("list-magazine.magazine-number-name")} : {item.magazineNumberName}</span>
                                                </div>
                                                <div id={'row' + item.id} className='flex gap-3 ml-8 hidden'>
                                                    <span onClick={() => {
                                                        setAddModalVisible(true);
                                                    }} className='p-2 text-cyan-700 font-bold cursor-pointer'>{t("list-magazine.add-journal")}</span>
                                                    <Modal
                                                        show={addModalVisible}
                                                        size="lg"
                                                        popup={true}
                                                        onClose={() => setAddModalVisible(false)}
                                                    >
                                                        <Modal.Header />
                                                        <Modal.Body>
                                                            <div className="text-center">
                                                                <div className='flex justify-center'>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                </div>
                                                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                                                    {t("list-magazine.add-journal-title")}
                                                                </h3>
                                                                <div className='mb-8'>
                                                                    <div className="mb-2 block">
                                                                        <Label
                                                                            htmlFor="fileUpload"
                                                                            value={t("list-magazine.add-journal-header")}
                                                                        />
                                                                    </div>
                                                                    <div id="fileUpload">
                                                                        <select
                                                                            id="journals"
                                                                            value={journalSelected}
                                                                            className="overflow-hidden w-64"
                                                                            defaultValue={journalWaitingToAdd[0]}
                                                                            onChange={(e) => setJournalSelected(e.target.value)}
                                                                        >
                                                                            {journalWaitingToAdd.map((item) => <option key={item.id} value={item.id}>
                                                                                {t("list-magazine.journal-id")}: {item.id} - {t("list-magazine.journal-title")}: {item.title} - {t("list-magazine.journal-type")}: {item.type}
                                                                            </option>)}
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-center gap-4">
                                                                    <Button
                                                                        type='submit'
                                                                        color="failure"
                                                                        onClick={() => {
                                                                            handleAddJournal(item.id);
                                                                            // setIdSelectedItem('');
                                                                        }}
                                                                    >
                                                                        {t("list-magazine.yes")}
                                                                    </Button>
                                                                    <Button
                                                                        color="gray"
                                                                        onClick={() => setAddModalVisible(false)}
                                                                    >
                                                                        {t("list-magazine.no")}
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </Modal.Body>
                                                    </Modal>
                                                    <span onClick={() => {
                                                        setPreviewModalVisible(true);
                                                    }} className='p-2 text-gray-700 font-bold cursor-pointer'>{t("list-magazine.preview")}</span>
                                                    <Modal
                                                        show={previewModalVisible}
                                                        size="md"
                                                        popup={true}
                                                        onClose={() => setPreviewModalVisible(false)}
                                                    >
                                                        <Modal.Header />
                                                        <Modal.Body>
                                                            <div className="text-center">
                                                                <div className='flex justify-center'>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                                                    </svg>
                                                                </div>
                                                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                                                    {t("list-magazine.preview")}
                                                                </h3>
                                                                <span>{t("list-magazine.preview-header")}</span>
                                                                <div className='mb-8'>
                                                                    <ul>
                                                                    {
                                                                        item.journalSet.map((journalItem) => 
                                                                            <li>
                                                                                <span>{t("list-magazine.journal-id")}: {journalItem.id} - {t("list-magazine.journal-title")}: {journalItem.title}</span>
                                                                            </li>
                                                                        )
                                                                    }
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </Modal.Body>
                                                    </Modal>
                                                    <span onClick={() => {
                                                        setPublishModalVisible(true);
                                                    }} className='p-2 text-cyan-700 font-bold cursor-pointer'>{t("list-magazine.publish-magazine")}</span>
                                                    <Modal
                                                        show={publishModalVisible}
                                                        size="md"
                                                        popup={true}
                                                        onClose={() => setPublishModalVisible(false)}
                                                    >
                                                        <Modal.Header />
                                                        <Modal.Body>
                                                            <div className="text-center">
                                                                <div className='flex justify-center'>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                                                    </svg>
                                                                </div>
                                                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                                                    {t("list-magazine.publish-magazine-title")}
                                                                </h3>
                                                                <div className='mb-8'>
                                                                    <form className="flex flex-col gap-4" onSubmit={e => handleSubmitPublish(e, item.id)}>
                                                                        <div>
                                                                            <div className="mb-2 block">
                                                                                <Label
                                                                                    htmlFor="datepick"
                                                                                    value={t("list-magazine.publish-magazine-header")}
                                                                                />
                                                                            </div>
                                                                            <input required id='datepick' type="date"
                                                                                onChange={(e) => setDatepick(e.target.value)}
                                                                                min={new Date().toISOString().slice(0, 10)} />
                                                                        </div>
                                                                        <Button type="submit">
                                                                            {t("list-magazine.submit")}
                                                                        </Button>
                                                                    </form>
                                                                </div>
                                                            </div>
                                                        </Modal.Body>
                                                    </Modal>
                                                    <span onClick={() => setDeleteModalVisible(true)} className='p-2 text-red-700 font-bold cursor-pointer'>{t("list-magazine.delete")}</span>
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
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                                                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                                                    </svg>
                                                                </div>
                                                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                                                    {t("list-magazine.delete-title")}
                                                                </h3>
                                                                <span>{t("list-magazine.delete-header")}</span>
                                                                <div className='mb-8'>
                                                                    <ul>
                                                                    {
                                                                        item.journalSet.map((journalItem) => 
                                                                            <li>
                                                                                <div className='flex gap-4 items-center'>
                                                                                    <span>{t("list-magazine.journal-id")}: {journalItem.id} - {t("list-magazine.journal-title")}: {journalItem.title}</span>
                                                                                    <span onClick={() => handleRemoveJournal(item.id, journalItem.id)} className='py-1 px-2 rounded-md bg-slate-600 cursor-pointer hover:bg-red-600 hover:text-white'>
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                                                                                        </svg>
                                                                                    </span>
                                                                                </div>
                                                                            </li>
                                                                        )
                                                                    }
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </Modal.Body>
                                                    </Modal>
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

export default Magazine