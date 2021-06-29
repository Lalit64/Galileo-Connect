import styled from "styled-components";
import { auth, db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Chat from "./Chat";

const Sidebar = () => {
  const [user] = useAuthState(auth);

  /* prettier-ignore */
  const userChatRef = db.collection("chats").where("users", "array-contains", user.email);
  const [chatsSnapshot] = useCollection(userChatRef);

  return (
    <div>
      <CoverContainer />
      <Container>
        {chatsSnapshot?.docs.map((chat) => (
          <Chat key={chat.id} id={chat.id} users={chat.data().users} />
        ))}
      </Container>
    </div>
  );
};

export default Sidebar;

const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid #e7e8e8;
  height: calc(100vh - 144px);
  min-width: 350px;
  max-width: 350px;
  overflow-y: scroll;
  padding: 8px;
  background: white;

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
  position: absolute;
  top: 144px;
`;

const CoverContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 350px;
  max-width: 350px;
  height: 80px;
  position: absolute;
  top: 64px;
  background: white;
`;

//https://youtu.be/svlEVg0To_c?t=7078
