/**

*/
import React, { Component } from 'react';
import {Button,ScrollView, Text, View, Image, StyleSheet, BackHandler, TouchableOpacity, Platform, TextInput} from 'react-native';
import { getCsrf, getSummary } from "../../request/discourse_api";
import moment from 'moment';
import { timeFormate } from '../../models/times';
import  config from '../../config';
const url = config.SERVER_URL;
class Summary extends Component {
	constructor(props){
		super(props);
		this.state={
			view:"statistics",
			summary:null
		}
	}
	componentDidMount (){

		//console.log(timeFormate(10003330));

		this.GetInfo();
	}
	GetInfo = async () => {
		try{
			const csrf = await getCsrf();
			const summary = await getSummary(this.props.username,csrf.csrf);
			console.log(summary)

			const topics = summary.topics;
			const replies = summary.user_summary.replies;
			const links = summary.user_summary.links;
			topics.map((v,k)=>{
				replies.map((v1,k1)=>{
					if(v1.topic_id === v.id){
						summary.user_summary.replies[k1].title = v.title
					}
				})
				links.map((v2,k2)=>{
					if(v2.topic_id === v.id){
						summary.user_summary.links[k2].topic_title = v.title
					}
				})
			})
			this.setState({
				summary:summary
			})
		}catch(e){
			console.log(e)
		}
	}

