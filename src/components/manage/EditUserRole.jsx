import { Button, Label, Select, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import API, { endpoints } from '../../API';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DEGREE, EMAIL, FAILURE, FIRST_NAME, LAST_NAME, PASSWORD, PHONE, ROLE_AUTHOR, ROLE_EDITOR, ROLE_REVIEWER, SCIENTIFIC_TITLE, STATUS_200_OK, USERNAME, WORK_PLACE } from '../const/data_const';

function EditUserRole() {

    const { userId } = useParams();
    const nav = useNavigate();
    const [t] = useTranslation("common");

    const [user, setUser] = useState({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        degree: "",
        scientificTitle: "",
        phone: "",
        workplace: "",
    })


    useEffect(() => {
        API.get(endpoints['get-user-info-by-id'](userId)).then(res => {
            setUser(res.data);
            console.log(res.data);
        }
        ).catch(err => console.log(err));
    }, [userId]);

    const handleFormSubmit = (event) => {

        event.preventDefault();

        if(user.username === '' || user.username.length > 20) {

            handleValidationFailed(USERNAME);
            return false;
        }

        if(user.password === '' || user.password.length > 20) {

            handleValidationFailed(PASSWORD);
            return false;
        }

        if(user.firstName === '' || user.firstName.length > 40) {

            handleValidationFailed(FIRST_NAME);
            return false;
        }

        if(user.lastName === '' || user.lastName.length > 40) {

            handleValidationFailed(LAST_NAME);
            return false;
        }

        if(user.degree === '' || user.degree.length > 50) {

            handleValidationFailed(DEGREE);
            return false;
        }

        if(user.scientificTitle === '' || user.scientificTitle.length > 50) {

            handleValidationFailed(SCIENTIFIC_TITLE);
            return false;
        }

        if(user.workplace === '' || user.workplace.length > 150) {
            
            handleValidationFailed(WORK_PLACE);
            return false;
        }

        if(user.email === '' || user.email.length > 100) {

            handleValidationFailed(EMAIL);
            return false;
        }

        if(user.phone === '' || user.phone.length > 20) {

            handleValidationFailed(PHONE);
            return false;
        }

        const json = JSON.stringify({
            username: user.username,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName,
            degree: user.degree,
            scientificTitle: user.scientificTitle,
            workPlace: user.workplace,
            email: user.email,
            phone: user.phone,
            userRole: document.getElementById('roles').value
        });

        API.post(endpoints['create-user-role'], json, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => {

            // console.log(res.data)
            if (res.status === STATUS_200_OK) {

                nav('/management')
            } else {

                alert("xxx")
            }
        })
    }

    const [userInputColor, setUserInputColor] = useState({
        username: "gray",
        password: "gray",
        firstName: "gray",
        lastName: "gray",
        email: "gray",
        degree: "gray",
        scientificTitle: "gray",
        phone: "gray",
        workplace: "gray",
    })

    const [userMessageValidation, setUserMessageValidation] = useState({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        degree: "",
        scientificTitle: "",
        phone: "",
        workplace: "",
    })

    const handleValidationFailed = (name) => {

        let value = FAILURE;

        setUserInputColor(prevalue => {
            return {
                ...prevalue,
                [name]: value
            }
        })

        setUserMessageValidation(prevalue => {

            return {
                ...prevalue,
                [name] : t("sign-up-validation."+name)
            }
        })
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
            <div>
                <Button onClick={() => nav(-1)} className='py-2 px-2 rounded-sm box-border flex text-black 
                bg-slate-200 hover:bg-black hover:text-slate-200 duration-300 transition-all'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953l7.108-4.062A1.125 1.125 0 0121 8.688v8.123zM11.25 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953L9.567 7.71a1.125 1.125 0 011.683.977v8.123z" />
                    </svg>
                    <span className='pl-2'>{t("user-role.back")}</span>
                </Button>
            </div>
            <h2 className='text-center mt-8 text-2xl uppercase font-bold'>{t("user-role.edit-user")}</h2>
            <div className='w-full min-h-screen m-auto flex justify-center items-center'>
                <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 my-6">
                    {/* username, password, firstname, lastname, email, degree, scientificTitle, phone, workplace */}
                    <div>
                        <div className="mb-2 block">
                            <Label
                                htmlFor="username"
                                value={t("user-role.username")}
                            />
                        </div>
                        <TextInput
                            id="username"
                            type="text"
                            placeholder={t("user-role.username-placeholder")}
                            required={true}
                            shadow={true}
                            value={user.username}
                            name='username'
                            onChange={e => handleChange(e)}
                            color={userInputColor.username}
                            helperText={<><span className="font-medium">{userMessageValidation.username}</span>{' '}</>}
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label
                                htmlFor="password"
                                value={t("user-role.password")}
                            />
                        </div>
                        <TextInput
                            id="password"
                            type="password"
                            required={true}
                            shadow={true}
                            name='password'
                            value={user.password}
                            onChange={e => handleChange(e)}
                            color={userInputColor.password}
                            helperText={<><span className="font-medium">{userMessageValidation.password}</span>{' '}</>}
                        />
                    </div>
                    <Select
                        id="roles"
                        required={true}
                    >
                        <option>
                            {ROLE_EDITOR}
                        </option>
                        <option>
                            {ROLE_REVIEWER}
                        </option>
                        <option>
                            {ROLE_AUTHOR}
                        </option>
                    </Select>
                    <div>
                        <div className="mb-2 block">
                            <Label
                                htmlFor="firstname"
                                value={t("user-role.firstname")}
                            />
                        </div>
                        <TextInput
                            id="firstname"
                            type="text"
                            placeholder={t("user-role.firstname-placeholder")}
                            required={true}
                            shadow={true}
                            name='firstName'
                            value={user.firstName}
                            onChange={e => handleChange(e)}
                            color={userInputColor.firstName}
                            helperText={<><span className="font-medium">{userMessageValidation.firstName}</span>{' '}</>}
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label
                                htmlFor="lastname"
                                value={t("user-role.lastname")}
                            />
                        </div>
                        <TextInput
                            id="lastname"
                            type="text"
                            placeholder={t("user-role.lastname-placeholder")}
                            required={true}
                            shadow={true}
                            name='lastName'
                            value={user.lastName}
                            onChange={e => handleChange(e)}
                            color={userInputColor.lastName}
                            helperText={<><span className="font-medium">{userMessageValidation.lastName}</span>{' '}</>}
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label
                                htmlFor="email"
                                value={t("user-role.email")}
                            />
                        </div>
                        <TextInput
                            id="email"
                            type="email"
                            placeholder={t("user-role.email-placeholder")}
                            required={true}
                            shadow={true}
                            name='email'
                            value={user.email}
                            onChange={e => handleChange(e)}
                            color={userInputColor.email}
                            helperText={<><span className="font-medium">{userMessageValidation.email}</span>{' '}</>}
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label
                                htmlFor="degree"
                                value={t("user-role.degree")}
                            />
                        </div>
                        <TextInput
                            id="degree"
                            type="text"
                            placeholder={t("user-role.degree-placeholder")}
                            required={true}
                            shadow={true}
                            name='degree'
                            value={user.degree}
                            onChange={e => handleChange(e)}
                            color={userInputColor.degree}
                            helperText={<><span className="font-medium">{userMessageValidation.degree}</span>{' '}</>}
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label
                                htmlFor="scientificTitile"
                                value={t("user-role.scientific-title")}
                            />
                        </div>
                        <TextInput
                            id="scientificTitile"
                            type="text"
                            placeholder={t("user-role.scientific-title-placeholder")}
                            required={true}
                            shadow={true}
                            name='scientificTitle'
                            value={user.scientificTitle}
                            onChange={e => handleChange(e)}
                            color={userInputColor.scientificTitle}
                            helperText={<><span className="font-medium">{userMessageValidation.scientificTitle}</span>{' '}</>}
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label
                                htmlFor="workplace"
                                value={t("user-role.organization")}
                            />
                        </div>
                        <TextInput
                            id="workplace"
                            type="text"
                            placeholder={t("user-role.organization-placeholder")}
                            required={true}
                            shadow={true}
                            name='workplace'
                            value={user.workplace}
                            onChange={e => handleChange(e)}
                            color={userInputColor.workplace}
                            helperText={<><span className="font-medium">{userMessageValidation.workplace}</span>{' '}</>}
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label
                                htmlFor="phone"
                                value={t("user-role.phone")}
                            />
                        </div>
                        <TextInput
                            id="phone"
                            type="text"
                            placeholder={t("user-role.phone-placeholder")}
                            required={true}
                            shadow={true}
                            name='phone'
                            value={user.phone}
                            onChange={e => handleChange(e)}
                            color={userInputColor.phone}
                            helperText={<><span className="font-medium">{userMessageValidation.phone}</span>{' '}</>}
                        />
                    </div>
                    <Button type="submit">
                        {t("user-role.edit-user")}
                    </Button>
                </form>
            </div>
        </>
    )
}

export default EditUserRole