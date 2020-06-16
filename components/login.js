 /**
 
 */
 import React, { Component } from 'react';
 import {NativeModules, Button, Text, View, Image, StyleSheet, BackHandler, TouchableOpacity, Platform, TextInput} from 'react-native';
 import commonStyle from "./commonStyle";
 import {_isLogin, _logout, _login} from '../models/auth';
 class Login extends Component {
 	constructor(props){
 		super(props)
 		this.state = {
 			username:null,
 			password:null,
 			errMsg:null
 		}
 	}
 	componentDidMount (){
 		const {navigation } = this.props;
 		navigation.setOptions({
			title: "登录",
			headerStyle: {
	            height:45
	        }
		});
    }
	login = async () => {
		this.setState({
    			errMsg:null
    		})
		const {username, password} = this.state;
		
		if(!username || !password) return;
		
    	const rs = await _login(username, password);
    	if (rs.status === "success"){
    		const navigation = this.props.navigation;
    		
    		this.props.route.params.refresh();
    		navigation.goBack();
    		//返回
    	}else{
    		
    		this.setState({
    			errMsg:rs.data.error
    		})
    	}
    }
    inputUName = (username)=>{
    	
    	this.setState({username:username})
    }
    inputPwd = (password)=>{
		
    	this.setState({password:password})
    }
 	render(){
 		const {errMsg} = this.state
		return (
			<>
				<TextInput   placeholder = '用户名' onChangeText = {this.inputUName} ></TextInput>
				<TextInput   placeholder = '密码'  secureTextEntry = {true} onChangeText = {this.inputPwd}></TextInput>
				{errMsg ? <Text>{errMsg}</Text> : null}
				 <Button
		          onPress={this.login}
		          title="登录"
		          color="#0000ff"
       			/>
			</>
		);
 	};

 };
 export default Login;