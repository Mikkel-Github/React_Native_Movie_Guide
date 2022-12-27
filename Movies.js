import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image, FlatList, TouchableOpacity, ImageBackground, Button } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';

export default function Movies() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTv, setTrendingTv] = useState([]);
  const [trendingPeople, setTrendingPeople] = useState([]);

  const [infoPopupImageSrc, setInfoPopupImageSrc] = useState('');
  const [infoPopupTitle, setInfoPopupTitle] = useState('');
  const [infoPopupLanguage, setInfoPopupLanguage] = useState('');
  const [infoPopupDescription, setInfoPopupDescription] = useState('');
  const [infoPopupPopularity, setInfoPopupPopularity] = useState('');
  const [infoPopupReleaseDate, setInfoPopupReleaseDate] = useState('');
  const [infoPopupBackdrop, setInfoPopupBackdrop] = useState('');
  const [infoPopupRuntime, setInfoPopupRuntime] = useState('');
  const [showInfoPopup, setShowInfoPopup] = useState(false);

  const masterContainer1 = useRef(null);
  const masterContainer2 = useRef(null);
  const masterContainer3 = useRef(null);
  const infoPopup = useRef(null);
  const infoPopupLanguageRef = useRef(null);
  const infoPopupReleaseDateRef = useRef(null);

  useEffect(() =>{
    getTrendingMoviesFromApi('https://api.themoviedb.org/3/trending/movie/week?api_key=a7d26cbde2c4cc637772c32299352a9f');
    getTrendingTvFromApi('https://api.themoviedb.org/3/trending/tv/week?api_key=a7d26cbde2c4cc637772c32299352a9f');
    getTrendingPeopleFromApi('https://api.themoviedb.org/3/trending/person/week?api_key=a7d26cbde2c4cc637772c32299352a9f');
  }, []);
        
  function getTrendingMoviesFromApi(url) {
    fetch(url)
    .then((response) => response.json())
    .then((json) => {
      //console.log(json);
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
        setTrendingMovies(trendingMovies => [...trendingMovies, requestData]);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  function getTrendingTvFromApi(url, requestType) {
    fetch(url)
    .then((response) => response.json())
    .then((json) => {
      //console.log(json);
      for(let i = 0; i < json.results.length; i++) {
        const requestData = {"id":json.results[i].id, 
          "title":json.results[i].name, 
          "language":json.results[i].original_language,
          "description":json.results[i].overview,
          "popularity":json.results[i].popularity,
          "releaseDate":json.results[i].first_air_date,
          "poster":"https://image.tmdb.org/t/p/original/" + json.results[i].poster_path, 
          "backdrop":"https://image.tmdb.org/t/p/original/" + json.results[i].backdrop_path}
        setTrendingTv(trendingTv => [...trendingTv, requestData]);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }
  function getTrendingPeopleFromApi(url, requestType) {
    fetch(url)
    .then((response) => response.json())
    .then((json) => {
      //console.log(json);
      for(let i = 0; i < json.results.length; i++) {
        var known_for = "";
        for(let j = 0; j < json.results[i].known_for.length; j++) {
          if(j == 0) {
            known_for += json.results[i].known_for[j].title;
          } else {
            known_for += ", " + json.results[i].known_for[j].title;
          }
        }
        var requestData = null;
        if(json.results[i].profile_path != null) {
          requestData = {"id":json.results[i].id, 
          "title":json.results[i].name, 
          "poster":"https://image.tmdb.org/t/p/original/" + json.results[i].profile_path,
          "popularity":json.results[i].popularity,
          "knownFor":known_for}
        } else {
          requestData = {"id":json.results[i].id, 
          "title":json.results[i].name, 
          "poster":"https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg",
          "popularity":json.results[i].popularity,
          "knownFor":known_for}
        }
        
        setTrendingPeople(trendingPeople => [...trendingPeople, requestData]);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  const Item = ({ title, imageSrc, language, description, popularity, releaseDate, backdrop }) => (
    <TouchableOpacity style={styles.item} 
      onPress={() => {
        setInfoPopupImageSrc(imageSrc);
        setInfoPopupTitle(title);
        setInfoPopupLanguage("Language: " + language);
        setInfoPopupDescription("Description: " + description);
        setInfoPopupPopularity("Score: " + popularity);
        setInfoPopupReleaseDate("Released: " + releaseDate);
        setInfoPopupBackdrop(backdrop);

        infoPopupLanguageRef.current.style.display = "block";
        infoPopupReleaseDateRef.current.style.display = "block";
        infoPopup.current.style.display = "block";
        masterContainer1.current.style.display = "none";
        masterContainer2.current.style.display = "none";
        masterContainer3.current.style.display = "none";
      }}>
      <Image
      style={styles.poster}
      source={{
        uri: imageSrc,
        }}/>
    </TouchableOpacity >
  );

  const renderItem = ({ item }) => (
    <Item title={item.title} imageSrc={item.poster} language={item.language} description={item.description} popularity={item.popularity} releaseDate={item.releaseDate} backdrop={item.backdrop}/>
  );

  const Actor = ({ title, imageSrc, description, popularity }) => (
    <TouchableOpacity style={styles.item} 
      onPress={() => {
        
        setInfoPopupImageSrc(imageSrc);
        setInfoPopupBackdrop(imageSrc);
        setInfoPopupTitle(title);
        infoPopupLanguageRef.current.style.display = "none";
        infoPopupReleaseDateRef.current.style.display = "none";
        setInfoPopupDescription("Known for: " + description);
        setInfoPopupReleaseDate("");
        setInfoPopupPopularity("Score: " + popularity);

        infoPopup.current.style.display = "block";
        masterContainer1.current.style.display = "none";
        masterContainer2.current.style.display = "none";
        masterContainer3.current.style.display = "none";
      }}>
      <Image
      style={styles.poster}
      source={{
        uri: imageSrc,
        }}/>
    </TouchableOpacity >
  );

  const renderPerson = ({ item }) => (
    <Actor title={item.title} imageSrc={item.poster} description={item.knownFor} popularity={item.popularity}/>
  );

  return (
    <View style={styles.container}>
      <View style={styles.infoPopup} ref={infoPopup}>
        <h2>{infoPopupTitle}</h2>
        <p ref={infoPopupLanguageRef}>{infoPopupLanguage}</p>
        <p>{infoPopupPopularity}</p>  
        <p ref={infoPopupReleaseDateRef}>{infoPopupReleaseDate}</p>
        <p>{infoPopupDescription}</p>
        <Image source={infoPopupBackdrop} style={styles.backgroundImage} blurRadius={0} />
        <Button style={styles.closeButton}
          title="Close"
          color="#0099ff"
          onPress={() => {
            infoPopup.current.style.display = "none";
            masterContainer1.current.style.display = "flex";
            masterContainer2.current.style.display = "flex";
            masterContainer3.current.style.display = "flex";
        }}>Close</Button>
      </View>
      <View style={styles.categoryContainer} ref={masterContainer1}>
        <h2>Trending Movies</h2>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.flatlist}
          data={trendingMovies}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
      <View style={styles.categoryContainer} ref={masterContainer2}>
        <h2>Trending Series</h2>
        <FlatList
          horizontal
          style={styles.flatlist}
          data={trendingTv}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
      <View style={styles.categoryContainer} ref={masterContainer3}>
        <h2>Trending People</h2>
        <FlatList
          horizontal
          style={styles.flatlist}
          data={trendingPeople}
          renderItem={renderPerson}
          keyExtractor={item => item.id}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flatlist: {
  },
  item: {
  },
  poster: {
    width: 150,
    height: 225,
    marginRight: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#212121',
    height: "100%",
  },
  categoryContainer: {
    fontFamily: 'Helvetica',
    marginTop: 40,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    color: '#fff',
  },
  infoPopup: {
    position: "sticky",
    display: "none",
    width: "100%",
    maxWidth: "100%",
    height: "100%",
    fontFamily: 'Helvetica',
    top: 0,
    marginTop: 40,
    backgroundColor: '#212121',
    color: "#fff",
    zIndex: 999,
  },
  backgroundImage: {
    height: 200,
    marginTop: 20,
  },
});
