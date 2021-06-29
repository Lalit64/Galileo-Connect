import styled from "styled-components";
import Head from "next/head";
import { Button } from "@material-ui/core";
import { auth, provider } from "../firebase";
import Image from "next/image";

const Login = () => {
  const signIn = () => {
    auth.signInWithPopup(provider).catch(alert);
  };

  return (
    <Container>
      <Head>
        <title>Login</title>
      </Head>
      <LoginContainer>
        <Logo
          src={
            "data:image/png;base64,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"
          }
        />
        <Button variant={"outlined"} onClick={signIn}>
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/480px-Google_%22G%22_Logo.svg.png"
            alt=""
            style={{ width: 20, height: 20, marginRight: 10 }}
          />
          Login with Google
        </Button>
      </LoginContainer>
    </Container>
  );
};

export default Login;

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background: whitesmoke;
`;

const LoginContainer = styled.div`
  padding: 100px;
  align-items: center;
  background: white;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
`;

const Logo = styled(Image)`
  height: 200px;
  width: 200px;
  margin-bottom: 50px;
  border-radius: 30px;
`;
