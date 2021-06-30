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
        <Logo src={"/output-onlinepngtools.png"} width={200} height={200} />
        <Button
          variant={"outlined"}
          onClick={signIn}
          style={{
            marginTop: 50,
            display: "flex",
          }}
        >
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/480px-Google_%22G%22_Logo.svg.png"
            alt="Google Logo"
            width={20}
            height={20}
          />
          <div style={{ marginLeft: 10 }}>Login with Google</div>
        </Button>
      </LoginContainer>
    </Container>
  );
};

export { Logo };

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
