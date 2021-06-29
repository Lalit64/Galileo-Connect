import styled from "styled-components";
import * as EmailValidator from "email-validator";
import { Popover, Button } from "@material-ui/core";
import { useState } from "react";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";
import Image from "next/image";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [user] = useAuthState(auth);
  const router = useRouter();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const createChat = () => {
    const input = prompt(
      "Please enter an email address for the user you wish to chat with"
    );
    if (!input) return null;

    if (
      EmailValidator.validate(input) &&
      !chatExists(input) &&
      input !== user.email
    ) {
      db.collection("chats").add({
        users: [user.email, input],
      });
    }
  };

  const chatExists = (recipientEmail) =>
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );

  //prettier-ignore
  const userChatRef = db.collection('chats').where('users', 'array-contains', user.email);
  const [chatsSnapshot] = useCollection(userChatRef);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Container>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <div
          style={{
            width: 250,
            height: 50,
            background: "#f7f9fb",
            display: "flex",
            alignItems: "center",
            paddingLeft: 10,
          }}
        >
          <Image
            src={user.photoURL}
            alt=""
            style={{
              objectFit: "cover",
              position: "relative",
              width: 32,
              height: 32,
              borderRadius: "100%",
              border: "1px solid whitesmoke",
              cursor: "pointer",
            }}
          />
          <p style={{ marginLeft: 10 }}>{user.displayName}</p>
        </div>
        <div style={{ width: 250, height: 165 }}>
          <PopoverButton>My Profile</PopoverButton>
          <PopoverButton>Edit Profile</PopoverButton>
          <PopoverButton>Notifications</PopoverButton>
          <SignOutButton
            onClick={() => {
              router.push(`/`);
              auth.signOut();
            }}
          >
            Sign Out
          </SignOutButton>
        </div>
      </Popover>
      <InnerContainer>
        <Community>
          <Logo>
            <CommunityLogo>
              <Image
                src={
                  "https://d2y5h3osumboay.cloudfront.net/gta5qu5wlijhxdm47utf15tapvih"
                }
                style={{
                  maxHeight: 30,
                  maxWidth: "100%",
                  height: "auto",
                  display: "block",
                }}
              />
            </CommunityLogo>
          </Logo>
        </Community>
        <Search>
          <HeaderSearch>
            <form style={{ width: "100%" }} className="header-search">
              <SearchInputWrapper>
                <i
                  className="far fa-search"
                  style={{
                    color: "#8a94a6",
                    position: "absolute",
                    top: 13,
                    left: 14,
                    fontSize: "0.9rem",
                  }}
                />
                <input
                  type="text"
                  className={"Input"}
                  name="search"
                  placeholder="Search"
                  data-target="autocomplete.input"
                  data-action="keyup->search#fetchResults keydown->search#navigateResults"
                  autoComplete="off"
                  spellCheck="false "
                  style={{
                    border: "none",
                    width: "100%",
                    background: "#edf2f7",
                    borderRadius: "4px",
                    height: 40,
                    fontWeight: 300,
                    padding: "0 20px 0 42px",
                    lineHeight: 40,
                    borderColor: "#edf2f7",
                    fontSize: "1rem",
                    borderWidth: 1,
                    color: "#8a94a6",
                  }}
                />
              </SearchInputWrapper>
            </form>
          </HeaderSearch>
          <QuickPost>
            <QuickPostButton onClick={createChat}>
              <i className="far fa-plus" style={{ fontSize: "1.2rem" }} />
            </QuickPostButton>
          </QuickPost>
        </Search>
        <HeaderActions>
          <HeaderAction>
            <Icon className="far fa-bell" />
          </HeaderAction>
          <HeaderAction>
            <Icon className="far fa-comments-alt" />
          </HeaderAction>
          <HeaderUser onClick={handleClick}>
            <UserMenu>
              <div style={{ boxSizing: "border-box" }}>
                <div
                  style={{
                    height: 32,
                    width: 32,
                    borderRadius: "50%",
                  }}
                >
                  <Image
                    src={user.photoURL}
                    alt=""
                    style={{
                      objectFit: "cover",
                      position: "relative",
                      width: 32,
                      height: 32,
                      borderRadius: "100%",
                      border: "1px solid whitesmoke",
                      cursor: "pointer",
                    }}
                  />
                </div>
              </div>
            </UserMenu>
          </HeaderUser>
        </HeaderActions>
      </InnerContainer>
    </Container>
  );
};

export default Navbar;

const Container = styled.div`
  width: 100%;
  height: 64px;
  border-bottom: 1px solid #ededed;
  position: fixed;
  top: 0;
  z-index: 4;
  background: white;
  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const InnerContainer = styled.div`
  display: grid;
  grid-template-columns: 256px 1fr 250px;
  grid-column-gap: 40px;
  padding: 0 30px;
  grid-template-areas: "community search actions";
  width: 1340px;
  height: 64px;
  margin: 0 auto;
`;

const Community = styled.div``;

const Logo = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #301796;
`;

const CommunityLogo = styled.div`
  align-items: center;
  justify-content: center;
  margin-top: 17px;
  cursor: pointer;
`;

const Search = styled.div`
  display: flex;
  grid-area: search;
  align-items: center;
  border-color: #e9e9e9;
`;

const HeaderSearch = styled.div`
  display: block;
  width: 100%;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const QuickPost = styled.div`
  margin-left: 20px;
`;

const QuickPostButton = styled.button`
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background-color: #301796;
  border-color: #301796;
  border-width: 0;
  border-radius: 3px;
  font-size: 15px;
  font-weight: 600;
  text-align: center;
  line-height: 34px;
  transition: background 0.3s ease, transform 0.3s ease, color 0.2s ease;
  :hover {
    background-color: #291480;
  }
`;

const HeaderActions = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  grid-area: actions;
  align-items: center;
  justify-content: flex-end;
`;

const HeaderAction = styled.div`
  display: block;
  position: relative;
  width: 20px;
  align-self: center;
  line-height: 1rem;
  fill: #8a94a6;
  margin-left: 20px;
`;

const Icon = styled.i`
  color: #8a94a6;
  font-size: 20px;
  :hover {
    color: #2f1695;
  }
`;

const HeaderUser = styled.div`
  margin-left: 20px;
`;

const UserMenu = styled.div`
  position: relative;
`;

const PopoverButton = styled(Button)`
  width: 100%;
  justify-content: space-between;
  margin-top: 4.5px;
  font-weight: 400;
  text-transform: none;
  border-radius: 0;
`;

const SignOutButton = styled(PopoverButton)`
  border-top: 1px solid #ededed;
`;

export { Icon };
