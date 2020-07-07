/**

*/
import React, { Component } from 'react';
import {Button, Text, View, Image, StyleSheet, BackHandler, TouchableOpacity, Platform, TextInput} from 'react-native';
import { getAbout } from "../request/discourse_api";
import {_getUsers} from '../models/auth';
import  config from '../config';
const url = config.SERVER_URL;
class About extends Component {
	constructor(props){
		super(props);
		this.state={
			about:null,
			type:"about"
		}
	}
	componentDidMount (){
 		const {navigation } = this.props;
 		navigation.setOptions({
			title: "激活账号",
			headerStyle: {
	            height:45
	        }
		});
		this.GetInfo();

    }
    GetInfo = async()=>{
    	const currentUser = await _getUsers();
	  		
		const csrf = JSON.parse(currentUser)[0] !=null && JSON.parse(currentUser)[0] != "undefind" ? JSON.parse(currentUser)[0].csrf :null;
			
    	const about = await getAbout(csrf);
    	this.setState({
    		about:about.about
    	})
    	console.log(about)
    }
	render(){
		const {type, about} = this.state;
		return(
			<View style={{flex:1,backgroundColor:"#fff",padding:10,marginTop:10}}>

				<View style={{width:"100%",flexDirection:'row',justifyContent:'space-between',paddingLeft:20,paddingRight:20}}>
					<Text onPress={()=>{if(type != "about") this.setState({type:"about"});}} style={type == "about" ? styles.selectedBtn : styles.defaultBtn}>关于</Text>
					<Text onPress={()=>{if(type != "faq") this.setState({type:"faq"});}} style={type == "faq" ? styles.selectedBtn : styles.defaultBtn}>常见问题</Text>
					<Text onPress={()=>{if(type != "tos") this.setState({type:"tos"});}} style={type == "tos" ? styles.selectedBtn : styles.defaultBtn}>服务条款</Text>
					<Text onPress={()=>{if(type != "privacy") this.setState({type:"privacy"});}} style={type == "privacy" ? styles.selectedBtn : styles.defaultBtn}>隐私</Text>
				</View>
				{type == "about" && 
					<View>
						{about != null && 

							<View>
								<Text>关于 {about.title}</Text>
								<Text>我们的管理员</Text>
								{about.admins.map((v,k)=>{
									return(
										<View style={{flexDirection:"row"}}>
											<TouchableOpacity style={{}} onPress={() => this.setState({showProfileMenu:!showProfileMenu})}>
								            	<Image style={{width:40,height:40,borderRadius:40,marginTop:4}} source={{uri: url + v.avatar_template.replace("{size}",64) }}></Image> 
								  			</TouchableOpacity>
								  			<Text style={{fontSize:18,marginLeft:10}}>{v.username}</Text>
										</View>
									)
								})}
								



							</View>

						}
					</View>	
					
				}
			</View>
		)
	}
}	
export default About;

const styles = StyleSheet.create({
	selectedBtn:{
		fontSize:18,
		color:"#fff",
		padding:5,
		paddingLeft:10,
		paddingRight:10,
		borderWidth:1,
		borderColor:"#e45735",
		backgroundColor:"#e45735"
	},
	defaultBtn:{
		fontSize:18,
		color:"#000",
		padding:5,
		paddingLeft:10,
		paddingRight:10,
		
	}
})