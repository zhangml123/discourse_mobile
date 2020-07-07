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
 			errMsg:null,

 		}
 	}
 	componentDidMount (){
 		const {navigation } = this.props;
 		navigation.setOptions({
			title: "登录",
			headerStyle: {
	            height:40,
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
        const navigation = this.props.navigation;
		return (
			<View style={{flex:1,backgroundColor:"#fff"}}>   
                <View style={{marginLeft:20,marginRight:20,marginTop:20}}>
                    <Text style={{height:50, justifyContent:'center',  textAlignVertical:'center',fontSize:16}}>用户</Text>
                    <TextInput   placeholder = '电子邮件或用户名' style={{borderWidth:1,borderColor:"#ccc",height:40}}  onChangeText = {this.inputUName}></TextInput>
                 </View>
                 <View style={{marginLeft:20,marginRight:20,marginTop:20}}>
                    <Text style={{height:50, justifyContent:'center',  textAlignVertical:'center',fontSize:16}}>密码</Text>
                    <TextInput   placeholder = '密码' secureTextEntry = {true} style={{borderWidth:1,borderColor:"#ccc",height:40}}  onChangeText = {this.inputPwd}></TextInput>
                 </View>
				{errMsg ? <Text>{errMsg}</Text> : null}
				
                <View style={{marginLeft:20,marginRight:20,marginTop:20,flexDirection:'row',justifyContent:'space-between'}}>
                    
                    <Text onPress={this.login} style={{width:"35%", height:40,borderWidth:1,borderColor:"#1AAD19",borderRadius:5,backgroundColor:"#1AAD19",color:"#fff",fontSize:18,fontWeight:"bold", textAlign:'center', alignItems:'center', justifyContent:'center',  textAlignVertical:'center',fontSize:16}}>登录</Text>
                    <Text onPress={() => navigation.navigate('Signup')} style={{width:"35%", height:40,borderWidth:1,borderColor:"#1AAD19",borderRadius:5,backgroundColor:"#fff",color:"#1AAD19",fontSize:18,fontWeight:"bold", textAlign:'center', alignItems:'center', justifyContent:'center',  textAlignVertical:'center',fontSize:16}}>创建新账户</Text>
                </View>
                
			</View>
		);
 	};

 };
 export default Login;