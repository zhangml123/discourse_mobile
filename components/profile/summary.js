/**

*/
import React, { Component } from 'react';
import {Button,ScrollView, Text, View, Image, StyleSheet, BackHandler, TouchableOpacity, Platform, TextInput} from 'react-native';
import {  getSummary } from "../../request/discourse_api";
import moment from 'moment';
import { timeFormate } from '../../models/times';
import  config from '../../config';
import { SvgXml } from 'react-native-svg';
import images from '../../images/images';
import HTMLView from 'react-native-htmlview';
import loadingImage from '../../images/loading.gif';
import {_getUsers} from '../../models/auth';

const url = config.SERVER_URL;
class Summary extends Component {
	constructor(props){
		super(props);
		this.state={
			view:"statistics",
			summary:null,
			loading:true
		}
	}
	componentDidMount (){
		this.GetInfo();
	}
	GetInfo = async () => {
		try{
			const currentUser = await _getUsers();
			const csrf = JSON.parse(currentUser)[0] !=null && JSON.parse(currentUser)[0] != "undefind" ? JSON.parse(currentUser)[0].csrf :null;
			const summary = await getSummary(this.props.username, csrf);
			
			const topics = summary.topics;
			const badges = summary.badges;
			const replies = summary.user_summary.replies;
			const links = summary.user_summary.links;
			const summary_badges = summary.user_summary.badges;
			topics.map((v,k)=>{
				replies.map((v1,k1)=>{
					if(v1.topic_id === v.id){
						summary.user_summary.replies[k1].title = v.title;
					}
				})
				links.map((v2,k2)=>{
					if(v2.topic_id === v.id){
						summary.user_summary.links[k2].topic_title = v.title;
					}
				})
				
			})
			badges.map((v,k)=>{
				summary_badges.map((v3,k3)=>{
					if(v3.badge_id === v.id ){
						summary.user_summary.badges[k3].name = v.name;
						let description;
						description = v.description.replace(/<a.*?>/g,"");
						description = description.replace(/<\/a>/g,"");
						summary.user_summary.badges[k3].description = description ;
					}
				})
			})

			this.setState({
				summary:summary,
				loading:false
			})
		}catch(e){
			console.log(e)
		}
	}

