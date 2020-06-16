/**

*/
import React, { Component } from 'react';
import {Button, Text, View, Image, StyleSheet, BackHandler, TouchableOpacity, Platform, TextInput, ScrollView, Dimensions} from 'react-native';
import HTMLView from 'react-native-htmlview';
import {WebView} from 'react-native-webview'
import { getTopicDetail } from "../request/discourse_api";
import PostMenu from './postMenu';
import loadingImage from '../images/loading.gif';
import  config from '../config';
const dimensions = Dimensions.get('window');
const windowWidth = dimensions.width;
const windowHeight = dimensions.height;
const url = config.SERVER_URL;
class TopicDetail extends Component {
	constructor(props){
		super(props)
		this.state = {
			detail:null
		}
	}
	componentDidMount (){

        this.GetInfo();
    }
    GetInfo = async () => {
        try{
        	const {tid, uid } = this.props.route.params;

			let path = "";
			path += "/t/"+tid
			if(uid > 0) path += "/"+uid;
			path += ".json"
			console.log(path)
			const detail = await getTopicDetail(path);
			console.log(detail)

			let content = detail ? detail.post_stream.posts[0].cooked :"",baseUrl:''
			detail.html = content +"\n\n\n\n"
			this.setState({
				detail:detail
			})
        }catch(e){
        }
    }
	renderNode =  (node, index, siblings, parent, defaultRenderer) => {
	  if (node.name == 'img') {
	    const attribs = node.attribs;
	    const alt = attribs.alt;
	    const src = attribs.src;
	    const sha1 = attribs['data-base62-sha1'];
	    const width = attribs.width;
	    const height = attribs.height * windowWidth / width;
	    const realWith = node.naturalWidth
	    console.log(width)
	    console.log(attribs.height)

	    console.log(windowWidth)
		console.log(height)
		console.log(src)
	    return (
	      <Image source={{uri: src}} style = {{width:windowWidth,height:height}} ></Image>
	    );
	  }
	}

	render(){
		const {detail} = this.state;
		const avatar_template = detail ? detail.details.created_by.avatar_template.replace("{size}",64):"";
		console.log(url + avatar_template )
		const {navigation } = this.props;
		navigation.setOptions({
			title: detail ? detail.title :"",
			headerStyle: {
	            height:45
	        }
		})


		//let content = detail ? detail.post_stream.posts[0].cooked :""
		let content = detail ? detail.html :"";
		
		 //let content ='<p><img src="https://www.platonfans.org/uploads/default/original/1X/612ad3df2eb9d419f0523cc4f6916f070d8f8351.png" alt="1592205344574_img" data-base62-sha1="dRA4uhPAkJiA4ztcEbifWjuKHrb" width="1020" height="880"></p>asdfasdfasdfasdf'
		//const html = content.replace(/<img/g,'<img width="50" height="100%"') + "asdfasdfasdfasdf\n\n\n\n\n";;

		
		return (
			
			<ScrollView contentContainerStyle={styles.contentContainer}>
				<View style={{paddingBottom:10,borderBottomWidth:2,borderBottomColor:"#eee"}}>
					<Text style={{fontSize:20}}> {detail ? detail.title :""}</Text>
				</View>
				
				<View style={{flexDirection:'row',paddingTop:10}}>
					<Image style={{width:35,
		height:35,
		borderRadius:35,
		marginTop:6}}  source={{uri: url + avatar_template }}/>
					<Text style={{paddingLeft:10,fontWeight:'bold',color:"#777"}}>{detail ? detail.details.created_by.name :""}</Text>
				</View>
				<View style={{flexDirection:'row',paddingTop:10}}>
				
					<HTMLView style={{paddingBottom:20}}
			        value={content}
			       //	renderNode={this.renderNode}
			      	/>
			   </View>
  			</ScrollView>
			
		)
	}
}
const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 20,
    minHeight:"100%",
    padding:5,
    backgroundColor:"#fff"
  }
});
export default TopicDetail;