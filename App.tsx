import "react-native-gesture-handler";
import React, { useCallback, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { MenuProvider } from "react-native-popup-menu";
import * as SplashScreen from "expo-splash-screen";
import { LogBox } from "react-native";
import * as Font from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/navigation";
import { store } from "./src/utils/store";

// Keep the splash screen visible while we fetch resources(fonts)
SplashScreen.preventAutoHideAsync();

// LogBox.ignoreLogs(["You are initializing Firebase Auth for React Native without providing AsyncStorage."]);

export default function App() {
	const [appIsReady, setAppIsReady] = useState(false);

	useEffect(() => {
		async function prepare() {
			try {
				// Pre-load fonts
				await Font.loadAsync({
					black: require("./assets/fonts/Roboto-Black.ttf"),
					blackItalic: require("./assets/fonts/Roboto-BlackItalic.ttf"),
					bold: require("./assets/fonts/Roboto-Bold.ttf"),
					boldItalic: require("./assets/fonts/Roboto-BoldItalic.ttf"),
					italic: require("./assets/fonts/Roboto-Italic.ttf"),
					light: require("./assets/fonts/Roboto-Light.ttf"),
					lightItalic: require("./assets/fonts/Roboto-LightItalic.ttf"),
					medium: require("./assets/fonts/Roboto-Medium.ttf"),
					mediumItalic: require("./assets/fonts/Roboto-MediumItalic.ttf"),
					regular: require("./assets/fonts/Roboto-Regular.ttf"),
					thin: require("./assets/fonts/Roboto-Thin.ttf"),
					thinItalic: require("./assets/fonts/Roboto-ThinItalic.ttf"),
				});
				await new Promise((resolve) => setTimeout(resolve, 2000));
			} catch (e) {
				console.warn(e);
			} finally {
				setAppIsReady(true);
			}
		}

		prepare();
	}, []);

	const onLayoutRootView = useCallback(async () => {
		if (appIsReady) {
			await SplashScreen.hideAsync();
		}
	}, [appIsReady]);

	if (!appIsReady) {
		return null;
	}

	return (
		<Provider store={store}>
			<SafeAreaProvider style={{ flex: 1 }} onLayout={onLayoutRootView}>
				<MenuProvider>
					<AppNavigator />
				</MenuProvider>
			</SafeAreaProvider>
		</Provider>
	);
}
