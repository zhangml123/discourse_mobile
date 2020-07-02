/**

*/
import React, { Component } from 'react';
import {Button, Text, View, Image, StyleSheet, BackHandler, TouchableOpacity, Platform, TextInput} from 'react-native';

class PostMenu extends Component {
	render(){
		return(
			<View style={{width:'100%',flexDirection:'row',backgroundColor:"#fff"}}>
				<Text style={{marginRight:30}}></Text>
				{this.props.showLike ? <TouchableOpacity onPress={this.props.like}  style={{ marginRight:10,flexDirection:'row', alignItems:'center' , textAlignVertical:'center'}}>
					<Text style={{marginRight:5}}>{this.props.like_count}</Text>
					{this.props.likeImageType == 1 && <Image style={{width:25,height:25}}  source={require("../images/like.png")}/>}
 					{this.props.likeImageType == 2 && <Image style={{width:25,height:25}}  source={require("../images/liked1.png")}/>}
 					{this.props.likeImageType == 3 && <Image style={{width:25,height:25}}  source={require("../images/liked2.png")}/>}
 					
 				</TouchableOpacity>
 				: null }

 				{this.props.showEdit ? <TouchableOpacity onPress={this.props.edit} style={{marginRight:10,}}>
 					<Image style={{width:23,height:23,marginTop:2}}  source={require("../images/edit.png")}/>
 				</TouchableOpacity>
 				:null}

 				{this.props.showDelete ? <TouchableOpacity onPress={this.props.delete} style={{}}>
 					<Image style={{width:23,height:23,marginTop:2}}  source={require("../images/delete.png")}/>
 				</TouchableOpacity>
 				:null}
 				
 				

				{/*
				<Text style={{padding:5}}>links</Text>
				<Text style={{padding:5}}>flat</Text>
				<Text style={{padding:5}}>edit</Text>
				<Text style={{padding:5}}>bookmark</Text>
				<Text style={{padding:5}}>delete</Text>*/}
				<TouchableOpacity onPress={this.props.reply} style={{position:"absolute",right:20}}>
 					<Image style={{width:25,height:25,borderRadius:25}}  source={require("../images/reply1.png")}/>
 				</TouchableOpacity>

			</View>
		);
	};

};
export default PostMenu;