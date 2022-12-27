import { Component } from "react";

class Scrollable extends Component {
    handleScroll = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom) {
          console.log("HIT BOTTOM");
          setPageNumber(setPageNumber++);
          getTrendingTvFromApi('https://api.themoviedb.org/3/trending/tv/week?api_key=a7d26cbde2c4cc637772c32299352a9f&page=' + pageNumber);
        }
    }

    render() {
        const [pageNumber, setPageNumber] = useState(1);

        const [trendingTv, setTrendingTv] = useState([]);
  
        const [infoPopupImageSrc, setInfoPopupImageSrc] = useState('');
        const [infoPopupTitle, setInfoPopupTitle] = useState('');
        const [infoPopupLanguage, setInfoPopupLanguage] = useState('');
        const [infoPopupDescription, setInfoPopupDescription] = useState('');
        const [infoPopupPopularity, setInfoPopupPopularity] = useState('');
        const [infoPopupReleaseDate, setInfoPopupReleaseDate] = useState('');
        const [infoPopupBackdrop, setInfoPopupBackdrop] = useState('');
    
        const infoPopup = useRef(null);
        const infoPopupLanguageRef = useRef(null);
        const infoPopupReleaseDateRef = useRef(null);
    
        useEffect(() =>{
            getTrendingTvFromApi('https://api.themoviedb.org/3/trending/tv/week?api_key=a7d26cbde2c4cc637772c32299352a9f');
        }, []);
        
        function getTrendingTvFromApi(url, requestType) {
        fetch(url)
        .then((response) => response.json())
        .then((json) => {
            console.log(json);
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

        if(this.props.what == "trendingTv") {
            return (
                <FlatList onScroll={this.handleScroll}
                    data={trendingTv}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}>
                </FlatList>
            );
        }
    }
}