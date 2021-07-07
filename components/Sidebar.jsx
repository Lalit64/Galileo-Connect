import styled from "styled-components";
import { auth, db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Chat from "./Chat";
import { Icon } from "./Navbar";
import { useState } from "react";

const Sidebar = () => {
  const [user] = useAuthState(auth);

  const [clicked, setClicked] = useState(true);

  const onClick = () => {
    setClicked(!clicked);
  };

  /* prettier-ignore */
  const userChatRef = db.collection("chats").where("users", "array-contains", user.email);
  const [chatsSnapshot] = useCollection(userChatRef);

  return (
    <div>
      <CoverContainer>
        <Icon onClick={onClick} className={"fa-solid fa-bars "} />
      </CoverContainer>
      <div>
        {clicked && (
          <Container className={"sidebarContainer"}>
            {chatsSnapshot?.docs.map((chat) => (
              <Chat key={chat.id} id={chat.id} users={chat.data().users} />
            ))}
          </Container>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

const Container = styled.div``;

const CoverContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  min-width: 350px;
  max-width: 350px;
  height: 80px;
  position: absolute;
  top: 64px;
  background: white;
`;
