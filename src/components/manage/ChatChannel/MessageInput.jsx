import React from 'react'
import { useState } from 'react';
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux';
import { sendMessage } from "../../../service/firebase"

function MessageInput(props) {

    const [t] = useTranslation("common");
    const [value, setValue] = useState("");
    const user = useSelector(state => state.user);
    const roomId = props.roomId;

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        sendMessage(roomId, user, value);
        setValue('');
    };

    return (
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded flex justify-center gap-5">
                <input
                    type="text"
                    placeholder={t("chat-channel.message-input-placeholder")}
                    value={value}
                    onChange={handleChange}
                    className="rounded-lg"
                    required
                    minLength={1}
                />
                <button type="submit" disabled={value < 1} className="bg-slate-600 px-5">
                    {t("chat-channel.message-input-send")}
                </button>
            </form>
    )
}

export default MessageInput