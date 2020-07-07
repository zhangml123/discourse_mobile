/**
 
 */
import React, { Component } from 'react';
import {Button, Text, View, Image, StyleSheet, BackHandler, TouchableOpacity, Platform, TextInput, Dimensions} from 'react-native';
const dimensions = Dimensions.get('window');
const windowWidth = dimensions.width;
const windowHeight = dimensions.height;
class Dropdown extends Component {
	constructor(props){
		super(props);
		this.state = {
		  showDropdown: false,
		  currentCategory: this.props.currentCategory || "所有分类"

		}
	}
	componentDidMount(){
	}
	
	_onPressButton = () => {
		this.setState({
			showDropdown: !this.state.showDropdown
		})
		//console.log(this.state.showDropdown)
	};
	_onSelect = (cate, id, slug) => {
		console.log(cate)
		this.setState({
			currentCategory: cate,
			showDropdown: false
		})
		this.props.changeCategory(cate, id, slug)
	}
	_onHideDropdown = ()=>{
		this.setState({
			showDropdown: false
		})
	}

	render(){
		const { showDropdown, currentCategory } = this.state
		const categories = this.props.categories;

		return (
			<>
				<View style={(showDropdown ? styles.showDropdown : styles.hideDropdown )}> 
				   <TouchableOpacity onPress={this._onPressButton} style={styles.dropDownBtn}>
				   		<Text>{currentCategory}</Text>
				   		<Image source={require("../images/drop_down.png")} style={showDropdown ? {width:8,height:8,transform: [{rotateX:'180deg'}]} : {width:8,height:8}}></Image>
				   		
				   </TouchableOpacity>
				   {showDropdown ? 
				   	<TouchableOpacity onPress={this._onHideDropdown} style={{width:windowWidth,height:windowHeight}}>
					   	<View style={{width:'43%',padding:5,backgroundColor:'#fff',borderWidth:1,borderColor:"#eee",position:"absolute"}}>
					   		<TouchableOpacity onPress={this._onSelect.bind(this,"所有分类")}>
					   			<Text>所有分类</Text>
				   			</TouchableOpacity>
					   		{categories.map((v,k)=>{
					   			return <>
					   				<TouchableOpacity key= {k} onPress={this._onSelect.bind(this, v.cateTittle, v.id, v.slug)} style={{flexDirection:"row",justifyContent: 'space-between'}}>
							   			<Text>{v.cateTittle}</Text><Text>帖子：{v.topic_count}</Text>
							   		</TouchableOpacity>
							   		{v.subCates != null && v.subCates.length != 0 &&
								   		v.subCates.map((v1,k1)=>{
								   				return <TouchableOpacity key= {k} onPress={this._onSelect.bind(this, v1.name, v1.id, v1.slug)} style={{flexDirection:"row",justifyContent: 'space-between'}}>
										   			<Text style={{flex:1}}> -- {v1.name}</Text><Text>帖子：{v1.topic_count}</Text>
									   			</TouchableOpacity>
								   			})
										}
						   			
						   			
					   				</>
					   			
					   		})}
					   	</View>
				   	</TouchableOpacity>
				   	
				   	: null}
	      		</View>
	      	
			</>
		);
	};

};

const styles = StyleSheet.create({
	dropDownView:{

		 height:windowHeight,
		 width:windowWidth,
		 padding:10,
		 position:"absolute",
		 top:55,zIndex:1
	},
	showDropdown:{
		flex: 1,
		height:windowHeight,
		width:windowWidth,
		padding:10,
		position:"absolute",
		top:55,
		zIndex:3
	},
	hideDropdown:{
		flex: 1,
		height:windowHeight,
		width:windowWidth,
		padding:10,
		position:"absolute",
		top:55,
		zIndex:1
	},
	dropDownBtn:{
		width:"45%",
		height:30,
		padding:5,
		borderWidth: 1,
		borderColor:'#ddd',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
		flexDirection:"row",
		justifyContent: 'space-between',
		alignItems:"center"
	}
})
export default Dropdown;