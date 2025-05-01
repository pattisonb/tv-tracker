import { useState, useRef, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, Image, Keyboard, TouchableOpacity } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { searchTVShows } from '../api';
import { Alert } from 'react-native';
import { formatDate } from '../utils/formatDate';



export default function SearchScreen({navigation}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const inputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 500); // small delay so screen finishes rendering
  
    return () => clearTimeout(timer);
  }, []);


  const searchTVShowsHandler = async (newSearch = false) => {
    try {
      Keyboard.dismiss();
      if (newSearch) {
        setPage(1);
        setResults([]);
        setHasMore(true);
      }
      setLoading(true);
      const { data, error } = await searchTVShows(query, newSearch ? 1 : page);
      if (error) {
        console.error(error);
        Alert.alert("Error", error)
        return;
      }
      const showsWithPosters = data.results.filter(show => show.poster_path);
      setResults(prev => [...prev, ...showsWithPosters]);
      setHasMore(data.page < data.total_pages);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderFooter = () => {
    if (!loading || page === 1) return null;
  
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  };

  const renderEmptyComponent = () => {
    if (loading) return null; // don't show "no results" while loading
  
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No results found.</Text>
      </View>
    );
  };
  
  
  
  return (
    <View style={styles.container}>
      <TextInput
      ref={inputRef}
  style={styles.input}
  placeholder="Search TV Shows..."
  value={query}
  onChangeText={setQuery}
  onSubmitEditing={() => searchTVShowsHandler(true)}
  returnKeyType="search"
/>
      <Button title="Search" onPress={() => searchTVShowsHandler(true)} />
      {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginVertical: 20 }} />}
      <FlatList
  data={results}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Details', { show: item })}
      style={styles.item}
    >
      {item.poster_path && (
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
          style={styles.poster}
        />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtitle}>First Air Date: {formatDate(item.first_air_date)}</Text>
      </View>
    </TouchableOpacity>
  )}
  onEndReached={() => {
    if (!loading && hasMore) {
      searchTVShowsHandler(false);
    }
  }}
  onEndReachedThreshold={0.5}
  ListFooterComponent={renderFooter}
  ListEmptyComponent={renderEmptyComponent}
/>

    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, marginTop: 30 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },  
  title: { fontSize: 18, fontWeight: 'bold' },
  subtitle: { color: '#555' },
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
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
  },
});
