import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  Image
} from 'react-native';

import MapView, { Marker } from 'react-native-maps';
import uAreHere from './assets/004-placeholder.png';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 53.6182417;
const LONGITUDE = -2.6583733;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

function createMarker(modifier = 1) {
  return {
    latitude: LATITUDE - SPACE * modifier,
    longitude: LONGITUDE - SPACE * modifier
  };
}

const MARKERS = [
  createMarker(),
  createMarker(2),
  createMarker(3),
  createMarker(4)
];

const DEFAULT_PADDING = { top: 40, right: 40, bottom: 40, left: 40 };

class FitToCoordinates extends React.Component {
  // fitPadding() {
  //   this.map.fitToCoordinates([MARKERS[2], MARKERS[3]], {
  //     edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
  //     animated: true
  //   });
  // }

  fitAllMarkers() {
    this.map.fitToCoordinates(MARKERS, {
      edgePadding: DEFAULT_PADDING,
      animated: true
    });
  }

  render() {
    console.log(this.props, 'THIS PROPS<><><><><><><><><><><>');
    return (
      <View style={styles.container}>
        <MapView
          ref={ref => {
            this.map = ref;
          }}
          style={styles.map}
          initialRegion={{
            latitude: this.props.latitude,
            longitude: this.props.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          }}
          mapType="satellite"
        >
          {MARKERS.map((marker, i) => <Marker key={i} coordinate={marker} />)}
          <Marker
            key={'You are here'}
            coordinate={{
              latitude: this.props.latitude,
              longitude: this.props.longitude
            }}
            title={'You are here'}
            description={'You are here'}
          >
            <Image source={uAreHere} />
          </Marker>
        </MapView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => this.fitAllMarkers()}
            style={[styles.bubble, styles.button]}
          >
            <Text>Fit All Markers</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20
  },
  button: {
    marginTop: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10
  },
  buttonContainer: {
    flexDirection: 'column',
    marginVertical: 20,
    backgroundColor: 'transparent'
  }
});

export default FitToCoordinates;
