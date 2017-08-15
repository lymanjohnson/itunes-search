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
let searchButton = document.getElementById('search-button');
let resultsSection = document.getElementById('results-section');
let songLinks = {};
let pageLinks = {};


searchButton.addEventListener("click",searchClick);
resultsSection.addEventListener("click",function(event){
  // Triggers if the list item box itself is clicked
  if (event.target && event.target.nodeName == "LI"){

    //if this song is already playing, it opens the iTunes page in a new tab
    if (player.src == songLinks[event.target.id]){
      window.open(pageLinks[event.target.id]);
    }

    //otherwise it starts the song
    else {
      player.src = songLinks[event.target.id];
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
              songLinks["no"+i] = data.results[i].previewUrl;
              pageLinks["no"+i] = data.results[i].trackViewUrl;
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
