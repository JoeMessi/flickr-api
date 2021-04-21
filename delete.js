

// good one 

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

        hash.shortened = propToShorten;
    
        while(total > 34) {
            let temp = removeLastWord(hash[propToShorten]) + '...';
            hash[propToShorten] = temp;
            total = temp.length +  smaller;
        }
    }

   return hash;

    function removeLastWord(string) {
        let arr = string.split(' ');
        arr.pop();
        return arr.join(' ');
    }

    function getKeyFromLength(object, valueLength) {
        return Object.keys(object).find(key => object[key].length === valueLength);
    }
 }