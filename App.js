import { useEffect } from "react";
import { View, Text, Pressable } from "react-native";

import * as AppleAuthentication from "expo-apple-authentication";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const postAppleSignin = async (identityToken, fullName) => {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_ENDPOINT}/signin/apple`,
      {
        method: "POST",
        body: JSON.stringify({
          identityToken,
          fullName,
        }),
      }
    );
    console.log(res);
  };

  const postNaverSignin = async (code) => {
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_ENDPOINT}/signin/naver`,
      {
        method: "POST",
        body: JSON.stringify({
          code,
        }),
      }
    );
    console.log(res);
  };

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      responseType: "code",
      scopes: [],
      clientId: process.env.EXPO_PUBLIC_NAVER_SIGNIN_CLIENT_ID,
      redirectUri: AuthSession.makeRedirectUri({
        scheme: "zzip",
        preferLocalhost: true,
      }),
    },
    {
      authorizationEndpoint: "https://nid.naver.com/oauth2.0/authorize",
      tokenEndpoint: "https://nid.naver.com/oauth2.0/token",
    }
  );

  useEffect(() => {
    if (response && response.type === "success") {
      postNaverSignin(response.params.code);
    }
  }, [response]);

  const naverLogin = async () => {
    try {
      promptAsync();
    } catch (e) {
      console.log("naver error");
    }
  };

  return (
    <View
      style={{ flex: 1, padding: 20, paddingTop: 40, justifyContent: "start" }}
    >
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={{
          width: 40,
          height: 40,
          borderColor: "black",
          borderWidth: 1,
          borderRadius: 5,
          marginBottom: 12,
        }}
        onPress={async () => {
          try {
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
              ],
            });

            await postAppleSignin(
              credential.identityToken,
              credential.fullName.familyName +
                (credential.fullName.middleName ? ` ${credential.fullName.middleName} ` : " ") +
                credential.fullName.givenName
            );
          } catch (e) {
            console.log("error", e);
            if (e.code === "ERR_REQUEST_CANCELED") {
              // handle that the user canceled the sign-in flow
            } else {
              // handle other errors
            }
          }
        }}
      />

      <Pressable
        disabled={!request}
        onPress={naverLogin}
        color="green"
        style={{
          width: "50%",
          padding: 8,
          borderColor: "green",
          borderWidth: 1,
          borderRadius: 5,
          textAlign: "left",
        }}
      >
        <Text style={{ color: "green" }}>Naver Signin</Text>
      </Pressable>
    </View>
  );
}
