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
			<View>
				<Button onPress={this.logout.bind(this)}
		          title="注销账号"
		          color="#aaa"/>

			</View>
		)
	}
}	
export default Setting;