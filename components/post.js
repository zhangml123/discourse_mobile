/**

*/
import React, { Component } from 'react';
import {Button, Text, View, Image, StyleSheet, BackHandler, TouchableOpacity, Platform, TextInput, NativeModules, NativeEventEmitter} from 'react-native';

import { session, getCsrf, postTopic, uploadFile, draft, postEdit } from "../request/discourse_api";
import { _getUsers} from '../models/auth';
import config from '../config'

const {EventEmitterManager} = NativeModules;
const tempEventEmitterManager = new NativeEventEmitter(EventEmitterManager);

const url = config.SERVER_URL;
class Post extends Component {
	constructor(props){
		super(props)
		this.state={
			csrf:null,
			is_new_topic: this.props.args.type === "new_topic" ? true : false,
			post_type: this.props.args.type
		}
	}
	componentDidMount (){
		const params = {"activity":"com.discoursemobile.RichEditorActivity",
						"args":this.props.args,
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
    	if(this.state.post_type === "new_topic"){
			await draft("new_topic");
    	}else{
    		const draft_key = "topic_"+this.props.args.topic_id;
			await draft(draft_key);
    	}
    	
		const users = await _getUsers();
		const csrf = JSON.parse(users)[0].csrf;
		this.setState({csrf:csrf});
    }

    postSubmit = async(post) => {
    	console.log("postSubmit")
    	console.log(post)

    	let params = {};
    	let type,msg,result;

    	if(this.state.post_type === "new_topic"){
    		const title = post.title
    		const category = post.category 
    		params.title = post.title;
    		params.category = post.category;
    		params.draft_key = "new_topic";
    		params.raw = post.content;
			console.log("params = ")
			console.log(params)
			result = await postTopic(params, this.state.csrf);
    	}else if(this.state.post_type === "reply"){
    		let args = this.props.args;
			params.topic_id = args.topic_id;
			params.category = args.category_id;
			params.whisper = false;
			params.featured_link="";
			params.draft_key="topic_"+args.topic_id;
			params.reply_to_post_number= args.post_number;
			params.raw = post.content;
			console.log("params = ")
			console.log(params)
			result = await postTopic(params, this.state.csrf);
    	}else if(this.state.post_type === "edit"){
    		

    		let args = this.props.args;
			params.topic_id = args.topic_id;
			params.post_id = args.post_id;
			params.raw = post.content;
			params.raw_old = args.raw;
			params.cooked = post.content;
			console.log("params11111111111111 = ")
			console.log(params)
			result = await postEdit(params, this.state.csrf);
			if(!result.errors){
				result.success = true;
			}

    	}
		
		
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
		if (result.success){
			if(this.state.post_type === "new_topic"){
				this.props.navigation.navigate('TopicDetail',{tid:result.post.topic_id,uid:result.post.user_id})
			}else if(this.state.post_type === "reply"){
				this.props.replySuccess();
			}else if(this.state.post_type === "edit"){
				this.props.editSuccess();
			}
		} 
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