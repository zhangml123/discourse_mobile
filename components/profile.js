/**

*/
import React, { Component } from 'react';
import {Button, Text, View, Image, StyleSheet, BackHandler, TouchableOpacity, Platform, FlatList, Dimensions, ScrollView} from 'react-native';
import { getUsers } from "../request/discourse_api";
import Setting from './profile/setting';
import Summary from './profile/summary';
import Activity from './profile/activity';
import Badges from './profile/badges'
import { SvgXml } from 'react-native-svg';
import images from '../images/images'
import {_isLogin, _logout, _login, _getUsers} from '../models/auth';
import  config from '../config';
import moment from 'moment';
import { timeFormate } from '../models/times';
const url = config.SERVER_URL;
class Profile extends Component {
	constructor(props){
		super(props);
		this.state = {
			view:"summary",
			username:null,
			avatar_template:null,
			is_current:false,
			showDetail:false,
			user:null
			
		}
		
	}
	componentDidMount (){
		const {navigation } = this.props;
 		navigation.setOptions({
			title: "用户",
			headerStyle: {
	            height:40,
	        }
		});
		this.GetInfo();
	}
	GetInfo = async () => {
		try{
			const username = this.props.route.params.username
			if(username){

				const user = await getUsers(username);
				const avatar_template = user.user.avatar_template.replace("{size}",64);
				const name = user.user.name;
				const is_login =  await _isLogin();
				console.log("is_login = "+is_login)
				let is_current = false;
				if(is_login){
					const currentUser = await _getUsers();
					let currentUserName = JSON.parse(currentUser)[0].username;
					console.log(currentUserName)
					if(username === currentUserName) is_current = true;
				}
				this.setState({
					username:username,
					name:name,
					user:user.user,
					avatar_template:avatar_template,
					is_current:is_current
				})
				
				
			}
		}catch(e){
		}
	}
	render(){
		//console.log(html)
		const {view, avatar_template, username, is_current, showDetail, name, user} = this.state
		const navigation = this.props.navigation;
		const refresh = this.props.route.params.refresh;
		let txt,xml;
		if(this.state.showDetail){
			txt="折叠"; xml= images.up
		}else{
			txt="展开"; xml= images.down
		}
		return(
			<View style={{flex: 1,backgroundColor:"#fff"}}>
				{user && <View  style={{flex: 1}}>
					<View style={{width:"100%",height:100,padding:20,flexDirection:'row',justifyContent:'space-between' , alignItems:'center',  textAlignVertical:'center'}}>
						<View style={{flexDirection:'row'}}>
							<Image style={{width:50,height:50,borderRadius:50,}} source={{uri: url + avatar_template }}></Image>
							<View >
								<Text style={{fontSize:18,marginLeft:10}}>{username}</Text>
								<Text style={{fontSize:14,marginLeft:10}}>{name}</Text>
							</View>
						</View>
						<TouchableOpacity style={{ width:80,height:40,marginRight:20,flexDirection:'row',backgroundColor:"#eee",padding:10,alignItems:'center', justifyContent:'center',  textAlignVertical:'center'}} onPress={()=>this.setState({showDetail :!this.state.showDetail})}>
							<SvgXml style={{marginRight:5}} width="20" height="20" xml={xml}/>
							<Text style={{flex:1,height:50, paddingLeft:"2%",textAlignVertical:'center',fontSize:16,color:"#555"}}>
								{txt}
							</Text>
							
						</TouchableOpacity>
					</View>
					{showDetail && <View>
						<View style={{width:"100%",height:40,flexDirection:'row',paddingLeft:"2%",paddingRight:"2%"}}>
							<View style={{flex:1,width:"50%",flexDirection:'row'}}>
								<Text style={{height:40,color:"#666"}}>加入时间</Text>
							 	<Text style={{height:40}}> {moment(user.created_at).format('YYYY年 M月D日 ')}</Text>
							</View>
							{user.last_posted_at && <View style={{flex:1,width:"50%",flexDirection:'row'}}>
								<Text style={{height:40,color:"#666"}}>最后发帖 </Text>
								<Text style={{height:40}}>  {moment(user.last_posted_at).fromNow()}</Text>
							</View>}
						</View>
						<View style={{width:"100%",height:40,flexDirection:'row',paddingLeft:"2%",paddingRight:"2%"}}>
							<View style={{flex:1,width:"50%",flexDirection:'row'}}>
								<Text style={{height:40,color:"#666"}}>最后活动</Text>
							 	<Text style={{height:40}}> {moment(user.last_seen_at).fromNow()}</Text>
							</View>
							<View style={{flex:1,width:"50%",flexDirection:'row'}}>
								<Text style={{height:40,color:"#666"}}>浏览 </Text>
								<Text style={{height:40}}> { timeFormate(user.time_read) }  </Text>
							</View>
						</View>
						<View style={{width:"100%",height:40,flexDirection:'row',paddingLeft:"2%",paddingRight:"2%"}}>
							<View style={{flex:1,width:"50%",flexDirection:'row'}}>
								<Text style={{height:40,color:"#666"}}>信任等级</Text>
							 	<Text style={{height:40}}> {user.trust_level} </Text>
							</View>
							{is_current && <View style={{flex:1,width:"50%",flexDirection:'row'}}>
								<Text style={{height:40,color:"#666"}}>邮箱 </Text>
								<Text style={{height:40}}> {user.email} </Text>
							</View>}
						</View>
					</View>
					}
					<View style={{width:"100%",height:40,flexDirection:'row',justifyContent:'space-between',borderBottomWidth:2,borderTopWidth:2,borderColor:"#ccc",marginBottom:10}}>
						<Text onPress={()=>{this.setState({view:"summary"})}} style={ view == "summary" ? styles.viewSelected : styles.viewDefault}>概要</Text>
						<Text onPress={()=>{this.setState({view:"activity"})}} style={ view == "activity" ? styles.viewSelected : styles.viewDefault}>活动</Text>
						{is_current && <Text onPress={()=>{this.setState({view:"notifications"})}} style={ view == "notifications" ? styles.viewSelected : styles.viewDefault}>通知</Text>}
						{is_current && <Text onPress={()=>{this.setState({view:"messages"})}} style={ view == "messages" ? styles.viewSelected : styles.viewDefault}>私信</Text>}
						<Text onPress={()=>{this.setState({view:"badges"})}} style={view == "badges" ? styles.viewSelected : styles.viewDefault}>徽章</Text>
						{is_current && <Text onPress={()=>{this.setState({view:"setting"})}} style={view == "setting" ? styles.viewSelected : styles.viewDefault}>设置</Text>}
						
					</View>
					{this.state.view === "setting" && is_current && <Setting navigation={navigation} refresh = {refresh} />}
					{this.state.view === "summary" && username && <Summary navigation={navigation} username = {username} is_current = {is_current}/>}
					{this.state.view === "activity" && username && <Activity navigation={navigation} username = {username} avatar_template={avatar_template} is_current = {is_current}/>}
					{this.state.view === "badges" && username && <Badges navigation={navigation} username = {username} avatar_template={avatar_template} is_current = {is_current}/>}
				</View>
				}
			</View>
			
		)
	}
}
export default Profile;



const styles = StyleSheet.create({
	viewDefault:{
		width:"16%",fontSize:16,height:38,textAlign:'center', alignItems:'center', justifyContent:'center',  textAlignVertical:'center',color:"#555"
	},
	viewSelected:{
		width:"16%",fontSize:16,height:38,textAlign:'center', alignItems:'center', justifyContent:'center',  textAlignVertical:'center',color:"#0000ff",borderBottomWidth:2,borderColor:"#0000ff"
	}
})