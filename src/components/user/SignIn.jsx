import { Alert, Button, Label, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import cookies from 'react-cookies'
import API, { endpoints } from '../../API';
import MyFooter from './Footer';
import NavBar from './NavBar';
import { useTranslation } from 'react-i18next';

function SignIn() {
  const [t] = useTranslation('common');
  const nav = useNavigate();
  const [user, setUser] = useState({
    username: "",
    password: "",
  })
  const [loginMessage, setLoginMessage] = useState('');

  const handleSignInSubmit = async (event) => {
    event.preventDefault();

    const json = JSON.stringify({
      username: user.username,
      password: user.password,
    });
    await API.post(endpoints['login'], json, {
      headers: {
        'Content-Type': 'application/json',
      }
      }).then(res => {
        if (res.status === 202) {
          setLoginMessage("inactive", () => {})
          console.log(loginMessage)
        } else if (res.status === 204) {
          setLoginMessage("failed", () => {})
        } else {
          cookies.save('access_token', res.data.accessToken)
          nav('/')
        }
      }).then(err => {

        setLoginMessage("failed", () => {})
      }
    )

  }

  const handleChange = (e) => {
    let name = e.target.name
    let value = e.target.value
    setUser(prevalue => {
      return {
        ...prevalue,
        [name]: value
      }
    })
  }

  const showFailResult = () => {
    return (
      <>
        <Alert
          color="danger"
          onDismiss={function onDismiss() { setLoginMessage('') }}
        >
          <span>
            <span className="font-medium">
              {loginMessage === "inactive" ? t("login.inactive-message") : t("login.failed-message")}
            </span>
          </span>
        </Alert>
      </>
    )
  }

  return (
    <>
      <div className='m-auto min-h-screen'>
        <NavBar />
        {/* <div>
          <Link to="/" className='py-2 px-2 rounded-sm box-border w-48 flex text-black 
        bg-slate-200 hover:bg-black hover:text-slate-200 duration-300 transition-all'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953l7.108-4.062A1.125 1.125 0 0121 8.688v8.123zM11.25 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953L9.567 7.71a1.125 1.125 0 011.683.977v8.123z" />
            </svg>
            <span className='pl-2'>Trở lại trang chủ</span>
          </Link>
        </div> */}
        <span className='flex justify-center'>
          {loginMessage === 'inactive' && showFailResult()}
          {loginMessage === 'failed' && showFailResult()}
        </span>
        <div className='w-full min-h-[70vh] m-auto flex justify-center items-center'>
          <form onSubmit={handleSignInSubmit} className="flex flex-col gap-4 my-16">
            <div>
              <div>
                <span className='uppercase text-3xl fond-bold'>{t("log-in.title")}</span>
              </div>
              <div className="mb-2 block">
                <Label
                  htmlFor="username1"
                  value={t("log-in.username")}
                />
              </div>
              <TextInput
                id="username1"
                type="text"
                placeholder={t("log-in.username-placeholder")}
                required={true}
                name="username"
                value={user.username}
                onChange={e => handleChange(e)}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label
                  htmlFor="password1"
                  value={t("log-in.password")} />
              </div>
              <TextInput
                id="password1"
                type="password"
                required={true}
                name="password"
                value={user.password}
                onChange={e => handleChange(e)}
              />
            </div>
            <Button type="submit">
              {t("log-in.title")}
            </Button>
          </form>
        </div>
        <MyFooter />
        <input id="hdnMessage" value={loginMessage} className='hidden' />
      </div>
    </>
  )
}

export default SignIn