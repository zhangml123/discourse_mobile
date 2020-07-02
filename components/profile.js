/**

*/
import React, { Component } from 'react';
import {Button, Text, View, Image, StyleSheet, BackHandler, TouchableOpacity, Platform, FlatList, Dimensions, ScrollView} from 'react-native';
import Setting from './profile/setting';
import Summary from './profile/summary';
import {_isLogin, _logout, _login, _getUsers} from '../models/auth';
import  config from '../config';
const url = config.SERVER_URL;
class Profile extends Component {
	constructor(props){
		super(props);
		this.state = {
			view:"summary"
			//view:"setting"
		}
		
	}
	componentDidMount (){
		this.GetInfo();
	}
	GetInfo = async () => {
		try{
			const is_login =  await _isLogin();
			console.log(is_login)
			if(is_login){
				this.setState({is_login:true})
				const users = await _getUsers();
				let avatar_template = JSON.parse(users)[0].avatar_template;
				let username = JSON.parse(users)[0].username;
				this.setState({avatar_template:avatar_template.replace("{size}",64),username:username})
				
			}else{
				this.setState({is_login:false})
				
			}

		}catch(e){
		}
	}
	render(){
		//console.log(html)
		const {view, avatar_template, username} = this.state
		const navigation = this.props.navigation;
		const refresh = this.props.route.params.refresh;
		console.log(url + avatar_template )
		return(
			<View style={{flex: 1,backgroundColor:"#fff"}}>
				<View style={{width:"100%",height:100,padding:20,flexDirection:'row', alignItems:'center',  textAlignVertical:'center'}}>
					<Image style={{width:50,height:50,borderRadius:50,}} source={{uri: url + avatar_template }}></Image>
					<Text style={{fontSize:18,marginLeft:10}}>{username}</Text>
				</View>
				<View style={{width:"100%",height:40,flexDirection:'row',justifyContent:'space-between',borderBottomWidth:2,borderTopWidth:2,borderColor:"#ccc",marginBottom:10}}>
					<Text onPress={()=>{this.setState({view:"summary"})}} style={{width:"16%",fontSize:16,height:40,textAlign:'center', alignItems:'center', justifyContent:'center',  textAlignVertical:'center',}}>概要</Text>
					<Text onPress={()=>{this.setState({view:"activity"})}} style={{width:"16%",fontSize:16,height:40,textAlign:'center', alignItems:'center', justifyContent:'center',  textAlignVertical:'center',}}>活动</Text>
					<Text onPress={()=>{this.setState({view:"messages"})}} style={{width:"16%",fontSize:16,height:40,textAlign:'center', alignItems:'center', justifyContent:'center',  textAlignVertical:'center',}}>私信</Text>
					<Text onPress={()=>{this.setState({view:"drafts"})}} style={{width:"16%",fontSize:16,height:40,textAlign:'center', alignItems:'center', justifyContent:'center',  textAlignVertical:'center',}}>草稿</Text>
					<Text onPress={()=>{this.setState({view:"badges"})}} style={{width:"16%",fontSize:16,height:40,textAlign:'center', alignItems:'center', justifyContent:'center',  textAlignVertical:'center',}}>徽章</Text>
					<Text onPress={()=>{this.setState({view:"setting"})}} style={{width:"16%",fontSize:16,height:40,textAlign:'center', alignItems:'center', justifyContent:'center',  textAlignVertical:'center',}}>设置</Text>
					
				</View>
				{this.state.view === "setting" && <Setting navigation={navigation} refresh = {refresh}/>}
				{this.state.view === "summary" && <Summary username = {username}/>}
				
			</View>
			
		)
	}
}
export default Profile;