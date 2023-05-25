import React from 'react'
import ChatChannelHeader from './ChatChannelHeader'
import { useAuth } from '../../../hook/useAuth'
import Authenticated from './Authenticated';
import Unauthenticated from './Unauthenticated';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

function ChatChannel() {

  const user = useSelector(state => state.user.username);

  const [t] = useTranslation('common');
  
  return (
      <div id='container'>
        <ChatChannelHeader />
        <div>
          <div className='text-center'>
            <h1>{t("chat-channel.chat-room")}</h1>
            {user !== "" ? <Authenticated /> : <Unauthenticated />}
          </div>
        </div>
      </div>
  );

}

export default ChatChannel