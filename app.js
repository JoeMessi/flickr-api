
const fetchParameters = {
    url: "https://www.flickr.com/services/rest/",
    API_KEY: "ef0ad418507f58471b0f73736cb3ff20",
    method: "flickr.photos.search",
    media: "photos",
    text: '',
    page: 1,
    per_page: 3,
    extras: 'description, tags, owner_name',
    sort: 'interestingness-desc',
    safe_search: 1,
    format: "json"
 }

const form = document.querySelector('#search-form');
const imgGallery = document.querySelector('.image-gallery');
const spinner = document.querySelector('.lds-spinner');
const messages = document.querySelector('.messages');

form.onsubmit = (e) => {
    e.preventDefault();
    let data = new FormData(form);
    let search = data.get('search');

    fetchParameters.page = 1;
    fetchParameters.text = search;

    // clear page
    document.querySelector('.image-gallery').innerHTML = "";
    form.querySelector('#search').value = "";
    // fetch images
    fetchImages(fetchParameters);
    window.addEventListener('scroll', scrollHandler);
}

// fetch more images on scroll
function scrollHandler() {
    if( Math.ceil(window.pageYOffset + window.innerHeight) >= getDocHeight() ) {
        fetchParameters.page ++;
        fetchImages(fetchParameters)
    }  
}
// helper func for cross browser compatibility  
function getDocHeight() {
    var D = document;
    return Math.max(
        D.body.scrollHeight, D.documentElement.scrollHeight,
        D.body.offsetHeight, D.documentElement.offsetHeight,
        D.body.clientHeight, D.documentElement.clientHeight
    );
}


function checkStatus(response) {
    if(!response.ok) throw new Error(response.statusText);
    return response.json();
}

function checkIfEmpty(arr) {
    return arr.length == 0 ? true : false;    
}

function fetchImages(params) {
    spinner.classList.remove('hidden');
    messages.className = 'messages';

    fetch(`${params.url}?method=${params.method}&api_key=${params.API_KEY}&text=${params.text}&safe_search=${params.safe_search}&media=${params.media}&per_page=${params.per_page}&page=${params.page}&extras=${params.extras}&sort=${params.sort}&format=${params.format}&nojsoncallback=1`)
    .then(res => checkStatus(res))
    .then(data => {
        let photosArr = data.photos.photo;
        if(checkIfEmpty(photosArr)) {
            if(imgGallery.children.length == 0) messages.classList.add('no-search') // append something and scroll off until new search?
            else messages.classList.add('no-more-search') // append something and scroll off until new search?
            window.removeEventListener('scroll', scrollHandler);
        }else{
            data.photos.photo.forEach(img => appendCard(img))
        }
        spinner.classList.add('hidden');
})
.catch(err => {
    console.log('Error fetching and parsing the data', err);
    spinner.classList.add('hidden');
    messages.classList.add('nothing-found')
});
}



 function appendCard(imgData) {
    imgGallery.innerHTML += createCard(imgData);
 }
 
 function createCard(imgData) {
     
     let desc = descHandler(imgData.description._content);
     let tags = tagsHandler(imgData.tags);
     let titles = titlesHandler(imgData.title, imgData.ownername);

    //  console.log(titles)

     let tooltipTitle = titles.shortened === 'title' ? `<span class='tooltip'>${imgData.title}</span>` : '';
     let tooltipAuthor = titles.shortened === 'author' ? `<span class='tooltip'>${imgData.ownername}</span>` : '';
     
     return `
        <div class="card">
            <div class="img-div-box"><div class="img-div" style="background-image: url(https://live.staticflickr.com/${imgData.server}/${imgData.id}_${imgData.secret}.jpg)"></div></div>
            <div class="text">
                <p class="titles"><a href="https://www.flickr.com/photos/${imgData.owner}/${imgData.id}">${titles.title}${tooltipTitle}</a> by <a href="https://www.flickr.com/photos/${imgData.owner}">${titles.author}${tooltipAuthor}</a></p>
                <p class="desc">${desc}</p>
                <p class="tags">${tags}</p>
            </div>
        </div>
      `;
 }




 function titlesHandler(title, author) {

    let hash = {
        title: title,
        author: author,
        shortened: null
    }

    let total = hash.title.length + hash.author.length;

    if(total > 34) {
        let bigger = Math.max(hash.title.length, hash.author.length);
        let smaller = Math.min(hash.title.length, hash.author.length);
        
        let propToShorten = getKeyFromLength(hash, bigger);
    
        while(total > 34) {
            let temp = removeLastWord(hash[propToShorten]) + '...';
            hash[propToShorten] = temp;
            total = temp.length +  smaller;
        }

        hash.shortened = propToShorten;
    }

    return hash;

    function getKeyFromLength(object, valueLength) {
        return Object.keys(object).find(key => object[key].length === valueLength);
    }
 }








 function descHandler(text) {
    return text.length > 0 ?  truncateText(text, 136) : "No description available!";
 }

 function tagsHandler(text) {
    return text.length > 0 ? truncateText(text.split(' ').join(', '), 42).replace(/,...\s*$/, "...") : "No tags available!";
 }

 function truncateText(text, length) {
    while(text.length > length) {
        text = removeLastWord(text) + '...';
    }
    return text;
 }

 function removeLastWord(string) {
    let arr = string.split(' ');
    arr.pop();
    return arr.join(' ');
}


//  function truncateText(text, wordsNum) {
//     let words = text.split(' ');
//     if(words.length > wordsNum) {
//         return words.slice(0, wordsNum).join(' ') + '...';
//     }
//     return text;
//  }
//  function truncateText(text, wordsNum) {
//     let words = text.split(' ');
//     if(words.length > wordsNum) {
//         return `${words.slice(0, wordsNum).join(' ')}<span class='ellipsis'>${words.slice(wordsNum).join(' ')}</span>`;
//     }
//     return text;
//  }









 





