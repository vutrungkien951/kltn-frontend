import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import VisibilityIcon from '@mui/icons-material/Visibility';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';
import Logo from '../../../assets/Logo_DH_Mở_TPHCM.png';
import { useDispatch, useSelector } from 'react-redux';
import cookie from "react-cookies"
import { login, logout, setRole, unSetRole } from '../../../features/user/userSlice'
import { authAxios, endpoints } from '../../../API';

function ChatChannelHeader() {
    const [t, i18n] = useTranslation("common");

    const user = useSelector(state => state.user.username)
    const dispatch = useDispatch()

    const loadUsername = async () => {

        const res = await authAxios().post(endpoints['nguoidung'])

        dispatch(setRole(res.data.user.userRole))
        dispatch(login(res.data.user.username))
    }

    const token = cookie.load('access_token')

    if (user === "" && token != null) {
        loadUsername()
    }

    const handleLogout = () => {
        cookie.remove('access_token')
        dispatch(logout())
    }

    return (
        <div className='bg-slate-300 flex justify-between items-center h-16'>
            <div className='mx-4 h-24'>
                <img src={Logo} className="h-full" alt="logo" style={{objectFit: 'cover'}}></img>
            </div>
            <div className='flex justify-center gap-3 mx-2'>
                <div onClick={() => i18n.changeLanguage('vi')} className='flex items-center py-4 cursor-pointer hover:bg-white hover:font-bold hover:text-[#4f536b] transition-all duration-300'>
                    <LanguageIcon></LanguageIcon>
                    <span className='ml-2'>{t("control-panel.VI")}</span>
                </div>
                <div onClick={() => i18n.changeLanguage('en')} className='flex items-center py-4 cursor-pointer hover:bg-white hover:font-bold hover:text-[#4f536b] transition-all duration-300'>
                    <LanguageIcon></LanguageIcon>
                    <span className='ml-2'>{t("control-panel.EN")}</span>
                </div>
                {/* Xem trang web */}
                <div className=' py-4 cursor-pointer hover:bg-white hover:font-bold hover:text-[#4f536b] transition-all duration-300'>
                    <Link to="/" className='flex items-center'>
                        <VisibilityIcon />
                        <span className='ml-2'>{t("control-panel.view-webpage")}</span>
                    </Link>
                </div>
            </div>
            <div className='mr-4'>
                <div id="btnLgout" onClick={handleLogout} className='py-2 px-3 rounded-lg cursor-pointer text-gray-800 bg-cyan-400'>
                    <span>{t('home.log-out')}</span>
                </div>
            </div>
        </div>
    )
}

export default React.memo(ChatChannelHeader)