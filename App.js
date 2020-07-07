   
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
import ProfileMenu from './components/profileMenu';
import Profile from './components/profile';
import Signup from './components/signup';
import Active from './components/active';
import Search from './components/search';
import Badges from './components/badges';
import Users from './components/users';
import About from './components/about';
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
            <Stack.Screen name="Profile" component={Profile}  />
            <Stack.Screen name="Signup" component={Signup}  />
            <Stack.Screen name="Active" component={Active}  />
            <Stack.Screen name="Search" component={Search}  />
            <Stack.Screen name="Badges" component={Badges}  />
            <Stack.Screen name="Users" component={Users}  />
            <Stack.Screen name="About" component={About}  />
          </Stack.Navigator>
        </NavigationContainer>
      </>
    );
  };
};

export default App;

