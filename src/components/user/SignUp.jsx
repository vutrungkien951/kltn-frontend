import { Alert, Button, Checkbox, Label, Select, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import API, { endpoints } from '../../API';
import { CONFIRM_PASSWORD, DEGREE, EMAIL, EXISTS, FAILED, FAILURE, FIRST_NAME, LAST_NAME, PASSWORD, PHONE, SCIENTIFIC_TITLE, STATUS_200_OK, STATUS_204_NO_CONTENT, SUCCESS, USERNAME, WORK_PLACE } from '../const/data_const';
import MyFooter from './Footer';
import NavBar from './NavBar';

function SignUp() {

    const [t] = useTranslation("common");

    const nav = useNavigate();

    const [signUpMessage, setSignUpMessage] = useState("");

    const handleFormSubmit = (event) => {

        event.preventDefault();

        if(user.confirmPassword !== user.password) {

            alert(t("sign-up-validation.confirmPasswordDoesnotMatch"));
            return false;
        }

        if(user.username === '' || user.username.length > 20) {

            handleValidationFailed(USERNAME);
            return false;
        }

        if(user.password === '' || user.password.length > 20) {

            handleValidationFailed(PASSWORD);
            return false;
        }

        if(user.confirmPassword === '' || user.confirmPassword.length > 20) {

            handleValidationFailed(CONFIRM_PASSWORD);
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
            degree: document.getElementById("degree").value,
            scientificTitle: user.scientificTitle,
            workPlace: user.workplace,
            email: user.email,
            phone: user.phone
        });

        console.log(json);
        API.post(endpoints['register'], json, {
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => {

            if (res.status === STATUS_200_OK) {

                setSignUpMessage(SUCCESS, () => {})
            } else if (res.status === STATUS_204_NO_CONTENT) {

                setSignUpMessage(EXISTS, () => {})
            } else {

                setSignUpMessage(FAILED, () => {})
            }
        })

    }

    const [user, setUser] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        email: "",
        degree: "",
        scientificTitle: "",
        phone: "",
        workplace: "",
    })

    const [userInputColor, setUserInputColor] = useState({
        username: "gray",
        password: "gray",
        confirmPassword: "gray",
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
        confirmPassword: "",
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
    };

    const showResult = () => {
        return (
          <>
            <Alert
              color="danger"
              onDismiss={function onDismiss() { setSignUpMessage('') }}
            >
              <span>
                <span className="text-lg bg-black text-white px-4 py-2 rounded-md">
                  {signUpMessage === SUCCESS ? t("sign-up.sign-up-success") : (signUpMessage === EXISTS ? t("sign-up.sign-up-exists") : t("sign-up.sign-up-failed"))}
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
                <span className='flex justify-center'>
                    {signUpMessage !== '' && showResult()}
                </span>
                <div className='w-full min-h-screen m-auto flex justify-center items-center'>
                    <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 my-2">
                        <h2 className='text-center mt-8 text-2xl uppercase font-bold'>{t("sign-up.title")}</h2>
                        {/* username, password, firstname, lastname, email, degree, scientificTitle, phone, workplace */}
                        <div>
                            <div className="mb-2 block">
                                <Label
                                    htmlFor="username1"
                                    value={t("sign-up.username")}
                                />
                            </div>
                            <TextInput
                                id="username1"
                                type="text"
                                placeholder={t("sign-up.username-placeholder")}
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
                                    htmlFor="password2"
                                    value={t("sign-up.password")}
                                />
                            </div>
                            <TextInput
                                id="password2"
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
                        <div>
                            <div className="mb-2 block">
                                <Label
                                    htmlFor="confirmPassword"
                                    value={t("sign-up.confirmPassword")}
                                />
                            </div>
                            <TextInput
                                id="confirmPassword"
                                type="password"
                                required={true}
                                shadow={true}
                                name='confirmPassword'
                                value={user.confirmPassword}
                                onChange={e => handleChange(e)}
                                color={userInputColor.confirmPassword}
                                helperText={<><span className="font-medium">{userMessageValidation.password}</span>{' '}</>}
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label
                                    htmlFor="firstname1"
                                    value={t("sign-up.first-name")}
                                />
                            </div>
                            <TextInput
                                id="firstname1"
                                type="text"
                                placeholder={t("sign-up.first-name-placeholder")}
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
                                    htmlFor="lastname1"
                                    value={t("sign-up.last-name")}
                                />
                            </div>
                            <TextInput
                                id="lastname1"
                                type="text"
                                placeholder={t("sign-up.last-name-placeholder")}
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
                                    htmlFor="email1"
                                    value={t("sign-up.email")}
                                />
                            </div>
                            <TextInput
                                id="email1"
                                type="email"
                                placeholder={t("sign-up.email")}
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
                                    value={t("sign-up.degree")}
                                />
                            </div>
                            <Select
                                id="degree"
                                required={true}
                                style={{ maxWidth: '1240px' }}
                            >
                                <option>
                                    Học vị tú tài
                                </option>
                                <option>
                                    Cử nhân, kỹ nhân, bác sĩ, dược sĩ...
                                </option>
                                <option>
                                    Thạc sỹ (Master)
                                </option>
                                <option>
                                    Tiến sĩ (Ph.D)
                                </option>
                            </Select>
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label
                                    htmlFor="scientificTitile1"
                                    value={t("sign-up.scientific-title")}
                                />
                            </div>
                            <TextInput
                                id="scientificTitile1"
                                type="text"
                                placeholder={t("sign-up.scientific-title")}
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
                                    htmlFor="workplace1"
                                    value={t("sign-up.organization")}
                                />
                            </div>
                            <TextInput
                                id="workplace1"
                                type="text"
                                placeholder={t("sign-up.organization")}
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
                                    htmlFor="phone1"
                                    value={t("sign-up.phone-number")}
                                />
                            </div>
                            <TextInput
                                id="phone1"
                                type="text"
                                placeholder={t("sign-up.phone-number")}
                                required={true}
                                shadow={true}
                                name='phone'
                                value={user.phone}
                                onChange={e => handleChange(e)}
                                color={userInputColor.phone}
                                helperText={<><span className="font-medium">{userMessageValidation.phone}</span>{' '}</>}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="agree" required />
                            <Label htmlFor="agree">
                                {t("sign-up.accept")}{' '}
                                <a
                                    href="/forms"
                                    className="text-blue-600 hover:underline dark:text-blue-500"
                                >
                                    {t("sign-up.terms-policy")}
                                </a>
                            </Label>
                        </div>
                        <Button type="submit">
                            {t("sign-up.submit")}
                        </Button>
                    </form>
                    <input id="hdnMessage" value={signUpMessage} className="hidden" />
                </div>
                <MyFooter />
            </div>
        </>
    )
}

export default SignUp