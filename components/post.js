/**

*/
import React, { Component } from 'react';
import {Button, Text, View, Image, StyleSheet, BackHandler, TouchableOpacity, Platform, TextInput, NativeModules, NativeEventEmitter} from 'react-native';
import Editor from './editor' 
import { session, getCsrf, postTopic, uploadFile } from "../request/discourse_api";
import { _getUsers} from '../models/auth';
import config from '../config'

const {EventEmitterManager} = NativeModules;
const tempEventEmitterManager = new NativeEventEmitter(EventEmitterManager);

const url = config.SERVER_URL;
class Post extends Component {
	constructor(props){
		super(props)
		this.state={
			csrf:null
		}
	}
	componentDidMount (){
		const params = {"activity":"com.discoursemobile.RichEditorActivity",
						"categories":this.props.categories
		}
		this.postSubmitListener = tempEventEmitterManager.addListener('postSubmit',(post)=>this.postSubmit(post));
		this.uploadImgListener = tempEventEmitterManager.addListener('uploadImg',(uri)=>this.uploadImg(uri));
		NativeModules.MapIntentModule.startActivityByClassname(JSON.stringify(params),(result)=>{
			console.log(JSON.parse(result) )
			if(JSON.parse(result).action == "finish"){
				console.log("result.action = "+ JSON.parse(result).action)
				this.postSubmitListener.remove();
				this.uploadImgListener.remove();
				this.props.removePost();
			}
			
		}) 
		this.GetInfo();
		
    }
    GetInfo = async ()=>{
		const users = await _getUsers();
		const csrf = JSON.parse(users)[0].csrf;
		this.setState({csrf:csrf});
    }

    postSubmit = async(post) => {
    	console.log("postSubmit")
    	console.log(post)
		const title = post.title
		const raw = post.content 
		const category = post.category 
		const result = await postTopic(title, raw, category, this.state.csrf);
		let type,msg;
		if(result.success) {
			type = "post_success";
			msg = "success"

		}else{
		    type = "post_error";
			msg = result.errors[0]
		}

		const postMassage = {
			'type': type,
			'msg': msg
		}
		NativeModules.MapIntentModule.postMessenger(JSON.stringify(postMassage),(result)=>{
			console.log(result)
		}) 
		if (result.success) this.props.navigation.navigate('TopicDetail',{tid:result.post.topic_id,uid:result.post.user_id})
    }
	uploadImg = async (uri) => {
		const uploadType = "composer"
	    const result =  await uploadFile(uploadType, uri.uri, this.state.csrf);
	    console.log("result = ")
	    console.log(result)
	    let type,msg;
		if(result.short_url) {
			result.host = url
			type = "upload_success";
			msg = result

		}else{
		    type = "upload_error";
			msg = result.errors[0]
		}
	    const postMassage = {
			'type': type,
			'msg': msg
		}
	    NativeModules.MapIntentModule.postMessenger(JSON.stringify(postMassage),(result)=>{
			console.log(result)
		}) 

	       
			

	} 

	render(){
		return(<></>);
	};
}
const styles = StyleSheet.create({
  post: {
    width:'100%',
    height:400,
    position:'absolute',
    bottom:0,
    zIndex:10,
    borderTopWidth:3,
    borderTopColor:'#000',
    backgroundColor:'#fff'
  }
});
export default Post;