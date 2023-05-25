import React from 'react'
import { useSelector } from 'react-redux';
import { useMessages } from '../../../hook/useMessages'

function MessageList({ roomId }) {
    const containerRef = React.useRef(null);
    const messages = useMessages(roomId);
    const user = useSelector(state => state.user.username);

    React.useLayoutEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    });

    return (
        <div className="message-list-container h-[340px] overflow-y-scroll" ref={containerRef}>
            <ul className="message-list overflow-hidden break-all">
                {messages.map((x) => (
                    <Message
                        key={x.id}
                        message={x}
                        isOwnMessage={x.uid === user}
                    />
                ))}
            </ul>
        </div>
    );
}

function Message({ message, isOwnMessage }) {
    const { displayName, text, timestamp } = message;
    return (
        <li className={['message', isOwnMessage && 'own-message'].join(' ')}>
            <h4 className="sender">{isOwnMessage ? 'You' : displayName} - {timestamp.toDate().toDateString()}</h4>
            <div>{text}</div>
        </li>
    );
}

export default MessageList