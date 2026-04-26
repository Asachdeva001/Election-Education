import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { AccessibleText } from '../components/AccessibleWrapper';
import MapMarkerCard from '../components/MapMarkerCard';
import { theme } from '../theme';

// Mock Polling Stations located in New Delhi, India
const MOCK_INDIA_STATIONS = [
  {
    id: '1',
    name: 'Connaught Place Early Voting Center',
    type: 'Early Voting',
    address: 'Rajiv Chowk, New Delhi, Delhi 110001, India',
    coordinate: { latitude: 28.6304, longitude: 77.2177 },
  },
  {
    id: '2',
    name: 'India Gate Polling Station',
    type: 'In-Person Polling Place',
    address: 'Rajpath, India Gate, New Delhi, Delhi 110001, India',
    coordinate: { latitude: 28.6129, longitude: 77.2295 },
  },
  {
    id: '3',
    name: 'Secure Mail-in Dropbox - Chanakyapuri',
    type: 'Mail-in secure Dropbox',
    address: 'Diplomatic Enclave, Chanakyapuri, New Delhi 110021, India',
    coordinate: { latitude: 28.5956, longitude: 77.1895 },
  }
];

export default function LocatorScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied. Please use the search bar.');
        return;
      }

      let userLoc = await Location.getCurrentPositionAsync({});
      setLocation(userLoc.coords);
    })();
  }, []);

  const mapRegion = location ? {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  } : {
    // Fallback to New Delhi default to show pins
    latitude: 28.6139,
    longitude: 77.2090,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  return (
    <View style={styles.container}>
      {errorMsg ? (
        <View style={styles.errorBox}>
          <AccessibleText variant="body">{errorMsg}</AccessibleText>
        </View>
      ) : null}

      <MapView 
         style={styles.map} 
         region={mapRegion}
         showsUserLocation={true}
      >
        {MOCK_INDIA_STATIONS.map((station) => (
          <Marker
            key={station.id}
            coordinate={station.coordinate}
            title={station.name}
            pinColor={
               station.type.includes('Early') ? theme.colors.primary 
             : station.type.includes('Mail') ? theme.colors.success 
             : theme.colors.secondary
            }
            onPress={() => setSelectedStation(station)}
          />
        ))}
      </MapView>
      
      <MapMarkerCard 
         station={selectedStation} 
         onClose={() => setSelectedStation(null)} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  errorBox: {
    backgroundColor: theme.colors.danger,
    padding: theme.spacing.md,
    alignItems: 'center',
  }
});
