import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import moment from "moment";
import firebase from "firebase";

function Message({ user, message, key }) {
  const [userLoggedIn] = useAuthState(auth);

  const TypeOfMessage = user === userLoggedIn.email ? Sender : Receiver;

  return (
    <Container>
      <TypeOfMessage>
        {message.message}
        <Timestamp>
          {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
        </Timestamp>
      </TypeOfMessage>
    </Container>
  );
}

export default Message;

const Container = styled.div`
  margin-top: 70px;
`;

const MessageElement = styled.p`
  width: fit-content;
  color: white;
  padding: 15px;
  border-radius: 8px;
  margin: 10px;
  min-width: 80px;
  padding-bottom: 26px;
  position: relative;
  text-align: right;
  font-weight: bold;
`;

const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #50e3c2;
`;

const Receiver = styled(MessageElement)`
  text-align: left;
  background-color: #ff5e82;
`;

const Timestamp = styled.span`
  color: white;
  padding: 10px;
  font-size: 9px;
  position: absolute;
  bottom: 0;
  text-align: right;
  right: 0;
`;
