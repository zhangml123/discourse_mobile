/**

*/
import React, { Component } from 'react';
import {Button, Text, View, Image, StyleSheet, BackHandler, TouchableOpacity, Platform, FlatList, Dimensions, ScrollView} from 'react-native';
import Header from "./header";
import Dropdown from "./dropdown";
import Post from './post'
import { getCategories, session, getCsrf, submitTopic, draft } from "../request/discourse_api";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import loadingImage from '../images/loading.gif'
import {WebView} from 'react-native-webview';

import md5 from "react-native-md5";
const dimensions = Dimensions.get('window');
const windowWidth = dimensions.width;
const windowHeight = dimensions.height;


class Index extends Component {
	constructor(props){
      super(props);
      this.state = {
           categories:[],
           csrf:null,
           loading:true,
           showPost:false,
           isLogin:false,
           avatarSource:"",
           
      }
      
  	}
	componentDidMount (){
	    this.GetInfo();
    }
    GetInfo = async () => {
        try{
        	
			const data = await getCategories();
			const category_list = data.category_list.categories;
			let categories = [];
			//console.log(category_list)
			category_list.map((v,k)=>{
				
				categories.push({key:k+"a", id:v.id, cateTittle: v.name, description:v.description_text, time:"", topic_count:v.topic_count, cate:[{title:"",color:""},{title:"",color:""},{title:"",color:""}]	})
				//categories.push({key:k+"a",cateTittle: v.name,description:v.description_text,time:"11111",cate:[{title:"",color:""},{title:"",color:""},{title:"",color:""}]	})
			})
           this.setState({
           	categories:categories,
           	loading:false
           })
          
        }catch(e){
            
        }
    }
    test = () =>{
   
    }
   
    newTopic = async()=>{
    	this.setState({
    		showPost:true
    	})
    }
   	removePost= ()=>{
   		console.log("removePost")
   		this.setState({
    		showPost:false
    	})
   	}
    refresh= (rs) =>{
    	this.GetInfo();
    	if(rs) {
    		this.setState({ isLogin:true})
    	}else{
    		this.setState({	isLogin:false})
    	}
    }


	render(){
		const {categories, loading, c, showPost, isLogin} = this.state;
		const navigation = this.props.navigation;
	
		return (
			<>
				<View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start',padding:2,backgroundColor:"#fff"}}>
					
					<Image source={this.state.avatarSource} style={{}} />
					<Header navigation = {navigation} refresh = {this.refresh} categories = {categories} showShadow = {this.showShadow}/> 
					<Dropdown categories = {categories} currentCategory = {c} changeCategory = {(c,id) => navigation.navigate('TopicList',{ c:c, id:id, categories:categories})}/>
					<View style={styles.viewCategory} >
						<View style={{width:'100%',flexDirection:'row'}}>
							<Text style ={styles.currentCategoryBtn} onPress={() => navigation.navigate('TopicList',{type:"categories", categories:categories})}>分类</Text>
							<Text style ={styles.categoryBtn} onPress={() => navigation.navigate('TopicList',{type:"latest", categories:categories})}>最新</Text>
							<Text style ={styles.categoryBtn} onPress={() => navigation.navigate('TopicList',{type:"top", categories:categories})}>热门</Text>
						</View>
						{isLogin ? 
						<View style={{width:'100%',flexDirection:'row',marginTop:10,paddingRight:20, justifyContent: 'flex-end'}}>
							<Button
					          onPress={this.newTopic}
					          title="New Topic"
					          color="#aaa"
			       			/>
		       			</View>	
		       			:null}
					</View>
					
					{showPost ? <Post args={{"categories":categories,"type":"new_topic"}} navigation={navigation} removePost={this.removePost}/> : null}

					<View style={{width:"100%",backgroundColor:"#fff",marginTop:150,borderTopWidth:3,
		borderTopColor:'#eee',zIndex:2,justifyContent:"center"}}>
						{loading ? 
						<View style={{width:"100%",alignItems:"center",padding:20}} >
							<Image  source={ loadingImage }/>
						</View>
						:null}
						<FlatList
						  keyExtractor={(item, index) => index.toString()}
						  data={categories}
						  renderItem={
						    ({item}) => 
						    <View style={styles.itemView}>
						    	<View style={{flexDirection:'row',justifyContent:'space-between'}} >
						    		<TouchableOpacity style={{width:"80%"}} onPress={() => navigation.navigate('TopicList',{ c:item.cateTittle, id:item.id, categories:categories})}>
							    		<Text style={styles.cateTittle} numberOfLines={1}>{item.cateTittle}</Text>
							    	</TouchableOpacity>
							    	<Text style={styles.time}>{item.time}</Text>
						    	</View>
						    	<Text style={styles.description}>{item.description}</Text>
						    	<View style={styles.cates}>
						    		{item.cate.map((cate,k)=>{
						    			if(cate.title != "" ){
						    				return <View  key={k} style={styles.cate}>
							    				<Text key={k} style={{width:10,height:10,margin:5,backgroundColor:cate.color}}>
							    				</Text><Text key={k+"a"}  style={{}}>{cate.title}</Text>
						    				</View>
						    			}						    			
						    		})}
						    		
						    	</View>
						    </View>
						    
						  }
						/>	
						
      				</View>
	      		


	      		</View>
	      		
			</>
		);
	};

};
const styles = StyleSheet.create({
	viewCategory:{
		width:"50%",
		position:"absolute",
		top:60,
		right:0,
		zIndex:2,
		
		
	},
	viewContent:{
		width: windowWidth,
		height:1000,
		justifyContent: 'flex-start', 
		//flexDirection:'row',
		//backgroundColor:"#ccc",
		
	},
	categoryBtn:{
		width:40,
		height:40,
		backgroundColor:"#888",
		color:"#fff",
		borderWidth: 1,
		borderColor:'#888',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        borderBottomRightRadius: 40,
        borderBottomLeftRadius: 40,
        textAlign:'center',
        alignItems:'center',
        justifyContent:'center',
        textAlignVertical:'center',
        marginLeft:10

	},
	currentCategoryBtn:{
		width:40,
		height:40,
		backgroundColor:"#ff9944",
		color:"#fff",
		borderWidth: 1,
		borderColor:'#ff9944',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        borderBottomRightRadius: 40,
        borderBottomLeftRadius: 40,
        textAlign:'center',
        alignItems:'center',
        justifyContent:'center',
        textAlignVertical:'center',
        marginLeft:10

	},
	itemView:{
		width:"100%",
		borderBottomWidth: 1,
		borderLeftWidth:5,
		borderBottomColor:'#ccc',
		borderLeftColor:"#345678",
		
	},
	cateTittle:{
		maxWidth:"80%",
		fontSize:18,
		padding:10,
		//backgroundColor:"#334455",
		fontWeight:('bold', '800')
	},
	description:{
		paddingLeft:10
	},
	cates:{

		//backgroundColor:"#877777",
		maxWidth:"80%",
		padding:10,
		flexDirection:'row',
		flexWrap:'wrap'
	},
	cate:{
		//backgroundColor:"#344222",
		flexDirection:'row',
	}

})
export default Index;
