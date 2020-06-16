import {StyleSheet, Dimensions} from 'react-native';
const dimensions = Dimensions.get('window');
const windowWidth = dimensions.width;
const windowHeight = dimensions.height;
const styles = StyleSheet.create({
	topicTittle:{
		width:"50%",
		padding:10,
		paddingRight:0,
		//backgroundColor:"#ccc"
	}
})

export default styles;