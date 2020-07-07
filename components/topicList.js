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
import LinearGradient from 'react-native-linear-gradient'
const url = config.SERVER_URL;
class TopicList extends Component {
	constructor(props){
      super(props);
      this.state = {
           categories:this.props.route.params.categories,
           categoriesAll:this.props.route.params.categoriesAll,
           topic_list:[],
           loading:true,
           type:this.props.route.params.type,
           c:this.props.route.params.c,
           id:this.props.route.params.id,
           slug:this.props.route.params.slug,
           page:0,
           per_page:50,
           have_no_item:false,
           isLogin:null
      }
      
  	}
	componentDidMount (){
		//this.setTimeFormat();
		const {navigation } = this.props;
		navigation.setOptions({
			title:"主题",
        	headerStyle: {
	            height:40
	        }

		})
		
		const {type, c, id, slug, page, per_page} = this.state;
		console.log("componentDidMount page = " +page)
        this.GetInfo(type, c, id, slug, page, per_page);
    }
    
    GetInfo = async (type, c, id, slug, page, per_page) => {
        try{
        	
           let path = "";
           let defaultType = type ? type : "latest";
           //if(c && id) path += "/c/"+slug+"/"+id;
           if(c && id) path += "/c/"+id +"/l/";
           path += defaultType;
           path += ".json";
       	   path += "?page="+page+"&per_page="+per_page;
       	   console.log("path = "+path)
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
    changeCategory = (c, id, slug)=>{

    	this.setState({
           	topic_list:[],
           	c:c,
           	id:id,
           	slug:slug,
           	loading:true
        })
    	
    	const {type, per_page} = this.state;
    	
        this.GetInfo(type, c, id, slug, 0, per_page);
    }
    changeType = (type)=>{
    	console.log("asdfasd")
    	this.setState({
    		topic_list:[],
    		type:type,
    		loading:true
    	})
    	const {c, id, slug, per_page} = this.state;
        this.GetInfo(type, c, id, slug, 0, per_page);

    }

    refresh=(rs)=>{
    	//this.getCategory();
    	
    	this.props.route.params.refresh(rs)
    	if(rs) {
    		this.setState({ isLogin:true})
    	}else{
    		this.setState({	isLogin:false})
    	}
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
    	console.log("loadItems page = " +new_page)
        this.GetInfo(type, c, id, new_page, per_page);
    }

	render(){
		//console.log(this.prop
		const {categories, categoriesAll, topic_list, loading, c, have_no_item, isLogin, type} = this.state;
		const {navigation } = this.props;
		
		
		return(
			<>
			<View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start',padding:2,backgroundColor:"#fff"}}>
				
				<Header navigation = {navigation} refresh = {this.refresh} isLogin={isLogin} categoriesAll = {categoriesAll}  option = {"topiclist"}/> 
				<Dropdown categories = {categories}  currentCategory = {c} changeCategory = {this.changeCategory}/>

				<View style={commonStyle.viewCategory} >
				{ type == "latest" ? <Text style ={commonStyle.currentCategoryBtn} >最新</Text>
					: <Text style ={commonStyle.categoryBtn} onPress={this.changeType.bind(this,"latest") }>最新</Text>
					}

				{type =="top" ? <Text style ={commonStyle.currentCategoryBtn}>热门</Text>
				:<Text style ={commonStyle.categoryBtn} onPress={this.changeType.bind(this,"top")}>热门</Text>
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
				    	
				    	{topic_list.length != 0 && 
							<FlatList
							  style={{flex:1,backgroundColor:"#fff"}}
							  keyExtractor={(item, index) => index.toString()}
							  data={topic_list}
							  renderItem={
							    ({item, index}) => {
							    	if(categoriesAll !=null){
							    		categoriesAll.map((v,k)=>{
								    		if(v.id === item.category_id){
								    			item.category_type = v.type;
								    			item.category_name = v.cateTittle;
								    			item.category_color = v.color;
								    			if(v.type == 1) item.category_p_color = v.p_color;
								    		}
								    	})
							    	}
							    	

							    return <View style={{borderBottomWidth:1,borderColor:"#efefef",paddingBottom:5,marginBottom:4}}>
							    	<View style={{flexDirection:'row',justifyContent:'space-between', alignItems:'center' , textAlignVertical:'center'}} >
								    	<View style={{flex:1,width:"50%"}}>
								    		<Text style={topicListStyle.topicTittle}  onPress={() => navigation.navigate('TopicDetail',{tid:item.id})}>{item.title}</Text>
								    		<View style={{flexDirection:'row',marginLeft:10 }}>
								    			{item.category_type == 1 && <LinearGradient
												    start={{ x : 0, y : 1 }} end={{ x : 1, y : 1 }}
												    locations={[ 0,0.5,0.5, 1]}
												    colors={[item.category_p_color, item.category_p_color, item.category_color, item.category_color ]}
												    style={{width:10,height:10,margin:3}}>
												</LinearGradient>}
												{item.category_type == 0 && <Text style={{width:10,height:10,margin:3,backgroundColor:item.category_color}}></Text>}
								    			<Text style={{fontSize:12,color:"#666"}}>{item.category_name}</Text>
								    		</View>
								    	</View>
								    	<TouchableOpacity style={{}} onPress={() =>navigation.navigate('Profile',{refresh:null,username:item.last_poster_username})}>
											<Image style={{width:30,height:30,marginLeft:20,borderRadius:30}}  source={{uri: url + item.last_poster_avatar_template.replace("{size}",64) }}/>
								    	</TouchableOpacity>
								    	<Text  style={{width:"10%",textAlign:"right"}}>{item.posts_count -1 >= 0 ? item.posts_count -1 : 0 }</Text>
								    	<Text  style={{width:"20%",textAlign:"right"}}>{moment(item.last_posted_at ? item.last_posted_at : item.created_at).fromNow()}</Text>
							    	</View>
							    </View>
							    }
							  } 
							  onEndReachedThreshold = {0.0001}
							  onEndReached={this.loadItems}
							  ListFooterComponent = {()=>{
		            		  	if(have_no_item){
		            		  		return <View style={{width:"100%",alignItems:"center"}} ><Text style={{height:40,fontSize:16,marginTop:10}}>没有更多{c}的主题了</Text></View>
		            		  
		            		  	}else{
									return null
		            		  	}
		            		  } 
		            		}
							/>	
						}
						{loading ? 
							<View style={{width:"100%",alignItems:"center"}} >
								<Image style={{width:20,height:20}}  source={ loadingImage }/>
							</View>
						:null}

					</View>
					}
      			</View>
      			
      		</View>
		</>
		);
	}
}

export default TopicList;