import { Alert, Button, Label, Select, Textarea, TextInput } from 'flowbite-react'
import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import API, { authAxios, endpoints } from '../../API'
import MyFooter from './Footer'
import NavBar from './NavBar'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { TagInput } from 'evergreen-ui'
import { AUTHORS, DESCRIPTION, EMAIL, FAILURE, KEYWORDS, ORGANIZATION, PDF_TYPE, STATUS_200_OK, SUCCESS, TITLE } from '../const/data_const'

function Submission() {
    const [t] = useTranslation("common");
    const content = useRef();
    const [submissionSuccess, setSubmissionSuccess] = useState('');
    const [journal, setJournal] = useState({
        title: "",
        description : "",
        authors : [],
        keywords : [],
        email : "",
        organization : "",
    });

    const [journalInputColor, setJournalInputColor] = useState({
        title: "gray",
        description: "gray",
        authors: "gray",
        keywords: "gray",
        email: "gray",
        organization: "gray",
    })

    const [journalMessageValidation, setJournalMessageValidation] = useState({
        title: "",
        description: "",
        authors: "",
        keywords: "",
        email: "",
        organization: "",
    })

    const handleChange = (e) => {
        let name = e.target.name
        let value = e.target.value
        setJournal(preValue => {
            return {
                ...preValue,
                [name]: value
            }
        })
    };

    const user = useSelector(state => state.user.username)

    const handleValidationFailed = (name) => {

        let value = FAILURE;

        setJournalInputColor(prevalue => {
            return {
                ...prevalue,
                [name]: value
            }
        })

        setJournalMessageValidation(prevalue => {

            return {
                ...prevalue,
                [name] : t("submission-validation."+name)
            }
        })
    }

    const handleFormSubmit = (event) => {

        event.preventDefault();

        if(journal.title === '' || journal.title.length > 100) {

            handleValidationFailed(TITLE);
            return false;
        }

        if(journal.description === '' || journal.description.length > 250) {
            
            handleValidationFailed(DESCRIPTION);
            return false;
        }

        if(journal.authors.length === 0) {

            alert(t("submission-validation.authors"));
            return false;
        }

        if(journal.keywords.length === 0) {

            alert(t("submission-validation.keywords"));
            return false;
        }

        if(journal.email === '' || journal.email.length > 100) {

            handleValidationFailed(EMAIL);
            return false;
        }

        if(journal.organization === '' || journal.organization.length > 100) {

            handleValidationFailed(ORGANIZATION);
            return false;
        }

        // check file selected?

        const form_data = new FormData();
        console.log(content.current.files[0]);
        if(content.current.files[0].type === PDF_TYPE){

            form_data.append("file", content.current.files[0]);
        } else {

            alert(t("submission.select-pdf-message"))
            return false;
        }

        API.post(endpoints['uploadFileJournal'](0), form_data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then(res => {

            if (res.status === STATUS_200_OK) {

                const json = JSON.stringify({
                    title : journal.title,
                    description : journal.description,
                    type : document.getElementById("types").value,
                    file_name : res.data.fileName,
                    file_download_url : res.data.fileDownloadUri,
                    listOfAuthors : journal.authors.join(";"),
                    listOfKeywords : journal.keywords.join(";"),
                    email : journal.email,
                    organization : journal.organization
                });

                console.log(json);
                
                return authAxios().post(endpoints['submission'], json, {

                    headers: {
                        'Content-Type': 'application/json',
                    }
                }).then(res => {

                    if(res.status === STATUS_200_OK) {

                        setSubmissionSuccess(SUCCESS);
                    } else {

                        setSubmissionSuccess(FAILURE);
                    }
                }).catch(err => {
                    
                    console.log(err);
                    setSubmissionSuccess(FAILURE);
                })
            }
        });
    }

    return (
        <>
            <div className='m-auto min-h-screen relative'>
                <NavBar />
                <div className='wrapperContent mx-6 lg:mx-16 my-8 min-h-[60vh] text-base'>
                    <h2 className='font-bold text-2xl mb-4'>{t("submission.title")}</h2>
                    {/* Authentication Render */}
                    { submissionSuccess === SUCCESS ? <Alert color="success" onDismiss={() => setSubmissionSuccess("")}><span>{t("submission.submit-success")}</span></Alert>  : null}
                    { submissionSuccess === FAILURE ? <Alert color="warning" onDismiss={() => setSubmissionSuccess("")}><span>{t("submission.submit-failure")}</span></Alert>  : null}
                    { user === "" 
                    ?   <>
                            <span className='border-l-4 border-blue-400 px-2'><Link to="/sign-in" className='text-red-600 font-bold'>{t("submission.sign-in")}</Link> {t("submission.or")} <Link to="/sign-up" className='text-yellow-600 font-bold'>{t("submission.sign-up")}</Link> {t("submission.to-submit")}</span>
                        </> 
                    :   <>
                            <div className='mt-8'>
                                <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
                                    <div>
                                        <div className="mb-2 block">
                                            <Label
                                                htmlFor="title1"
                                                value={t("submission.journal-title")}
                                            />
                                        </div>
                                        <TextInput
                                            id="title1"
                                            type="text"
                                            placeholder={t("submission.journal-title-placeholder")}
                                            required={true}
                                            style={{ maxWidth: '1240px' }}
                                            value={journal.title}
                                            name='title'
                                            onChange={e => handleChange(e)}
                                            color={journalInputColor.title}
                                            helperText={<><span className="font-medium">{journalMessageValidation.title}</span>{' '}</>}
                                        />
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <Label
                                                htmlFor="description1"
                                                value={t("submission.journal-description")}
                                            />
                                        </div>
                                        <Textarea
                                            id="description1"
                                            type="text"
                                            name='description'
                                            placeholder={t("submission.journal-description-placeholder")}
                                            required={true}
                                            onChange={e => handleChange(e)}
                                            value={journal.description}
                                            style={{ maxWidth: '1240px' }}
                                            rows={4}
                                            color={journalInputColor.description}
                                            helperText={<><span className="font-medium">{journalMessageValidation.description}</span>{' '}</>}
                                        />
                                    </div>
                                    <div id="select">
                                        <div className="mb-2 block">
                                            <Label
                                                htmlFor="types"
                                                value={t("submission.journal-select-type")}
                                            />
                                        </div>
                                        <Select
                                            id="types"
                                            required={true}
                                            style={{ maxWidth: '1240px' }}
                                        >
                                            <option>
                                                {t("master-data.research-article")}
                                            </option>
                                            <option>
                                                {t("master-data.review-article")}
                                            </option>
                                            <option>
                                                {t("master-data.book-review")}
                                            </option>
                                            <option>
                                                {t("master-data.case-report")}
                                            </option>
                                            <option>
                                                {t("master-data.commentaries-letters")}
                                            </option>
                                            <option>
                                                {t("master-data.datasets")}
                                            </option>
                                        </Select>
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <Label
                                                htmlFor="list-author1"
                                                value={t("submission.list-author")}
                                            />
                                        </div>
                                        <TagInput
                                            inputProps={{ placeholder: t("submission.author-placeholder") }}
                                            values={journal.authors}
                                            onChange={(values) => {
                                                setJournal(prevalue => {
                                                    return {
                                                        ...prevalue,
                                                        authors : values
                                                    }
                                                })
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <Label
                                                htmlFor="list-keyword1"
                                                value={t("submission.list-keyword")}
                                            />
                                        </div>
                                        <TagInput
                                            id="list-keyword1"
                                            inputProps={{ placeholder: t("submission.keyword-placeholder") }}
                                            values={journal.keywords}
                                            onChange={(values) => {
                                                setJournal(prevalue => {
                                                    return {
                                                        ...prevalue,
                                                        keywords : values
                                                    }
                                                })
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <Label
                                                htmlFor="email1"
                                                value={t("submission.email")}
                                            />
                                        </div>
                                        <TextInput
                                            id="email1"
                                            type="text"
                                            name='email'
                                            value={journal.email}
                                            onChange={e => handleChange(e)}
                                            placeholder={t("submission.email-placeholder")}
                                            required={true}
                                            style={{ maxWidth: '1240px' }}
                                            rows={4}
                                            color={journalInputColor.email}
                                            helperText={<><span className="font-medium">{journalMessageValidation.email}</span>{' '}</>}
                                        />
                                    </div>
                                    <div>
                                        <div className="mb-2 block">
                                            <Label
                                                htmlFor="organization1"
                                                value={t("submission.organization")}
                                            />
                                        </div>
                                        <TextInput
                                            id="organization1"
                                            type="text"
                                            name='organization'
                                            value={journal.organization}
                                            onChange={e => handleChange(e)}
                                            placeholder={t("submission.organization-placeholder")}
                                            required={true}
                                            style={{ maxWidth: '1240px' }}
                                            rows={4}
                                            color={journalInputColor.organization}
                                            helperText={<><span className="font-medium">{journalMessageValidation.organization}</span>{' '}</>}
                                        />
                                    </div>
                                    <div id="fileUpload">
                                        <input type="file" accept='application/pdf' ref={content} />
                                        {/* <FilePicker width={250} ref={content} id="file" placeholder="Select the file here!" /> */}
                                    </div>
                                    <Button type="submit">
                                        {t("submission.submit")}
                                    </Button>
                                </form>
                            </div>
                        </>}
                        
                    {/* <LoggedIn /> */}
                </div>
                <div>
                    <MyFooter />
                </div>
            </div>
        </>
    )
}

export default Submission