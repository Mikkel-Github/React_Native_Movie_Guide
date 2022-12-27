import { StyleSheet, View, Image, FlatList, TouchableOpacity, Button } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function BrowseTvShows() {
    const [trendingTv, setTrendingTv] = useState([]);
  
    const [infoPopupImageSrc, setInfoPopupImageSrc] = useState('');
    const [infoPopupTitle, setInfoPopupTitle] = useState('');
    const [infoPopupLanguage, setInfoPopupLanguage] = useState('');
    const [infoPopupDescription, setInfoPopupDescription] = useState('');
    const [infoPopupPopularity, setInfoPopupPopularity] = useState('');
    const [infoPopupReleaseDate, setInfoPopupReleaseDate] = useState('');
    const [infoPopupBackdrop, setInfoPopupBackdrop] = useState('');
    const [infoPopupRuntime, setInfoPopupRuntime] = useState('');
    const [showInfoPopup, setShowInfoPopup] = useState(false);

    const [pageCounter, setPageCounter] = useState(1);
  
    const masterTvShowsContainer = useRef(null);
    const infoPopup = useRef(null);
    const infoPopupLanguageRef = useRef(null);
    const infoPopupReleaseDateRef = useRef(null);
  
    useEffect(() =>{
      getTrendingTvFromApi(pageCounter);
    }, []);
    
    function getTrendingTvFromApi(page) {
        setTrendingTv([]);
        var url = 'https://api.themoviedb.org/3/trending/tv/week?api_key=a7d26cbde2c4cc637772c32299352a9f&page=' + page
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
          masterTvShowsContainer.current.style.display = "none";
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
      <Item title={item.title} imageSrc={item.poster} language={item.language} description={item.description} popularity={item.popularity} releaseDate={item.releaseDate} backdrop={item.backdrop}/>
    );
  
    return (
      <View style={styles.container}>
        <View style={styles.infoPopup} ref={infoPopup}>
            <Image source={infoPopupBackdrop} style={styles.backgroundImage} blurRadius={0} />
            <h2>{infoPopupTitle}</h2>
            <p ref={infoPopupLanguageRef}>{infoPopupLanguage}</p>
            <p>{infoPopupPopularity}</p>  
            <p ref={infoPopupReleaseDateRef}>{infoPopupReleaseDate}</p>
            <p>{infoPopupDescription}</p>
            <Button style={styles.closeButton}
                title="Close"
                color="#0099ff"
                onPress={() => {
                infoPopup.current.style.display = "none";
                masterTvShowsContainer.current.style.display = "flex";
            }}>Close</Button>
        </View>
        <View style={styles.categoryContainer} ref={masterTvShowsContainer}>
          <h2>Browse Trending Series</h2>
          <FlatList
            style={styles.flatlist}
            data={trendingTv}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.touchButton}
                onPress={() => {
                    if(pageCounter > 1) {
                        getTrendingTvFromApi(pageCounter - 1);
                        // Update the page counter after,
                        // Since the setState is too slow to set the new value
                        setPageCounter(pageCounter - 1);
                    }
                }}>
                <MaterialCommunityIcons name="arrow-left-thick" color={'#fff'} size={24} />
            </TouchableOpacity>
            <p style={{margin: 0, marginTop: "auto", marginBottom: "auto", fontSize: 12}}>Page {pageCounter}</p>
            <TouchableOpacity style={styles.touchButton}
                onPress={() => {
                    getTrendingTvFromApi(pageCounter + 1);
                    // Update the page counter after,
                    // Since the setState is too slow to set the new value
                    setPageCounter(pageCounter + 1);
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
