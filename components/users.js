/**

*/
import React, { Component } from 'react';
import {Button, Text, View, Image, StyleSheet, BackHandler, TouchableOpacity, Platform, TextInput, ScrollView, FlatList} from 'react-native';
import {_isLogin, _getUsers} from '../models/auth';
import { timeFormate } from '../models/times';
import {getUsersList } from "../request/discourse_api";
import { SvgXml } from 'react-native-svg';
import images from '../images/images';
import  config from '../config';
import loadingImage from '../images/loading.gif';
const url = config.SERVER_URL;
class Users extends Component {
	constructor(props){
		super(props)
		this.state = {
			directory_items:[],
			csrf:null,
			total_rows_directory_items:null,
			period:"all",
			order:"likes_received",
			page:0,
			loading:true
		}
	}
	componentDidMount (){
		const {navigation } = this.props;
 		navigation.setOptions({
			title: "用户",
			headerStyle: {
	            height:45
	        }
		});
		const {period, order, page}= this.state;
		this.GetInfo(period, order, page);

	}
	GetInfo = async(period, order, page)=>{
		const is_login =  await _isLogin();
		console.log("is_login = "+is_login)
		let is_current = false;
		let csrf = null;
		if(is_login){
			const currentUser = await _getUsers();
			csrf = JSON.parse(currentUser)[0].csrf;
		}
		const users = await getUsersList(period, order, page, csrf);
		const meta = users.meta
		const total_rows_directory_items = meta ? meta.total_rows_directory_items : users.total_rows_directory_items;
		const directory_items = this.state.directory_items ;
		const new_director_items = users.directory_items;
		directory_items.push.apply(directory_items,new_director_items);
		this.setState({
			page:page,
			directory_items:directory_items,
			total_rows_directory_items:total_rows_directory_items,
			csrf:csrf,
			loading:false
		})
	}
	loadItems = ()=>{
		const {loading} = this.state;
		if( loading == true ) {
    		return false;	
    	}
    	console.log("loadingdown")
		this.setState({
    		loading:true
    	})
		const {period, order, page}= this.state;
		const new_page = page + 1; 
		this.GetInfo(period, order, new_page);
	}
	render(){
		const {directory_items, total_rows_directory_items, loading} = this.state;
		const {categories, navigation} = this.props
		const header = ()=>{
			if(total_rows_directory_items){
				return(<Text style={{color:"#888",width:"100%",height:30,borderBottomWidth:1,borderColor:"#ccc",fontSize:16,paddingLeft:10}}>{total_rows_directory_items} 位用户</Text>) ;
			}else{
				 return null;
			}
		}
		return(
			<View style={{flex:1,backgroundColor:"#fff",padding:10}}>
				{directory_items.length != 0 && 
					<FlatList
					  ref={(flatlist)=>{this._flatList = flatlist; return this._flatList}}
					  style={{flex:1,backgroundColor:"#fff",padding:5,paddingTop:0}}
					  keyExtractor={(item, index) => index.toString()}
					  ListHeaderComponent ={header}
					  data={directory_items}
					  renderItem={
					    ({item,index}) => {
				    	let v= item;
				    	let k = index;
						return( <View style={{marginTop:20, borderBottomWidth:1,borderBottomColor:"#ccc"}}>

							<View >
								<TouchableOpacity style={{}} onPress={() =>navigation.navigate('Profile',{refresh:null,username:v.user.username})}>
											
								<View style={{flexDirection:'row'}}>
									<Image style={{width:50,height:50,borderRadius:50,}} source={{uri: url + v.user.avatar_template.replace("{size}",64) }}></Image>
									<View >
										<Text style={{fontSize:18,marginLeft:10}}>{v.user.username}</Text>
										<Text style={{fontSize:14,marginLeft:10}}>{v.user.name}</Text>
									</View>
								</View>
								</TouchableOpacity>
							</View>
							<View style = {{marginTop:20,marginBottom:10}}>
								<View style={{width:"100%",height:30,flexDirection:'row',paddingLeft:"2%",paddingRight:"2%"}}>
										<View style={{width:"50%",flexDirection:'row'}}>
											<Text style={{height:30,fontSize:16,color:"#000",fontWeight:"bold"}}>{v.likes_received} </Text>
											<SvgXml width="20" height="20" xml={images.heart3}/>
											<Text style={{height:30,fontSize:16,color:"#666"}}> 获得赞</Text> 
											
										</View>
										<View style={{width:"50%",flexDirection:'row'}}>
											<Text style={{height:30}}>{v.likes_given} </Text>
											<SvgXml width="20" height="20" xml={images.heart3}/>
											<Text style={{height:30,fontSize:16,color:"#666"}}> 送出赞</Text> 
											
										</View>
										
								</View>
								<View style={{width:"100%",height:30,flexDirection:'row',paddingLeft:"2%",paddingRight:"2%"}}>
										<View style={{width:"50%",flexDirection:'row'}}>
											<Text style={{height:30,fontSize:16,color:"#000",fontWeight:"bold"}}>{v.topic_count} </Text>
											<SvgXml width="20" height="20" xml={images.heart3}/>
											<Text style={{height:30,fontSize:16,color:"#666"}}> 主题</Text> 
											
										</View>
										<View style={{width:"50%",flexDirection:'row'}}>
											<Text style={{height:30}}>{v.post_count} </Text>
											<SvgXml width="20" height="20" xml={images.heart3}/>
											<Text style={{height:30,fontSize:16,color:"#666"}}> 回复</Text> 
											
										</View>
										
								</View>
								<View style={{width:"100%",height:30,flexDirection:'row',paddingLeft:"2%",paddingRight:"2%"}}>
										<View style={{width:"50%",flexDirection:'row'}}>
											<Text style={{height:30,fontSize:16,color:"#000",fontWeight:"bold"}}>{v.topics_entered} </Text>
											<SvgXml width="20" height="20" xml={images.heart3}/>
											<Text style={{height:30,fontSize:16,color:"#666"}}> 浏览</Text> 
											
										</View>
										<View style={{width:"50%",flexDirection:'row'}}>
											<Text style={{height:30}}>{v.posts_read} </Text>
											<SvgXml width="20" height="20" xml={images.heart3}/>
											<Text style={{height:30,fontSize:16,color:"#666"}}> 阅读</Text> 
											
										</View>
										
								</View>
								<View style={{width:"100%",height:30,flexDirection:'row',paddingLeft:"2%",paddingRight:"2%"}}>
										<View style={{width:"50%",flexDirection:'row'}}>
											<Text style={{height:30,fontSize:16,color:"#000",fontWeight:"bold"}}>{v.days_visited} </Text>
											<SvgXml width="20" height="20" xml={images.heart3}/>
											<Text style={{height:30,fontSize:16,color:"#666"}}> 访问</Text> 
											
										</View>
										<View style={{width:"50%",flexDirection:'row'}}>
											<Text style={{height:30}}>{timeFormate(v.time_read)} </Text>
											<SvgXml width="20" height="20" xml={images.heart3}/>
											<Text style={{height:30,fontSize:16,color:"#666"}}> 阅读时长</Text> 
											
										</View>
										
								</View>

							</View>

							</View>

						)}
					}
				 	onEndReachedThreshold = {1}
				  	onEndReached={this.loadItems}
				/>			
			}
			{loading ? 
				<View style={{width:"100%",alignItems:"center"}} >
					<Image style={{width:20,height:20}} source={ loadingImage }/>
				</View>
			:null}
			</View>
		)
	}
}	
export default Users;