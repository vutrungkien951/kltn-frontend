import React from 'react';
import { useTranslation } from 'react-i18next';

function Unauthenticated() {

    const [t] = useTranslation("common");

    return (
        <>
            <h1>{t("chat-channel.message-unauthenticated")}</h1>
        </>
    );
}

export default Unauthenticated