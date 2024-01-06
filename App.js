import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, Button } from "react-native";
import { useEffect } from "react";
import KakaoLogin from "./utils/KakaoLogin";
import WebView from "react-native-webview";

// 로그인 버튼 누르면 웹 브라우저가 열리고, 구글 로그인 페이지로 이동
WebBrowser.maybeCompleteAuthSession();
export default function login () {

  const [isLogined, setIsLogined] = React.useState(false);
  const [googleLogined, setGoogleLogined] = React.useState(false);
  const [kakaoLogined, setKakaoLogined] = React.useState(false);

  // 안드로이드, 웹 클라이언트 아이디를 사용하여 인증 요청 보냄.
  // Google 인증 요청을 위한 훅 초기화
  // promptAsync: 인증 요청 보냄.
  const [userInfo, setUserInfo] = React.useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId:
      "764762593312-cakiv6uodn0vqjrlr9uk9pq19t7u2d19.apps.googleusercontent.com",
    androidClientId:
      "764762593312-6fkgt57438d5rhngkrgr9bucd84nt6jc.apps.googleusercontent.com",
    iosClientId:
      "764762593312-j4lu4mocv438rigg7lrjvhpsb0ntdkjg.apps.googleusercontent.com"
  });


  // Google 로그인 처리하는 함수
  const handleSignWithGoogle = async () => {
    const user = await AsyncStorage.getItem("@user");
    if (!user) {
      if (response?.type === "success") {
        // 인증 요청에 대한 응답이 성공이면, 토큰을 이용하여 유저 정보 가져오기.
        await getGoogleUserInfo(response.authentication?.accessToken);
      }
    } else {
      // 유저 정보가 이미 있을 시, 유저 정보를 가져오기.
      setUserInfo(JSON.parse(user));
    }
  }

  // 토큰을 이용하여 유저 정보를 가져오는 함수
  const getGoogleUserInfo = async (token) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const userInfoResponse = await response.json();
      // 유저 정보를 AsyncStorage에 저장, 상태업데이트
      await AsyncStorage.setItem("@user", JSON.stringify(userInfoResponse));
      setUserInfo(userInfoResponse);
    } catch (e) {
      console.log(e);
    }
  };

  const handleGoogleLogout = async () => {
    await AsyncStorage.removeItem("@user");
    setUserInfo(null);
  };

  // Google 인증 응답이 바뀔 때 마다 실행
  useEffect(() => {
    handleSignWithGoogle();
  }, [response]);

  // Kakao 인증 응답이 바뀔 때 마다 실행
  useEffect(() => {}, [])

  return (
    <View style={{flex: 1, alignContent: "center"}}>
      <Text>{JSON.stringify(userInfo, null, 2)}</Text>
      <View>
        { googleLogined ?
          <Button
            title="logout"
            onPress={() => handleGoogleLogout()}
          />
          :
          <Button
            title="Sign in with Google"
            disabled={!request}
            onPress={() => {
              promptAsync();
            }}
          />
        }
      </View>
      <View>
        <KakaoLogin />
      </View>
      <KakaoLogin/>
    </View>
  )
}