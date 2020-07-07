/**

*/
import React, { Component } from 'react';
import {Button, Text, View, Image, StyleSheet, BackHandler, TouchableOpacity, Platform, TextInput, ScrollView, Dimensions, FlatList} from 'react-native';
import HTMLView from 'react-native-htmlview';
import {WebView} from 'react-native-webview'
import Toast from 'react-native-root-toast';
import { getTopicDetail, postAction, postActionUnlike, postDelete, topicDelete } from "../request/discourse_api";
import PostMenu from './postMenu';
import loadingImage from '../images/loading.gif';
import  config from '../config';
import moment from 'moment';
import Post from './post'
import {_getUsers} from '../models/auth';
import { SvgXml } from 'react-native-svg';
import images from '../images/images';
const dimensions = Dimensions.get('window');
const windowWidth = dimensions.width;
const windowHeight = dimensions.height;
const url = config.SERVER_URL;
class TopicDetail extends Component {
	constructor(props){
		super(props)
		this.state = {
			detail:null,
			posts:[],
			showReply:false,
			showEdit:false,
			replyParams:null,
			editParams:null,
			currentUser:null,
			csrf:null,
			loading:true,
			stream:[],
			totalPage:null,
			page:1,
			pages:[],
			per_page:20,
			views:null,
			selected:null,
			refreshing:false,
			initialScroll:0,
			show_toast:false,
			toastMsg:null,
			show_bottom:false,
    		bottomText:null

		}
	}
	componentDidMount (){
        this.GetInfo();
    }

