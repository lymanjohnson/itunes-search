/*
  Here is a rough idea for the steps you could take:
*/

// 1. First select and store the elements you'll be working with
// 2. Create your submit event for getting the user's search term
// 3. Create your fetch request that is called after a submission
// 4. Create a way to append the fetch results to your page
// 5. Create a way to listen for a click that will play the song in the audio play

//https://itunes.apple.com/search?key1=value1&key2=value2&key3=value3

let player = document.getElementById('music-player');
let searchBar = document.getElementById('search-form');
let resultsSection = document.getElementById('results-section');
let footerSong = document.getElementById('current-song-name');
let footerArtist= document.getElementById('current-artist-name');
let footerAlbum = document.getElementById('current-album-name');
let footerInfoBar = document.getElementById('current-track-info');
let songLinks = {};
let pageLinks = {};
let songNames = {};
let albumNames = {};
let artistNames = {};
let resizePercent = 50;

searchBar.addEventListener("keypress",function(event){
  if (event.keyCode == 13) {
    console.log(searchBar.value);
    fetchAPI(createQuery(searchBar.value));
  }
})

resultsSection.addEventListener("click",function(event){
  // Triggers if the list item box itself is clicked
  if (event.target && event.target.nodeName == "LI"){

    //if this song is already playing, it opens the iTunes page in a new tab
    if (player.src == songLinks[event.target.id]){
      window.open(pageLinks[event.target.id]);
    }

    //otherwise it starts the song
    else {
      footerAlbum.innerHTML = albumNames[event.target.id];
      footerSong.innerHTML = songNames[event.target.id];
      footerArtist.innerHTML = artistNames[event.target.id];
      player.src = songLinks[event.target.id];
      footerInfoBar.style.visibility = "";
      player.play();
    }
  }

  // Triggers if the words or image are clicked
  else if (event.target && (event.target.nodeName == "P" || event.target.nodeName == "IMG")){

    //if it's already playing, open the itunes page in a new window
    if (player.src == songLinks[event.target.parentNode.id]){
      console.log(pageLinks[event.target.parentNode.id]);
      console.log(pageLinks);
      window.open(pageLinks[event.target.parentNode.id]);
    }

    //otherwise it starts the song
    else {
      footerAlbum.innerHTML = albumNames[event.target.parentNode.id];
      footerSong.innerHTML = songNames[event.target.parentNode.id];
      footerArtist.innerHTML = artistNames[event.target.parentNode.id];
      footerInfoBar.style.visibility = "";
      player.src = songLinks[event.target.parentNode.id];
    player.play();
    }
  }
});

function searchClick() {
    console.log(searchBar.value);
  fetchAPI(createQuery(searchBar.value));
  searchBar.value="";
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

          let markup =`
                ${data.results.map((datum,index) =>
                `<li class = "entry" id="no${index}">
                  <img src="${datum.artworkUrl100}">
                  <p>${datum.trackName}</p>
                  <p>${datum.artistName}</p>
                  <p>${datum.collectionName}</p>
                </li>
                `).join(' ')}
              `;

            resultsSection.innerHTML = markup;

            //Creates a dictionary for song URL values, with DOM element IDs as keys
            for (i=0;i<data.results.length;i++){
              songLinks["no"+i]   =   data.results[i].previewUrl;
              pageLinks["no"+i]   =   data.results[i].trackViewUrl;
              songNames["no"+i]   =   data.results[i].trackName;
              albumNames["no"+i]  =   data.results[i].collectionName;
              artistNames["no"+i]  =   data.results[i].artistName;
            }

       });

     }

   );
}

// data[i]:
// artistName
// artworkUrl100 (big thumbnail)
// previewUrl (song)
// primaryGenreName
// trackName
// trackViewUrl
// collectionName (album)
