import React from 'react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import cookie from "react-cookies"
import { useDispatch, useSelector } from "react-redux"
import { authAxios, endpoints } from '../../API'
import { login, logout, setRole, unSetRole } from '../../features/user/userSlice'
import { useTranslation } from 'react-i18next'


const NavBar = () => {
  const [nav, setNav] = useState(false)
  const handleClick = () => setNav(!nav)
  const [t, i18n] = useTranslation('common');

  const user = useSelector(state => state.user.username)
  const dispatch = useDispatch()

  const loadUsername = async () => {
    const res = await authAxios().post(endpoints['nguoidung'])

    console.log(res);
    console.log(res.data.user)
    dispatch(login(res.data.user.username))
    dispatch(setRole(res.data.user.userRole))
  }

  const token = cookie.load('access_token')

  useState(() => {
    loadUsername();
  }, [])

  const handleLogOut = () => {
    cookie.remove('access_token')
    dispatch(logout())
  }

  const NotLoggedInSmall = () => {
    return (
      <>
        <button className='border-none bg-transparent text-white mr-4'><Link to='/sign-in'>{t("home.log-in")}</Link></button>
        <button className='px-8 py-3 text-black'><Link to='/sign-up'>{t("home.sign-up")}</Link></button>
      </>
    )
  }

  const LoggedInSmall = () => {
    return (
      <>
        <button className='border-none bg-transparent text-black mr-4'>{t("home.hello")}, {user}</button>
        <button className='px-8 py-3 text-black' onClick={handleLogOut}>{t("home.log-out")}</button>
      </>
    )
  }

  const NotLoggedInLg = () => {
    return (
      <>
        <button className='border-none bg-transparent text-white mr-4'><Link to='/sign-in'>{t("home.log-in")}</Link></button>
        <button className='px-8 py-3 text-black'><Link to='/sign-up'>{t("home.sign-up")}</Link></button>
      </>
    )
  }

  const LoggedInLg = () => {
    return (
      <>
        <button className='border-none bg-transparent text-white mr-4'><Link to="/management/">{t("home.control-panel")}</Link></button>
        <button className='border-none bg-transparent text-white mr-4'>{t("home.hello")}, {user}</button>
        <button className='px-8 py-3 text-black' onClick={handleLogOut}>{t("home.log-out")}</button>
      </>
    )
  }

  return (
    <div className='w-screen h-[100px] z-10 bg-[#1D559F] text-white drop-shadow-lg'>
      <div className='px-2 flex justify-between items-center w-full h-full'>
        <div className='flex items-center'>
          <h1 className='text-3xl font-bold mr-4 sm:text-4xl'><img src="https://ou.edu.vn/wp-content/uploads/2016/08/Logo.png" alt="" /></h1>
          <ul className='hidden md:flex'>
            <li className='flex gap-2'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <Link to='/' className='hover:text-slate-300'>
                {t('home.home')}
              </Link>
            </li>
            <li><Link to='/' className='hover:text-slate-300'>{t('home.about')}</Link></li>
            <li><Link to='/submission' className='hover:text-slate-300'>{t('home.submit')}</Link></li>
            <li><Link to='/new-magazine' className='hover:text-slate-300'>{t('home.current')}</Link></li>
            <li><Link to='/all-magazine' className='hover:text-slate-300'>{t('home.archives')}</Link></li>
            <li><button className='' onClick={() => i18n.changeLanguage('vi')}>{t("home.VI")}</button></li>
            <li><button className='' onClick={() => i18n.changeLanguage('en')}>{t("home.EN")}</button></li>
          </ul>
        </div>
        <div className='hidden md:flex pr-4'>
          {
            (user === "")
              ? <NotLoggedInLg />
              : <LoggedInLg />
          }
        </div>
        <div className='md:hidden' onClick={handleClick}>
          {!nav ? <MenuIcon className='w-5' /> : <XIcon className='w-5' />}
        </div>
      </div>

      <ul className={!nav ? 'hidden' : 'absolute bg-zinc-200 w-full text-black px-8'}>
        <li className='border-b-2 border-zinc-300 w-full'>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <Link to='/'>
              {t("home.home")}
            </Link>
          </div>
        </li>
        <li className='border-b-2 border-zinc-300 w-full'><Link to='/'>{t("home.about")}</Link></li>
        <li className='border-b-2 border-zinc-300 w-full'><Link to='/submission'>{t("home.submit")}</Link></li>
        <li className='border-b-2 border-zinc-300 w-full'><Link to='/new-magazine'>{t("home.current")}</Link></li>
        <li className='border-b-2 border-zinc-300 w-full'><Link to='/all-magazine'>{t("home.archives")}</Link></li>
        {/* <li className='border-b-2 border-zinc-300 w-full'><Link to='/all-magazine'>VI</Link></li> */}
        {/* <li className='border-b-2 border-zinc-300 w-full'><button onClick={() => i18n.changeLanguage('en')}>EN</button></li> */}
        <div className='flex flex-col my-4'>
          {
            (user === "")
              ? <NotLoggedInSmall />
              : <LoggedInSmall />
          }
        </div>
      </ul>
    </div>
  )
}

export default React.memo(NavBar)
