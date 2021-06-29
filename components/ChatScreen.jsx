import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { Avatar, Button } from "@material-ui/core";
import { Icon } from "./Navbar";
import { useCollection } from "react-firebase-hooks/firestore";
import "../styles/config";
import Message from "./Message";
import { useRef, useState, useReducer, Suspense } from "react";
import firebase from "firebase";
import { Picker } from "emoji-mart";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react";

const ChatScreen = ({ chat, messages }) => {
  const [user] = useAuthState(auth);
  const [input, setInput] = useState("");
  const [pickerOpen, togglePicker] = useReducer((state) => !state, false);
  const router = useRouter();
  const endOfMessageRef = useRef(null);
  const [messagesSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );
  const [recipientSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getRecipientEmail(chat.users, user))
  );
  const recipientEmail = getRecipientEmail(chat.users, user);
  const recipient = recipientSnapshot?.docs?.[0]?.data();

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };

  const onEmojiClick = (emoji) => {
    setInput(input + "‌" + emoji.native);
  };

  const ScrollToBottom = () => {
    endOfMessageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
    });

    setInput("");
    ScrollToBottom();
  };

  return (
    <Container>
      <Header>
        {recipient ? (
          <Avatar src={user.photoURL} />
        ) : (
          <Avatar>{recipientEmail[0].toUpperCase()}</Avatar>
        )}

        <HeaderInformation>
          {recipient ? <h3>{recipient.name}</h3> : <h3>{recipientEmail}</h3>}
          {recipientSnapshot ? (
            <p>
              Last seen:{" "}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p>Loading...</p>
          )}
        </HeaderInformation>
        <HeaderIcons>
          <Button
            style={{
              maxWidth: "2px",
              maxHeight: "2px",
              minWidth: "30px",
              minHeight: "30px",
            }}
          >
            <Icon
              className="fas fa-paperclip"
              style={{ color: "#2f1695", fontSize: "1rem" }}
            />
          </Button>
          <Button
            style={{
              maxWidth: "2px",
              maxHeight: "2px",
              minWidth: "30px",
              minHeight: "30px",
              marginLeft: 10,
              marginRight: 20,
            }}
          >
            <Icon
              className="fas fa-ellipsis-v"
              style={{ color: "#2f1695", fontSize: "1rem" }}
            />
          </Button>
        </HeaderIcons>
      </Header>

      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={endOfMessageRef} />
      </MessageContainer>

      <OuterContainer>
        <EmojiPickerContainer>
          {pickerOpen && (
            <Suspense fallback={<p id="loading">Loading...</p>}>
              <Picker
                color="#128c7e"
                emoji="grinning"
                title="Chose an Emoji"
                onSelect={onEmojiClick}
                native="true"
              />
            </Suspense>
          )}
        </EmojiPickerContainer>
        <InputContainer>
          <Icon
            className="far fa-grin"
            style={{ cursor: "pointer", color: "gray" }}
            onClick={togglePicker}
          />
          <Input value={input} onChange={(e) => setInput(e.target.value)} />
          <button
            style={{
              background: "#2f1695",
              border: "none",
              marginRight: 15,
              padding: 10,
              paddingLeft: 20,
              paddingRight: 20,
              borderTopRightRadius: 4,
              borderBottomRightRadius: 4,
            }}
            disabled={!input}
            type="submit"
            onClick={sendMessage}
          >
            <Icon
              className="fad fa-sign-out-alt"
              style={{ color: "#ededed", fontSize: "1.3rem" }}
            />
          </button>
        </InputContainer>
      </OuterContainer>
    </Container>
  );
};

export default ChatScreen;

const Container = styled.div`
  position: relative;
  margin-left: 350px;
  top: 64px;
  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Header = styled.div`
  position: fixed;
  background: white;
  width: calc(100vw - 350px);
  z-index: 100;
  top: 64px;
  display: flex;
  padding: 11px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid #e7e8e8;
  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3 {
    margin-bottom: 3px;
  }

  > p {
    font-size: 14px;
    color: gray;
  }
  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
  padding: 30px;
  background-color: #f7f9fb;
  min-height: 100vh;
  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const EndOfMessage = styled.div``;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Input = styled.input`
  border: none;
  flex: 1;
  background: #edf2f7;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  height: 40px;
  font-weight: 300;
  padding: 20px;
  line-height: 40;
  font-size: 1rem;
  color: #8a94a6;
  margin-left: 15px;

  :focus {
    outline: none;
  }
  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const EmojiPickerContainer = styled.div`
  position: absolute;
  bottom: 100px;
  left: 50px;
`;

const OuterContainer = styled.div`
  position: sticky;
  bottom: 0;
`;
