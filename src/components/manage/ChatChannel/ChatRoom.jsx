import React from 'react'
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { chatRooms } from '../../../data/chatRoom';
import ChatChannelHeader from './ChatChannelHeader';
import MessageInput from './MessageInput';
import MessageList from './MessageList';

function ChatRoom() {

  const params = useParams();

  const [t] = useTranslation('common');

  const room = chatRooms.find((x) => x.id === params.id);

  if (!room) {
    // TODO: 404
  }

    return (
      <>
          <div id='container'>
          <ChatChannelHeader />
          <div>
            <div className='text-center my-4'>
              <h2>{room.title}</h2>
              <div>
                  <Link to="/chat-channel">⬅️ {t("chat-channel.back-to-all-room")}</Link>
              </div>
            </div>
            <div className='flex justify-center'>
              <div className='border-black border-solid border-2 w-5/12 h-96'>
                <MessageInput roomId={room.id} />
                <MessageList roomId={room.id} />
              </div>
            </div>
          </div>
        </div>
      </>
    )
}

export default ChatRoom