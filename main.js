/*
  Here is a rough idea for the steps you could take:
*/

// 1. First select and store the elements you'll be working with
// 2. Create your `submit` event for getting the user's search term
// 3. Create your `fetch` request that is called after a submission
// 4. Create a way to append the fetch results to your page
// 5. Create a way to listen for a click that will play the song in the audio play

//https://itunes.apple.com/search?key1=value1&key2=value2&key3=value3

player = document.getElementById('music-player');
searchBar = document.getElementById('search-form');
searchButton = document.getElementById('search-button');
results = document.getElementById('results');
results.addEventListener("click",clicker);
searchButton.addEventListener("click",searchClick);


function searchClick() {
    console.log(searchBar.value);
  fetchAPI(createQuery(searchBar.value));
  searchBar.value="";
}

function clicker() {
  console.log("click!");
}

function createQuery(searchTerms){
  let query = "https://itunes.apple.com/search?media=music&term=";
  searchTerms = searchTerms.replace(/\s+/g,"+");
  query += searchTerms;
  return query;
}

function fetchAPI(url) {
   fetch(url)
   .then (
     function(response) {
       if (response.status !== 200) {
         console.log("Error "+ response.status);
       }
       response.json().then(function(data){

         console.log(data);


       });

     }

   );

 }



// data[i]:
// artistName
//artworkUrl100 (big thumbnail)
//previewUrl (song)
//primaryGenreName
//trackName
//trackViewUrl
//collectionName (album)
