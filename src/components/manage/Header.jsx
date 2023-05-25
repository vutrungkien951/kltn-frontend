import React from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import LanguageIcon from '@mui/icons-material/Language';
import logo from '../../assets/Logo_DH_Mở_TPHCM.png'
import { authAxios, endpoints } from '../../API';
import { login, setRole } from '../../features/user/userSlice';
import cookie from "react-cookies"
import { useTranslation } from 'react-i18next';
import NotificationsIcon from '@mui/icons-material/Notifications';


function Header() {

  const [t, i18n] = useTranslation('common');
  const user = useSelector(state => state.user.username)
  const dispatch = useDispatch()

  const loadUsername = async () => {
    const res = await authAxios().post(endpoints['nguoidung'])

    // console.log(res.data.user.username)
    // dispatch(login(res.data.user.username))
    dispatch(login(res.data.user.username))
    dispatch(setRole(res.data.user.userRole))
  }

  const token = cookie.load('access_token')

  if (user === "" && token != null) {
    loadUsername()
  }

  return (
    <>
      {/* header */}
      <div className='bg-[#4f536b] min-h-14 flex justify-between items-center text-[#bde0a1] w-full h-full'>
        {/* company name */}
        <div className='mx-4 flex'>
          <img width={75} src={logo} alt="logo" className='block md:hidden' />
          <span className='uppercase text-xl hidden md:flex'>{t("control-panel.header")}</span>
        </div>
        {/* right header */}
        <div className='mx-4 flex justify-center items-center gap-8'>
          <div className='py-4 cursor-pointer hover:bg-white hover:font-bold hover:text-[#4f536b] transition-all duration-300'>
            <Link to="/chat-channel">
              <NotificationsIcon></NotificationsIcon>
              <span className='ml-2'>{t("control-panel.notification")}</span>
            </Link>
          </div>
          <div onClick={() => i18n.changeLanguage('vi')} className='py-4 cursor-pointer hover:bg-white hover:font-bold hover:text-[#4f536b] transition-all duration-300'>
            <LanguageIcon></LanguageIcon>
            <span className='ml-2'>{t("control-panel.VI")}</span>
          </div>
          <div onClick={() => i18n.changeLanguage('en')} className='py-4 cursor-pointer hover:bg-white hover:font-bold hover:text-[#4f536b] transition-all duration-300'>
            <LanguageIcon></LanguageIcon>
            <span className='ml-2'>{t("control-panel.EN")}</span>
          </div>
          {/* Xem trang web */}
          <div className='py-4 cursor-pointer hover:bg-white hover:font-bold hover:text-[#4f536b] transition-all duration-300'>
            <Link to="/">
              <VisibilityIcon />
              <span className='ml-2'>{t("control-panel.view-webpage")}</span>
            </Link>
          </div>
          {/* User */}
          <div className='ml-8'>
            <PersonIcon />
            <span className='ml-2'>{user}</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header