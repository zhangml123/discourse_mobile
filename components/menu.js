/**

*/
import React, { Component } from 'react';
import {Button, Text, View, Image, StyleSheet, BackHandler, TouchableOpacity, Platform, TextInput} from 'react-native';
class Menu extends Component {
	componentDidMount (){

	}
	render(){
		const {categories} = this.props
		return(
			<View style={{width:"100%",position:"absolute",top:50,padding:10,backgroundColor:"#efefef",zIndex:5}}>
				<View style={{width:"100%",height:120,borderBottomWidth:1,backgroundColor:"#fff",flexDirection:'row',
		flexWrap:'wrap',borderBottomColor:"#ddd"}}>
					<Text style={{width:"50%",height:40,  textAlignVertical:'center',paddingLeft:20,color:"#0366d6"}}>最新</Text>
					<Text style={{width:"50%",height:40, textAlignVertical:'center',paddingLeft:20,color:"#0366d6"}}>热门</Text>
					<Text style={{width:"50%",height:40,   textAlignVertical:'center',paddingLeft:20,color:"#0366d6"}}>徽章</Text>
					<Text style={{width:"50%",height:40,textAlignVertical:'center',paddingLeft:20,color:"#0366d6"}}>用户</Text>
					<Text style={{width:"50%",height:40,    textAlignVertical:'center',paddingLeft:20,color:"#0366d6"}}>群组</Text>
					
				</View>
				<View style={{width:"100%",height:120,borderBottomWidth:1,backgroundColor:"#fff",borderBottomColor:"#ddd"}}>
					<Text style={{width:"100%",height:40,     textAlignVertical:'center',paddingLeft:20,color:"#0366d6"}}>分类</Text>
					
					<View style={{maxWidth:"100%",
						paddingLeft:15,
						flexDirection:'row',
						flexWrap:'wrap',
					}}>
					{categories.map((cate,k)=>{

						if(cate.cateTittle != "" ){
		    				return <View  key={k} style={{flexDirection:'row',width:"50%",height:30}}>
			    				<Text key={k} style={{width:10,height:10,margin:8,backgroundColor:"#ccc"}}>
			    				</Text><Text key={k+"a"}  style={{fontSize:18}}>{cate.cateTittle}</Text>
		    				</View>
		    			}
					})}

					</View>
				</View>
				<View style={{width:"100%",backgroundColor:"#fff",flexDirection:'row'}}>
					<Text style={{width:"50%",height:40,  textAlignVertical:'center',paddingLeft:20,color:"#0366d6"}}>关于</Text>
					<Text style={{width:"50%",height:40, textAlignVertical:'center',paddingLeft:20,color:"#0366d6"}}>常见问题</Text>
					
				</View>
			</View>
		)
	}
}	
export default Menu;