import React from 'react';
import Environment from './config/environment';
import {
	ActivityIndicator,
	Clipboard,
	FlatList,
	Image,
	Share,
	StyleSheet,
	View, ScrollView, TouchableOpacity, Animated
} from 'react-native';

import {
	Container, Content, CardItem, Body, Text, Left, Button
} from 'native-base';

import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import uuid from 'uuid';
import firebase from './config/firebase';
import { LibCard } from './LibCard';
import { CameraCard } from './CameraCard';

export default class Home extends React.Component {
	state = {
		image: null,
		uploading: false,
		googleResponse: null,
		filename: ""
	};

	async componentDidMount() {
		await Permissions.askAsync(Permissions.CAMERA_ROLL);
		await Permissions.askAsync(Permissions.CAMERA);
	}
	static navigationOptions = {
		title: 'Google Vision API',
		headerTintColor: '#06409e',
		headerStyle: {
			backgroundColor: 'white',
			borderBottomColor: '#778BEB'
		 }
	  };

	render() {
		let { image } = this.state;
		const {navigate} = this.props.navigation;
		return (
			<Container style={styles.container}>
				<Content>
					<View >
						<View>
							<CardItem style={{height: 40, paddingBottom:0, marginTop:0, marginBottom:5}}>
								<Left >
									<Image source={require('./img/PDI-logo-color.png')}  
											style={{height: 34 , width: 110, resizeMode:"contain"}} />
									<Body>
										<Text style={{ color: '#06409e' }}>HackGT Workshop</Text>
										<Text note>Welcome</Text>
									</Body>
								</Left>
							</CardItem>
						</View>

						<ScrollView>
							<View style={{flex: 1, flexDirection: 'row', margin:5, marginTop:0, marginBottom:0}}>
								<LibCard onPress={this._pickImage}/>
								<CameraCard onPress={this._takePhoto} />
							</View>
							{this._maybeRenderImage()}
							{this._maybeRenderUploadingOverlay()}
						</ScrollView>
					</View>
				</Content>
			</Container>
		);
	}

	_maybeRenderUploadingOverlay = () => {
		if (this.state.uploading) {
			return (
				<View
					style={[
						StyleSheet.absoluteFill,
						{
							backgroundColor: 'rgba(0,0,0,0.4)',
							alignItems: 'center',
							justifyContent: 'center'
						}
					]}>
					<ActivityIndicator color="#fff" animating size="large" />
				</View>
			);
		}
	};

	_maybeRenderImage = () => {
		let { image, googleResponse } = this.state;
		if (!image) {
			return(
				<View style={styles.uploadPhotoBox}>
					<Image source={require('./img/uploadImage.jpeg')}  
					style={{ width: 250, height: 250, opacity:.5}} />
				</View>
			);
		}

		return (
			<View>
				<View	style={styles.uploadPhotoBox}>
					<TouchableOpacity onPress={this._copyToClipboard}
						onLongPress={this._share}>
						<Image source={{ uri: image }} style={{ width: 350, height: 250 }} />
					</TouchableOpacity>
				</View>
				<Button style={styles.button}
					onPress={() => this.submitToGoogle()}>
					<Text style={{color:'white'}}>Analyze</Text>
				</Button>

				{googleResponse && (
					<View style={{ height: 310 }} >
						<FlatList 
							data={this.state.googleResponse.responses[0].labelAnnotations}
							keyExtractor={item => item.description}
							renderItem={item => this._renderLabel(item.item)}
						/>
						<Button style={styles.button} onPress={this._showJson}>
							<Text style={{color:'white'}}>View Full Response</Text>
						</Button>
					</View>
				)}
			</View>
		);
	};

	_renderLabel = (item) => {
		animatedValue = new Animated.Value(0);
		Animated.timing(animatedValue, {toValue: item.score * 340}).start();

		return	(
			<View style={styles.item}>
				<Text style={styles.label}>{item.description}</Text>
				<View style={styles.data}>	
					<Animated.View style={[styles.bar, {width: animatedValue}]} />				
					<Text style={styles.dataNumber}>{(item.score * 100).toFixed(2)}%</Text>
				</View>
		  	</View>
		);
	}

	_share = () => {
		Share.share({
			message: JSON.stringify(this.state.googleResponse),
			title: 'Check it out',
			url: this.state.image
		});
	};

	_copyToClipboard = () => {
		Clipboard.setString(JSON.stringify(this.state.googleResponse));
		alert('Copied to clipboard');
	};

