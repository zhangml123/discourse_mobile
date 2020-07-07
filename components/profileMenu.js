/**

*/
import React, { Component } from 'react';
import {Button, Text, View, Image, StyleSheet, BackHandler, TouchableOpacity, Platform, TextInput} from 'react-native';
import {_isLogin, _logout, _login} from '../models/auth';
import  config from '../config';
const url = config.SERVER_URL;
class ProfileMenu extends Component {
	componentDidMount (){
 		this._onSelect();
    }
	_onSelect = ()=>{
		
	}
	render(){
		const {navigation, username, avatar_template}= this.props;
		const refresh = this.props.refresh;
		return(
			<View  style={{width:"100%",position:"absolute",top:50,padding:10,backgroundColor:"#efefef",zIndex:5}}>
				
				<View  style={{width:"100%",height:40,borderBottomWidth:1,backgroundColor:"#fff",flexDirection:'row',
		flexWrap:'wrap',borderBottomColor:"#ddd"}}>
  					<Image style={{width:30,height:30,borderRadius:30,marginTop:4,marginLeft:10,marginRight:10}} source={{uri: url + avatar_template }}></Image> 
					<Text onPress={
						() => {
							this.props.close();
							navigation.navigate('Profile',{refresh:refresh,username:username});
						}
					}  style={{width:"50%",height:40,fontSize:16,  textAlignVertical:'center',color:"#0366d6"}}>{username}</Text>
					
				</View>
				
			</View>
		)
	}

}
export default ProfileMenu;