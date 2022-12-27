import { StyleSheet, View, Image, FlatList, TouchableOpacity, Button } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function BrowseMovies() {
    const [trendingPeople, setTrendingPeople] = useState([]);
  
    const [infoPopupImageSrc, setInfoPopupImageSrc] = useState('');
    const [infoPopupTitle, setInfoPopupTitle] = useState('');
    const [infoPopupLanguage, setInfoPopupLanguage] = useState('');
    const [infoPopupDescription, setInfoPopupDescription] = useState('');
    const [infoPopupPopularity, setInfoPopupPopularity] = useState('');
    const [knownFor, setKnownFor] = useState('');
    const [infoPopupReleaseDate, setInfoPopupReleaseDate] = useState('');
    const [infoPopupBackdrop, setInfoPopupBackdrop] = useState('');

    const [moviePageCounter, setMoviePageCounter] = useState(1);
  
    const masterMovieContainer = useRef(null);
    const infoPopup = useRef(null);
    const infoPopupLanguageRef = useRef(null);
    const infoPopupReleaseDateRef = useRef(null);
  
    useEffect(() =>{
        getTrendingPeopleFromApi(moviePageCounter);
    }, []);

    function getTrendingPeopleFromApi(page) {
        setTrendingPeople([]);
        var url = 'https://api.themoviedb.org/3/trending/person/week?api_key=a7d26cbde2c4cc637772c32299352a9f&page=' + page;
        fetch(url)
        .then((response) => response.json())
        .then((json) => {
            //console.log(json);
            for (let i = 0; i < json.results.length; i++) {
                var known_for = "";
                for (let j = 0; j < json.results[i].known_for.length; j++) {
                    if (j == 0) {
                        known_for += json.results[i].known_for[j].title;
                    } else {
                        known_for += ", " + json.results[i].known_for[j].title;
                    }
                }
                var requestData = null;
                if (json.results[i].profile_path != null) {
                    requestData = {
                        "id": json.results[i].id,
                        "title": json.results[i].name,
                        "poster": "https://image.tmdb.org/t/p/original/" + json.results[i].profile_path,
                        "backdrop": "https://image.tmdb.org/t/p/original/" + json.results[i].profile_path,
                        "popularity": json.results[i].popularity,
                        "knownFor": known_for
                    }
                } else {
                    requestData = {
                        "id": json.results[i].id,
                        "title": json.results[i].name,
                        "poster": "https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg",
                        "backdrop": "https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg",
                        "popularity": json.results[i].popularity,
                        "knownFor": known_for
                    }
                }
                setTrendingPeople(trendingPeople => [...trendingPeople, requestData]);
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }
  
    const Item = ({ title, imageSrc, known_for, language, description, popularity, releaseDate, backdrop }) => (
      <TouchableOpacity style={styles.item} 
        onPress={() => {
          setInfoPopupImageSrc(imageSrc);
          setInfoPopupTitle(title);
          //setInfoPopupLanguage("Language: " + language);
          //setInfoPopupDescription("Description: " + description);
          setInfoPopupPopularity("Score: " + popularity);
          //setInfoPopupReleaseDate("Released: " + releaseDate);
          setKnownFor("Known for: " + known_for);
          setInfoPopupBackdrop(backdrop);
  
          //infoPopupLanguageRef.current.style.display = "block";
          //infoPopupReleaseDateRef.current.style.display = "block";
          infoPopup.current.style.display = "block";
          masterMovieContainer.current.style.display = "none";
        }}>
        <View style={styles.posterContainer}>
            <Image
                style={styles.poster}
                source={{
            uri: imageSrc,
            }}/>
        </View>
        <View>
            <h4 style={{margin: 0, marginTop: 10}}>{title}</h4>
            <p style={{margin: 0}}>Score: {popularity}</p>
            <p style={{margin: 0}}>Released: {releaseDate}</p>
        </View>
      </TouchableOpacity >
    );
  
    const renderItem = ({ item }) => (
        <Item title={item.title} imageSrc={item.poster} known_for={item.knownFor} language={item.language} description={item.description} popularity={item.popularity} releaseDate={item.releaseDate} backdrop={item.backdrop}/>
    );
  
    return (
      <View style={styles.container}>
        <View style={styles.infoPopup} ref={infoPopup}>
            <Image source={infoPopupBackdrop} style={styles.backgroundImage} blurRadius={0} />
            <h2>{infoPopupTitle}</h2>
            <p ref={infoPopupLanguageRef}>{infoPopupLanguage}</p>
            <p>{infoPopupPopularity}</p>  
            <p>{knownFor}</p>  
            <p ref={infoPopupReleaseDateRef}>{infoPopupReleaseDate}</p>
            <p>{infoPopupDescription}</p>
            <Button style={styles.closeButton}
                title="Close"
                color="#0099ff"
                onPress={() => {
                infoPopup.current.style.display = "none";
                masterMovieContainer.current.style.display = "flex";
            }}>Close</Button>
        </View>
        <View style={styles.categoryContainer} ref={masterMovieContainer}>
            <h2>Trending Movies</h2>
            <FlatList
                style={styles.flatlist}
                data={trendingPeople}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
            <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.touchButton}
                onPress={() => {
                    if(moviePageCounter > 1) {
                        getTrendingPeopleFromApi(moviePageCounter - 1);
                        // Update the page counter after,
                        // Since the setState is too slow to set the new value
                        setMoviePageCounter(moviePageCounter - 1);
                    }
                }}>
                <MaterialCommunityIcons name="arrow-left-thick" color={'#fff'} size={24} />
            </TouchableOpacity>
            <p style={{margin: 0, marginTop: "auto", marginBottom: "auto", fontSize: 12}}>Page {moviePageCounter}</p>
            <TouchableOpacity style={styles.touchButton}
                onPress={() => {
                    getTrendingPeopleFromApi(moviePageCounter + 1);
                    // Update the page counter after,
                    // Since the setState is too slow to set the new value
                    setMoviePageCounter(moviePageCounter + 1);
                }}>
                <MaterialCommunityIcons name="arrow-right-thick" color={'#fff'} size={24} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
}
  
const styles = StyleSheet.create({
    touchButton: {
        backgroundColor:"#0099ff",
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        width: 30,
        height: 30,
    },
  flatlist: {
  },
  item: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: 250,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: "#121212",
    padding: 20,
    borderRadius: 10,
  },
  posterContainer: {
    width: 150,
    height: 225,

    justifyContent: "center",
    alignItems: "center",

    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 16,
  },
  poster: {
    width: 150,
    height: 225,
  },
  container: {
    flex: 1,
    backgroundColor: '#212121',
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    height: "100vh",
    maxHeight: "100%",
    fontFamily: 'Helvetica',
  },
  categoryContainer: {
    width: "100%",
    fontFamily: 'Helvetica',
    marginLeft: 40,
    marginRight: 40,
    color: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoPopup: {
    position: "sticky",
    display: "none",
    width: "100%",
    maxWidth: 350,
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
  buttonContainer: {
    display: "flex", 
    flexDirection: "row", 
    justifyContent: "space-around",
    width: 250, 
    marginBottom: 20,
  }
});
