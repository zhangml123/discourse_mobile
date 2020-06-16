/**

*/
import React, { Component } from 'react';
import {NativeModules, Button, Text, View, Image, StyleSheet, BackHandler, TouchableOpacity, Platform, TextInput} from 'react-native';
import headerStyle from "./headerStyle";
import {_isLogin, _logout, _login, _getUsers} from '../models/auth';
import  config from '../config'
import ProfileMenu from './profileMenu'
const url = config.SERVER_URL;
class Header extends Component {
	constructor(props){
		super(props)
		this.state={
			avatar_template:null,
			is_login:false,
			showProfileMenu:false
		}
	}
	componentDidMount (){
		this.GetInfo();
	}
	GetInfo = async () => {
			try{
				const is_login =  await _isLogin();
				if(is_login){
					this.setState({is_login:true})
					const users = await _getUsers();
					let avatar_template = JSON.parse(users)[0].avatar_template;
					this.setState({avatar_template:avatar_template.replace("{size}",64)})
					this.props.refresh(true);
				}else{
					this.props.refresh(false);
				}

			}catch(e){
			}
		}
	refresh= ()=>{
		this.GetInfo();
	}
	render(){
		const navigation = this.props.navigation;
		const {avatar_template, is_login, showProfileMenu} = this.state;
		
	return (
		<>
			<View style={{  width:"100%", height: 50, backgroundColor: "#fff",flexDirection:"row"}} > 
			    <Image style={headerStyle.imageLeft} source={require("../images/category.png")}></Image> 
			    <TextInput style={headerStyle.input}   placeholder = '请输入搜索内容' />
        		<Image style={headerStyle.search} source={require("../images/search.png")}></Image>
        		{showProfileMenu ? <ProfileMenu/> : null}
        		{is_login ? 
        		<TouchableOpacity style={headerStyle.accountImage} onPress={() => this.setState({showProfileMenu:false})}>
                	<Image style={headerStyle.imageRight} source={{uri: url + avatar_template }}></Image> 
      			</TouchableOpacity>
				:
				<TouchableOpacity style={headerStyle.accountImage} onPress={() => navigation.navigate('Login',{refresh:this.refresh}) }>
                	<Image style={headerStyle.imageRight} source={require("../images/account-fill.png")}></Image> 
      			</TouchableOpacity>
        		}
				
			   
      		</View>
		</>
	);
	};

};
export default Header;