	render(){
		const {view, summary} = this.state;
		return(
			<ScrollView style={{flex: 1}}>
				{summary ? 

					<View>

					<View style={{flex:1,borderBottomWidth:2,borderColor:"#999"}}>
					<Text style={{width:"100%",height:50,fontWeight:"bold", paddingLeft:"2%",fontSize:20,color:"#333",alignItems:'center', justifyContent:'center',  textAlignVertical:'center'}}>
						统计
					</Text>
					
					<View>
						<View style={{width:"100%",height:40,flexDirection:'row',paddingLeft:"2%",paddingRight:"2%"}}>
							<Text style={{width:"32%",height:40}}>访问天数 {summary.user_summary.days_visited} </Text>
							<Text style={{width:"32%",height:40}}>阅读时间 { timeFormate(summary.user_summary.time_read) } </Text>
								
						</View>
						<View style={{width:"100%",height:40,flexDirection:'row',paddingLeft:"2%",paddingRight:"2%"}}>
								<Text style={{width:"32%",height:40}}>已阅主题 {summary.user_summary.topics_entered}</Text>
								<Text style={{width:"32%",height:40}}>阅读帖子 { summary.user_summary.posts_read_count}</Text>
								<Text style={{width:"32%",height:40}}>送出赞 { summary.user_summary.likes_given}</Text>
						</View>
						<View style={{width:"100%",height:40,flexDirection:'row',paddingLeft:"2%",paddingRight:"2%"}}>
								<Text style={{width:"32%",height:40}}>创建主题 {summary.user_summary.topic_count}</Text>
								<Text style={{width:"32%",height:40}}>发布帖子 {summary.user_summary.post_count}</Text>
								<Text style={{width:"32%",height:40}}>收到赞 {summary.user_summary.likes_received}</Text>
						</View>
					</View>
					
				</View>
				<View style={{flex:1,borderBottomWidth:2,borderColor:"#999"}}>
					<Text onPress={()=>{this.state.view == "replies" ? this.setState({view :null}) : this.setState({view :"replies"})}} style={{width:"100%",height:50,fontWeight:"bold", paddingLeft:"2%",fontSize:20,color:"#333", alignItems:'center', justifyContent:'center',  textAlignVertical:'center'}}>
						热门回复
					</Text>
					{view == "replies" && 
						<View>
							{summary.user_summary.replies.map((v,k)=>{
								return(
								<View key = {k} style={{marginTop:5,width:"100%",height:60,backgroundColor:"#fff",paddingLeft:10,marginLeft:2,borderLeftWidth:4,borderColor:"#bbb"}}>
									<Text style={{fontSize:20,color:"#555"}}>{moment(v.created_at).fromNow()}</Text>
									<Text style={{fontSize:20,color:"#0000ff"}}>{v.title}</Text>
								</View>)

							})}
						</View>
					}
				</View>
				<View style={{flex:1,borderBottomWidth:2,borderColor:"#999"}}>
					<Text onPress={()=>{this.state.view == "topics" ? this.setState({view :null}) : this.setState({view :"topics"})}} style={{width:"100%",height:50,fontWeight:"bold", paddingLeft:"2%",fontSize:20,color:"#333", alignItems:'center', justifyContent:'center',  textAlignVertical:'center'}}>
						热门主题
					</Text>
					{view == "topics" && 
						<View>
							{summary.topics.map((v,k)=>{
								return(
								<View key = {k} style={{marginTop:5,width:"100%",height:60,backgroundColor:"#fff",paddingLeft:10,marginLeft:2,borderLeftWidth:4,borderColor:"#bbb"}}>
									<Text style={{fontSize:20,color:"#555"}}>{moment(v.created_at).fromNow()}</Text>
									<Text style={{fontSize:20,color:"#0000ff"}}>{v.title}</Text>
								</View>)

							})}
						</View>
					}
				</View>
				<View style={{flex:1,borderBottomWidth:2,borderColor:"#999"}}>
					<Text onPress={()=>{this.state.view == "links" ? this.setState({view :null}) : this.setState({view :"links"})}} style={{width:"100%",height:50,fontWeight:"bold", paddingLeft:"2%",fontSize:20,color:"#333", alignItems:'center', justifyContent:'center',  textAlignVertical:'center'}}>
						热门链接
					</Text>
					{view == "links" && 
						<View>
							{summary.user_summary.links.map((v,k)=>{
								return(
								<View key = {k} style={{marginTop:5,width:"100%",height:60,backgroundColor:"#fff",paddingLeft:10,marginLeft:2,borderLeftWidth:4,borderColor:"#bbb"}}>
									<Text style={{fontSize:20,color:"#555"}}>{v.url}</Text>
									<Text style={{fontSize:20,color:"#0000ff"}}>{v.topic_title}</Text>
								</View>)

							})}
						</View>
					}
				</View>
				<View style={{flex:1,borderBottomWidth:2,borderColor:"#999"}}>
					<Text onPress={()=>{this.state.view == "replied" ? this.setState({view :null}) : this.setState({view :"replied"})}} style={{width:"100%",height:50,fontWeight:"bold", paddingLeft:"2%",fontSize:20,color:"#333", alignItems:'center', justifyContent:'center',  textAlignVertical:'center'}}>
						最多回复至
					</Text>
					{view == "replied" && 
						<View>
							{summary.user_summary.most_replied_to_users.map((v,k)=>{
								return(
								<View key = {k} style={{marginTop:5,width:"100%",height:60,backgroundColor:"#fff",paddingLeft:10,marginLeft:2,borderLeftWidth:4,borderColor:"#bbb",flexDirection:'row'}}>
									<Image style={{width:50,height:50,borderRadius:50,}} source={{uri: url + v.avatar_template.replace("{size}",64) }}></Image>
									<View style={{marginLeft:10}}>
										<Text style={{fontSize:20,fontWeight:"bold"}}>{v.username}</Text>
										<Text style={{fontSize:20}}>{v.count}</Text>
									</View>
								</View>)

							})}
							
						</View>
					}
				</View>
				<View style={{flex:1,borderBottomWidth:2,borderColor:"#999"}}>
					<Text onPress={()=>{this.state.view == "liked_by" ? this.setState({view :null}) : this.setState({view :"liked_by"})}} style={{width:"100%",height:50,fontWeight:"bold", paddingLeft:"2%",fontSize:20,color:"#333", alignItems:'center', justifyContent:'center',  textAlignVertical:'center'}}>
						谁赞最多
					</Text>
					{view == "liked_by" && 
						<View>
							{summary.user_summary.most_liked_by_users.map((v,k)=>{
								return(
								<View key = {k} style={{marginTop:5,width:"100%",height:60,backgroundColor:"#fff",paddingLeft:10,marginLeft:2,borderLeftWidth:4,borderColor:"#bbb",flexDirection:'row'}}>
									<Image style={{width:50,height:50,borderRadius:50,}} source={{uri: url + v.avatar_template.replace("{size}",64) }}></Image>
									<View style={{marginLeft:10}}>
										<Text style={{fontSize:20,fontWeight:"bold"}}>{v.username}</Text>
										<Text style={{fontSize:20}}>{v.count}</Text>
									</View>
								</View>)

							})}
							
						</View>
					}
				</View>
				<View style={{flex:1,borderBottomWidth:2,borderColor:"#999"}}>
					<Text onPress={()=>{this.state.view == "liked_users" ? this.setState({view :null}) : this.setState({view :"liked_users"})}} style={{width:"100%",height:50,fontWeight:"bold", paddingLeft:"2%",fontSize:20,color:"#333", alignItems:'center', justifyContent:'center',  textAlignVertical:'center'}}>
						赞谁最多
					</Text>
					{view == "liked_users" &&  
						<View>
							{summary.user_summary.most_liked_users.map((v,k)=>{
								return(
								<View key = {k} style={{marginTop:5,width:"100%",height:60,backgroundColor:"#fff",paddingLeft:10,marginLeft:2,borderLeftWidth:4,borderColor:"#bbb",flexDirection:'row'}}>
									<Image style={{width:50,height:50,borderRadius:50,}} source={{uri: url + v.avatar_template.replace("{size}",64) }}></Image>
									<View style={{marginLeft:10}}>
										<Text style={{fontSize:20,fontWeight:"bold"}}>{v.username}</Text>
										<Text style={{fontSize:20}}>{v.count}</Text>
									</View>
								</View>)

							})}
							
						</View>
					}
				</View>
				<View style={{flex:1,borderBottomWidth:2,borderColor:"#999"}}>
					<Text onPress={()=>{this.state.view == "categories" ? this.setState({view :null}) : this.setState({view :"categories"})}} style={{width:"100%",height:50,fontWeight:"bold", paddingLeft:"2%",fontSize:20,color:"#333", alignItems:'center', justifyContent:'center',  textAlignVertical:'center'}}>
						热门分类
					</Text>
					{view == "categories" &&  
						<View style={{fontSize:16}}>
							<View style={{flexDirection:'row',padding:10}}>
								<Text style={{flex:3}}></Text>
								<Text style={{flex:1,textAlign:"center",alignItems:'center', justifyContent:'center',  textAlignVertical:'center'}}>主题</Text>
								<Text style={{flex:1,textAlign:"center",alignItems:'center', justifyContent:'center',  textAlignVertical:'center'}}>回复</Text>
							</View>
							{summary.user_summary.top_categories.map((v,k)=>{
								return(
									<View style={{flexDirection:'row',padding:10}}>
										<Text style={{flex:3}}>{v.name}</Text>
										<Text style={{flex:1,textAlign:"center",alignItems:'center', justifyContent:'center',  textAlignVertical:'center'}}>{v.topic_count}</Text>
										<Text style={{flex:1,textAlign:"center",alignItems:'center', justifyContent:'center',  textAlignVertical:'center'}}>{v.post_count}</Text>

									</View>
										
								)

							})}
						</View>
					}
				</View>
				<View style={{flex:1,borderBottomWidth:2,borderColor:"#999"}}>
					<Text style={{width:"100%",height:50,fontWeight:"bold", paddingLeft:"2%",fontSize:20,color:"#333", alignItems:'center', justifyContent:'center',  textAlignVertical:'center'}}>
						热门徽章
					</Text>
					{view == "reply" && 
						<View>
							<View style={{width:"100%",height:40,flexDirection:'row',paddingLeft:"2%",paddingRight:"2%"}}>
								<Text style={{width:"32%",height:40}}>访问天数</Text>
								<Text style={{width:"32%",height:40}}>阅读时间</Text>
									
							</View>
							<View style={{width:"100%",height:40,flexDirection:'row',paddingLeft:"2%",paddingRight:"2%"}}>
									<Text style={{width:"32%",height:40}}>已阅主题</Text>
									<Text style={{width:"32%",height:40}}>阅读帖子</Text>
									<Text style={{width:"32%",height:40}}>送出赞</Text>
							</View>
							<View style={{width:"100%",height:40,flexDirection:'row',paddingLeft:"2%",paddingRight:"2%"}}>
									<Text style={{width:"32%",height:40}}>创建主题</Text>
									<Text style={{width:"32%",height:40}}>发布帖子</Text>
									<Text style={{width:"32%",height:40}}>收到赞</Text>
							</View>
						</View>
					}
				</View>


					</View>

					: null}
				
			</ScrollView>
		)
	}
}	
export default Summary;