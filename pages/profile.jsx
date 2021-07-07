import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import styled from "styled-components";

const Profile = () => {
  const [user] = useAuthState(auth);

  return (
    <Container>
      <InfoContainer></InfoContainer>
    </Container>
  );
};

export default Profile;

const Container = styled.div``;

const InfoContainer = styled.div``;
