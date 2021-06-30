import styled from "styled-components";
import { auth, db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Chat from "./Chat";
import { Icon } from "./Navbar";

const Sidebar = () => {
  const [user] = useAuthState(auth);

  /* prettier-ignore */
  const userChatRef = db.collection("chats").where("users", "array-contains", user.email);
  const [chatsSnapshot] = useCollection(userChatRef);

  let state = {
    clicked: false,
  };

  const onClick = () => {
    state = {
      clicked: !state.clicked,
    };
    console.log(!1);
  };

  return (
    <div>
      <CoverContainer>
        <Icon onClick={onClick} className={"fa-solid fa-bars "} />
      </CoverContainer>
      <Container
        className={"sidebarContainer"}
        style={{
          display: state.clicked ? "none" : "flex",
          flexDirection: "column",
        }}
      >
        {chatsSnapshot?.docs.map((chat) => (
          <Chat key={chat.id} id={chat.id} users={chat.data().users} />
        ))}
      </Container>
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

//https://youtu.be/svlEVg0To_c?t=7078
