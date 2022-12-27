const URI = 'https://api.themoviedb.org/3/movie/550?api_key=a7d26cbde2c4cc637772c32299352a9f';

export default {
    async fetchMovies() {
        try {
                let response = await fetch(URI);
                let responseJsonData = await response.json();
                return responseJsonData;
            }
        catch(e) {
            console.log(e)
        }
    }
}