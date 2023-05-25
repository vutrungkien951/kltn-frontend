import { Rating } from '@mui/material'
import { Spinner } from 'flowbite-react'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Link, useLocation, useParams } from 'react-router-dom'
import API, { authAxios, endpoints } from '../../API'
import { STATUS_200_OK, ROLE_ADMIN } from '../const/data_const'
import MyFooter from './Footer'
import NavBar from './NavBar'
import moment from 'moment/moment';
import 'moment/locale/vi';
import { Badge, Pane } from 'evergreen-ui'
// import 'moment/locale/en';


function ViewJournal(props) {
    const [journal, setJournal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [t] = useTranslation('common');
    const { journalId } = useParams();
    const [data, setData] = useState(null);
    const [comment, setComment] = useState("");
    const user = useSelector(state => state.user);
    let { state } = useLocation();
    const locale = t("view-journal.locale");
    const [myRate, setMyRate] = useState(0);
    const [avgRate, setAvgRate] = useState(null);
    const [countRate, setCountRate] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const [authors, setAuthors] = useState([]);
    const [keywords, setKeywords] = useState([]);

    const init = () => {

        API.get(endpoints['journal-info'](journalId)).then(res => {

            setJournal(res.data);
            setData(res.data.contentHtml);
            setCommentCount(res.data.commentSet.length);
            setAuthors(res.data.listAuthor.split(";"));
            setKeywords(res.data.listKeyword.split(";"));
            setLoading(false);
        }
        ).catch(err => console.log(err));
    }

    useEffect(() => {

        init();
    }, [journalId]);

    // method update avg rating after user rating
    const updateAvgRating = () => {

        setLoading(true);

        API.get(endpoints['avg-rating'](journalId)).then(res => {

            // check res status
            if(res.status === 200){

                setAvgRate(parseFloat(res.data).toFixed(2));
                setLoading(false);
            }
        }).catch(err => {

            console.log(err);
            setLoading(false);
        });    
    }

    // method update count rating after user rating
    const updateCountRating = () => {

        setLoading(true);

        API.get(endpoints['count-rating'](journalId)).then(res => {

            // check res status
            if(res.status === 200){

                setCountRate(res.data);
                setLoading(false);
            }
        }).catch(err => {

            console.log(err);
            setLoading(false);
        });    
    }

    // method init call API in first time to get AVG rating info and my rating info.
    useEffect(() => {

        //
        if(journalId != null) {
            setLoading(true);

        API.get(endpoints['journal-info'](journalId)).then(res => {
            setJournal(res.data);
            setCommentCount(res.data.commentSet.length);
            setData(res.data.contentHtml);

            return API.get(endpoints['count-rating'](journalId)).then(res => {

                // check res status
                if(res.status === 200){
    
                    setCountRate(res.data);

                    return API.get(endpoints['avg-rating'](journalId)).then(res => {

                        // check res status
                        if(res.status === STATUS_200_OK){
            
                            setAvgRate(parseFloat(res.data).toFixed(2));
                            setLoading(false);
                        }else {

                            setLoading(false);
                        }
                    }).catch(err => {
            
                        console.log(err);
                        setLoading(false);
                    }); 
                }else {

                    setLoading(false);
                }
            }).catch(err => {
    
                console.log(err);
                setLoading(false);
            });  
        }
        ).catch(err => console.log(err));
        }
    }, []);

    const  handleCommentClick = async () => {
        if(user.username === ""){
            alert(t("view-journal.message-user-login"));
            return;
        }

        if(window.confirm(t('view-journal.message-comment')) === false){
            return;
        }

        setLoading(true);
        const json = JSON.stringify({
            content: comment,
            journalId: journalId
        });

        await authAxios().post(endpoints['comment'], json, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => {
            console.log(res);
            
            if(res.status === STATUS_200_OK){

                alert(t("view-journal.message-comment-success"));
                setCommentCount(commentCount+1);
            }

            setLoading(false);
            setComment("");
        }
        ).catch(err => {
            console.log(err);
            setLoading(false);
            alert(t("view-journal.message-comment-failed"))});

        API.get(endpoints['journal-info'](journalId)).then(res => {
            setJournal(res.data);
            setData(res.data.contentHtml);
        }
        ).catch(err => console.log(err));
    }

    // method api post new rating to server
    const handleRating = async (newValue) => {

        if(user.username === ""){
            alert(t("view-journal.message-user-login"));
            return;
        }

        if(window.confirm(t('view-journal.message-rating')) === false){
            return;
        }
        
        setLoading(true);
        const json = JSON.stringify({
            rate: newValue,
            journalId: journalId
        });
        console.log(json);
        // check rating before send to server
        if(0 < newValue && newValue <= 5) {
            
            await authAxios().post(endpoints['rating'], json, {

                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(res => {

                alert(t("view-journal.message-rating-success"));
                setLoading(false);

                if(res.status === STATUS_200_OK) {

                    updateAvgRating();
                    updateCountRating();
                }
            }).catch(err => {
                console.log(err);
                setLoading(false);
                alert(t("view-journal.message-comment-failed"));
            });
        }else{
            setLoading(false);
        }
    }

    //method to delete comment (only use by ROLE_ADMIN)
    const handleDeleteComment = (commentId) => {

        // confirm delete comment
        if(window.confirm(t('view-journal.message-delete-comment')) === false){

            return;
        } else {

            // send api to delete comment
            setLoading(true);

            authAxios().post(endpoints['delete-comment'](commentId)).then(res => {

                setLoading(false);

                if(res.status === STATUS_200_OK) {
                    
                    init();

                    alert(t("view-journal.message-delete-comment-success"));
                } else {

                    alert(t("view-journal.message-delete-comment-failed"));
                }
            }).catch(err => {

                setLoading(false);
            });
        }
    }

    if (loading === true) {
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
                <div className='m-auto min-h-screen'>
                    <NavBar />
                    <div className='wrapperContent mx-6 min-h-[60vh] lg:mx-16 my-2 text-base'>
                        <div className='flex justify-center items-center'>
                            <span className='font-bold text-3xl'>
                                {t("view-journal.header")}
                            </span>
                        </div>
                        <div id='btnPdf' className='flex justify-end items-center'>
                            <div className='px-3 py-2 rounded-md bg-slate-400'>
                                <span className='font-bold text-2xl'>
                                    <Link target="_blank" onClick={() => {
                                            localStorage.setItem("magazineId", state.magazineId);
                                            localStorage.setItem("journal_url", window.location.href);
                                        }} 
                                        // state={{ magazineId: state.magazineId, journal_url: window.location.href }} 
                                        to={'/view-pdf/' + journalId}>{t("view-journal.view-pdf")}</Link>
                                </span>
                            </div>
                        </div>
                        {/* container */}
                        <div>
                            {/* table */}
                            <div className='text-lg mx-32 my-4'>
                                <div>
                                    <span className='font-bold'>
                                        {
                                            avgRate === null 
                                            ? t('view-journal.no-rating') 
                                            : 
                                                <>
                                                    <div className='flex items-center gap-3'>
                                                        <label>{avgRate}</label>
                                                        <Rating
                                                            name="half-rating-read"
                                                            readOnly
                                                            precision={0.5}
                                                            defaultValue={avgRate}
                                                        />
                                                        <label>{countRate} {t("view-journal.ratings")}</label>
                                                    </div>
                                                </>
                                        }
                                    </span>
                                </div>
                                <div>
                                    <span className='font-bold'>{t("view-journal.title")}: </span>
                                    <span>{journal.title}</span>
                                </div>
                                <div>
                                    <span className='font-bold'>{t("view-journal.type")}: </span>
                                    <span>{journal.type}</span>
                                </div>
                                <div>
                                    <span className='font-bold'>{t("view-journal.description")}: </span>
                                    <span>{journal.description}</span>
                                </div>
                                <div>
                                    <span className='font-bold'>{t("view-journal.keywords")}: </span>
                                    <Pane>
                                        {keywords.map(item => <>
                                            <Badge color="neutral" marginRight={8}>
                                                {item}
                                            </Badge>
                                        </>)}
                                    </Pane>
                                </div>
                                <div>
                                    <span className='font-bold'>{t("view-journal.authors")}: </span>
                                    <Pane>
                                        {authors.map(item => <>
                                            <Badge color="neutral" marginRight={8}>
                                                {item}
                                            </Badge>
                                        </>)}
                                    </Pane>
                                </div>
                                <div>
                                    <span className='font-bold'>{t("view-journal.content")}: </span>
                                    <div
                                        dangerouslySetInnerHTML={{ __html: data }}
                                    />
                                </div>
                                {/* comment and rating */}
                                {user.username !== "" ? <div className='my-3'>
                                    <textarea className='w-[100%] rounded-md' value={comment} onChange={(evt) => setComment(evt.target.value)} />
                                    {/* button submit */}
                                    <div className='flex justify-between my-4'>
                                        <div className='flex items-center gap-5'>
                                            <span><label className='font-bold text-lg'>{t('view-journal.rating')}</label></span>
                                            <Rating
                                                name="simple-controlled"
                                                value={myRate}
                                                onChange={(event, newValue) => {

                                                    setMyRate(newValue);
                                                    // call API send new my rate to server
                                                    handleRating(newValue);
                                                }}
                                            />
                                        </div>
                                        <div className='px-3 py-2 bg-slate-500 rounded-md cursor-pointer' onClick={() => handleCommentClick()}>
                                            <span>{t('view-journal.comment')}</span>
                                        </div>
                                    </div>
                                </div> : null}
                                <span>{t("view-journal.comments")} ({commentCount})</span>
                                <div className=''>
                                    {journal.commentSet.sort(function(a, b) {
                                            return new Date(b.createdDate) - new Date(a.createdDate); 
                                        }).map(item =>
                                        <div id={'comment_'+item.id} className=' bg-slate-400 rounded-md my-2'>
                                            <div className='flex justify-between items-center bg-slate-500 px-4 py-1'>
                                                <span><label>{item.userId.username} - {moment(item.createdDate).locale(locale).fromNow()}</label></span>
                                                {
                                                    user.userRole === ROLE_ADMIN 
                                                    ?   <>
                                                            <span className='text-red-800 text-lg cursor-pointer p-2 bg-black rounded-lg' onClick={() => handleDeleteComment(item.id)}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </span>
                                                        </>
                                                    : null
                                                }
                                            </div>
                                            <div className='px-4 py-3'>{item.content}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <MyFooter />
                </div>
            </>
        )
    }
}

export default ViewJournal