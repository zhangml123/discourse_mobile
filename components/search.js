/**

*/
import React, { Component } from 'react';
import {Button, Text, View, Image, StyleSheet, BackHandler, TouchableOpacity, Platform, TextInput, Dimensions, FlatList} from 'react-native';
import { search } from "../request/discourse_api";
import { _getUsers} from '../models/auth';
import  config from '../config';
import loadingImage from '../images/loading.gif';
const url = config.SERVER_URL;
const dimensions = Dimensions.get('window');
const windowWidth = dimensions.width;
const windowHeight = dimensions.height;
class Search extends Component {
	constructor(props){
		super(props)
		this.state={
			errorMsg:null,
			page:1,
			posts:[],
			searchText:this.props.route.params.searchText ? this.props.route.params.searchText:null,
			searchButtonEnable:true,
			loading:false,
			have_no_item :false

		}
	}
	componentDidMount (){
		const {navigation } = this.props;
 		navigation.setOptions({
			title: "搜索",
			headerStyle: {
	            height:40,
	        }
		});

		if(this.props.route.params.searchText){
			this.GetInfo(this.props.route.params.searchText,1);
		}
	    
    }
	GetInfo = async (searchText, page)=>{
		console.log("searchText = "+searchText)
		console.log("page = "+page)
		this.setState({have_no_item:false})
		if(searchText == null || searchText == "") return;
		if(searchText.length <=2){
			this.setState({
				errorMsg:"你的搜索词太短。"
			})
			return;
		}
		this.setState({
			errorMsg:null,
			loading:true
		})
		const users = await _getUsers();
		
		const csrf = JSON.parse(users)[0] !=null ? JSON.parse(users)[0].csrf :null;
		
		let data={
			q:searchText,
			page:page
		}
		const rs = await search(data,csrf);
		
		const new_posts = rs.posts;
		if(new_posts.length == 0 && page ==1){
			this.setState({
				errorMsg:"没有找到结果。",
				loading:false
			})
			return;
		}
		const topics = rs.topics;
		console.log("posts.length = " + new_posts.length)
		new_posts.map((v,k)=>{
			topics.map((v1,k1)=>{
				if(v.topic_id == v1.id){
					new_posts[k].title = v1.title
				}
			})
		})
		let have_no_item = this.state.have_no_item;
		if(new_posts.length == 0 ) have_no_item = true;
		const posts = this.state.posts;
		posts.push.apply(posts,new_posts);
		this.setState({
			have_no_item:have_no_item,
			posts:posts,
			page:page,
			loading:false
		})
	}
	searchChange=(search)=>{
		this.setState({
			errorMsg:null,
			have_no_item:false,
			posts:[]

		})
		if(search == null || search == "") return;
    	this.setState({
    		searchText: search,
    	})
    }
	searchPress = ()=>{
		this.GetInfo(this.state.searchText,1);
	}
	loadItems=()=>{
		console.log("loaditems")

    	const {searchText, page, loading, have_no_item } = this.state;
    	if( loading == true || have_no_item == true) return false;
    	console.log("loading")
    	this.setState({
    		loading:true
    	})
    	
    	let new_page = page + 1
        this.GetInfo(searchText, new_page);
	}
	render(){
		const {errorMsg, posts, searchButtonEnable, loading, have_no_item} = this.state;
		const height = windowHeight;
		const navigation = this.props.navigation;
		return(
			<View style={{flex:1,backgroundColor:"#fff",padding:2}}>
				<View style={{backgroundColor:"#fff",flexDirection:"row"}}>
			   		<Image style={{width:28,height:28,position:"absolute",left:"2%",top:10,zIndex:1 }} source={require("../images/search.png")}></Image>
				    <TextInput defaultValue = {this.props.route.params.searchText || ""} style={{fontSize:16,paddingLeft:"10%",backgroundColor:"#eee",width:"90%",height:40,marginTop:5,paddingRight:50,borderRadius:2}} onChangeText={this.searchChange}  placeholder = '请输入搜索内容' />
		    		{searchButtonEnable && <Text onPress={this.searchPress} style={{color:"#fff",width:50,height:40,backgroundColor:"#888",marginTop:5,borderTopRightRadius:2,borderBottomRightRadius:2,position:"absolute",right:0,textAlign:'center', alignItems:'center', justifyContent:'center',  textAlignVertical:'center'}}>搜索</Text>
	    			}
	    		</View>
				{errorMsg && <Text style={{fontSize:16,textAlign:"center",marginTop:10}}>{errorMsg}</Text>}

				{posts.length !=0 &&
				<FlatList
					style={{marginTop:10,paddingLeft:5,paddingRight:5}}
					keyExtractor={(item, index) => index.toString()}
					data={posts}
					renderItem={
					({item}) => 
					<View style={{width:"100%",marginBottom:30,backgroundColor:"#fff",flexDirection:'row'}}>
						<TouchableOpacity  >
					    	<Image style={{width:40,height:40,borderRadius:40,}} source={{uri: url + item.avatar_template.replace("{size}",64) }}></Image> 
						</TouchableOpacity>
						<View style={{flex:1,marginLeft:10}}>{console.log(item)}
							<Text onPress={()=>navigation.navigate('TopicDetail',{tid:item.topic_id,post_id:item.id})} style={{flex:1,paddingBottom:5,fontSize:18,color:"#0000ff"}}>{item.title}</Text>
							<Text style={{flex:1,backgroundColor:"#fff"}}>{item.blurb}</Text>

						</View>
					</View>

					}

					onEndReachedThreshold = {0.0001}
					onEndReached={this.loadItems}
					ListFooterComponent = {()=>{
            		  	if(have_no_item){
            		  		return <View style={{width:"100%",alignItems:"center"}} ><Text style={{height:40,fontSize:16,marginTop:10}}>没有找到更多结果。</Text></View>
            		  
            		  	}else{
							return null
            		  	}
            		  } 
            		}
					/>	
				}
				{loading && <View style={{width:"100%",alignItems:"center"}} >
					<Image style={{width:20,height:20}} source={ loadingImage }/>
				</View>}
				
			</View>
		)
	}
}	
export default Search;