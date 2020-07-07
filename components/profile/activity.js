/**

*/
import React, { Component } from 'react';
import {Button, Text, View, Image, StyleSheet, BackHandler, TouchableOpacity, Platform, TextInput, ScrollView} from 'react-native';
import { getCsrf, getUserAction, getCategories, getTopics, getDraft } from "../../request/discourse_api";
import {_getUsers} from '../../models/auth';
import moment from 'moment';
import loadingImage from '../../images/loading.gif';

import  config from '../../config';
import { SvgXml } from 'react-native-svg';
import images from '../../images/images'
const url = config.SERVER_URL;
class Activity extends Component {
	constructor(props){
		super(props)
		this.state={
			view:"all",
			actions:[],
			actions_reply:[],
			actions_likes:[],
			actions_bookmarks:[],
			categories:[],
			drafts:[],
			topics:[],
			loading:true
		}
	}
	componentDidMount (){
		this.GetInfo();
	}
	GetInfo = async ()=>{
		try{
			const currentUser = await _getUsers();
	  		
			const csrf = JSON.parse(currentUser)[0] !=null && JSON.parse(currentUser)[0] != "undefind" ? JSON.parse(currentUser)[0].csrf :null;
			
			const category = await getCategories();
			const categories = category.category_list.categories
			//全部
			const data = {};
			data.offset = 0;
			data.username = this.props.username;
			data.filter = "4,5";
			data.no_results_help_key = "user_activity.no_default";
			const actions = await getUserAction(data, csrf);
			const user_actions = actions.user_actions || [];
			this.setState({
				actions:user_actions,
				categories:categories,
				//loading:false
			})
			//主题
			//https://www.platonfans.org/topics/created-by/admin.json
			let params = "/topics/created-by/";
			params += this.props.username;
			params += ".json";
			const topic = await getTopics(params);
			const topics = topic.topic_list.topics || [];
			
			this.setState({
				topics:topics,
				//loading:false
			})
			//回复
			data.filter = "5";
			data.no_results_help_key = "user_activity.no_replies"
			const actions1 = await getUserAction(data, csrf);
			const actions_reply = actions1.user_actions || [];
			this.setState({
				actions_reply:actions_reply,
				loading:false
			})
			//草稿
			const user_drafts = await getDraft(this.props.username, csrf);
			//console.log("drafts = ")
			//console.log(drafts)
			const drafts = user_drafts.drafts || [];
			this.setState({
				drafts:drafts,
				loading:false
			})
			//送出赞
			data.filter = "1";
			data.no_results_help_key = "user_activity.no_likes_given"
			const actions2 = await getUserAction(data, csrf);
			const actions_likes = actions2.user_actions || [];
			
			this.setState({
				actions_likes:actions_likes,
				loading:false
			})
			//收藏
			data.filter = "3";
			data.no_results_help_key = "user_activity.no_bookmarks"
			const actions3= await getUserAction(data, csrf);
			const actions_bookmarks = actions3.user_actions || [];
			
			this.setState({
				actions_bookmarks:actions_bookmarks,
				loading:false
			})
		}catch(e){
			console.log(e)
		}
	}
	
