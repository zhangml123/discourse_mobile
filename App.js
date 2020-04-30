/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

class App extends Component {
  constructor(props){
      super(props);
      this.state = {
          loading: true,
      }
  }
  loaded(){
    console.log("loaded")
    this.setState({loading:false})
  }
  render(){
    const loading = this.state.loading;
    const _this = this;
    return (
      <>
      
       
        
        <WebView style={{"width":"100%","height":"100%"}} source={{ uri: 'https://www.platonfans.org' }} 
          javascriptEnabled={true}
          scrollEnabled={false}
          scalesPageToFit={true}
          automaticallyAdjustContentInsets={true}
          onLoad={function(){
            _this.loaded()
          }}
        />
        {loading ?  
         <View style={{flex: 1, alignItems: 'center', justifyContent: 'center' ,backgroundColor:'#fff'}}>
            <Image style={styles.imageLocalStyle} source={require('./images/timg.gif')} />
          </View> :
           null}
      </>
    );
  };
};


const styles = StyleSheet.create({
  imageLocalStyle: {
   
    
  },
})

export default App;
