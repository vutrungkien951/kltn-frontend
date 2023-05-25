import React from 'react'
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { chatRooms, chatAuthor, chatReviewer, chatEditor } from '../../../data/chatRoom';
import { ROLE_ADMIN, ROLE_AUTHOR, ROLE_EDITOR, ROLE_REVIEWER } from '../../const/data_const';

function Authenticated() {

    const userRole = useSelector(state => state.user.userRole);

    const [t] = useTranslation('common');

    var listRoomChat = [];

    if (userRole === ROLE_ADMIN){
      listRoomChat = chatRooms;
    } else if (userRole === ROLE_AUTHOR) {
      listRoomChat = chatAuthor;
    } else if (userRole === ROLE_EDITOR) {
      listRoomChat = chatEditor;
    } else if (userRole === ROLE_REVIEWER) {
      listRoomChat = chatReviewer;
    }

    return (
      <>
        <h2>{t("chat-channel.choose-chat-room")}</h2>
          <div className='mx-16 mt-4'>
              <ul className="chat-room-list grid grid-cols-2 gap-4">
                  {listRoomChat.map((room) => (
                      <Link className="bg-slate-500 rounded-lg text-white" to={`/chat-channel/room/${room.id}`}>
                        <li key={room.id}>
                            {room.title}
                        </li>
                      </Link>
                  ))}
              </ul>
          </div>
      </>
    )
}

export default Authenticated