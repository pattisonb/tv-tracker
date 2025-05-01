import { FlatList, TouchableOpacity, Text, View, Image, StyleSheet, Button, Alert } from 'react-native';
import { useTrackedShows } from '../TrackedShowsContext';
import { formatDate } from '../utils/formatDate';

export default function ShowListScreen({ navigation }) {
  const { trackedShows, removeShow } = useTrackedShows();

  const handleRemovePress = (id, name) => {
    Alert.alert(
      'Remove Show',
      `Are you sure you want to remove "${name}" from your tracked shows?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeShow(id) },
      ]
    );
  };
  

  return (
    <View style={styles.container}>
      <FlatList
        data={trackedShows}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <TouchableOpacity
              style={styles.itemContent}
              onPress={() => navigation.navigate('Details', { show: item })}
            >
              {item.poster_path && (
                <Image
                  source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
                  style={styles.poster}
                />
              )}
              <View style={styles.textContainer}>
  <Text style={styles.title}>{item.name}</Text>
  {item.next_episode_to_air ? (
    <>
      <Text style={styles.subtitle}>
        Next Episode: {formatDate(item.next_episode_to_air.air_date)}
      </Text>
      <Text style={styles.episodeSubtitle}>
        S{item.next_episode_to_air.season_number}:E{item.next_episode_to_air.episode_number} "{item.next_episode_to_air.name}"
      </Text>
    </>
  ) : item.rumor ? (
    <Text style={styles.subtitle}>
      {item.rumor}
    </Text>
  ) : null}

</View>

            </TouchableOpacity>
        
            <TouchableOpacity
              onPress={() => handleRemovePress(item.id, item.name)}
              style={styles.removeButton}
            >
              <Text style={styles.removeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        )}
        
        
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tracked shows yet. Start tracking some!</Text>
        }
      />

      <View style={{ marginTop: 20 }}>
        <Button
          title="Search for TV Shows"
          onPress={() => navigation.navigate('Search')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, marginTop: 30 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  removeButton: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },  
  itemContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  episodeSubtitle: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 2,
  },
  
});
