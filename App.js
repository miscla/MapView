/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import MapView from 'react-native-maps';

export default class App extends Component<{}> {
    constructor(props) {
        super(props);

        this.state = {
            latitude: 0.1,
            longitude: 0.1,
            error: null,
            markers:[
            ]
        };
    }

    componentDidMount() {
        this.timer = setInterval(()=> this.getLocation(), 10000)
        this.watchId = navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    error: null,
                }, ()=>{
                    // ketika dia lokasi nya berubah otomatis ngupdate database
                    fetch('http://alfatihstudi.000webhostapp.com/minihack/Services.php?application=update', {
                        // post text must be in upper case
                        method: 'POST',
                        headers:{
                          Accept:"application/json",
                         "Content-Type":"application/json"
                        },
                         body: JSON.stringify({
                          email: "aceparis32@gmail.com", // ntar email ini harusnya dapet dari acep
                          latitude: this.state.latitude,
                          longitude: this.state.longitude
                      })
                    })
                });
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
        );
    }

    async getLocation(){
        fetch('http://alfatihstudi.000webhostapp.com/minihack/Services.php?application=read', {
            // post text must be in upper case
            method: 'get',
            dataType: 'json',
            headers:{
                Accept:"application/json",
                "Content-Type":"application/json"
            }
        }).then((response)=>{
            return response.json()
        }).then((json)=>{
            // console.log("THIS IS JSON",json)
            for(var i=0;i<json.length;i++){
                json[i].latitude = parseFloat(json[i].latitude)
                json[i].longitude = parseFloat(json[i].longitude)
            }
            this.setState({markers:json})
            console.log("INI MARKER STATE",json)
        })
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchId);
    }

  render() {
    return (
      <View style={styles.container}>
        <MapView
            style={styles.map}
            // set mapview region, use region instead of initialRegion
            region={{
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}>
          <MapView.Marker
              coordinate={{
                  latitude: this.state.latitude,
                  longitude: this.state.longitude,
              }}
          />
            {this.state.markers.map((marker,i) => (
                <MapView.Marker
                    key={i}
                    coordinate={
                        {
                            latitude: marker.latitude,
                            longitude: marker.longitude,
                        }
                    }
                />
            ))}
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    map:{
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute',
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
