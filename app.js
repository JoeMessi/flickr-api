// Detect if user is on IE browser
var isIE = !!window.MSInputMethodContext && !!document.documentMode;

if (isIE) {
    // Create Promise polyfill script tag
    var promiseScript = document.createElement("script");
    promiseScript.type = "text/javascript";
    promiseScript.src = 'https://cdn.jsdelivr.net/npm/promise-polyfill@8.1.3/dist/polyfill.min.js';

    // Create Fetch polyfill script tag
    var fetchScript = document.createElement("script");
    fetchScript.type = "text/javascript";
    fetchScript.src = "https://cdn.jsdelivr.net/npm/whatwg-fetch@3.4.0/dist/fetch.umd.min.js";

    // Add polyfills to head element
    document.head.appendChild(promiseScript);
    document.head.appendChild(fetchScript);

    // Give a moment to the polyfills to load and run the function. 
    setTimeout(function () {
        runTheProgram();
    }, 1000);

} else {
    // else run the same thing without the polyfills
    runTheProgram();
}


function runTheProgram() {

    // obj that will be passed to the fetch function
    var fetchParameters = {
        url: "https://www.flickr.com/services/rest/",
        API_KEY: "ef0ad418507f58471b0f73736cb3ff20",
        method: "flickr.photos.search",
        media: "photos",
        text: '',
        page: 1,
        per_page: 10,
        extras: 'description,tags,owner_name',
        sort: 'interestingness-desc',
        safe_search: 1,
        format: "json"
    }

    // selecting a few elements
    var form = document.querySelector('#search-form');
    var searchInput = form.querySelector('#search');
    var imgGallery = document.querySelector('.image-gallery');
    var spinner = document.querySelector('.lds-spinner');
    var messages = document.querySelector('.messages');
    var tooltipSearch = document.querySelector('.tooltip-search');


    // when search is submitted
    form.onsubmit = function(e) {
        e.preventDefault();
        e.returnValue = false; // (for IE)

        // get the searched string by the user
        var search = searchInput.value;

        // update/reset parameters of fetch obj
        fetchParameters.page = 1;
        fetchParameters.text = search;

        // clear page
        imgGallery.innerHTML = "";
        searchInput.value = "";

        // handles tooltip under search form
        tooltipSearched(search, tooltipSearch);

        // call fetch func with parameters obj
        fetchImages(fetchParameters);
        // will handle new fetch on scroll
        window.addEventListener('scroll', scrollHandler);
    }

    // shows the searched term by the user under the form 
    function tooltipSearched(search, tooltip) {
        tooltip.textContent = search;
        tooltip.style.visibility = 'visible';
        (search.length > 67) ? tooltip.style.fontSize = '0.7rem' : tooltip.style.fontSize = '';
    }

    // fetch more images on scroll
    function scrollHandler() {
        if( Math.ceil(window.pageYOffset + window.innerHeight) >= getDocHeight() ) {
            fetchParameters.page ++;
            fetchImages(fetchParameters);
        }  
    }

    // helper func for cross browser compatibility, gets document height 
    function getDocHeight() {
        var D = document;
        return Math.max(
            D.body.scrollHeight, D.documentElement.scrollHeight,
            D.body.offsetHeight, D.documentElement.offsetHeight,
            D.body.clientHeight, D.documentElement.clientHeight
        );
    }

    // checks the status of the fetch response
    function checkStatus(response) {
        if(!response.ok) throw new Error(response.statusText);
        return response.json();
    }

    // returns true if passed array is empty
    function checkIfEmpty(arr) {
        return arr.length == 0 ? true : false;    
    }

    // handles the fetch from the API
    function fetchImages(params) {
        // shows loading spinner on page
        spinner.classList.remove('hidden');
        // reset the div.messages class
        messages.className = 'messages';

        fetch(params.url+'?method='+params.method+'&api_key='+params.API_KEY+'&text='+params.text+'&safe_search='+params.safe_search+'&media='+params.media+'&per_page='+params.per_page+'&page='+params.page+'&extras='+params.extras+'&sort='+params.sort+'&format='+params.format+'&nojsoncallback=1')
        .then(function(res) {return checkStatus(res)})
        .then(function(data) {
            var photosArr = data.photos.photo;
            if(checkIfEmpty(photosArr)) {
                // very first search and no matched results
                if(imgGallery.children.length == 0) messages.classList.add('no-search');
                // else means searched happened already, but there aren't any more matches
                else messages.classList.add('no-more-search');
                // no need for calling fetch on scroll anymore at this point
                window.removeEventListener('scroll', scrollHandler);
            }else{
                // all good, ready to inject on page
                data.photos.photo.forEach(function(imgData) {
                        appendCard(imgData);
                })
            }
            // we hide loading spinner after fetch completed
            spinner.classList.add('hidden');
        })
        .catch(function(err) {
            console.log('Error fetching and parsing the data', err);
            spinner.classList.add('hidden');
            messages.classList.add('nothing-found');
        });
    }

    // injects the newly created card
    function appendCard(imgData) {
        imgGallery.innerHTML += createCard(imgData);
    }

    // creates the image card
    function createCard(imgData) {  
        // some work on 'description', 'tags' and 'image title' + 'author name' before creating the card 
        var desc = descHandler(imgData.description._content);
        var tags = tagsHandler(imgData.tags);
        var titles = titlesHandler(imgData.title, imgData.ownername);

        // potential tooltips for either the image title or the author name for when they're too long
        var tooltipTitle = titles.shortened === 'title' ? "<span class='tooltip'>"+imgData.title+"</span>" : '';
        var tooltipAuthor = titles.shortened === 'author' ? "<span class='tooltip'>"+imgData.ownername+"</span>" : '';
        
        return '<div class="card">\
                    <div class="img-div-box">\
                        <div class="img-div" style="background-image: url(https://live.staticflickr.com/'+imgData.server+'/'+imgData.id+'_'+imgData.secret+'.jpg)"></div>\
                    </div>\
                    <div class="text">\
                        <p class="titles"><a href="https://www.flickr.com/photos/'+imgData.owner+'/'+imgData.id+'">'+titles.title+tooltipTitle+'</a> by <a href="https://www.flickr.com/photos/'+imgData.owner+'">'+titles.author+tooltipAuthor+'</a></p>\
                        <p class="desc">'+desc+'</p>\
                        <p class="tags">'+tags+'</p>\
                    </div>\
                </div>';
    }

    // handles the length of (image title + author name) for when one of them is too long
    // it gets the total length of the 2 strings, finds the longest and it shortens it 
    // with the shortenString() func, It returns an object.
    function titlesHandler(title, author) {

        var hash = {
            title: title,
            author: author,
            shortened: false
        }

        var total = hash.title.length + hash.author.length;

        if(total > 28) {
            var bigger = Math.max(hash.title.length, hash.author.length);            
            var propToShorten = getKeyFromLength(hash, bigger);
            var maxChars = bigger - (total - 28);

            hash[propToShorten] = shortenString(maxChars, hash[propToShorten]);
            hash.shortened = propToShorten;
        }

        return hash;

        function getKeyFromLength(object, valueLength) {
            return Object.keys(object).filter(function(key) {return object[key].length === valueLength})[0];
        }
    }

    // handles image's description, if empty, placeholder text is returned
    // otherwise it is shortened if too long or returned as it is 
    function descHandler(text) {
        if(text.length == 0) {
           return "No description available!";
        }
        else if(text.length < 136) {
           return text;
        }
        else{
            return shortenString(136, text);
        }
    }

    // handles image's tags string, if empty, placeholder text is returned
    // otherwise it is shortened if too long or returned
    function tagsHandler(text) {
        var withCommas = text.split(' ').join(', ');

        if(text.length == 0) {
            return "No tags available!";
         }
         else if(withCommas.length < 37) {
            return withCommas;
         }
         else{
             return shortenString(37, withCommas).replace(/,...\s*$/, "...");
         }
    }

    // it shortens and returns a string given a max number of characters
    function shortenString(maxChars, string) {
        var newString = [];
        var arr = string.split(' ');

        for(var i = 0; i < arr.length; i++) {
           if(newString.join(' ').length + (arr[i].length + 4) <= maxChars) {
               newString.push(arr[i]);
           }
        }
        return newString.join(' ') + '...';
    }

}