    GetInfo = async () => {
    	await this.getCurrentUser();
       	const detail = await this.intiStream();
       	const stream = detail.post_stream.stream;
       	const post_id = this.props.route.params.post_id;
       	let loadingType = "init"
       	if(post_id){
       		const { per_page} = this.state;
			let post_k = 0;
			stream.map((v,k)=>{
				if(post_id == v) post_k = k + 1;
			})
			let page = Math.ceil(post_k / per_page);
			loadingType = "search"
		 	this.refreshPost(page, loadingType);
       	}else{
			this.refreshPost(1,loadingType);
       	}
    }
  	getCurrentUser = async ()=>{
  		const currentUser = await _getUsers();
  		console.log(currentUser)
		const csrf = JSON.parse(currentUser)[0] !=null && JSON.parse(currentUser)[0] != "undefind" ? JSON.parse(currentUser)[0].csrf :null;
		this.setState({
			currentUser:JSON.parse(currentUser)[0],
			csrf:csrf
		})
  	}
    refreshPost = async ( page, loadingType)=>{
    	 try{
    	 	const tid = this.props.route.params.tid;
			console.log("page = "+page)
			let path = "";
			path += "/t/"+tid;
			path += "/posts.json?";
			const {stream, per_page} = this.state;
			let detail = {};
			let new_posts = [];
			if(stream != null && stream.length > 0){
				console.log(path)
				let currentCount = stream.length - (page -1) * per_page > 20 ? 20 : stream.length - (page-1) * per_page;
				console.log(currentCount)
				let start = (page -1) * per_page;
				for(let i = 0 ; i < currentCount; i++){
					path += "post_ids[]="+stream[start + i]+"&"
				}
				if(path.substr(-1,1) == "&"){
					path = path.substr(0,path.length -1 );
				}
				console.log(path)
				detail = await getTopicDetail(path);
				new_posts = detail.post_stream.posts;
			}
			
			if(loadingType == "init" || loadingType == "search" || loadingType == "reply") {
				this.setState({
					page:page,
					posts:new_posts,
					loading:false
				})
				if(loadingType == "search"){
					
					const id = this.props.route.params.post_id
					console.log("post_id = " +id)
					new_posts.map((v,k)=>{
						if(v.id== id){
							console.log("k = "+k)
							this.setState({initialScroll:k,selected:k})
							setTimeout(()=>{
					        	this.setState({selected:null})
					        },1000)
						}
					})

				}
				if(loadingType == "reply"){
					this.setState({initialScroll:new_posts.length -1, selected:new_posts.length -1})
					setTimeout(()=>{
			        	this.setState({selected:null})
			        },1000)
				}

			}
			if(loadingType == "up") {
				let posts = this.state.posts;
				new_posts.push.apply(new_posts,posts);
				this.setState({
					page:page,
					posts:new_posts,
					refreshing:false
				})
			}
			if(loadingType == "down") {
				let posts = this.state.posts;
				posts.push.apply(posts,new_posts);
				this.setState({
					page:page,
					posts:posts,
					loading:false
				})
			}
			let pages = this.state.pages;
			console.log("pages = " + pages)
			console.log("page = "+page)
			if(pages.indexOf(page) == -1 ) pages.push(page);
			pages.sort((a,b)=>{return a-b});
			this.setState({pages:pages})
			console.log(this.state.pages)
			
        }catch(e){
        	console.log(e)
        }	
    }
    intiStream = async ()=>{
    	const tid = this.props.route.params.tid;
    	let path = "";
		path += "/t/"+tid;
		path += ".json"
		console.log(path)
		const detail = await getTopicDetail(path);
		const stream = detail.post_stream.stream;
		const totalPage = Math.ceil(stream.length / this.state.per_page);
		this.setState({
			stream:stream,
			detail:detail,
			totalPage:totalPage,
			pages:[]
		})
		
		return detail;
    }
    loadItemsDown = () => {
    	console.log("loaditemsDown")
    	const {loading, page,  totalPage, pages} = this.state;
    	console.log("loadItemsDown pages = ")
    	console.log(pages)
    	console.log("pages.slice(-1) = "+pages.slice(-1) )

    	if( loading == true || pages.length == 0 ) {
    		return false;	
    	}

    	if(parseInt(pages.slice(-1))  == totalPage){
    		this.setState({
    			show_bottom:true,
    			bottomText:"没有更多帖子了"
    		})

    		return false;
    	}

    	console.log("loadingdown")
    	this.setState({
    		loading:true
    	})
    	let new_page = parseInt(pages.slice(-1)) + 1;
    	let loadingType = "down"
        this.refreshPost(new_page,loadingType);
    }
    loadItemsUp = ()=>{
    	console.log("loadItemsUp")

    	const {refreshing, page, totalPage, pages } = this.state;
    	console.log("totalPage = "+ totalPage)
    	console.log("pages.slice(0,1) = "+pages.slice(0,1) )
    	if( refreshing == true || pages.length == 0  ){
    		return false;
    	} 
    	if(parseInt(pages.slice(0,1)) == 1){
    		this.showToast("没有更多帖子了");
    		return false;
    	}
    	console.log("loadingup")
    	
    	this.setState({
    		refreshing:true
    	})
    	let new_page = parseInt(pages.slice(0,1)) - 1;
    	let loadingType = "up"
       this.refreshPost(new_page,loadingType);
    }
	clickToScroll= (type,id) =>{
		try{
			if(type == "post_number"){
				const posts = this.state.posts;
				posts.map((v,k)=>{
					if(v.post_number== id){
						this._flatList.scrollToIndex({ viewPosition :0.5, index: k });
						this.setState({selected:k})
						setTimeout(()=>{
				        	this.setState({selected:null})
				        },1000)
					}
				})

			}else if(type == "post_id"){
				const posts = this.state.posts;
				posts.map((v,k)=>{
					if(v.id== id){
						console.log("v.id = " + v.id)
						console.log("k = "+k)
						this._flatList.scrollToIndex({ viewPosition :0.5, index: k });
						this.setState({selected:k})
						setTimeout(()=>{
				        	this.setState({selected:null})
				        },1000)
					}
				})
			}
			
			
		}catch(e){
			console.log(e)
		}
	}
	removeReply = ()=>{
   		console.log("removeReply")
   		this.setState({
    		showReply:false
    	})
   	}
   	reply = (replyParams)=>{
   		this.setState({
    		showReply:true,
    		replyParams:replyParams
    	})
   	}
   	replySuccess=  (post)=>{
   		console.log("replySuccess")
   		console.log("post11111 = ")
   		console.log(post)
   		const stream = this.state.stream;
   		stream.push(post.id)
   		this.setState({stream:stream})
   		const totalPage = Math.ceil(stream.length / this.state.per_page);
   		console.log("reply success totalPage = "+ totalPage)
   		this.setState({
			stream:stream,
			totalPage:totalPage,
			pages:[]
		})
   		let loadingType = "reply"
   		this.refreshPost(totalPage, loadingType);
   	}
   	like = async (post_id, post_key)=>{
   		let params = {};
   		params.id = post_id;
   		params.post_action_type_id = 2;
   		params.flag_topic = false
   		
   		const result = await postAction(params,this.state.csrf); 
   		console.log(result)
   		const posts =this.state.posts;
   		posts[post_key] = result;
   		this.setState({
   			posts : posts
   		})
   		//this.refresh();
   	}
   	whoLiks=()=>{
   		console.log("wholikes")
   	
   	}
   	unlike = async (post_id, can_unlike, post_key)=>{
   		console.log("unlike")

   		if(can_unlike){
   			const result = await postActionUnlike(post_id,this.state.csrf); 
	   		console.log(result)
	   		if(result.error) {
	   			this.showToast("不可取消");
	   			return;
	   		}
	   		if(result.id == post_id){
	   			const posts =this.state.posts;
		   		posts[post_key] = result;
		   		this.setState({
		   			posts : posts
		   		})
	   		}
	   		//this.refresh();
   		}else{
   			console.log("不可取消")
   			this.showToast("不可取消");
			
   		}
   		
   	}
   	showToast = (text)=>{
		this.setState({
			show_toast:true,
			toastMsg:text
		})
		let _self = this
		setTimeout(function () {
			_self.setState({
			show_toast:false,
				toastMsg:null
			})
		}, 2000);
   	}

