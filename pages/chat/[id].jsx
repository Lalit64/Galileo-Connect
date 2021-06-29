import styled from "styled-components";
import Head from "next/head";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import ChatScreen from "../../components/ChatScreen";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import getRecipientEmail from "../../utils/getRecipientEmail";
import { useCollection } from "react-firebase-hooks/firestore";

const Chat = ({ chat, messages }) => {
  const [user] = useAuthState(auth);
  const [recipientSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getRecipientEmail(chat.users, user))
  );
  const recipientEmail = getRecipientEmail(chat.users, user);
  const recipient = recipientSnapshot?.docs?.[0]?.data();

  return (
    <Container>
      <Head>
        <title>
          Chat with{" "}
          {recipient ? recipient?.name : getRecipientEmail(chat.users, user)}
        </title>
      </Head>
      <Navbar />
      <Sidebar />
      <ChatContainer>
        <ChatScreen chat={chat} messages={messages} />
      </ChatContainer>
    </Container>
  );
};

export default Chat;

export async function getServerSideProps(context) {
  const ref = db.collection("chats").doc(context.query.id);
  //prettier-ignore
  const messageRes = await ref.collection("messages").orderBy('timestamp', 'asc').get()

  //prettier-ignore
  const messages = messageRes.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })).map(messages => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime()
  }));
  const chatRes = await ref.get();
  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  };

  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat,
    },
  };
}

const Container = styled.div`
  display: flex;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;
`;
