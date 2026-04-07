import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

interface Series {
  series_name: string;
  category: string;
  live_data_csv: string;
}

export default function HomeScreen() {
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // This points to your Doorables-Data repo
  const SERIES_JSON_URL = "https://raw.githubusercontent.com/Azzurri5161/Doorables-Data/main/series.json";

  useEffect(() => {
    loadSeries();
  }, []);

  const loadSeries = async () => {
    try {
      const response = await axios.get(SERIES_JSON_URL);
      setSeriesList(response.data);
    } catch (error) {
      console.error("Error loading the Hub:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderSeriesCard = ({ item }: { item: Series }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push({
        pathname: "/characters",
        params: { csvUrl: item.live_data_csv, seriesName: item.series_name }
      })}
    >
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText}>{item.category}</Text>
      </View>
      <Text style={styles.cardTitle}>{item.series_name}</Text>
      <Text style={styles.tapText}>View Codes →</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.mainHeader}>Doorables Hub</Text>
      
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Syncing with GitHub...</Text>
        </View>
      ) : (
        <FlatList
          data={seriesList}
          renderItem={renderSeriesCard}
          keyExtractor={(item) => item.series_name}
          numColumns={2} // This creates the visual grid
          contentContainerStyle={styles.listPadding}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  mainHeader: { fontSize: 32, fontWeight: 'bold', marginTop: 60, marginBottom: 20, paddingHorizontal: 20 },
  listPadding: { paddingHorizontal: 10, paddingBottom: 40 },
  card: {
    backgroundColor: '#FFF',
    flex: 1,
    margin: 8,
    padding: 15,
    borderRadius: 16,
    height: 130,
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryBadge: {
    backgroundColor: '#E5E5EA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start'
  },
  categoryText: { fontSize: 10, fontWeight: '700', color: '#8E8E93', textTransform: 'uppercase' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#1C1C1E' },
  tapText: { fontSize: 12, color: '#007AFF', fontWeight: '600' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#8E8E93' }
});