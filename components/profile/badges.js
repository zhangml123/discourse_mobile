/**

*/
import React, { Component } from 'react';
import {Button, Text, View, Image, StyleSheet, BackHandler, TouchableOpacity, Platform, TextInput, ScrollView} from 'react-native';
import { _getUsers} from '../../models/auth';
import {  getSummary, getBadges } from "../../request/discourse_api";
import loadingImage from '../../images/loading.gif';
class Dadges extends Component {
	constructor(props){
		super(props)
		this.state = {
			badges:[],
			loading:true
		}
	}
	componentDidMount (){
		this.GetInfo();
	}
	GetInfo = async () =>{
		try{
			const currentUser = await _getUsers();
			const csrf = JSON.parse(currentUser)[0] !=null && JSON.parse(currentUser)[0] != "undefind" ? JSON.parse(currentUser)[0].csrf :null;
			const username = this.props.username;
			const badges = await getBadges(username, csrf);
			console.log("badges = " )
			console.log(badges)
			this.setState({
				badges:badges,
				loading:false
			})
		}catch(e){
			console.log(e)
		}
	}
	render(){
		const {badges, loading} = this.state;
		return(
			<ScrollView style={{}}>
				{badges.length !=0 &&
					<View style={{padding:20}}>
						{badges.badges.map((v,k)=>{
							console.log(v)
							return(
								<View style={{padding:10,textAlign:"center",alignItems:"center",backgroundColor:"#f3f3f3",marginTop:10}}>
									<Text style={{fontSize:16}}>{v.name}</Text>	
									<Text style={{marginTop:5}}>{v.description.replace(/<a.*?>/g,"").replace(/<\/a>/g,"")}</Text>
									
								</View>
									
							)

						})}
					</View>
				}
				{loading ? 
					<View style={{width:"100%",alignItems:"center"}} >
						<Image style={{width:20,height:20}}  source={ loadingImage }/>
					</View>
				:null}	
			</ScrollView>
		)
	}
}	
export default Dadges;