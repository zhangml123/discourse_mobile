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
           categories:this.props.route.params.categories
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
		const {type, c, id} = this.state;
        this.GetInfo(type, c, id);
    }
    GetInfo = async (type, c, id) => {
        try{
           let path = ""
           if(c && id) path += "/c/"+c+"/"+id;
           if(c && id && type) path += "/l"
           if(type) path += "/"+type
           path += ".json"
       	   
           const topics = await getTopics(path);
           const users = topics.users;
           let topic_list = topics.topic_list.topics;
			topic_list.map((v,k)=>{
				
				users.map((v1,k1)=>{
					if(v.last_poster_username === v1.username){
						topic_list[k]["last_poster_avatar_template"]=v1.avatar_template
					}
				})
			})
           this.setState({
           	topic_list:topic_list,
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
    setTimeFormat(){
        moment.locale("zh-CN",{
            relativeTime : {
                future : "%s后",
                past : "%s前",
                s : "%d秒",
                m : "%d分",
                mm : "%d 分",
                h : "%d小时",
                hh : "%d 小时",
                d : "%d天",
                dd : "%d 天",
                M : "%d月",
                MM : "%d 月",
                y : "%d年",
                yy : "%d 年"
            }
        })
    }
    refresh=(rs)=>{
    	return;
    }

	render(){
		//console.log(this.prop
		const {categories, topic_list, loading, c} = this.state;
		const {navigation } = this.props;

		return(
			<>
			<View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start',padding:2,backgroundColor:"#fff"}}>
				<Header navigation = {navigation} refresh = {this.refresh}/> 
				<Dropdown categories = {categories} currentCategory = {c} changeCategory = {this.changeCategory}/>
				<View style={commonStyle.viewCategory} >
					<Text style ={commonStyle.categoryBtn} onPress={() => navigation.navigate('TopicList',{type:"latest"})}>最新</Text>
					<Text style ={commonStyle.categoryBtn} onPress={() => navigation.navigate('TopicList',{type:"top"})}>热门</Text>
				</View>
				<View style={commonStyle.content}>
					{loading ? 
						<View style={{width:"100%",alignItems:"center",padding:20}} >
							<Image  source={ loadingImage }/>
						</View>
					:null}
					{!loading && topic_list == "" ? 
						<View style={{width:"100%",alignItems:"center",padding:20}} >
							<Text>此分类没有主题</Text>
						</View> 
					: null}

						<View>
							<View style={{flexDirection:'row',justifyContent:'space-between'}} >
						    	<Text style={{width:"70%",padding:10}}>主题</Text>
						    	<Text style={{width:"15%",padding:10}}>回复</Text>
						    	<Text style={{width:"15%",padding:10}}>活动</Text>
					    	</View>
							<FlatList
							  keyExtractor={(item, index) => index.toString()}
							  data={topic_list}
							  renderItem={
							    ({item}) => {

									
							    return <View style={topicListStyle.itemView}>
							    	<View style={{flexDirection:'row',justifyContent:'space-between', alignItems:'center' , textAlignVertical:'center'}} >
								    	<Text style={topicListStyle.topicTittle}  onPress={() => navigation.navigate('TopicDetail',{tid:item.id,uid:item.posters[0].user_id})}>{item.title}</Text>
								    	<Image style={{width:35,height:35,marginLeft:20,borderRadius:35}}  source={{uri: url + item.last_poster_avatar_template.replace("{size}",64) }}/>
								    	<Text  style={{width:"10%",textAlign:"right"}}>{item.posts_count -1 >= 0 ? item.posts_count -1 : 0 }</Text>
								    	<Text  style={{width:"20%",textAlign:"right"}}>{moment(item.last_posted_at ? item.last_posted_at : item.created_at).fromNow()}</Text>
							    	</View>
							    </View>
							    }
							  }
							/>	
						</View>
      				</View>
      		
      		</View>
		</>
		);
	}
}

export default TopicList;