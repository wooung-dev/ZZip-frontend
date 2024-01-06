import { View, Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import axios from 'axios';

const INJECTED_JAVASCRIPT = `window.ReactNativeWebView.postMessage('message from webView')`;

export default function KakaoLogin () {

  const getCode = (target) => {
		const exp = 'code=';
		const condition = target.indexOf(exp);
		if (condition !== -1) {
			const requestCode = target.substring(condition + exp.length);
			console.log('code = ', requestCode);
			requestToken(requestCode);
		}
	};

  const requestToken = async (code) => {
		const requestTokenUrl = 'https://lastdance.kr/api/members/kakao/login';

		try {
			const body = {
				code,
			};
			const response = await axios.post(requestTokenUrl, body);

			console.log(response.headers);

			const accessToken = response.headers['authorization'];
			const refreshToken = response.headers['authorization-refresh'];

			if (accessToken) {
				// AsyncStorage에 accessToken 저장
				await AsyncStorage.setItem('accessToken', accessToken);
			}

			if (refreshToken) {
				// AsyncStorage에 refreshToken 저장
				await AsyncStorage.setItem('refreshToken', refreshToken);
			}

			console.log(response.data);

			await navigation.navigate('가족선택');
		} catch (e) {
			console.log(e);
		}
	};

  return(
    Platform.OS === "web" ? (
      <iframe src="https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=$44a4ea60b87b4f0a41cdddf1aff7331c&redirect_uri=http://localhost:19006" height={'100%'} width={'100%'} /> ) : (
        <View style={{ flex: 1 }}>
        <WebView
          source={{ uri: 'https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=$44a4ea60b87b4f0a41cdddf1aff7331c&redirect_uri=http://localhost:19006' }}
          injectedJavaScript={INJECTED_JAVASCRIPT}
          javaScriptEnabled
          style={{marginTop: 22, flex: 1}}
          onMessage={(event) => {
            const data = event.nativeEvent.url;
            getCode(data);
          }}
        />
      </View>
    )
  )
}