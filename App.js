import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Animated,
  Image,
  Slider
} from 'react-native';
import Tts from 'react-native-tts';
import { MapView } from 'expo';
import superagent from 'superagent';
import Icon from 'react-native-vector-icons/FontAwesome';
import pin from './assets/001-placeholder-1.png';
import uAreHere from './assets/004-placeholder.png';
import building from './assets/university.png';

export default class App extends React.Component {
  state = {
    latitude: null,
    longitude: null,
    error: null,
    request: false,
    landmarks: {},
    isLoading: true,
    markers: [],
    titles: [],
    distance: 5000,
    locationInfo: ''
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
          `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=${
            this.state.distance
          }&gscoord=${this.state.latitude}|${this.state.longitude}&format=json`
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
    console.log('render<<<<<<,');
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

                  return (
                    <MapView.Marker
                      key={marker.pageid}
                      coordinate={coords}
                      title={marker.title}
                      description={`distance: ${marker.distance}m`}
                      onPress={() => {
                        superagent
                          .get(
                            `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&pageids=${
                              marker.pageid
                            }rvsection=0action=raw`
                          )

                          .end((error, response) => {
                            if (error) {
                              console.error(error);
                            } else {
                              var reg = new RegExp('/[0-9]/');
                              const t = JSON.parse(response.text);
                              const m = t.query.pages;
                              const tour = m[marker.pageid].extract
                                .replace(
                                  /<b>|<\/p>|<\/b>|<h2>|<\/h2>|<p>|<span id=|<\/[a-z]+>|<[a-z]+>|<p class="mw-empty-elt">/g,
                                  ''
                                )
                                .replace(
                                  /"References">References\s\D+\s?\d?/gi,
                                  ''
                                );
                              console.log(tour, '@@@@<><><><><><><@@@');

                              {
                                /* Tts.getInitStatus().then(() => {
                                Tts.speak(tour);
                              }); */
                              }
                            }
                          });
                      }}
                    >
                      <View style={styles.marker}>
                        <Text>{marker.title}</Text>
                        <Image source={building} />
                      </View>
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
      const val = this.state.distance;
      return (
        <View
          style={{
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
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
          <Text>{'\n'}</Text>
          <Text>{this.state.distance}</Text>
          <Slider
            step={50}
            minimumValue={500}
            maximumValue={3000}
            width={200}
            value={val}
            onValueChange={changedVal => {
              this.setState({ distance: changedVal });
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
    backgroundColor: '#66B032',
    alignItems: 'center',
    justifyContent: 'center'
  },
  marker: {
    backgroundColor: '#9BD770',
    padding: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 5
  }
});
