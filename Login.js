/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Button,
    Image
} from "react-native";

import LoginView from "./src/clientJS/LoginView";

import FBSDK, {
    LoginManager,
    AccessToken,
    LoginButton
} from "react-native-fbsdk";

const instructions = Platform.select({
    ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
    android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});

import {
    StackNavigator,
} from 'react-navigation';

const App = StackNavigator({
    Login: { screen: Login},
    MapView: { screen: App},
});

class Login extends Component<{}> {

    // _fbAuth(){
    //   LoginManager.logInWithReadPermissions(["email"],["user_birthday"]).then(function(result){
    //     if (result.isCancelled){
    //       alert('Login Cancelled')
    //     }else{
    //       alert('login successfull ' + result.grantedPermissions.toString());
    //     }
    //   }, function(error){
    //     alert('error was occured' + error);
    //   })
    // }
    render() {
        return (
            // <View style={styles.container}>
            //   <TouchableOpacity onPress={() => this._fbAuth()}>
            //     <Text>Facebook</Text>
            //   </TouchableOpacity>
            // </View>
            <View style={styles.container}>
                <Image source={{uri : 'https://d24wuq6o951i2g.cloudfront.net/img/events/id/282/2826921/assets/76d.FDC_Logo-Stacked-2-colour-for-white-bg.png'}} style={{height: 200, width: 200 }} resizeMode="contain"/>
                <LoginButton
                    publishPermissions={["publish_actions,email"]}
                    onLoginFinished={(error, result) => {
                        if (error) {
                            alert("Login error " + result.error);
                        } else if (result.isCancelled) {
                            alert("Login is cancelled");
                        } else {
                            AccessToken.getCurrentAccessToken().then(data => {
                                {
                                    /*const { accessToken } = data
                                      initUser(accessToken)*/
                                }
                                fetch(
                                    "https://graph.facebook.com/v2.11/me?fields=email,name,picture&access_token=" +
                                    data.accessToken
                                )
                                    .then(response => response.json())
                                    .then(json => {
                                        console.log(data.accessToken.toString())
                                        console.log(json.name);
                                        console.log(json.email);
                                        console.log(json.id);
                                        fetch(
                                            "http://alfatihstudi.000webhostapp.com/minihack/Services.php?application=create",
                                            {
                                                method: "POST",
                                                headers: {
                                                    Accept: "application/json",
                                                    "Content-Type": "application/json"
                                                },
                                                body: JSON.stringify({
                                                    name: json.name,
                                                    skill: "gatau",
                                                    email: json.email,
                                                    phone: "085720008645"
                                                })
                                            }
                                        );
                                    })
                                    .catch(() => {
                                        reject("ERROR GETTING DATA FROM FACEBOOK");
                                    });
                            });
                        }
                        navigate('Login')
                    }}
                    onLogoutFinished={() => alert("logout.")}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF"
    },
    welcome: {
        fontSize: 20,
        textAlign: "center",
        margin: 10
    },
    instructions: {
        textAlign: "center",
        color: "#333333",
        marginBottom: 5
    }
});
