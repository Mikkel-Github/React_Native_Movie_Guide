import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, ScrollView, Button, TextInput, TouchableHighlight, Image, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import Movies from './Movies';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState, useRef } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BrowseTvShows from './TvShowsScreen';
import BrowseMovies from './MoviesScreen';
import BrowsePeople from './PeoplesScreen';


const Tab = createBottomTabNavigator();

function HomeScreen() {
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState([{"id":0, "title":"Search Results"}]);

  const [searchResultsPopupTitle, setSearchResultsPopupTitle] = useState('');
  const [searchResultsPopupPopularity, setSearchResultsPopupPopularity] = useState('');
  const [searchResultsPopupRelease, setSearchResultsPopupRelease] = useState('');
  const [searchPoster, setSearchPoster] = useState('https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_160x56dp.png');

  const searchPopup = useRef(null);
  const searchResultText = useRef(null);
  const moviesContainer = useRef(null);

  function search(s) {
    setResults([]);

    const words = s.split(' ');
    var query = words[0];
    if(words.length > 1) {
      for(let i = 1; i < words.length; i++) {
        query += '+' + words[i];
      }
    }
  
    //console.log('Search: ' + query);
  
    fetch('https://api.themoviedb.org/3/search/movie?api_key=a7d26cbde2c4cc637772c32299352a9f&query=' + query)
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      console.log("length: " + json.results.length);
      for(let i = 0; i < json.results.length; i++) {
        const requestData = {
          "id":json.results[i].id, 
          "title":json.results[i].title, 
          "language":json.results[i].original_language,
          "description":json.results[i].overview,
          "popularity":json.results[i].popularity,
          "releaseDate":json.results[i].release_date,
          "poster":"https://image.tmdb.org/t/p/original/" + json.results[i].poster_path, 
          "backdrop":"https://image.tmdb.org/t/p/original/" + json.results[i].backdrop_path}
        setResults(results => [...results, requestData]);
      }
      setSearchResultsPopupTitle(json.results[0].title);
      setSearchResultsPopupPopularity(json.results[0].popularity);
      setSearchResultsPopupRelease(json.results[0].release_date);
      setSearchPoster("https://image.tmdb.org/t/p/original/" + json.results[0].poster_path);
      searchPopup.current.style.display = 'block';
      moviesContainer.current.style.display = "none";
    })
    .catch((error) => {
      console.error(error);
    });

    searchPopup.current.style.width = Dimensions.get('window').width + "px";
  }

  const Item = ({ title, imageSrc, language, description, popularity, releaseDate, backdrop, runtime }) => (
    <TouchableOpacity style={styles.item} 
      onPress={() => {
        //todo : Implement so that when user clicks on search results, it opens the info window
      }}>
      <View style={styles.searchResultsView}>
        <Image
          style={styles.searchResultPoster}
          source={imageSrc}/>
        <View style={styles.infoBlock}>
          <h3 style={styles.searchResultText}>{title}</h3>
          <p style={styles.searchResultText}>Score: {popularity}</p>  
          <p style={styles.searchResultText}>Released: {releaseDate}</p>  
        </View>
      </View>
    </TouchableOpacity >
  );

  const renderItem = ({ item }) => (
    <Item title={item.title} imageSrc={item.poster} language={item.language} description={item.description} popularity={item.popularity} releaseDate={item.releaseDate} backdrop={item.backdrop} runtime={item.runtime}/>
  );

  return (
    <ScrollView style={{ height: "100%", backgroundColor: "#212121" }}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <h1 style={styles.logo}>MovieGuide</h1>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.input}
              placeholder={"Search"}
              onChangeText={newText => setSearchText(newText)}
              defaultValue={searchText}
            />
            <TouchableHighlight onPress={() => search(searchText)}>
              <Ionicons name="search" size={24} color="#0099ff" />
            </TouchableHighlight>
          </View>
        </View>
      </View>

      <View id={"searchResultView"} style={styles.searchResultsPopup} ref={searchPopup}>
        <Button
          title="Close"
          color="#0099ff"
          onPress={() => {
            searchPopup.current.style.display = "none";
            moviesContainer.current.style.display = "block";
          }}>Close</Button>
          <FlatList
            data={results}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
      </View>
      
      <View ref={moviesContainer} >
        <Movies />
      </View>
    </ScrollView>
  );
}

function TvShowsScreen() {
  return (
    <ScrollView style={{ height: "100%", backgroundColor: "#212121" }}>
      <BrowseTvShows />
    </ScrollView>
  );
}

function MoviesScreen() {
  return (
    <ScrollView style={{ height: "100%", backgroundColor: "#212121" }}>
      <BrowseMovies />
    </ScrollView>
  );
}

function PeopleScreen() {
  return (
      <ScrollView style={{ height: "100%", backgroundColor: "#212121" }}>
          <BrowsePeople />
      </ScrollView>
  );
}

export default function App() {
  const navTheme = {
    colors: {
      background: "#fff",
      primary: "#0099ff",
      card: "#131313",
      text: "#fff",
      border: "#0099ff",
    }
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
      screenOptions={{
        headerShown: false
      }}>
        <Tab.Screen name="Home" component={HomeScreen} options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}/>
        <Tab.Screen name="Tv Shows" component={TvShowsScreen} options={{
          tabBarLabel: 'Tv Shows',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="television" color={color} size={size} />
          ),
        }} />
        <Tab.Screen name="Movies" component={MoviesScreen} options={{
          tabBarLabel: 'Movies',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="movie" color={color} size={size} />
          ),
        }} />
        <Tab.Screen name="People" component={PeopleScreen} options={{
          tabBarLabel: 'People',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  masterContainer: {
    fontFamily: 'Helvetica',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#212121',
    width: "100%",
    maxWidth: 350,
    height: "100vh",
    maxHeight: "100%",
    fontFamily: 'Helvetica',
    height: "100%", 
    backgroundColor: "#212121",
  },
  headerContainer: {
    height: 70,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignContent: 'flex-start',
    maxHeight: 50,
    width: '100%',
    flex: 1,
    backgroundColor: '#131313',
    color: '#0099ff',
    alignItems: 'center',
    fontFamily: 'Helvetica',

    shadowColor: '#0099ff',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  logo: {
    marginLeft: 10,
    marginRight: 5,
    fontSize: 20,
  },
  headerText: {
    marginLeft: 5,
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  searchBar: {
    display: 'flex',
    flexDirection: 'row',
    marginRight: 10,
    height: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#000',
    height: 25,
  },
  searchBtn: {
    height: 20,
  },
  searchResultsPopup: {
    display: "none",
    width: "100%",
    padding: 20,
    top: 0,
    backgroundColor: '#212121',
    color: "#fff",
    zIndex: 999,
  },
  closeButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 40,
    height: 40,
  },
  searchResultsView: {
    display: 'flex',
    flexDirection: 'row',
    height: 225/2.5,
    maxHeight: 225/2.5,
    marginLeft: 10,
    marginTop: 5,
    marginBottom: 5,
    alignItems: 'center',
    fontFamily: 'Helvetica',
  },
  searchResultPoster: {
    left: 0,
    top: 0,
    width: 150/2.5,
    height: 225/2.5,
    marginRight: 10,
  },
  searchResultText: {
    margin: 0,
    marginRight: 10,
    width: "100%",
    maxWidth: "100%",
  },
  infoBlock: {
    justifyContent: 'space-around',
    height: "100%",
  }
});
