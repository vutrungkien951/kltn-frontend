import React, { useEffect, useState } from 'react'
import Header from '../Header'
import Slidebar from '../Slidebar'
import API, { endpoints } from '../../../API';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function MangazinePublished() {

    const [magazinePublished, setMagazinePublished] = useState([]);
    const [t] = useTranslation("common");

    useEffect(() => {

        API.get(endpoints['list-magazine-published']).then(res => {
            console.log(res.data)
            setMagazinePublished(res.data);
        }
        ).catch(err => console.log(err));

    }, []);

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
                                <div className='cursor-pointer px-4 py-2 bg-slate-300'>
                                    <span><Link to='/management/list-magazine'>{t("list-magazine.magazine-unpublished")}</Link></span>
                                </div>
                                <div className='cursor-pointer on-select px-4 py-2'>
                                    <span><Link to='/management/list-magazine-published'>{t("list-magazine.magazine-published")}</Link></span>
                                </div>
                            </div>
                            <div className='mt-8'>
                                <div className='mb-5 py-4 px-2'>
                                    <span className='text-xl'>{t("list-magazine.magazine-published")}</span>
                                </div>
                                {/* wrapper */}
                                <div>
                                    {
                                        magazinePublished.map((item) =>
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
                                                    <span>{item.magazineNumberName} - {t("list-magazine.released-date")}: {new Date(Date.parse(item.releaseDate)).toLocaleDateString()}</span>
                                                </div>
                                                <div id={'row' + item.id} className='flex gap-3 ml-8 hidden pb-3'>
                                                    <table>
                                                        <caption>{t("list-magazine.published-journal")}</caption>
                                                        <tbody>
                                                        {item.journalSet.map(item =>
                                                            <tr key={item.id}>
                                                                <td>ID: {item.id}</td>
                                                                <td>{item.title}</td>
                                                                <td>{item.type}</td>
                                                                <td><a href={item.fileDownloadUrl}>{item.fileName}</a></td>
                                                            </tr>
                                                        )}
                                                        </tbody>
                                                    </table>
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

export default MangazinePublished