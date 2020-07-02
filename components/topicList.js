/**

*/
import React, { Component } from 'react';
import Header from "./header";
import Dropdown from "./dropdown";
import {Button, Text, View, Image, StyleSheet, BackHandler, TouchableOpacity, Platform, TextInput, Dimensions, FlatList} from 'react-native';
import { getCategories, getTopics } from "../request/discourse_api";
import TopicDetail from './topicDetail';
import commonStyle from "./commonStyle";
import topicListStyle from "./topicListStyle";
import loadingImage from '../images/loading.gif';
import config from '../config';
import moment from 'moment';
const url = config.SERVER_URL;
class TopicList extends Component {
	constructor(props){
      super(props);
      this.state = {
           categories:[] ,
           topic_list:[],
           loading:true,
           type:this.props.route.params.type,
           c:this.props.route.params.c,
           id:this.props.route.params.id,
           categories:this.props.route.params.categories,
           page:0,
           per_page:50,
           have_no_item:false
           
      }
      
  	}
	componentDidMount (){
		//this.setTimeFormat();
		const {navigation } = this.props;
		navigation.setOptions({
			title:"主题",
        	headerStyle: {
	            height:45
	        }
		})
		const {type, c, id, page, per_page} = this.state;
        this.GetInfo(type, c, id, page, per_page);
    }
    GetInfo = async (type, c, id, page, per_page) => {
        try{
           let path = ""
           if(c && id) path += "/c/"+c+"/"+id;
           if(c && id && type) path += "/l";
           if(type) path += "/"+type;
           path += ".json";
       	   path += "?page="+page+"&per_page="+per_page;
       	   
           const topics = await getTopics(path);
           const users = topics.users;
           let topic_list = this.state.topic_list;
           let new_topic_list = topics.topic_list.topics;
           console.log("new_topic_list .length = " +new_topic_list.length)
			new_topic_list.map((v,k)=>{
				users.map((v1,k1)=>{
					if(v.last_poster_username === v1.username){
						v["last_poster_avatar_template"]=v1.avatar_template
					}
				})
				topic_list.push(v)
			})
			let have_no_item = this.state.have_no_item;
			if(new_topic_list.length == 0 ) have_no_item = true;

           this.setState({
           	topic_list:topic_list,
           	have_no_item:have_no_item,
           	page:page,
           	loading:false
           })
        }catch(e){
        }
    }
    changeCategory = (c,id)=>{

    	this.setState({
           	topic_list:null,
           	loading:true
        })
    	
    	const { type } = this.state;
    	this.GetInfo(type, c, id);
    }

    refresh=(rs)=>{
    	return false;
    }
    loadItems = ()=>{
    	console.log("loaditems")

    	const {type, c, id, page, per_page, loading, have_no_item } = this.state;


    	if( loading == true || have_no_item == true) return false;
    	console.log("loading")
    	this.setState({
    		loading:true
    	})
    	
    	let new_page = page + 1
        this.GetInfo(type, c, id, new_page, per_page);
    }

	render(){
		//console.log(this.prop
		const {categories, topic_list, loading, c, have_no_item} = this.state;
		const {navigation } = this.props;
		const type = this.props.route.params.type;
		return(
			<>
			<View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start',padding:2,backgroundColor:"#fff"}}>
				
				<Header navigation = {navigation} refresh = {this.refresh} categories = {categories}/> 
				<Dropdown categories = {categories} currentCategory = {c} changeCategory = {this.changeCategory}/>
				<View style={commonStyle.viewCategory} >
				{ type == "latest" ? <Text style ={commonStyle.currentCategoryBtn} onPress={() => navigation.navigate('TopicList',{type:"latest"})}>最新</Text>
					: <Text style ={commonStyle.categoryBtn} onPress={() => navigation.navigate('TopicList',{type:"latest"})}>最新</Text>
					}

					{type =="top"?<Text style ={commonStyle.currentCategoryBtn} onPress={() => navigation.navigate('TopicList',{type:"top"})}>热门</Text>
				:<Text style ={commonStyle.categoryBtn} onPress={() => navigation.navigate('TopicList',{type:"top"})}>热门</Text>
				}
				</View>
				<View style={commonStyle.content}>
					
					{!loading && topic_list.length == 0 ? 
						<View style={{width:"100%",alignItems:"center",padding:20}} >
							<Text>此分类没有主题</Text>
						</View> 
					: 

					<View style={{flex:1}}>
						<View style={{flexDirection:'row',justifyContent:'space-between'}} >
					    	<Text style={{width:"70%",padding:10}}>主题</Text>
					    	<Text style={{width:"15%",padding:10}}>回复</Text>
					    	<Text style={{width:"15%",padding:10}}>活动</Text>
				    	</View>
				    	{console.log(topic_list.length)}
				    	{topic_list.length != 0 && 
							<FlatList
							  style={{flex:1,backgroundColor:"#fff"}}
							  keyExtractor={(item, index) => index.toString()}
							  data={topic_list}
							  renderItem={
							    ({item}) => {
							    return <View style={topicListStyle.itemView}>
							    	<View style={{flexDirection:'row',justifyContent:'space-between', alignItems:'center' , textAlignVertical:'center'}} >
								    	<Text style={topicListStyle.topicTittle}  onPress={() => navigation.navigate('TopicDetail',{tid:item.id})}>{item.title}</Text>
								    	<Image style={{width:30,height:30,marginLeft:20,borderRadius:30}}  source={{uri: url + item.last_poster_avatar_template.replace("{size}",64) }}/>
								    	<Text  style={{width:"10%",textAlign:"right"}}>{item.posts_count -1 >= 0 ? item.posts_count -1 : 0 }</Text>
								    	<Text  style={{width:"20%",textAlign:"right"}}>{moment(item.last_posted_at ? item.last_posted_at : item.created_at).fromNow()}</Text>
							    	</View>
							    </View>
							    }
							  } 
							  onEndReachedThreshold = {0.0001}
							  onEndReached={this.loadItems}
							/>	
						}
						{loading ? 
							<View style={{width:"100%",alignItems:"center"}} >
								<Image  source={ loadingImage }/>
							</View>
						:null}

					</View>
					}
      			</View>
      			{have_no_item &&  <Text style={{height:40,fontSize:16}}>没有更多{c}的主题了</Text>}	
      		</View>
		</>
		);
	}
}

export default TopicList;