	render(){
		const {actions, view, loading, categories, topics, actions_reply, drafts, actions_likes, actions_bookmarks} = this.state;
		const {navigation, is_current} = this.props;
		return(
			<ScrollView style={{flex: 1}}>
			 <View>

					
						
						<TouchableOpacity style={{flexDirection:'row',backgroundColor:"#fff",alignItems:'center', justifyContent:'center',  textAlignVertical:'center'}} onPress={()=>{this.state.view == "all" ? this.setState({view :null}) : this.setState({view :"all"})}}>
							<Text style={{flex:1,height:50, paddingLeft:"2%",textAlignVertical:'center',fontSize:16,color:"#555"}}>
								全部
							</Text>
							{this.state.view == "all" ?
							<SvgXml style={{marginRight:"5%"}} width="15" height="15" xml={images.up}/>
							: 
							<SvgXml style={{marginRight:"5%"}} width="15" height="15" xml={images.down}/> 
							}
						</TouchableOpacity>
						{view == "all" &&
							<View style={{paddingLeft:"3%",paddingRight:"3%"}}>
								{actions.length !=0 ? actions.map((v,k)=>{
									let category_name,category_color ;
									categories.map((v1,k1)=>{
										if(v.category_id == v1.id){
											category_name = v1.name;
											category_color = "#"+v1.color;
										}

									})
									if(k > 4) return null;

									return(
									<View key = {k} style={
										k <4 ? {paddingTop:10,paddingBottom:10,width:"100%",backgroundColor:"#fff",flexDirection:'row',borderBottomWidth:1,borderColor:"#ccc"}
										:{paddingTop:10,paddingBottom:10,width:"100%",backgroundColor:"#fff",flexDirection:'row',borderBottomWidth:0,borderColor:"#ccc"}
									}>
										<View style={{marginRight:10}}>
											<Image style={{width:35,height:35,borderRadius:35,marginTop:4}} source={{uri: url + v.avatar_template.replace("{size}",64) }}></Image> 
										</View>
										<View style={{flex:1}}>
											<View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}>
												<Text onPress={() => navigation.navigate('TopicDetail',{tid:v.topic_id})} style={{flex: 1,marginRight:10,fontSize:16,color:"#4E6EF2"}}>{v.title}</Text>
												<Text style={{fontSize:14,color:"#555"}}>{moment(v.created_at).fromNow()}</Text>	
											</View>
											<View style={{flexDirection:'row',backgroundColor:"#fff",alignItems:'center' }}>
												<Text style={{width:10,height:10,marginTop:2,backgroundColor:category_color}}></Text>
												<Text style={{marginLeft:5,fontSize:14}}>{category_name}</Text>
											</View>
											
											<Text style={{marginTop:8}}>{v.excerpt}</Text>
											
										</View>
										
									</View>)

								})
								: !loading && <Text style={{color:"#888",width:"100%",height:40,textAlign:"center"}}>没有记录</Text>
								}
							</View>
						}
					

						<TouchableOpacity style={{flexDirection:'row',backgroundColor:"#fff",alignItems:'center', justifyContent:'center',  textAlignVertical:'center'}} onPress={()=>{this.state.view == "topic" ? this.setState({view :null}) : this.setState({view :"topic"})}}>
							<Text style={{flex:1,height:50, paddingLeft:"2%",textAlignVertical:'center',fontSize:16,color:"#555"}}>
								主题
							</Text>
							{this.state.view == "topic" ?
							<SvgXml style={{marginRight:"5%"}} width="15" height="15" xml={images.up}/>
							: 
							<SvgXml style={{marginRight:"5%"}} width="15" height="15" xml={images.down}/> 
							}
						</TouchableOpacity>
						{view == "topic" &&
							<View style={{paddingLeft:"3%",paddingRight:"3%"}}>
								{topics.length != 0 ? topics.map((v,k)=>{
									let category_name,category_color ;

									categories.map((v1,k1)=>{
										if(v.category_id == v1.id){
											category_name = v1.name;
											category_color = "#"+v1.color;
										}

									})
									if(k > 4) return null;
									return(
									<View key = {k} style={
										k <4 ? {paddingTop:10,paddingBottom:10,width:"100%",backgroundColor:"#fff",flexDirection:'row',borderBottomWidth:1,borderColor:"#ccc"}
										:{paddingTop:10,paddingBottom:10,width:"100%",backgroundColor:"#fff",flexDirection:'row',borderBottomWidth:0,borderColor:"#ccc"}
									}>
										<View style={{marginRight:10}}>
											<Image style={{width:35,height:35,borderRadius:35,marginTop:4}} source={{uri: url + this.props.avatar_template }}></Image> 
										</View>
										<View style={{flex:1}}>
											<View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}>
												<Text onPress={() => navigation.navigate('TopicDetail',{tid:v.topic_id})} style={{flex: 1,marginRight:10,fontSize:16,color:"#4E6EF2"}}>{v.title}</Text>
												<Text style={{fontSize:14,color:"#555"}}>{moment(v.last_posted_at).fromNow()}</Text>	
											</View>
											<View style={{flexDirection:'row',backgroundColor:"#fff",alignItems:'center' }}>
												<Text style={{width:10,height:10,marginTop:2,backgroundColor:category_color}}></Text>
												<Text style={{marginLeft:5,fontSize:14}}>{category_name}</Text>
											</View>
											
											<Text style={{marginTop:8}}>{v.excerpt}</Text>
											
										</View>
										
									</View>)

								})
								: !loading && <Text style={{color:"#888",width:"100%",height:40,textAlign:"center"}}>没有记录</Text>
								}
							</View>
						}
					

						
						<TouchableOpacity style={{flexDirection:'row',backgroundColor:"#fff",alignItems:'center', justifyContent:'center',  textAlignVertical:'center'}} onPress={()=>{this.state.view == "reply" ? this.setState({view :null}) : this.setState({view :"reply"})}}>
							<Text style={{flex:1,height:50, paddingLeft:"2%",textAlignVertical:'center',fontSize:16,color:"#555"}}>
								回复
							</Text>
							{this.state.view == "reply" ?
							<SvgXml style={{marginRight:"5%"}} width="15" height="15" xml={images.up}/>
							: 
							<SvgXml style={{marginRight:"5%"}} width="15" height="15" xml={images.down}/> 
							}
						</TouchableOpacity>
						{view == "reply" &&
							<View style={{paddingLeft:"3%",paddingRight:"3%"}}>
								{actions_reply.length !=0 ? actions_reply.map((v,k)=>{
									let category_name,category_color ;

									categories.map((v1,k1)=>{
										if(v.category_id == v1.id){
											category_name = v1.name;
											category_color = "#"+v1.color;
										}

									})
									if(k > 4) return null;
									
									return(
									<View key = {k} style={
										k <4 ? {paddingTop:10,paddingBottom:10,width:"100%",backgroundColor:"#fff",flexDirection:'row',borderBottomWidth:1,borderColor:"#ccc"}
										:{paddingTop:10,paddingBottom:10,width:"100%",backgroundColor:"#fff",flexDirection:'row',borderBottomWidth:0,borderColor:"#ccc"}
									}>
										<View style={{marginRight:10}}>
											<Image style={{width:35,height:35,borderRadius:35,marginTop:4}} source={{uri: url + this.props.avatar_template }}></Image> 
										</View>
										<View style={{flex:1}}>
											<View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}>
												<Text onPress={() => navigation.navigate('TopicDetail',{tid:v.topic_id})} style={{flex: 1,marginRight:10,fontSize:16,color:"#4E6EF2"}}>{v.title}</Text>
												<Text style={{fontSize:14,color:"#555"}}>{moment(v.last_posted_at || v.bumped_at || v.created_at).fromNow()}</Text>	
											</View>
											<View style={{flexDirection:'row',backgroundColor:"#fff",alignItems:'center' }}>
												<Text style={{width:10,height:10,marginTop:2,backgroundColor:category_color}}></Text>
												<Text style={{marginLeft:5,fontSize:14}}>{category_name}</Text>
											</View>
											
											<Text style={{marginTop:8}}>{v.excerpt}</Text>
											
										</View>
										
									</View>)

								})
								: !loading && <Text style={{color:"#888",width:"100%",height:40,textAlign:"center"}}>没有记录</Text>
								}
							</View>
						}
					

					{is_current && <View>
						
						<TouchableOpacity style={{flexDirection:'row',backgroundColor:"#fff",alignItems:'center', justifyContent:'center',  textAlignVertical:'center'}} onPress={()=>{this.state.view == "drafts" ? this.setState({view :null}) : this.setState({view :"drafts"})}}>
							<Text style={{flex:1,height:50, paddingLeft:"2%",textAlignVertical:'center',fontSize:16,color:"#555"}}>
								草稿
							</Text>
							{this.state.view == "drafts" ?
							<SvgXml style={{marginRight:"5%"}} width="15" height="15" xml={images.up}/>
							: 
							<SvgXml style={{marginRight:"5%"}} width="15" height="15" xml={images.down}/> 
							}
						</TouchableOpacity>
						{view == "drafts" &&
							<View style={{paddingLeft:"3%",paddingRight:"3%"}}>
								{drafts.length !=0 ?drafts.map((v,k)=>{
									let category_name,category_color ;

									categories.map((v1,k1)=>{
										if(v.category_id == v1.id){
											category_name = v1.name;
											category_color = "#"+v1.color;
										}

									})
									if(k > 4) return null;
									
									return(
									<View key = {k} style={
										k <4 ? {paddingTop:10,paddingBottom:10,width:"100%",backgroundColor:"#fff",flexDirection:'row',borderBottomWidth:1,borderColor:"#ccc"}
										:{paddingTop:10,paddingBottom:10,width:"100%",backgroundColor:"#fff",flexDirection:'row',borderBottomWidth:0,borderColor:"#ccc"}
									}>
										<View style={{marginRight:10}}>
											<Image style={{width:35,height:35,borderRadius:35,marginTop:4}} source={{uri: url + this.props.avatar_template }}></Image> 
										</View>
										<View style={{flex:1}}>
											<View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}>
												<Text onPress={() => navigation.navigate('TopicDetail',{tid:v.topic_id})} style={{flex: 1,marginRight:10,fontSize:16,color:"#4E6EF2"}}>{v.title}</Text>
												<Text style={{fontSize:14,color:"#555"}}>{moment(v.last_posted_at || v.bumped_at || v.created_at).fromNow()}</Text>	
											</View>
											<View style={{flexDirection:'row',backgroundColor:"#fff",alignItems:'center' }}>
												<Text style={{width:10,height:10,marginTop:2,backgroundColor:category_color}}></Text>
												<Text style={{marginLeft:5,fontSize:14}}>{category_name}</Text>
											</View>
											
											<Text style={{marginTop:8}}>{v.excerpt}</Text>
											
										</View>
										
									</View>)

								})
								: !loading && <Text style={{color:"#888",width:"100%",height:40,textAlign:"center"}}>没有记录</Text>
								}
							</View>
						}
						</View>
					}
						
						<TouchableOpacity style={{flexDirection:'row',backgroundColor:"#fff",alignItems:'center', justifyContent:'center',  textAlignVertical:'center'}} onPress={()=>{this.state.view == "likes" ? this.setState({view :null}) : this.setState({view :"likes"})}}>
							<Text style={{flex:1,height:50, paddingLeft:"2%",textAlignVertical:'center',fontSize:16,color:"#555"}}>
								送出赞
							</Text>
							{this.state.view == "likes" ?
							<SvgXml style={{marginRight:"5%"}} width="15" height="15" xml={images.up}/>
							: 
							<SvgXml style={{marginRight:"5%"}} width="15" height="15" xml={images.down}/> 
							}
						</TouchableOpacity>
						{view == "likes" &&
							<View style={{paddingLeft:"3%",paddingRight:"3%"}}>
								{actions_likes.length !=0 ? actions_likes.map((v,k)=>{
									let category_name,category_color ;

									categories.map((v1,k1)=>{
										if(v.category_id == v1.id){
											category_name = v1.name;
											category_color = "#"+v1.color;
										}

									})
									if(k > 4) return null;
									
									return(
									<View key = {k} style={
										k <4 ? {paddingTop:10,paddingBottom:10,width:"100%",backgroundColor:"#fff",flexDirection:'row',borderBottomWidth:1,borderColor:"#ccc"}
										:{paddingTop:10,paddingBottom:10,width:"100%",backgroundColor:"#fff",flexDirection:'row',borderBottomWidth:0,borderColor:"#ccc"}
									}>
										<View style={{marginRight:10}}>
											<Image style={{width:35,height:35,borderRadius:35,marginTop:4}} source={{uri: url + v.avatar_template.replace("{size}",64) }}></Image> 
										</View>
										<View style={{flex:1}}>
											<View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}>
												<Text onPress={() => navigation.navigate('TopicDetail',{tid:v.topic_id})} style={{flex: 1,marginRight:10,fontSize:16,color:"#4E6EF2"}}>{v.title}</Text>
												<Text style={{fontSize:14,color:"#555"}}>{moment(v.last_posted_at || v.bumped_at || v.created_at).fromNow()}</Text>	
											</View>
											<View style={{flexDirection:'row',backgroundColor:"#fff",alignItems:'center' }}>
												<Text style={{width:10,height:10,marginTop:2,backgroundColor:category_color}}></Text>
												<Text style={{marginLeft:5,fontSize:14}}>{category_name}</Text>
											</View>
											
											<Text style={{marginTop:8}}>{v.excerpt.replace(/<a.*?>/g,"").replace(/<\/a>/g,"")}</Text>
										</View>
										
									</View>)

								})
								: !loading && <Text style={{color:"#888",width:"100%",height:40,textAlign:"center"}}>没有记录</Text>
								}
							</View>
						}
					


					{is_current && <View>
						
						<TouchableOpacity style={{flexDirection:'row',backgroundColor:"#fff",alignItems:'center', justifyContent:'center',  textAlignVertical:'center'}} onPress={()=>{this.state.view == "actions_bookmarks" ? this.setState({view :null}) : this.setState({view :"actions_bookmarks"})}}>
							<Text style={{flex:1,height:50, paddingLeft:"2%",textAlignVertical:'center',fontSize:16,color:"#555"}}>
								收藏
							</Text>
							{this.state.view == "actions_bookmarks" ?
							<SvgXml style={{marginRight:"5%"}} width="15" height="15" xml={images.up}/>
							: 
							<SvgXml style={{marginRight:"5%"}} width="15" height="15" xml={images.down}/> 
							}
						</TouchableOpacity>
						{view == "actions_bookmarks" &&
							<View style={{paddingLeft:"3%",paddingRight:"3%"}}>
								{actions_bookmarks.length != 0 ? actions_bookmarks.map((v,k)=>{
									let category_name,category_color ;

									categories.map((v1,k1)=>{
										if(v.category_id == v1.id){
											category_name = v1.name;
											category_color = "#"+v1.color;
										}

									})
									if(k > 4) return null;
									
									return(
									<View key = {k} style={
										k <4 ? {paddingTop:10,paddingBottom:10,width:"100%",backgroundColor:"#fff",flexDirection:'row',borderBottomWidth:1,borderColor:"#ccc"}
										:{paddingTop:10,paddingBottom:10,width:"100%",backgroundColor:"#fff",flexDirection:'row',borderBottomWidth:0,borderColor:"#ccc"}
									}>
										<View style={{marginRight:10}}>
											<Image style={{width:35,height:35,borderRadius:35,marginTop:4}} source={{uri: url + v.avatar_template.replace("{size}",64) }}></Image> 
										</View>
										<View style={{flex:1}}>
											<View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}>
												<Text onPress={() => navigation.navigate('TopicDetail',{tid:v.topic_id})} style={{flex: 1,marginRight:10,fontSize:16,color:"#4E6EF2"}}>{v.title}</Text>
												<Text style={{fontSize:14,color:"#555"}}>{moment(v.last_posted_at || v.bumped_at || v.created_at).fromNow()}</Text>	
											</View>
											<View style={{flexDirection:'row',backgroundColor:"#fff",alignItems:'center' }}>
												<Text style={{width:10,height:10,marginTop:2,backgroundColor:category_color}}></Text>
												<Text style={{marginLeft:5,fontSize:14}}>{category_name}</Text>
											</View>
											
											<Text style={{marginTop:8}}>{v.excerpt.replace(/<a.*?>/g,"").replace(/<\/a>/g,"")}</Text>
										</View>
										
									</View>)

								})

								: !loading && <Text style={{color:"#888",width:"100%",height:40,textAlign:"center"}}>没有收藏。</Text>
								}
							</View>
						}
					</View>
				}

				</View>
			
			{loading &&
				<View style={{width:"100%",alignItems:"center"}} >
					<Image style={{width:20,height:20}}  source={ loadingImage }/>
				</View>
			}	
			</ScrollView>
		)
	}
}	
export default Activity;