	_takePhoto = async () => {
		let pickerResult = await ImagePicker.launchCameraAsync({
			allowsEditing: true,
			aspect: [4, 3]
		});

		this._handleImagePicked(pickerResult);
	};

	_pickImage = async () => {
		let pickerResult = await ImagePicker.launchImageLibraryAsync({
			allowsEditing: true,
			aspect: [4, 3]
		});

		this._handleImagePicked(pickerResult);
	};	

	_handleImagePicked = async pickerResult => {
		try {
			this.setState({ uploading: true });

			if (!pickerResult.cancelled) { 
				uploadUrl = await this.uploadImageAsync(pickerResult.uri);
				
				this.setState({ image: uploadUrl });
			}
		} catch (e) {
			console.log(e);
			alert('Upload failed');
		} finally {
			this.setState({ uploading: false });
		}
	};

	_showJson = async () => {
		this.props.navigation.navigate('ShowJson', {json: this.state.googleResponse.responses[0]})
	}
	
	submitToGoogle = async () => {
		try {
			this.setState({ uploading: true });
			let { image, filename } = this.state;
			let image2= Environment['FIREBASE_STORAGE_BUCKET']+ filename;
			console.log("image:"+image2);

			let body = JSON.stringify({
				requests: [
					{
						features: [
							{ type: 'LABEL_DETECTION', maxResults: 8 },
							{ type: 'SAFE_SEARCH_DETECTION', maxResults: 5 },
							{ type: 'LANDMARK_DETECTION', maxResults: 5 },
							{ type: 'FACE_DETECTION', maxResults: 5 },
							{ type: 'LOGO_DETECTION', maxResults: 5 },
							{ type: 'TEXT_DETECTION', maxResults: 5 },
							{ type: 'DOCUMENT_TEXT_DETECTION', maxResults: 5 },
							{ type: 'IMAGE_PROPERTIES', maxResults: 5 },
							{ type: 'CROP_HINTS', maxResults: 5 },
							{ type: 'WEB_DETECTION', maxResults: 5 }
						],
						image: {
							source: {
								imageUri: image2
							}
						}
					}
				]
			});
			let response = await fetch(
				'https://vision.googleapis.com/v1/images:annotate?key=' +
				Environment['GOOGLE_CLOUD_VISION_API_KEY'],
				{
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					},
					method: 'POST',
					body: body
				}
			);
			let responseJson = await response.json();
			console.log(responseJson);
			this.setState({
				googleResponse: responseJson,
				uploading: false
			});
		} catch (error) {
			console.log(error);
		}
	}

	uploadImageAsync = async (uri) => {
		let response = await fetch(uri);
		const blob = await response.blob();
		
		const ref = firebase.storage().ref().child(uuid.v4());
		const snapshot = await ref.put(blob);
		blob.close();
		this.setState({
			filename: ref.name
		});
		return await snapshot.ref.getDownloadURL();
	}
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
		paddingBottom: 5
	},
	uploadphoto: {
		borderTopRightRadius: 3,
		borderTopLeftRadius: 3,
		shadowColor: 'rgba(0,0,0,1)',
		shadowOpacity: 0.2,
		shadowOffset: { width: 4, height: 4 },
		shadowRadius: 5,
		overflow: 'hidden',
		marginTop: 5,
		margin: 5,
		justifyContent: 'center',
		alignItems: 'center'
	},

	uploadPhotoBox: {
		alignItems: 'center',
		borderStyle: 'dashed',
		borderColor: '#d6d7da',
		borderWidth: 2,
		borderRadius: 1,
		alignSelf: 'center',
		height: 255,
		width: '95%'
	},

	button: {
		backgroundColor:'#06409e',
		height: 34,
		alignSelf: 'stretch',
		borderRadius: 4,
		justifyContent: 'center',
		margin: 5
	},

	item: {
		flexDirection: 'column',
		marginBottom: 5,
		paddingHorizontal: 10
	  },
	  label: {
		color: 'dimgrey',
		flex: 1,
		fontSize: 12,
		position: 'relative',
		top: 2
	  },
	  data: {
		flex: 2,
		flexDirection: 'row'
	  },
	  dataNumber: {
		color: 'dimgrey',
		fontSize: 11
	  },
	  bar: {
		alignSelf: 'center',
		borderRadius: 5,
		height: 6,
		marginRight: 5,
		backgroundColor: '#F55443'
	  },
	
});