	render(){
		const {view, summary, loading} = this.state;
		const navigation = this.props.navigation;

		return(
			<ScrollView style={{flex: 1}}>

				{summary && 
					<View>

					<View style={{flex:1,borderBottomWidth:2,borderColor:"#ccc"}}>
					<Text style={{width:"100%",height:50, paddingLeft:"2%",fontSize:16,color:"#555",alignItems:'center', justifyContent:'center',  textAlignVertical:'center'}}>
						统计
					</Text>
					
					<View>
						<View style={{width:"100%",height:40,flexDirection:'row',paddingLeft:"2%",paddingRight:"2%"}}>
							<View style={{width:"32%",flexDirection:'row'}}>
								<Text style={{height:40,color:"#666"}}>访问天数</Text>
							 	<Text style={{height:40}}> {summary.user_summary.days_visited}</Text>
							</View>
							<View style={{width:"32%",flexDirection:'row'}}>
								<Text style={{height:40,color:"#666"}}>阅读时间 </Text>
								<Text style={{height:40}}> { timeFormate(summary.user_summary.time_read) } </Text>
							</View>
						</View>
						<View style={{width:"100%",height:40,flexDirection:'row',paddingLeft:"2%",paddingRight:"2%"}}>
								<View style={{width:"32%",flexDirection:'row'}}>
									<Text style={{height:40,color:"#666"}}>已阅主题</Text> 
									<Text style={{height:40}}> {summary.user_summary.topics_entered}</Text>
								</View>
								<View style={{width:"32%",flexDirection:'row'}}>
									<Text style={{height:40,color:"#666"}}>阅读帖子</Text> 
									<Text style={{height:40}}> { summary.user_summary.posts_read_count}</Text>
								</View>
								<View style={{width:"32%",flexDirection:'row'}}>
									<Text style={{height:40,color:"#666"}}>送出赞</Text> 
									<Text style={{height:40}}> { summary.user_summary.likes_given} </Text>
									<SvgXml width="20" height="20" xml={images.heart3}/>
								</View>
						</View>
						<View style={{width:"100%",height:40,flexDirection:'row',paddingLeft:"2%",paddingRight:"2%"}}>
								
								<View style={{width:"32%",flexDirection:'row'}}>
									<Text style={{height:40,color:"#666"}}>创建主题</Text> 
									<Text style={{height:40}}> {summary.user_summary.topic_count}</Text>
								</View>
								<View style={{width:"32%",flexDirection:'row'}}>
									<Text style={{height:40,color:"#666"}}>发布帖子</Text> 
									<Text style={{height:40}}> { summary.user_summary.post_count}</Text>
								</View>
								<View style={{width:"32%",flexDirection:'row'}}>
									<Text style={{height:40,color:"#666"}}>收到赞</Text> 
									<Text style={{height:40}}> { summary.user_summary.likes_received} </Text>
									<SvgXml width="20" height="20" xml={images.heart3}/>
								</View>

						</View>
					</View>
					
				</View>
				<View style={{flex:1,borderBottomWidth:2,borderColor:"#ccc"}}>
					<TouchableOpacity style={{flexDirection:'row',backgroundColor:"#fff",alignItems:'center', justifyContent:'center',  textAlignVertical:'center'}} onPress={()=>{this.state.view == "replies" ? this.setState({view :null}) : this.setState({view :"replies"})}}>
						<Text style={{flex:1,height:50, paddingLeft:"2%",textAlignVertical:'center',fontSize:16,color:"#555"}}>
							热门回复
						</Text>
						{this.state.view == "replies" ?
						<SvgXml style={{marginRight:"5%"}} width="15" height="15" xml={images.up}/>
						: 
						<SvgXml style={{marginRight:"5%"}} width="15" height="15" xml={images.down}/> 
						}
					</TouchableOpacity>
					{view == "replies" && 
						<View>
							{summary.user_summary.replies.map((v,k)=>{
								return(
								<View key = {k} style={{marginTop:5,width:"100%",height:60,backgroundColor:"#fff",paddingLeft:10,marginLeft:2,borderLeftWidth:4,borderColor:"#bbb"}}>
									<Text style={{fontSize:16,color:"#555"}}>{moment(v.created_at).fromNow()}</Text>
									<Text onPress={() => navigation.navigate('TopicDetail',{tid:v.topic_id})} style={{fontSize:16,color:"#4E6EF2"}}>{v.title}</Text>
								</View>)

							})}
						</View>
					}
				</View>
				<View style={{flex:1,borderBottomWidth:2,borderColor:"#ccc"}}>

					<TouchableOpacity style={{flexDirection:'row',backgroundColor:"#fff",alignItems:'center', justifyContent:'center',  textAlignVertical:'center'}} onPress={()=>{this.state.view == "topics" ? this.setState({view :null}) : this.setState({view :"topics"})}}>
						<Text style={{flex:1,height:50, paddingLeft:"2%",textAlignVertical:'center',fontSize:16,color:"#555"}}>
							热门主题
						</Text>
						{this.state.view == "topics" ?
						<SvgXml style={{marginRight:"5%"}} width="15" height="15" xml={images.up}/>
						: 
						<SvgXml style={{marginRight:"5%"}} width="15" height="15" xml={images.down}/> 
						}
					</TouchableOpacity>

					{view == "topics" && 
						<View>
							{summary.topics.map((v,k)=>{
								return(
								<View key = {k} style={{marginTop:5,width:"100%",height:60,backgroundColor:"#fff",paddingLeft:10,marginLeft:2,borderLeftWidth:4,borderColor:"#bbb"}}>
									<Text style={{fontSize:16,color:"#555"}}>{moment(v.created_at).fromNow()}</Text>
									<Text  onPress={() => navigation.navigate('TopicDetail',{tid:v.id})} style={{fontSize:16,color:"#4E6EF2"}}>{v.title}</Text>
								</View>)

							})}
						</View>
					}
				</View>
				<View style={{flex:1,borderBottomWidth:2,borderColor:"#ccc"}}>
					
					<TouchableOpacity style={{flexDirection:'row',backgroundColor:"#fff",alignItems:'center', justifyContent:'center',  textAlignVertical:'center'}} onPress={()=>{this.state.view == "links" ? this.setState({view :null}) : this.setState({view :"links"})}}>
						<Text style={{flex:1,height:50, paddingLeft:"2%",textAlignVertical:'center',fontSize:16,color:"#555"}}>
							热门链接
						</Text>
						{this.state.view == "links" ?
						<SvgXml style={{marginRight:"5%"}} width="15" height="15" xml={images.up}/>
						: 
						<SvgXml style={{marginRight:"5%"}} width="15" height="15" xml={images.down}/> 
						}
					</TouchableOpacity>

					{view == "links" && 
						<View>
							{summary.user_summary.links.map((v,k)=>{
								return(
								<View key = {k} style={{marginTop:5,width:"100%",height:60,backgroundColor:"#fff",paddingLeft:10,marginLeft:2,borderLeftWidth:4,borderColor:"#bbb"}}>
									<Text style={{fontSize:16,color:"#555"}}>{v.url}</Text>
									<Text style={{fontSize:16,color:"#4E6EF2"}}>{v.topic_title}</Text>
								</View>)

							})}
						</View>
					}
				</View>
				<View style={{flex:1,borderBottomWidth:2,borderColor:"#ccc"}}>
					
					<TouchableOpacity style={{flexDirection:'row',backgroundColor:"#fff",alignItems:'center', justifyContent:'center',  textAlignVertical:'center'}} onPress={()=>{this.state.view == "replied" ? this.setState({view :null}) : this.setState({view :"replied"})}}>
						<Text style={{flex:1,height:50, paddingLeft:"2%",textAlignVertical:'center',fontSize:16,color:"#555"}}>
							最多回复至
						</Text>
						{this.state.view == "replied" ?
						<SvgXml style={{marginRight:"5%"}} width="15" height="15" xml={images.up}/>
						: 
						<SvgXml style={{marginRight:"5%"}} width="15" height="15" xml={images.down}/> 
						}
					</TouchableOpacity>
					{view == "replied" && 
						<View>
							{summary.user_summary.most_replied_to_users.map((v,k)=>{
								return(
								<View key = {k} style={{marginTop:5,width:"100%",height:60,backgroundColor:"#fff",paddingLeft:10,marginLeft:2,borderLeftWidth:4,borderColor:"#bbb",flexDirection:'row'}}>
									<Image style={{width:50,height:50,borderRadius:50,}} source={{uri: url + v.avatar_template.replace("{size}",64) }}></Image>
									<View style={{marginLeft:10}}>
										<Text style={{fontSize:16}}>{v.username}</Text>
										<Text style={{fontSize:16}}>{v.count}</Text>
									</View>
								</View>)

							})}
							
						</View>
					}
				</View>
				<View style={{flex:1,borderBottomWidth:2,borderColor:"#ccc"}}>
					
					<TouchableOpacity style={{flexDirection:'row',backgroundColor:"#fff",alignItems:'center', justifyContent:'center',  textAlignVertical:'center'}} onPress={()=>{this.state.view == "liked_by" ? this.setState({view :null}) : this.setState({view :"liked_by"})}}>
						<Text style={{flex:1,height:50, paddingLeft:"2%",textAlignVertical:'center',fontSize:16,color:"#555"}}>
							谁赞最多
						</Text>
						{this.state.view == "liked_by" ?
						<SvgXml style={{marginRight:"5%"}} width="15" height="15" xml={images.up}/>
						: 
						<SvgXml style={{marginRight:"5%"}} width="15" height="15" xml={images.down}/> 
						}
					</TouchableOpacity>
					{view == "liked_by" && 
						<View>
							{summary.user_summary.most_liked_by_users.map((v,k)=>{
								return(
								<View key = {k} style={{marginTop:5,width:"100%",height:60,backgroundColor:"#fff",paddingLeft:10,marginLeft:2,borderLeftWidth:4,borderColor:"#bbb",flexDirection:'row'}}>
									<Image style={{width:50,height:50,borderRadius:50,}} source={{uri: url + v.avatar_template.replace("{size}",64) }}></Image>
									<View style={{marginLeft:10}}>
										<Text style={{fontSize:16}}>{v.username}</Text>
										<Text style={{fontSize:16}}>{v.count}</Text>
									</View>
								</View>)

							})}
							
						</View>
					}
				</View>
				<View style={{flex:1,borderBottomWidth:2,borderColor:"#ccc"}}>
					
					<TouchableOpacity style={{flexDirection:'row',backgroundColor:"#fff",alignItems:'center', justifyContent:'center',  textAlignVertical:'center'}} onPress={()=>{this.state.view == "liked_users" ? this.setState({view :null}) : this.setState({view :"liked_users"})}}>
						<Text style={{flex:1,height:50, paddingLeft:"2%",textAlignVertical:'center',fontSize:16,color:"#555"}}>
							赞谁最多
						</Text>
						{this.state.view == "liked_users" ?
						<SvgXml style={{marginRight:"5%"}} width="15" height="15" xml={images.up}/>
						: 
						<SvgXml style={{marginRight:"5%"}} width="15" height="15" xml={images.down}/> 
						}
					</TouchableOpacity>
					{view == "liked_users" &&  
						<View>
							{summary.user_summary.most_liked_users.map((v,k)=>{
								return(
								<View key = {k} style={{marginTop:5,width:"100%",height:60,backgroundColor:"#fff",paddingLeft:10,marginLeft:2,borderLeftWidth:4,borderColor:"#bbb",flexDirection:'row'}}>
									<Image style={{width:50,height:50,borderRadius:50,}} source={{uri: url + v.avatar_template.replace("{size}",64) }}></Image>
									<View style={{marginLeft:10}}>
										<Text style={{fontSize:16}}>{v.username}</Text>
										<Text style={{fontSize:16}}>{v.count}</Text>
									</View>
								</View>)

							})}
							
						</View>
					}
				</View>
				<View style={{flex:1,borderBottomWidth:2,borderColor:"#ccc"}}>
					
					<TouchableOpacity style={{flexDirection:'row',backgroundColor:"#fff",alignItems:'center', justifyContent:'center',  textAlignVertical:'center'}} onPress={()=>{this.state.view == "categories" ? this.setState({view :null}) : this.setState({view :"categories"})}}>
						<Text style={{flex:1,height:50, paddingLeft:"2%",textAlignVertical:'center',fontSize:16,color:"#555"}}>
							热门分类
						</Text>
						{this.state.view == "categories" ?
						<SvgXml style={{marginRight:"5%"}} width="15" height="15" xml={images.up}/>
						: 
						<SvgXml style={{marginRight:"5%"}} width="15" height="15" xml={images.down}/> 
						}
					</TouchableOpacity>
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
				<View style={{flex:1,borderBottomWidth:2,borderColor:"#ccc"}}>
					
					<TouchableOpacity style={{flexDirection:'row',backgroundColor:"#fff",alignItems:'center', justifyContent:'center',  textAlignVertical:'center'}} onPress={()=>{this.state.view == "badges" ? this.setState({view :null}) : this.setState({view :"badges"})}}>
						<Text style={{flex:1,height:50, paddingLeft:"2%",textAlignVertical:'center',fontSize:16,color:"#555"}}>
							热门徽章
						</Text>
						{this.state.view == "badges" ?
						<SvgXml style={{marginRight:"5%"}} width="15" height="15" xml={images.up}/>
						: 
						<SvgXml style={{marginRight:"5%"}} width="15" height="15" xml={images.down}/> 
						}
					</TouchableOpacity>
					{view == "badges" && 
						<View style={{padding:20}}>
							{summary.user_summary.badges.map((v,k)=>{
								console.log(v)
								return(
									<View style={{padding:10,textAlign:"center",alignItems:"center",backgroundColor:"#f3f3f3",marginTop:10}}>
										<Text style={{fontSize:16}}>{v.name}</Text>	
										<Text style={{marginTop:5}}>{v.description}</Text>
										
									</View>
										
								)

							})}
						</View>
					}
				</View>


					</View>

				}

					{loading ? 
						<View style={{width:"100%",alignItems:"center"}} >
							<Image style={{width:20,height:20}}  source={ loadingImage }/>
						</View>
					:null}
					
			</ScrollView>
			
		)
	}
}	
export default Summary;