   	removeEdit = ()=>{
   		console.log("removeEdit")
   		this.setState({
    		showEdit:false
    	})
   	}
   	edit = (editParams)=>{
   		console.log("edit")
   		console.log("editParams = ")
   		console.log(editParams)
   		this.setState({
    		showEdit:true,
    		editParams:editParams
    	})
   	}
   	editSuccess= (post)=>{
   		console.log("editSuccess")
   		//this.refresh();

   		const posts = this.state.posts;
   		posts.map((v,k)=>{
   			if(v.id == post.id){
   				posts[k] = post
   			}

   		})
		this.setState({posts:posts})   		
   	}
   	deletePost = async (post_id, topic_id, topic_slug, post_number)=>{
   		console.log("delete")
   		let context="/t/"+topic_slug+"/"+topic_id;
   		const rs = await postDelete(context, post_id, this.state.csrf)
   		const posts = this.state.posts;
   		posts.map((v,k)=>{
   			if(v.id == post_id){
   				posts.splice(k,1);
   			}
   		})
   		this.setState({posts:posts})
   	}
   	deleteTopic = async(post_id, topic_id, topic_slug, post_number)=>{
   		console.log("deleteTopic")
   		let context="/t/"+topic_slug+"/"+topic_id;
   		const rs = await topicDelete(context, topic_id, this.state.csrf)
   		
   		
   	}
   	refresh = async ()=>{
   		console.log("refresh")
		await this.getCurrentUser();
	}
	render(){
		const {detail, posts, showReply, replyParams, editParams, currentUse, showEdit, currentUser, loading, selected, show_toast, toastMsg, show_bottom,bottomText} = this.state;
		
		const avatar_template = detail ? detail.details.created_by.avatar_template.replace("{size}",64):"";
		
		const {navigation } = this.props;
		navigation.setOptions({
			title: detail ? detail.title :"",
			headerStyle: {
				
	            height:40
	        }
		})
		return (
			
			<View style={{flex:1,backgroundColor:"#fff"}} ref={(view) => { this.myScrollView = view; }} 
						contentContainerStyle={styles.contentContainer}
			>
				
				{posts.length != 0 && 
					<FlatList
					  ref={(flatlist)=>{this._flatList = flatlist; return this._flatList}}
					  style={{flex:1,backgroundColor:"#fff",padding:5,paddingTop:0}}
					  keyExtractor={(item, index) => index.toString()}
					  data={posts}
					  initialNumToRender = {this.state.per_page}
					  initialScrollIndex = {this.state.initialScroll }
					  renderItem={
					    ({item,index}) => {
					    	let post = item;
					    	let k = index;


					    	//post.reply_to_post_number
					    	post.actions_summary.map((v,k)=>{
									if(v.id == 2){
										post.liked = v.acted ? v.acted : null;
										post.can_unlike = v.can_undo ? v.can_undo : null;
										post.like_count = v.count ? v.count : null;
									}
								})
							let showLike = false;
							let likeImageType = 1 ; //空心灰 
							let like = this.like.bind(this,post.id, k);
							let showEdit = false;
							let showDelete = false;
							let del = this.deletePost.bind(this,post.id, post.topic_id, post.topic_slug, post.post_number)
							if(currentUser == null || currentUser == "undefind"  ){
								showLike = true;
								like = () => navigation.navigate('Login',{refresh:this.refresh});
								reply = ()=> navigation.navigate('Login',{refresh:this.refresh});
							}else{
								showLike = true;
								if(post.yours && post.like_count == null){
									showLike = false;
								}else if(post.yours && post.like_count != null){
									likeImageType = 2; //实心灰
									like = this.whoLiks;
								}else if(!post.yours && post.liked){
									likeImageType = 3; //实心红
									like = this.unlike.bind(this,post.id,post.can_unlike, k);

								}
								if(post.can_edit ){
									showEdit = true;
								}
								if(post.can_delete){
									showDelete = true;
								}
								

								/*if(post.username == currentUser.username && post.post_number == 1){
									showDelete = true;
									del = this.deleteTopic.bind(this,post.id, post.topic_id, post.topic_slug, post.post_number)
								}*/

								reply = this.reply.bind(this,{username:post.name,post_number:post.post_number})

							}
							let cooked = post.cooked;
							cooked = cooked.replace(/<img/g,'\n<img');
							cooked = cooked.replace(/<span class="filename">.*?<\/span>/g,"");
							cooked = cooked.replace(/<span class="informations">.*?<\/span>/g,"");
							//console.log("cooked = "+cooked)
							return (
								<View k={k} style=
									{selected == k ? {width:"100%",backgroundColor:"#eee",paddingTop:10,borderTopWidth:1,borderColor:"#ccc",paddingBottom:20}
									:
									{width:"100%",backgroundColor:"#fff",paddingTop:10,borderTopWidth:1,borderColor:"#ccc",paddingBottom:20}
									}
								>
									{index == 0 &&<View style={{paddingBottom:10,borderBottomWidth:2,borderBottomColor:"#eee"}}>
										<Text style={{fontSize:20}}> {detail ? detail.title :""}</Text>
									</View>}
									
									<View style={{flexDirection:'row',paddingTop:10}} >

										<TouchableOpacity style={{}} onPress={() =>navigation.navigate('Profile',{refresh:null,username:post.username})}>
											<Image style={{width:35,height:35,	borderRadius:35,marginTop:6}}  source={{uri: url + post.avatar_template.replace("{size}",64) }}/>
										</TouchableOpacity>
										<Text style={{paddingLeft:10,fontWeight:'bold',color:"#777"}}>{ post.username}</Text>
										{post.reply_to_post_number ? <View style={{position:"absolute",right:10,color:"#777",flexDirection:'row',marginTop:10}}>
											<TouchableOpacity onPress={this.clickToScroll.bind(this, "post_number", post.reply_to_post_number)} style={{flexDirection:'row',marginRight:10}}>
												<SvgXml style={{marginTop:3,marginRight:3}}width="20" height="20" xml={images.reply2}/>
											<Image style={{width:25,height:25,	borderRadius:25}}  source={{uri: url + post.reply_to_user.avatar_template.replace("{size}",64) }}/>
											</TouchableOpacity>
											<Text style={{  height:25,textAlign:'center',
													        alignItems:'center',
													        justifyContent:'center',
													        textAlignVertical:'center',
													    }}>{moment(post.created_at).fromNow()}</Text>
										</View> :null }
									</View>
									<View style={{paddingTop:10}}>
									
										<HTMLView style={{}}
									        value={cooked+"\n"}
								       //	renderNode={this.renderNode}
							      		/>
							   		</View>
							   		<PostMenu reply =  {reply} 
							   				  showLike = {showLike}
							   				  showDelete = {showDelete} 
							   				  showEdit = {showEdit}  
							   				  likeImageType = {likeImageType}
							   				  like = {like} 
							   				  liked = {post.liked ? post.liked : false}
							   				  like_count = {post.like_count ? post.like_count: ""}
							   				  can_unlike = {post.can_unlike ? post.can_unlike : false}
							   				  edit = {this.edit.bind(this,{username:post.name,reply_to:post.reply_to_user ? post.reply_to_user.username : null,post_number:post.post_number,post_id:post.id,raw:post.cooked})} 
							   				  delete = {del}
							   		/>
								</View>
						)}
					  } 
					  onEndReachedThreshold = {0.0001}
					  onEndReached={this.loadItemsDown}
					  onRefresh={this.loadItemsUp.bind(this)}     
            		  refreshing={this.state.refreshing}
            		  ListFooterComponent = {()=>{
            		  	if(show_bottom){
            		  		return <View style={{width:"100%",height:40,textAlign:"center",alignItems:'center' , textAlignVertical:'center'}}><Text style={{padding:10}}>{bottomText}</Text></View>
            		  	}else{
							return null
            		  	}
            		  } 
            		}
					/>	
				}

				<View style={{width:100,height:10,backgroundColor:"#fff"}} ref="new_reply" ></View>
				{showReply ? <Post args={{  "username":replyParams.username,
											"topic_id":detail.id,
											"category_id":detail.category_id,
											"post_number":replyParams.post_number,
											"type":"reply"
										}} navigation={navigation} removePost={this.removeReply} replySuccess={this.replySuccess}/> : null}
				
  				{showEdit ? <Post args={{   "username":editParams.username,
  											"reply_to":editParams.reply_to,
											"topic_id":detail.id,
											"post_id":editParams.post_id,
											"raw":editParams.raw,
											"category_id":detail.category_id,
											"post_number":editParams.post_number,
											"type":"edit"
										}} navigation={navigation} removePost={this.removeEdit} editSuccess={this.editSuccess}/> : null}
				{loading ? 
					<View style={{width:"100%",alignItems:"center"}} >
						<Image style={{width:20,height:20}} source={ loadingImage }/>
					</View>
				:null}
				{show_toast && <View style={{width:"100%",height:40,textAlign:"center",alignItems:'center' , textAlignVertical:'center'}}><Text style={{padding:10,backgroundColor:"#666",color:"#fff"}}>{toastMsg}</Text></View>}
			</View>
			
		)
	}
}
const styles = StyleSheet.create({
  contentContainer: {
  	//flex:1,
  	padding:10,
  	backgroundColor:"#fff",
    paddingVertical: 20
  }
});
export default TopicDetail;