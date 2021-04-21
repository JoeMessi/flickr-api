
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

    // clear page from all imagage then --> 
    
    // form.querySelector('#search').value = ""
    document.querySelector('.image-gallery').innerHTML = '';
    fetchImages(fetchParameters)
    window.addEventListener('scroll', scrollHandler);
}




// adding more images on scroll
// window.addEventListener('scroll', scrollHandler);

function scrollHandler() {
    if( Math.ceil(window.pageYOffset + window.innerHeight) >= getDocHeight() ) {
        fetchParameters.page ++;
        fetchImages(fetchParameters)
    }  
}

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
    //  console.log(imgData)
     // I could fetch another image here to replace the ones without descriptions but I could get another image without description anyway, see the API if there's a way to fetch by description or something
     
     let checkIfDesc = hasText(imgData.description._content, "No description available!");
     let desc = truncateText(checkIfDesc, 24);
    //  let checkIfTags = hasText(imgData.tags, "No tags available!");
    //  let tags = 
     
     return `
        <div class="card">
            <div class="img-div-box"><div class="img-div" style="background-image: url(https://live.staticflickr.com/${imgData.server}/${imgData.id}_${imgData.secret}.jpg)"></div></div>
            <div class="text">
                <p class="titles"><a href="https://www.flickr.com/photos/${imgData.owner}/${imgData.id}">${imgData.title}</a> by <a href="https://www.flickr.com/photos/${imgData.owner}">${imgData.ownername}</a></p>
                <p class="desc">${desc}</p>
                <p class="ellipsis">${imgData.tags.split(' ').join(', ')}</p>
            </div>
        </div>
      `;
 }


 function hasText(text, replace) {
    return  text.length == 0 ? replace : text;
 }

//  function hasTags(string) {
//      if(hasText(string)) {
//          return string.split(' ').join(', ');
//      }else{

//      }
//  }

 function truncateText(text, wordsNum) {
    let words = text.split(' ');
    if(words.length > wordsNum) {
        return words.slice(0, wordsNum).join(' ') + '...';
    }
    return text;
 }
//  function truncateText(text, wordsNum) {
//     let words = text.split(' ');
//     if(words.length > wordsNum) {
//         return `${words.slice(0, wordsNum).join(' ')}<span class='ellipsis'>${words.slice(wordsNum).join(' ')}</span>`;
//     }
//     return text;
//  }







 





