import { Button, SelectMenu, Spinner, toaster } from 'evergreen-ui';
import { Label, Modal, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom'
import API, { endpoints } from '../../../API';
import Header from '../Header';
import Slidebar from '../Slidebar';

function JournalSpecSelect() {
    const { journalId } = useParams();
    const nav = useNavigate();
    const [invitationModalVisible, setInvitationModalVisible] = useState(false);
    const [t] = useTranslation('common');
    //set up multi select

    const [journal, setJournal] = useState([]);
    const [listReviewer, setListReviewer] = useState([]);

    useEffect(() => {
        API.get(endpoints['journal-info'](journalId)).then(res => {
            setJournal(res.data);
        }
        ).catch(err => console.log(err));
        //get list peer reviewer
        API.get(endpoints['list-peer-reviewer']).then(res => {
            setListReviewer(res.data.map(label => ({
                label: "ID: " + label.id + "; Username: " + label.username + "; " + label.firstName + " " + label.lastName + "; Workplace: " + label.workPlace,
                value: label.id
            })));
        }
        ).catch(err => console.log(err));


    }, [journalId]);


    const [selectedItemsState, setSelectedItems] = React.useState([]);
    const [selectedItemNamesState, setSelectedItemNames] = React.useState(null);

    console.log(selectedItemsState);

    if (journal == null) {
        return (
            <>
                <Spinner />
            </>
        )
    }

    const handleUsernameCheck = () => {

        const json = JSON.stringify({
            username: document.getElementById('username').value
        });

        API.post(endpoints['check-username-exists'], json, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => {
            console.log(res.data)
            if (res.status === 200) {
                toaster.success('Can use this username!!')
            } else {
                toaster.danger('Please choose other username!!')
            }
        });
        
    }

    const handleSendMail = () => {
        const json = JSON.stringify({
            username: document.getElementById('username').value,
            email: document.getElementById('email').value
        });

        API.post(endpoints['send-invitation'], json, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => {
            console.log(res.data)
            if (res.status === 200) {
                toaster.success('Sent mail successful!!');
                
            } else {
                toaster.danger('Send mail fail!!');
            }
        });
        setInvitationModalVisible(false);
    }

    const handleClick = () => {
        if (selectedItemNamesState === null) {
            toaster.notify('Please choose at least one reviewer!!')
        }
        else {
            const json = JSON.stringify({
                journalId: journalId,
                reviewerId: selectedItemsState
            });

            API.post(endpoints['create-peer-review'], json, {
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(res => {
                if (res.status === 200) {
                    alert(t("journal.message-submit-success"))
                    nav('/management/')
                } else {
                    alert(t("journal.message-submit-failed"))
                }
            })
        }

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
                        <Modal
                            show={invitationModalVisible}
                            size="md"
                            popup={true}
                            onClose={() => setInvitationModalVisible(false)}
                        >
                            <Modal.Header />
                            <Modal.Body>
                                <div className="text-center">
                                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                        {t("journal-spec-select.modal-title")}
                                    </h3>
                                    <div className="flex justify-center gap-4 pb-6">
                                        <div className="flex flex-col gap-4">
                                            <div>
                                                <div className="mb-2 block">
                                                    <Label
                                                        htmlFor="username"
                                                        value={t("journal-spec-select.modal-username")}
                                                    />
                                                </div>
                                                <TextInput
                                                    id="username"
                                                    type="text"
                                                    sizing="md"
                                                />
                                                <Button className='mt-6' onClick={handleUsernameCheck}>
                                                    {t("journal-spec-select.modal-username-check")}
                                                </Button>
                                            </div>
                                            <div>
                                                <div className="mb-2 block">
                                                    <Label
                                                        htmlFor="email"
                                                        value={t("journal-spec-select.modal-email")}
                                                    />
                                                </div>
                                                <TextInput
                                                    id="email"
                                                    type="text"
                                                    sizing="md"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        color="gray"
                                        onClick={handleSendMail}
                                    >
                                        {t("journal-spec-select.modal-submit")}
                                    </Button>
                                </div>
                            </Modal.Body>
                        </Modal>
                        <div>
                            <Button appearance="primary" onClick={() => nav(-1)} className='py-2 px-2 rounded-sm box-border flex text-black 
                bg-slate-200 hover:bg-black hover:text-slate-200 duration-300 transition-all'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953l7.108-4.062A1.125 1.125 0 0121 8.688v8.123zM11.25 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953L9.567 7.71a1.125 1.125 0 011.683.977v8.123z" />
                                </svg>
                                <span className='pl-2'>{t("journals.back")}</span>
                            </Button>
                        </div>
                        <div className='w-full h-screen flex justify-center'>
                            <div className='mx-16 my-8'>
                                <div className='px-2 pb-8'>
                                    <span className='font-bold text-red-700 text-3xl'>{t("journals.select-reviewer")}</span>
                                    <div>
                                        <span>{t("journals.journal-information")}</span>
                                        <table class="table-fixed">
                                            <tr>
                                                <th>{t("journals.journal-id")}:</th>
                                                <td>{journal.id}</td>
                                            </tr>
                                            <tr>
                                                <th>{t("journals.journal-title")}:</th>
                                                <td>{journal.title}</td>
                                            </tr>
                                            <tr>
                                                <th>{t("journals.journal-description")}:</th>
                                                <td>{journal.description}</td>
                                            </tr>
                                            <tr>
                                                <th>{t("journals.journal-filename")}:</th>
                                                <td><a href={journal.fileDownloadUrl}>{journal.fileName}</a></td>
                                            </tr>
                                            <tr>
                                                <th>{t("journals.journal-type")}:</th>
                                                <td>{journal.type}</td>
                                            </tr>
                                            <tr>
                                                <th>{t("journals.journal-list-of-authors")}:</th>
                                                <td>{journal.listAuthor}</td>
                                            </tr>
                                            <tr>
                                                <th>{t("journals.journal-list-of-keywords")}:</th>
                                                <td>{journal.listKeyword}</td>
                                            </tr>
                                            <tr>
                                                <th>{t("journals.journal-organization")}:</th>
                                                <td>{journal.organization}</td>
                                            </tr>
                                        </table>
                                        {/* <ul>
                                            <li>ID: {journal.id}</li>
                                            <li>Mô tả: {journal.description}</li>
                                            <li><a href={journal.fileDownloadUrl}>{journal.fileName}</a></li>
                                        </ul> */}
                                    </div>
                                </div>
                                <SelectMenu
                                    width={500}
                                    isMultiSelect
                                    title={t("journals.select-reviewer")}
                                    options={listReviewer}
                                    selected={selectedItemsState}
                                    onSelect={(item) => {
                                        const selected = [...selectedItemsState, item.value]
                                        const selectedItems = selected
                                        const selectedItemsLength = selectedItems.length
                                        let selectedNames = ''
                                        if (selectedItemsLength === 0) {
                                            selectedNames = ''
                                        } else if (selectedItemsLength === 1) {
                                            selectedNames = 'Reviewer ID: ' + selectedItems.toString()
                                        } else if (selectedItemsLength > 1) {
                                            selectedNames = selectedItemsLength.toString() + ' ' + t("journals.selected...")
                                        }
                                        setSelectedItems(selectedItems)
                                        setSelectedItemNames(selectedNames)
                                    }}
                                    onDeselect={(item) => {
                                        const deselectedItemIndex = selectedItemsState.indexOf(item.value)
                                        const selectedItems = selectedItemsState.filter((_item, i) => i !== deselectedItemIndex)
                                        const selectedItemsLength = selectedItems.length
                                        let selectedNames = ''
                                        if (selectedItemsLength === 0) {
                                            selectedNames = ''
                                        } else if (selectedItemsLength === 1) {
                                            selectedNames = 'Reviewer ID: ' + selectedItems.toString()
                                        } else if (selectedItemsLength > 1) {
                                            selectedNames = selectedItemsLength.toString() + ' ' + t("journals.selected...")
                                        }

                                        setSelectedItems(selectedItems)
                                        setSelectedItemNames(selectedNames)
                                    }}
                                >
                                    <Button>{selectedItemNamesState || t("journals.List-reviewer")}</Button>
                                </SelectMenu>
                                <div className='pt-8'>
                                    <Button onClick={() => setInvitationModalVisible(true)}>{t("journals.Invite-external-reviewer")}</Button>
                                </div>
                                <div className='pt-8'>
                                    <Button onClick={handleClick}>{t("journals.Submit")}</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default JournalSpecSelect