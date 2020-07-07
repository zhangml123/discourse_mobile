/**

*/
import React, { Component } from 'react';
import {Button, Text, View, Image, StyleSheet, BackHandler, TouchableOpacity, Platform, TextInput} from 'react-native';
 import { _logout} from '../../models/auth';

class Setting extends Component {
	componentDidMount (){

	}
	logout = async ()=>{
		const rs = await _logout();

		console.log("rs = ")
		console.log(rs)
		if(rs){
			const navigation = this.props.navigation;
			this.props.refresh();
			navigation.goBack();
		}
	}
	render(){
		return(
			<View style={{width:"100%",textAlign:"center",alignItems:'center',  textAlignVertical:'center'}}>
				
		         <Text onPress={this.logout.bind(this)} style={{width:"70%", height:40,borderWidth:1,borderColor:"#555",borderRadius:5,backgroundColor:"#555",color:"#fff",fontSize:18,fontWeight:"bold", textAlign:'center', alignItems:'center', justifyContent:'center',  textAlignVertical:'center',fontSize:16}}>注销账号</Text>
				
			</View>
		)
	}
}	
export default Setting;