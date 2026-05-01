/**
 * @file LocatorScreen.js
 * @description Provides a map interface to help users locate polling stations.
 * Incorporates structural logic for Google Maps Places API for enhanced address lookup.
 */

// --- Imports ---
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

// Internal Components & Configuration
import { AccessibleText, AccessibleButton } from '../components/AccessibleWrapper';
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
 * Renders the Locator Screen containing an interactive map and a search bar
 * pre-wired for Google Maps Places API integration.
 * 
 * @returns {JSX.Element} The LocatorScreen component.
 */
export default function LocatorScreen() {
  // --- State ---
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

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
  
  /**
   * Handles the address search logic.
   * This is where Google Maps Places API (Autocomplete/Geocoding) would interface.
   */
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setErrorMsg(null);
    
    try {
      // GOOGLE PLACES API INTEGRATION POINT:
      // In a full environment, you would call `https://maps.googleapis.com/maps/api/geocode/json?address=${searchQuery}&key=${API_KEY}` here
      // to convert the string address into coordinates, then update the map region.
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Fallback/Mock behavior: Center map on New Delhi
      setLocation({
        latitude: 28.6139,
        longitude: 77.2090,
      });
      
    } catch (err) {
       setErrorMsg('Address lookup failed. Please try a different query.');
    } finally {
      setIsSearching(false);
    }
  };

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
      {/* Search Bar & Error Banner */}
      <View style={styles.topBar}>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Zip or Address..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            accessibilityLabel="Search for polling locations by address"
          />
          <AccessibleButton 
             title={isSearching ? "..." : "Search"} 
             variant="primary" 
             onPress={handleSearch} 
             disabled={isSearching}
          />
        </View>

        {errorMsg ? (
          <View style={styles.errorBox}>
            <AccessibleText variant="body" style={{color: '#FFF'}}>{errorMsg}</AccessibleText>
          </View>
        ) : null}
      </View>

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
  topBar: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  searchRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    color: theme.colors.textPrimary,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 8,
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  errorBox: {
    backgroundColor: theme.colors.danger,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderRadius: 8,
  }
});
