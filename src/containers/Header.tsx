import React, { useState } from 'react'
import Login from '../components/Login'
import {StyleSheet, View, Button, Image, Text, Platform} from 'react-native'
import Colors from '../utility/Colors'
import * as DocumentPicker from 'expo-document-picker'
import { Base64 } from 'js-base64';
import * as FileSystem from 'expo-file-system';
import { JWKInterface } from 'arweave/web/lib/wallet'

type Iprops = {
	onSetWallet: Function
}
const Header = ({onSetWallet}:Iprops) => {
	const [loggedIn, setLoggedIn] = useState(false)
	const [openLoginModal, setOpenLoginModal] = useState(false)

	const onClickSignin = () => {
		setOpenLoginModal(true)
	}
	const onCloseLogin = () => {
		setOpenLoginModal(false)
	}

	const onChangeLogin = async () => {
		let file = await DocumentPicker.getDocumentAsync({ type: '*/*' })
		if(file.type=='cancel'){ return; }
		if(file.type=='success'){
			try {
				
				let b64: string
				if(Platform.OS === 'web'){
					b64 = file.uri.split(',')[1]
				}else {
					b64 = await FileSystem.readAsStringAsync(file.uri, {encoding: FileSystem.EncodingType.Base64})
				}

				let strJwk = Base64.decode(b64)
				let wallet: JWKInterface = JSON.parse(strJwk)
				
				setLoggedIn(true)
				onSetWallet(wallet)
				
			} catch (err) {
				console.log('Error logging in: ' + err)
				 //alert('Error logging in: ' + err)
			}
		}
		setOpenLoginModal(false)
	}
	
	return (
		<View style={s.buttonContainer}>
			<Image source={require('../../assets/icon.png')} style={{width: 30, height: 30}} />
			<Text style={s.text}>Hotdog Sample Browser</Text>
			<Button title={loggedIn? 'logged in': 'sign in'} color={Colors.primary} onPress={onClickSignin} />
			<Login onClose={onCloseLogin} open={openLoginModal} onChangeFile={onChangeLogin} />
		</View>
	)
}

const s = StyleSheet.create({
	buttonContainer: {
		flexDirection: "row",
		width: '100%',
		maxWidth: 768,
		justifyContent: "space-evenly",
		alignItems: 'center',
		padding: 15,
		backgroundColor: Colors.background,
	},
	button: {
		width: '40%',
	},
	text: {
		color: Colors.onBackground,
	}

})

export default Header