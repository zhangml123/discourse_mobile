/**

*/
import React, { Component } from 'react';
import {Button, Text, View, Image, StyleSheet, BackHandler, TouchableOpacity, Platform, TextInput, ScrollView} from 'react-native';
import { _getUsers} from '../models/auth';
import {  getAllBadges } from "../request/discourse_api";
import loadingImage from '../images/loading.gif';
class Dadges extends Component {
	constructor(props){
		super(props)
		this.state = {
			badges:{},
			type1:[]
		}
	}
	componentDidMount (){
		const {navigation } = this.props;
		navigation.setOptions({
			title:"徽章",
        	headerStyle: {
	            height:40
	        }

		})
		this.GetInfo();
	}
	GetInfo = async () =>{
		try{
			
			
			const badges = await getAllBadges();
			//console.log("badges = " )
			//console.log(badges)
			/*const badge_groupings = badges.badge_groupings;
			const badges
			let type1 = [];
			
			badges.badge_groupings.map((v,k)=>{

				badges.badges.map((v1,k1)=>{
				
					if(v.badge_grouping_id == 2){
						type1.push(v)
					}

				})
				


				})
			console.log("type1 = ")
			console.log(type1)

*/
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
			<ScrollView style={{backgroundColor:"#fff"}}>

				{badges != {}  &&
					<View style={{marginTop:20}}>
					<Text style={{width:"100%",height:40,fontSize:20,textAlign:"center"}}>徽章</Text>
						{badges.badge_groupings !=null&& 
							badges.badge_groupings.map((v,k)=>{
								 
								if(v.name == "Trust Level")v.name_cn = "信任等级"
								if(v.name == "Getting Started")v.name_cn = "入门指南"
								if(v.name == "Community")v.name_cn = "社区"
								if(v.name == "Posting")v.name_cn = "发帖"
							return (
								<View>
									<Text style={{height:40,paddingLeft:10,color:"#999",fontSize:20}}>{v.name_cn}</Text>
									{badges.badges.map((v1,k1)=>{
										if(v.id == v1.badge_grouping_id){
											return (
												<View style={{padding:10,textAlign:"center",alignItems:"center",backgroundColor:"#f3f3f3",margin:10}}>
													<Text style={{fontSize:16}}>{v1.name}</Text>	
													<Text style={{marginTop:5}}>{v1.description.replace(/<a.*?>/g,"").replace(/<\/a>/g,"")}</Text>
													
												</View>
											)
										}
									})}
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