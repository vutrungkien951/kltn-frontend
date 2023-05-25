import {
  Route,
  BrowserRouter,
  Routes
} from "react-router-dom";
import JournalStatus from "./components/manage/author/JournalStatus";
import CreateUserRole from "./components/manage/CreateUserRole";
import EditUserRole from "./components/manage/EditUserRole";
import FormatJournal from "./components/manage/journal/FormatJournal";
import Journal from "./components/manage/journal/Journal";
import JournalDecide from "./components/manage/journal/JournalDecide";
import JournalDecideAfterEdit from "./components/manage/journal/JournalDecideAfterEdit";
import JournalSpec from "./components/manage/journal/JournalSpec";
import JournalSpecSelect from "./components/manage/journal/JournalSpecSelect";
import Review from "./components/manage/journal/Review";
import Magazine from "./components/manage/magazine/Magazine";
import MangazinePublished from "./components/manage/magazine/MangazinePublished";
import Management from "./components/manage/Management";
import UserAndRole from "./components/manage/UserAndRole";
import Home from "./components/user/Home";
import SignIn from "./components/user/SignIn";
import SignUp from "./components/user/SignUp"
import Submission from "./components/user/Submission";
import NewMagazine from "./components/user/NewMagazine";
import AllMagazine from "./components/user/AllMagazine";
import EditUserPassword from "./components/manage/EditUserPassword";
import FormatJournalEditor from "./components/manage/journal/FormatJournalEditor";
import ViewJournalFormatted from "./components/manage/author/ViewJournalFormatted";
import ViewJournal from "./components/user/ViewJournal";
import ChatChannel from "./components/manage/ChatChannel/ChatChannel";
import BasicDocument from "./components/user/BasicDocument";
import ChatRoom from "./components/manage/ChatChannel/ChatRoom";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* route for user and homepage */}
          <Route path='/' element={<Home />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/submission' element={<Submission />} />
          <Route path='/new-magazine' element={<NewMagazine />} />
          <Route path='/all-magazine' element={<AllMagazine />} />
          <Route path='/view-journal/:journalId' element={<ViewJournal />} />
          <Route path='/view-pdf/:journalId' element={<BasicDocument />} />
          {/* route for management page */}
          <Route path="/management/" element={<Management />} />
          <Route path="/management/journal-waiting-handle" element={<Journal />} />
          <Route path="/management/journal-waiting-spec" element={<JournalSpec />} />
          <Route path="/management/journal-waiting-spec/:journalId" element={<JournalSpecSelect />} />
          <Route path="/management/journal-waiting-decide" element={<JournalDecide />} />
          <Route path="/management/journal-waiting-decide-after-edit" element={<JournalDecideAfterEdit />} />
          <Route path="/management/user-role" element={<UserAndRole />} />
          <Route path="/management/edit-user-role/:userId" element={<EditUserRole />} />
          <Route path="/management/create-user-role" element={<CreateUserRole />} />
          <Route path="/management/edit-password" element={<EditUserPassword />} />
          {/* route for review page */}
          <Route path="/management/list-journal-review" element={<Review />} />
          {/* route for magazine page */}
          <Route path="/management/list-magazine" element={<Magazine />} />
          <Route path="/management/list-magazine-published" element={<MangazinePublished />} />
          {/* route for status journal for author */}
          <Route path="/management/status-journals" element={<JournalStatus />} />
          <Route path="/management/view-formatted-journal/:journalId" element={<ViewJournalFormatted />} />
          {/* route for journal accepted before published for editor */}
          <Route path="/management/format-journals" element={<FormatJournal />} />
          {/* route for journal format ckeditor */}
          <Route path="/management/format-journal-process/:journalId" element={<FormatJournalEditor />} />
          {/* route for chat channel */}
          <Route path="/chat-channel" element={<ChatChannel />} />
          {/* route for chat channel room specified */}
          <Route path="/chat-channel/room/:id" element={<ChatRoom />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
