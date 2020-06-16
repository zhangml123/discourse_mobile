   
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {Button, Text, View, Image, StyleSheet, BackHandler, TouchableOpacity, Platform} from 'react-native';
import { WebView } from 'react-native-webview';
import Index from './components/index';
import TopicList from './components/topicList';
import Login from './components/login';
import Post from './components/post';
import TopicDetail from './components/topicDetail';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import moment from 'moment';
import config from './config'
moment.locale("zh-CN",{
    relativeTime : config.relativeTime
})
const Stack = createStackNavigator();


class App extends Component {
  constructor(props){
      super(props);
      this.state = {
          loading: true,
         
      }
  } 

  
  render(){
    
    return (
      <>
        <NavigationContainer >
          <Stack.Navigator>
            <Stack.Screen name="Index" component={Index} options={{ headerTitle: <></>,headerStyle: { height:0} }}  />
            <Stack.Screen name="TopicList" component={TopicList} />
            <Stack.Screen name="TopicDetail" component={TopicDetail} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Post" component={Post}  />
          </Stack.Navigator>
        </NavigationContainer>
      </>
    );
  };
};

export default App;

