/**

*/
import React, { Component } from 'react';
import {Button, Text, View, Image, StyleSheet, BackHandler, TouchableOpacity, Platform, TextInput} from 'react-native';
class PostMenu extends Component {
	render(){
		return(
			<View style={{width:'100%',flexDirection:'row'}}>
				<Text style={{padding:5}}>like</Text>
				<Text style={{padding:5}}>links</Text>
				<Text style={{padding:5}}>flat</Text>
				<Text style={{padding:5}}>edit</Text>
				<Text style={{padding:5}}>bookmark</Text>
				<Text style={{padding:5}}>delete</Text>
 				<Text style={{padding:5}}>reply</Text>
			</View>
		);
	};

};
export default PostMenu;