/**

*/
import React, { Component } from 'react';
import {Button, Text, View, Image, StyleSheet, BackHandler, TouchableOpacity, Platform, TextInput} from 'react-native';
import { SvgXml } from 'react-native-svg';
import images from '../images/images'
class PostMenu extends Component {
	render(){
		return(
			<View style={{width:'100%',flexDirection:'row',backgroundColor:"#fff"}}>
				<Text style={{marginRight:30}}></Text>
				{this.props.showLike ? <TouchableOpacity onPress={this.props.like}  style={{ marginRight:10,flexDirection:'row', alignItems:'center' , textAlignVertical:'center'}}>
					<Text style={{marginRight:5}}>{this.props.like_count}</Text>
					{this.props.likeImageType == 1 && <SvgXml width="22" height="22" xml={images.heart1} />}
 					{this.props.likeImageType == 2 && <SvgXml width="22" height="22" xml={images.heart2}/>}
 					{this.props.likeImageType == 3 && <SvgXml width="22" height="22" xml={images.heart3}/>}
 					
 				</TouchableOpacity>
 				: null }

 				{this.props.showEdit ? <TouchableOpacity onPress={this.props.edit} style={{marginRight:10,}}>
 					<SvgXml width="18" height="18" xml={images.edit}/>
 				</TouchableOpacity>
 				:null}

 				{this.props.showDelete ? <TouchableOpacity onPress={this.props.delete} style={{}}>
 					<SvgXml width="20" height="20" xml={images.delete}/>
 				</TouchableOpacity>
 				:null}
 				
 				

				{/*
				<Text style={{padding:5}}>links</Text>
				<Text style={{padding:5}}>flat</Text>
				<Text style={{padding:5}}>edit</Text>
				<Text style={{padding:5}}>bookmark</Text>
				<Text style={{padding:5}}>delete</Text>*/}
				<TouchableOpacity onPress={this.props.reply} style={{position:"absolute",right:20}}>
 					<SvgXml width="20" height="20" xml={images.reply1}/>
 				</TouchableOpacity>

			</View>
		);
	};

};
export default PostMenu;