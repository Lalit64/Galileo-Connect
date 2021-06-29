import styled from "styled-components";
import { Avatar } from "@material-ui/core";
import getRecipientEmail from "../utils/getRecipientEmail";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";

function Chat({ id, users }) {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [recipientSnapshot] = useCollection(
    db.collection("users").where("email", "==", getRecipientEmail(users, user))
  );
  const recipientEmail = getRecipientEmail(users, user);
  const recipient = recipientSnapshot?.docs?.[0]?.data();

  const enterChat = () => {
    router.push(`/chat/${id}`);
  };

  return (
    <Container onClick={enterChat}>
      {recipient ? (
        <UserAvatar src={recipientSnapshot?.docs?.[0]?.data().photoURL} />
      ) : (
        <UserAvatar>{recipientEmail[0].toUpperCase()}</UserAvatar>
      )}
      {recipient ? (
        <p>{recipientSnapshot?.docs?.[0]?.data().name}</p>
      ) : (
        <p>{recipientEmail}</p>
      )}
    </Container>
  );
}

export default Chat;

const Container = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 7px;
  word-break: break-word;
  border-radius: 7px;
  margin-bottom: 15px;
  :hover {
    outline: 2px solid #301796;
  }
`;

const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;

//https://youtu.be/svlEVg0To_c?t=7027
