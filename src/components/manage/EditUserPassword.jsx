import { Button, Label, Select, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import API, { authAxios, endpoints } from '../../API';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Slidebar from './Slidebar';
import zIndex from '@mui/material/styles/zIndex';
import { use } from 'i18next';
import { useTranslation } from 'react-i18next';
import { STATUS_200_OK } from "../const/data_const"

function EditUserPassword() {

    const nav = useNavigate();
    const [user, setUser] = useState({
        newPasswordConfirmed: "",
        newPassword: "",
    })
    const [t] = useTranslation("common");

    const handleFormSubmit = (event) => {
        event.preventDefault();

        if (user.newPassword !== user.newPasswordConfirmed) {
            alert("New password doesn't match");
        } else {
            const json = JSON.stringify({
                newPasswordConfirmed: user.newPasswordConfirmed,
                newPassword: user.newPassword
            });

            authAxios().post(endpoints['update-password'], json, {
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(res => {
                console.log(res)

                if (res.status === STATUS_200_OK) {
                    
                    alert(t("edit-user-password.message-change-password-success"))
                    nav('/management')
                } else {
                    alert(t("edit-user-password.message-change-password-failed"))
                }
            })
            
        }


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
                        <h2 className='text-center mt-8 text-2xl uppercase font-bold'>{t("edit-user-password.header")}</h2>
                        <div className='w-full min-h-screen m-auto flex justify-center'>
                            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 my-6">
                                {/* change password */}
                                <div>
                                    <div className="mb-2 block">
                                        <Label
                                            htmlFor="newPassword"
                                            value={t("edit-user-password.new-password")}
                                        />
                                    </div>
                                    <div className='flex justify-center items-center'>
                                        <TextInput
                                            id="newPassword"
                                            type="password"
                                            placeholder={t("edit-user-password.new-password-placeholder")}
                                            required={true}
                                            shadow={true}
                                            value={user.newPassword}
                                            name='newPassword'
                                            onChange={e => handleChange(e)}
                                            pattern=".{8,100}"
                                            size="20"
                                        />
                                        <div className='ml-2'>
                                            <span className='cursor-pointer' onClick={() => {
                                                let inputElementPassword = document.getElementById("newPassword");
                                                if (inputElementPassword.type === "password") {
                                                    inputElementPassword.type = "text";
                                                } else {
                                                    inputElementPassword.type = "password";
                                                }
                                            }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-2 block">
                                        <Label
                                            htmlFor="newPasswordConfirmed"
                                            value={t("edit-user-password.new-password-confirm")}
                                        />
                                    </div>
                                    <TextInput
                                        id="newPassword"
                                        type="password"
                                        placeholder={t("edit-user-password.new-password-confirm-placeholder")}
                                        required={true}
                                        shadow={true}
                                        value={user.newPasswordConfirmed}
                                        name='newPasswordConfirmed'
                                        onChange={e => handleChange(e)}
                                        pattern=".{8,100}"

                                    />
                                </div>
                                <div className='bg-slate-500 border-b-2 text-center rounded-md'>
                                    <input type="submit" className='cursor-pointer text-white' value={t("edit-user-password.submit")}/>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditUserPassword