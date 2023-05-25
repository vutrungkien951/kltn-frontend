import React from 'react'
import { Link } from 'react-router-dom'
import { login, setRole } from '../../features/user/userSlice';
import cookie from "react-cookies"
import { useDispatch, useSelector } from 'react-redux';
import { authAxios, endpoints } from '../../API'
import { useTranslation } from 'react-i18next';
import { PanelStatsIcon } from 'evergreen-ui';

function Slidebar() {

    const role = useSelector(state => state.user.userRole)
    const dispatch = useDispatch()
    const loadUsername = async () => {
        const res = await authAxios().post(endpoints['nguoidung'])

        dispatch(setRole(res.data.user.userRole))
        dispatch(login(res.data.user.username))
    }
    const [t] = useTranslation("common");

    const token = cookie.load('access_token')

    if (role === "" && token != null) {
        loadUsername()
    }

    if (role === 'ROLE_AUTHOR') {
        return (
            <>
                <div className="absolute min-h-full bg-[#171e22] w-[251px] font-normal leading-5 text-lg transition-all duration-500 ease-linear float-left text-gray-300">
                    <div className='px-4 py-4 box-border hover:font-bold'>
                        <span><Link to="/management/status-journals">{t("control-panel.my-journals")}</Link></span>
                    </div>
                    <div className='px-4 py-4 box-border hover:font-bold'>
                        <span><Link to="/management/edit-password">{t("control-panel.edit-user-password")}</Link></span>
                    </div>
                </div>
            </>
        )
    } else if (role === 'ROLE_EDITOR') {
        return (
            <>
                <div className="absolute min-h-full bg-[#171e22] w-[251px] font-normal leading-5 text-lg transition-all duration-500 ease-linear float-left text-gray-300">
                    <div className='px-4 py-4 box-border hover:font-bold'>
                        <span><Link to="/management/journal-waiting-handle">{t("control-panel.journals")}</Link></span>
                    </div>
                    <div className='px-4 py-4 box-border hover:font-bold'>
                        <span><Link to="/management/format-journals">{t("control-panel.edit-last-time-journal")}</Link></span>
                    </div>
                    <div className='px-4 py-4 box-border hover:font-bold'>
                        <span><Link to="/management/list-magazine">{t("control-panel.magazine-number")}</Link></span>
                    </div>
                    <div className='px-4 py-4 box-border hover:font-bold'>
                        <span><Link to="/management/edit-password">{t("control-panel.edit-user-password")}</Link></span>
                    </div>
                </div>
            </>
        )
    } else if (role === 'ROLE_REVIEWER') {
        return (
            <>
                <div className="absolute min-h-full bg-[#171e22] w-[251px] font-normal leading-5 text-lg transition-all duration-500 ease-linear float-left text-gray-300">
                    <div className='px-4 py-4 box-border hover:font-bold'>
                        <span><Link to="/management/list-journal-review">{t("control-panel.review")}</Link></span>
                    </div>
                    <div className='px-4 py-4 box-border hover:font-bold'>
                        <span><Link to="/management/edit-password">{t("control-panel.edit-user-password")}</Link></span>
                    </div>
                </div>
            </>
        )
    } else if (role === 'ROLE_ADMIN') {
        return (
            <>
                <div className="absolute min-h-full bg-[#171e22] w-[251px] font-normal leading-5 text-lg transition-all duration-500 ease-linear float-left text-gray-300">
                    <div className='px-4 py-4 box-border hover:font-bold'>
                        <span><Link to="/management/journal-waiting-handle">{t("control-panel.journals")}</Link></span>
                    </div>
                    <div className='px-4 py-4 box-border hover:font-bold'>
                        <span><Link to="/management/format-journals">{t("control-panel.edit-last-time-journal")}</Link></span>
                    </div>
                    <div className='px-4 py-4 box-border hover:font-bold'>
                        <span><Link to="/management/list-magazine">{t("control-panel.magazine-number")}</Link></span>
                    </div>
                    <div className='px-4 py-4 box-border hover:font-bold'>
                        <span><Link to='/management/user-role'>{t("control-panel.user-management")}</Link></span>
                    </div>
                    <div className='px-4 py-4 box-border hover:font-bold'>
                        <span><Link to="/management/edit-password">{t("control-panel.edit-user-password")}</Link></span>
                    </div>
                </div>
            </>
        )
    }
}

export default Slidebar