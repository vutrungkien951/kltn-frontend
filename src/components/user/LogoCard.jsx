import { Card } from 'flowbite-react';
import React from 'react'
import { useTranslation } from 'react-i18next'

function LogoCard(props) {

    const [t] = useTranslation("common");

    return (
        <>
            <div className="max-w-sm mt-6">
                <Card imgSrc="https://js.vnu.edu.vn/img/jcsce.jpg">
                    {/* <Card imgSrc="https://flowbite.com/docs/images/blog/image-1.jpg"> */}
                    <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {t("home.logo-title")}
                    </h5>
                </Card>
            </div>
        </>
    )
}

export default LogoCard