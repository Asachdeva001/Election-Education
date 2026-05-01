/**
 * @file LocatorScreen.js
 * @description Provides a map interface to help users locate polling stations,
 * early voting centers, and mail-in dropboxes based on their current location.
 */

// --- Imports ---
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

// Internal Components & Configuration
import { AccessibleText } from '../components/AccessibleWrapper';
import MapMarkerCard from '../components/MapMarkerCard';
import { theme } from '../theme';

// --- Constants ---
/**
 * @constant MOCK_INDIA_STATIONS
 * @description Mock polling station data for demonstration purposes.
 * Located in New Delhi, India.
 */
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

// --- Main Component ---
/**
 * Renders the Locator Screen containing an interactive map.
 * Requests location permissions and displays nearby polling stations.
 * 
 * @returns {JSX.Element} The LocatorScreen component.
 */
export default function LocatorScreen() {
  // --- State ---
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);

  // --- Side Effects ---
  useEffect(() => {
    /**
     * Asynchronously requests location permissions and fetches the current position.
     */
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

  // --- Helpers ---
  // Determine the map's visible region based on user location or fallback.
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

  // --- Render ---
  return (
    <View style={styles.container}>
      {/* Error Banner */}
      {errorMsg ? (
        <View style={styles.errorBox}>
          <AccessibleText variant="body">{errorMsg}</AccessibleText>
        </View>
      ) : null}

      {/* Interactive Map */}
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
      
      {/* Selected Station Overlay */}
      <MapMarkerCard 
         station={selectedStation} 
         onClose={() => setSelectedStation(null)} 
      />
    </View>
  );
}

// --- Styles ---
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
