import React from 'react';
import { Animated, PixelRatio, Platform, StatusBar, StyleSheet, View, ActivityIndicator } from 'react-native';
import { AppLoading, Asset, Font, Icon, SplashScreen } from 'expo';
import AppNavigator from './navigation/AppNavigator';

console.disableYellowBox = true;

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    splashAnimation: new Animated.Value(0),
    splashAnimationComplete: false,
  };

  componentDidMount() {
    SplashScreen.preventAutoHide();
    this._loadAsync();
  }

  _loadAsync = async () => {
    try {
      // call the resources, wait for load completion
      await this._loadResourcesAsync();
    } catch (e) {
      this._handleLoadingError(e);
    } finally {
      this._handleFinishLoading();
    }
  };

  getAnimatedContainerStyle = () => {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 80, 255, 0.95)',
      opacity: this.state.splashAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
      }),
    }
  }

  getAnimatedViewStyle = () => {
    return {
      // position: 'absolute',
      // top: 0,
      // left: 0,
      // bottom: 0,
      // right: 0,
      margin: 20,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      // backgroundColor: 'rgba(0, 80, 255, 0.5)',
      opacity: this.state.splashAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
      }),
    }
  }

  _maybeRenderLoadingImage = () => {

    const animatedImageStyle = {
      width: 65,
      height: 65,
      margin: 10,
      // position: 'absolute',
      // top: 0,
      // left: 0,
      // bottom: 0,
      // right: 0,
      resizeMode: 'contain',
      transform: [
        {
          scale: this.state.splashAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 2],
          }),
        },
      ],
    }

    const animatedTextStyle = {
      fontSize: 10 * PixelRatio.get(),
      color: 'whitesmoke',
      fontFamily: 'Cabin',
      fontWeight: 'bold'
    }

    // as long as the animation isn't complete, 
    if (this.state.splashAnimationComplete) {
      return null;
    }

    const iconSources = [
      './assets/weather/icons/skyline.png',
      './assets/tab-navigator/icons/mountains.png',
      '/assets/tab-navigator/icons/cloud.png',
      './assets/tab-navigator/icons/skiing.png'
    ]

    return (
      <Animated.View
        style={this.getAnimatedContainerStyle()}>
        <Animated.View
          style={this.getAnimatedViewStyle()}>
          <Animated.Image
            source={require('./assets/weather/icons/skyline.png')}
            style={animatedImageStyle}
            onLoadEnd={this._animateOut}
          />

          <Animated.Image
            source={require('./assets/tab-navigator/icons/mountains.png')}
            style={animatedImageStyle}
          // onLoadEnd={this._animateOut}
          />

          <Animated.Image
            source={require('./assets/tab-navigator/icons/cloud.png')}
            style={animatedImageStyle}
          // onLoadEnd={this._animateOut}
          />
          <Animated.Image
            source={require('./assets/tab-navigator/icons/skiing.png')}
            style={animatedImageStyle}
          // onLoadEnd={this._animateOut}
          />
        </Animated.View>
        <Animated.View
          style={this.getAnimatedViewStyle()}>
          <Animated.Text style={animatedTextStyle}>
            loading resources ...
          </Animated.Text>
          <ActivityIndicator style={{marginLeft: 10}} size="large" color="white" />
        </Animated.View>


      </Animated.View>
    );
  };

  _animateOut = async () => {
    SplashScreen.hide();
    await this.timeout(3000);

    Animated.timing(this.state.splashAnimation, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start(() => {
      this.setState({ splashAnimationComplete: true });
    });
  };

  // these calls will be made and completed before the app is available for the 
  // user. 
  _loadResourcesAsync = async () => {

    return Promise.all([
      // make a fe
      fetch(`https://lit-falls-35438.herokuapp.com/Denver-weather`)
      .then((response) => response.json())
      .then((response) => {
        // console.log(response);
      })
      .catch((error) => {
        console.error(error);
      }),
      fetch(`https://lit-falls-35438.herokuapp.com/snow`)
      .then((response) => response.json())
      .then((response) => {
        // console.log(response);
      })
      .catch((error) => {
        console.error(error);
      }),
      fetch(`https://lit-falls-35438.herokuapp.com/traffic`)
      .then((response) => response.json())
      .then((response) => {
        // console.log(response);
      })
      .catch((error) => {
        console.error(error);
      }),
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
        require('./assets/images/splash.png'),
      ]),
      Font.loadAsync({
        'Cabin': require('./assets/fonts/Cabin/Cabin-Regular.ttf'),
        'Cabin-Bold': require('./assets/fonts/Cabin/Cabin-Bold.ttf'),
        'OpenSans': require('./assets/fonts/OpenSans/OpenSans-Regular.ttf'),
        'OpenSans-Bold': require('./assets/fonts/OpenSans/OpenSans-Bold.ttf'),

        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

  render() {

    if (!this.state.isLoadingComplete) {
      return <View />;
    }

    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <AppNavigator />
        {this._maybeRenderLoadingImage()}
      </View>
    );
  }

}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});