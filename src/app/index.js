import { useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { getFromStorage, saveToStorage, storageKeys } from "../utils/storage";
import { Stack, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import images from "../images";
import {
  mutateSigninApple,
  mutateSigninNaver,
} from "../server/react-query/useAuth";
import { useGetUser } from "../server/react-query/useUser";
import { useCheckAuthFirst } from "../hooks/useCheckAuthFirst";

WebBrowser.maybeCompleteAuthSession();

const Page = () => {
  useCheckAuthFirst();
  const { mutate: postSigninApple } = mutateSigninApple();
  const { mutate: postSigninNaver } = mutateSigninNaver();
  const { refetch: getUser } = useGetUser();

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

  const postAppleSignin = async (identityToken, fullName) => {
    postSigninApple(
      { identityToken, fullName },
      {
        onSuccess: (data) => {
          console.log("apple signin success: ", data);
        },
        onError: (error) => {
          console.log("apple signin error: ", error);
        },
      }
    );
  };

  const postNaverSignin = async (code) => {
    postSigninNaver(code, {
      onSuccess: async (data) => {
        console.log("naver signin success: ", data);
        await saveToStorage(storageKeys.accessToken, data.accessToken);
        await saveToStorage(storageKeys.refreshToken, data.refreshToken);
        checkAuthAndNavigate();
      },
      onError: (error) => {
        console.log("naver signin error: ", error);
        alert("Naver Signin Error!");
      },
    });
  };

  const checkAuthAndNavigate = () => {
    getUser().then(() => {
      router.replace({ pathname: "/home" });
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          height: "70%",
          justifyContent: "center",
          // justifyContent: "space-around",
          alignItems: "center",
          gap: 48,
          backgroundColor: "#E7FDFF",
        }}
      >
        <Image source={images.logo.main} style={{ width: 200, height: 200 }} />
        <View style={{ gap: 24 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "60%",
              gap: 8,
            }}
          >
            <View
              style={{ borderWidth: 0.5, borderColor: "#87B4B8", flexGrow: 1 }}
            />
            <Text style={{ fontWeight: 600, color: "#87B4B8" }}>
              로그인 옵션
            </Text>
            <View
              style={{ borderWidth: 0.5, borderColor: "#87B4B8", flexGrow: 1 }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              justifyContent: "center",
            }}
          >
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={
                AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
              }
              buttonStyle={
                AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
              }
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
                      (credential.fullName.middleName
                        ? ` ${credential.fullName.middleName} `
                        : " ") +
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
              onPress={() => {
                try {
                  promptAsync();
                } catch (e) {
                  console.log("naver error");
                }
              }}
              color="green"
              style={{
                padding: 8,
                borderColor: "green",
                width: 40,
                height: 40,
                borderWidth: 1,
                borderRadius: 5,
                textAlign: "left",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={images.oAuth.naver}
                style={{ height: 40, width: 40 }}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Page;

const styles = StyleSheet.create({});
