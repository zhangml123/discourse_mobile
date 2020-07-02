/**

*/
import React, { Component } from 'react';
import {Dimensions, NativeModules, Button, Text, View, Image, StyleSheet, BackHandler, TouchableOpacity, Platform, TextInput} from 'react-native';
import headerStyle from "./headerStyle";
import {_isLogin, _logout, _login, _getUsers} from '../models/auth';
import  config from '../config'
import ProfileMenu from './profileMenu'
import Menu from './menu'

const url = config.SERVER_URL;
const dimensions = Dimensions.get('window');
const windowWidth = dimensions.width;
const windowHeight = dimensions.height;
class Header extends Component {
	constructor(props){
		super(props)
		this.state={
			avatar_template:null,
			is_login:false,
			showProfileMenu:false,
			showMenu:false,
			showLogin:false,
			searchText:null,
			searchButtonEnable:false
		}
	}
	componentDidMount (){
		this.GetInfo();
	}
	GetInfo = async () => {
			try{
				const is_login =  await _isLogin();
				console.log(is_login)
				if(is_login){
					this.setState({is_login:true})
					const users = await _getUsers();
					let avatar_template = JSON.parse(users)[0].avatar_template;
					this.setState({avatar_template:avatar_template.replace("{size}",64)})
					this.props.refresh(true);
				}else{
					this.setState({is_login:false})
					this.props.refresh(false);
				}

			}catch(e){
			}
		}
	refresh= ()=>{
		this.GetInfo();
	}
	
	showShadow = ()=>{
    	this.setState({
    		showLogin:true
    	})
    	//() => navigation.navigate('Login',{refresh:this.refresh})
    }
    searchChange=(search)=>{
    	if(search == null || search == "" ) {
			this.setState({searchButtonEnable: false})
			return;
    	}
    	this.setState({
    		searchText: search,
    		searchButtonEnable: true
    	})
    }
    searchPress=()=>{
		this.setState({
    		showSearch:true
    	})

    }
   
	render(){
		const navigation = this.props.navigation;
		const {avatar_template, is_login, showProfileMenu, showMenu, showLogin, showSearch, searchText, searchButtonEnable} = this.state;
		
	return (
		<>
		<View style={{ flex: 1,width:"100%",height:50,paddingLeft:10,paddingRight:5,position:"absolute",backgroundColor: "#fff",justifyContent:'space-between',flexDirection:"row",zIndex:5}} >
			<TouchableOpacity style={{flex:1,backgroundColor:"#fff",textAlign:'center', alignItems:'center',}} onPress={() => this.setState({showMenu:!showMenu})}>
            	 <Image style={{width:35,height:35,marginTop:6}} source={require("../images/category.png")}></Image> 
  			</TouchableOpacity> 
		   	<View style={{flex:5,backgroundColor:"#fff",flexDirection:"row"}}>
		   		<Image style={{width:28,height:28,position:"absolute",left:"5%",top:10,zIndex:1 }} source={require("../images/search.png")}></Image>
			    <TextInput style={{fontSize:16,paddingLeft:"10%",backgroundColor:"#eee",width:"90%",marginLeft:"5%",height:40,marginTop:5,paddingRight:50,borderRadius:5}} onChangeText={this.searchChange}  placeholder = '请输入搜索内容' />
	    		{searchButtonEnable && <Text onPress={()=>navigation.navigate('Search',{searchText:searchText})} style={{color:"#fff",width:50,height:40,backgroundColor:"#888",marginTop:5,borderTopRightRadius:5,borderBottomRightRadius:5,position:"absolute",right:0,textAlign:'center', alignItems:'center', justifyContent:'center',  textAlignVertical:'center'}}>搜索</Text>
    		}
	    		</View>
    		{is_login ? 
    		<TouchableOpacity style={{flex:1,backgroundColor:"#fff",textAlign:'center', alignItems:'center',}} onPress={() => this.setState({showProfileMenu:!showProfileMenu})}>
            	<Image style={{width:40,height:40,borderRadius:40,marginTop:4}} source={{uri: url + avatar_template }}></Image> 
  			</TouchableOpacity>
			:
			<TouchableOpacity style={{flex:1,backgroundColor:"#fff",textAlign:'center', alignItems:'center',}} onPress={this.showShadow }>
            	<Image style={{width:40,height:40,borderRadius:40,marginTop:4}} source={require("../images/account-fill.png")}></Image> 
  			</TouchableOpacity>
    		}
  		</View>
		{showMenu ? <Menu categories = {this.props.categories} navigation = {navigation}/> : null}
		{showProfileMenu ? <ProfileMenu navigation = {navigation} refresh = {this.refresh}/> : null}
		{showLogin && 

			<View style={{position:"absolute",width:windowWidth,height:windowHeight,textAlign:'center', alignItems:'center',   backgroundColor:"rgba(0,0,0,0.8)",zIndex:5}}>
				<View style={{width:350,height:200,marginTop:100,borderWidth:1,borderRadius:5,backgroundColor:"#fff"}}>
					<Text style={{width:"100%",height:40,fontSize:20,textAlign:'center',marginTop:20}}>未登录</Text>
					<Text style={{width:"100%",height:50,fontSize:16,color:"#aaa",textAlign:'center',marginTop:20}}>当前未登录，登录获取更多操作</Text>
					<View style={{flexDirection:'row',justifyContent:'space-between'}}>
						<Text onPress={()=> this.setState({showLogin:false})} style={{width:"50%", height:60,color:"#777",fontSize:18,fontWeight:"bold", textAlign:'center', alignItems:'center', justifyContent:'center',  textAlignVertical:'center',fontSize:16}}>稍后</Text>
						<Text onPress={() => {
							this.setState({showLogin:false});
							navigation.navigate('Login',{refresh:this.refresh});
						}} style={{width:"50%", height:60,color:"#00ff33",fontSize:18,fontWeight:"bold", textAlign:'center', alignItems:'center', justifyContent:'center',  textAlignVertical:'center',fontSize:16}}>登录</Text>
				
					</View>
				</View>

			</View>
		}
		
		</>
	);
};

};
export default Header;
