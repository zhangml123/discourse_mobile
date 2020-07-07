/**

*/
import React, { Component } from 'react';
import {Button, Text, View, Image, StyleSheet, BackHandler, TouchableOpacity, Platform, FlatList, Dimensions, ScrollView} from 'react-native';
import Header from "./header";
import Dropdown from "./dropdown";
import Post from './post'
import { getCategories, session, getCsrf, submitTopic, draft, getCategory } from "../request/discourse_api";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import loadingImage from '../images/loading.gif'
import {WebView} from 'react-native-webview';
import LinearGradient from 'react-native-linear-gradient'
import md5 from "react-native-md5";
const dimensions = Dimensions.get('window');
const windowWidth = dimensions.width;
const windowHeight = dimensions.height;


class Index extends Component {
	constructor(props){
      super(props);
      this.state = {
           categories:[],
           categoriesAll:[],
           csrf:null,
           loading:true,
           showPost:false,
           isLogin:null,
           avatarSource:"",
           
      }
      
  	}
	componentDidMount (){
	    //this.GetInfo();
    }
    GetInfo = async () => {
        try{
			const data = await getCategories();
			const category_list = data.category_list.categories;
			let categories = [];
			/*category_list.map((v,k)=>{
				let subCates = []
				if(v.subcategory_ids){
					v.subcategory_ids.map(async(v1,k1)=>{
						let cate = await getCategory(v1);					
						subCates.push({id:v1,name:cate.category.name,color:cate.category.color});
						if(v.subcategory_ids.length === subCates.length){
							categories.push({
								key:k+"a",
								id:v.id,
								cateTittle: v.name,
								description:v.description_text,color:"#"+v.color, 
								time:"", 
								topic_count:v.topic_count, 
								subCates:subCates	
							})
							if(category_list.length === categories.length){
							 	this.setState({
						           	categories:categories,
						           	loading:false
					           	})
							}
						}
					})

				}else{
					categories.push({
						key:k+"a",
						id:v.id,
						cateTittle: v.name,
						description:v.description_text,color:"#"+v.color, 
						time:"", 
						topic_count:v.topic_count, 
						subCates:null	
					})
					
					if(category_list.length === categories.length){
						this.setState({
							categories:categories,
							loading:false
						})
					}
				}
				
			})*/
			let categoriesAll = [];
			category_list.map((v,k)=>{
				let obj = {
					key:k+"a",
					id:v.id,
					cateTittle: v.name,
					description:v.description_text,
					color:"#"+v.color, 
					time:"", 
					topic_count:v.topic_count, 
					subCates:null,
					slug:v.slug
				}
				categories.push(obj)
				categoriesAll.push({
					type:0,	
					id:v.id,
					cateTittle:v.name,
					topic_count:v.topic_count, 
					color:"#"+v.color,	
				})
				if(v.subcategory_ids){
					let subCates = []
					v.subcategory_ids.map(async(v1,k1)=>{
						let cate = await getCategory(v1);					
						subCates.push({
							id:v1,
							name:cate.category.name,
							color:"#"+cate.category.color,
							topic_count:cate.category.topic_count,
							slug:cate.category.slug
						});
						categoriesAll.push({
							type:1,	
							id:v1,
							cateTittle:cate.category.name,
							p_color:"#"+v.color,
							color:"#"+cate.category.color,
							topic_count:cate.category.topic_count, 
						})
						categories[k].subCates = subCates;
						if( k1 == v.subcategory_ids.length - 1 ){
							this.setState({
					           	categories:categories,
					           	categoriesAll:categoriesAll,
					           	loading:false
				           	})
						}
					 	
					})
				}

				if(category_list.length === categories.length){
					this.setState({
						categories:categories,
						categoriesAll:categoriesAll,
						loading:false
					})
				}


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
    	console.log("index refresh")
    	this.GetInfo();
    	if(rs) {
    		this.setState({ isLogin:true})
    	}else{
    		this.setState({	isLogin:false})
    	}
    }
	render(){
		const {categories, categoriesAll, loading, c, showPost, isLogin} = this.state;
		const navigation = this.props.navigation;
	
		return (
			<>
				<View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start',padding:2,backgroundColor:"#fff"}}>
					
					<Image source={this.state.avatarSource} style={{}} />
					<Header navigation = {navigation} refresh = {this.refresh} isLogin = {isLogin} option = {"index"} categoriesAll = {categoriesAll} showShadow = {this.showShadow}/> 
					<Dropdown categories = {categories}  changeCategory = {(c,id) => navigation.navigate('TopicList',{ c:c, id:id, categories:categories,categoriesAll:categoriesAll})}/>
					<View style={styles.viewCategory} >
						<View style={{width:'100%',flexDirection:'row'}}>
							<Text style ={styles.currentCategoryBtn} onPress={() => navigation.navigate('TopicList',{type:"categories", categories:categories,categoriesAll:categoriesAll})}>分类</Text>
							<Text style ={styles.categoryBtn} onPress={() => navigation.navigate('TopicList',{type:"latest", categories:categories,categoriesAll:categoriesAll})}>最新</Text>
							<Text style ={styles.categoryBtn} onPress={() => navigation.navigate('TopicList',{type:"top", categories:categories,categoriesAll:categoriesAll})}>热门</Text>
						</View>
						{isLogin ? 
						<View style={{width:'100%',flexDirection:'row',marginTop:15,paddingRight:20, justifyContent: 'flex-end'}}>
							<Button
					          onPress={this.newTopic}
					          title="创建新主题"
					          color="#aaa"
			       			/>
		       			</View>	
		       			:null}
					</View>
					


					{showPost ? <Post args={{"categories":categoriesAll,"type":"new_topic"}} navigation={navigation} removePost={this.removePost}/> : null}

					<View style={{width:"100%",backgroundColor:"#fff",marginTop:150,borderTopWidth:3,
		borderTopColor:'#eee',zIndex:2,justifyContent:"center"}}>
						{loading ? 
						<View style={{width:"100%",alignItems:"center",padding:20}} >
							<Image  style={{width:20,height:20}}   source={ loadingImage }/>
						</View>
						:null}
						
						<FlatList
						  keyExtractor={(item, index) => index.toString()}
						  data={categories}
						  renderItem={
						    ({item}) => 
						    <View style={{width:"100%",
								borderBottomWidth: 1,
								borderLeftWidth:5,
								borderBottomColor:'#ccc',
								borderLeftColor:item.color,}}>
						    	<View style={{flexDirection:'row',justifyContent:'space-between'}} >
						    		<TouchableOpacity style={{width:"80%"}} onPress={() => navigation.navigate('TopicList',{ c:item.cateTittle, id:item.id, slug:item.slug, refresh:this.refresh, categories:categories,categoriesAll:categoriesAll})}>
							    		<Text style={styles.cateTittle} numberOfLines={1}>{item.cateTittle}</Text>
							    	</TouchableOpacity>
							    	<Text style={styles.time}>{item.time}</Text>
						    	</View>
						    	<Text style={styles.description}>{item.description}</Text>
						    	<View style={styles.cates}>
						    		{item.subCates && item.subCates.map((cate,k)=>{
						    			if(cate.name != "" ){
						    				return <View  key={k} style={styles.cate}>
							    				<LinearGradient
												    start={{ x : 0, y : 1 }} end={{ x : 1, y : 1 }}
												    locations={[ 0,0.5,0.5, 1]}
												    colors={[item.color, item.color, cate.color, cate.color ]}
												    style={{width:10,height:10,margin:5}}>
													    
													</LinearGradient>
							    				<Text key={k+"a"}  style={{}}>{cate.name}</Text>
						    				</View>
						    			}						    			
						    		})
						    		}
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
