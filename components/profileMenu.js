/**

*/
import React, { Component } from 'react';
import {Button, Text, View, Image, StyleSheet, BackHandler, TouchableOpacity, Platform, TextInput} from 'react-native';
import {_isLogin, _logout, _login} from '../models/auth';

class ProfileMenu extends Component {
	componentDidMount (){
 		console.log("asdfadsfasdf")
 		this._onSelect();
    }
	_onSelect = ()=>{
		
	}
	render(){
		const navigation = this.props.navigation;
		const refresh = this.props.refresh;
		return(
			<View  style={{width:"100%",position:"absolute",top:50,padding:10,backgroundColor:"#efefef",zIndex:5}}>
				
				<View  style={{width:"100%",height:40,borderBottomWidth:1,backgroundColor:"#fff",flexDirection:'row',
		flexWrap:'wrap',borderBottomColor:"#ddd"}}>
  					<Image style={{width:30,height:30,marginTop:5,marginLeft:10}} source={require("../images/account-fill.png")}></Image> 
					<Text onPress={() => navigation.navigate('Profile',{refresh:refresh})}  style={{width:"50%",height:40,fontSize:16,  textAlignVertical:'center',color:"#0366d6"}}>admin</Text>
					
				</View>
				
			</View>
		)
	}

}
export default ProfileMenu;