import { Spinner } from 'flowbite-react'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import API, { endpoints } from '../../API'
import { STATUS_200_OK } from '../const/data_const'
import MyFooter from './Footer'
import LogoCard from './LogoCard'
import NavBar from './NavBar'

function NewMagazine() {

    const [magazineReleased, setMagazineReleased] = useState([]);

    const [loading, setLoading] = useState(true);

    const [t] = useTranslation('common');

    useEffect(() => {

        setLoading(true);

        API.get(endpoints['magazine-released-pagination'](0)).then((res) => {

            if(res.status === STATUS_200_OK) {

                setMagazineReleased(res.data.content);
            }

            setLoading(false);
        }
        ).catch(err => console.log(err));
    }, []);

    if (loading === true) {
        return (
            <>
                <Spinner />
            </>
        )
    } else {
        return (
            <>
                <div className='m-auto min-h-screen'>
                    <NavBar />
                    <div className='wrapperContent mx-6 lg:mx-16 my-2 text-base'>
                        <span className='font-bold'>Tạp chí khoa học Trường Đại học Mở TP Hồ Chí Minh
                            là một dịch vụ cho phép độc giả tiếp cận tri thức khoa học được xuất bản tại Trường.<br />
                            Để biết thêm thông tin và cách thức tham gia dịch vụ, vui lòng tham khảo tại trang Giới thiệu.
                        </span>
                        {/* card */}
                        <div className="max-w-sm mt-6">
                            <LogoCard />
                            <p className="font-bold text-xl text-gray-700 dark:text-gray-400 mt-4">
                                {magazineReleased[0].magazineNumberName}
                            </p>
                            <p className="font-bold text-xl text-gray-700 dark:text-gray-400">
                                {t("home.released-date")}: {new Date(Date.parse(magazineReleased[0].releaseDate)).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            {
                                magazineReleased[0].journalSet.map((item) => <>
                                    <div className='mt-2'>{item.title}</div>
                                    <div className='mt-2'>{item.listAuthor}</div>
                                    <span className='mt-2 px-4 py-2 rounded-md border border-cyan-300 hover:bg-cyan-300 flex justify-center items-center w-24'>
                                        <Link to={'/view-journal/' + item.id} state={ {magazineId : magazineReleased[0].id } } >
                                            <span>{t("home.view")}</span>
                                        </Link>
                                    </span>
                                </>
                                )
                            }
                        </div>
                    </div>

                    <MyFooter />
                </div>
            </>
        )
    }
}

export default NewMagazine