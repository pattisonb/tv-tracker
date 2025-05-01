import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Button, ActivityIndicator, Alert } from 'react-native';
import { getTVShowDetails } from '../api';
import { useTrackedShows } from '../TrackedShowsContext';
import { formatDate } from '../utils/formatDate';

export default function DetailsScreen({ route, navigation }) {
  const { trackedShows, addShow, removeShow } = useTrackedShows();
  const isTracked = details ? trackedShows.some((s) => s.id === details.id) : false;
  const { show } = route.params;
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data, error } = await getTVShowDetails(show.id);
        if (error) {
          console.error(error);
          Alert.alert('Error', error);
          return;
        }
        setDetails(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [show.id]);

  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!details) {
    return (
      <View style={styles.container}>
        <Text>Failed to load details.</Text>
        <Button title="Back to Search" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const handleTrackToggle = () => {
    if (trackedShows.some((s) => s.id === details.id)) {
      removeShow(details.id);
      Alert.alert('Success', `${details.name} ${trackedShows.some((s) => s.id === details.id) ? 'removed' : 'added'} from your list.`);

    } else {
      addShow(details);
      Alert.alert('Success', `${details.name} ${trackedShows.some((s) => s.id === details.id) ? 'removed' : 'added'} to your list.`);

    }
  };
  

  const getStatusColor = () => {
    switch (details.status) {
      case 'Returning Series':
        return 'green';
      case 'In Production':
        return 'orange';
      case 'Ended':
      case 'Canceled':
        return 'red';
      default:
        return 'gray';
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {details.poster_path && (
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w300${details.poster_path}` }}
          style={styles.poster}
        />
      )}
      <Text style={styles.title}>{details.name}</Text>
      {details.in_production && details.next_episode_to_air ? (
  <Text style={styles.subtitle}>
    Next Air Date: {formatDate(details.next_episode_to_air.air_date)}
  </Text>
) : !details.in_production && details.last_air_date ? (
  <Text style={styles.subtitle}>
    Last Air Date: {formatDate(details.last_air_date)}
  </Text>
) : (
  <Text style={styles.subtitle}>
    First Air Date: {formatDate(details.first_air_date)}
  </Text>
)}

      <Text style={styles.subtitle}>Seasons: {details.number_of_seasons}</Text>
      <Text style={styles.subtitle}>Episodes: {details.number_of_episodes}</Text>
            <Text style={[styles.subtitle, { color: getStatusColor() }]}>
        {details.in_production ? 'Currently Airing' : 'Ended'}
      </Text>
      {details && (
  <>
    <Button
      title={
        trackedShows.some((s) => s.id === details.id)
          ? "Untrack Show"
          : "Track This Show"
      }
      onPress={handleTrackToggle}
    />
  </>
)}


      <Text style={styles.overview}>{details.overview}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  poster: { width: 200, height: 300, borderRadius: 8, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 10 },
  overview: { fontSize: 16, textAlign: 'center', marginTop: 10 },
});
