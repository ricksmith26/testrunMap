import React from 'react';
import { StyleSheet, Text, View, Button, Animated, Image } from 'react-native';

import { MapView } from 'expo';
import superagent from 'superagent';
import Icon from 'react-native-vector-icons/FontAwesome';
import pin from './assets/001-placeholder-1.png';
import uAreHere from './assets/004-placeholder.png';
// import CITHeader from './Header';

export default class App extends React.Component {
  state = {
    latitude: null,
    longitude: null,
    error: null,
    request: false,
    landmarks: {},
    isLoading: true,
    markers: [],
    titles: []
  };

  componentDidMount() {
    this.watchId = navigator.geolocation.watchPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null
        });
      },
      error => this.setState({ error: error.message }),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 10
      }
    );
  }
  componentDidUpdate(_, prevState) {
    if (prevState.request !== this.state.request) {
      superagent
        .get(
          `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gscoord=${
            this.state.latitude
          }|${this.state.longitude}&format=json`
        )

        .end((error, response) => {
          if (error) {
            console.error(error);
          } else {
            this.setState({ landmarks: JSON.parse(response.text) });
            const landmarks = { ...this.state.landmarks.query };
            const markers = landmarks.geosearch.map(function(l) {
              const marker = {
                coordinate: {
                  latitude: l.lat,
                  longitude: l.lon
                },
                title: l.title,
                distance: l.dist,
                pageid: l.pageid
              };
              return marker;
            });
            this.setState({ markers });
          }
        });
    }
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }
  render() {
    // console.log(this.state, '<<<<<<<<<<<<<<<<<<<<');
    if (this.state.request) {
      return (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.0422,
            longitudeDelta: 0.0221
          }}
          zoom={2}
          zoomEnabled={true}
          scrollEnabled={true}
          showsScale={true}
          mapType="satellite"
          showsMyLocationButton={true}
          showsScale={true}
          showsCompass={true}
          loadingIndicatorColor="#228B22"
        >
          {
            (this.state.length = 0
              ? null
              : this.state.markers.map(marker => {
                  const coords = {
                    latitude: marker.coordinate.latitude,
                    longitude: marker.coordinate.longitude
                  };
                  console.log(coords, '<>><<><<><<<<<<<<<<<<<');
                  return (
                    <MapView.Marker
                      key={marker.pageid}
                      coordinate={coords}
                      title={marker.title}
                      description={`distance: ${marker.distance}m`}
                    >
                      <Image source={pin} />
                    </MapView.Marker>
                  );
                }))
          }
          <MapView.Marker
            key={'You are here'}
            coordinate={{
              latitude: this.state.latitude,
              longitude: this.state.longitude
            }}
            title={'You are here'}
            description={'You are here'}
          >
            <Image source={uAreHere} />
          </MapView.Marker>
        </MapView>
      );
    } else {
      return (
        <View
          style={{
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* <CITHeader /> */}
          <Text>Latitude: {this.state.latitude}</Text>
          <Text>Longitude: {this.state.longitude}</Text>
          {this.state.error ? <Text>Error: {this.state.error}</Text> : null}
          <Text>{'\n'}</Text>
          <Button
            icon={<Icon name="arrow-right" size={15} color="white" />}
            title="Search nearby Landmarks"
            onPress={() => {
              this.setState({ request: true });
            }}
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  marker: {
    backgroundColor: '#550bbc',
    padding: 5,
    borderRadius: 5
  }
});
