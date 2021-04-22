

// old one 

function titlesHandler(title, author) {

    let hash = {
        title: [title, title.length],
        author: [author, author.length],
        shortened: null
    }

    let total = hash.title[1] + hash.author[1];

    if(total > 34) {
        let longest = Math.max(hash.title[1], hash.author[1]);
        let otherOne = Math.min(hash.title[1], hash.author[1]);
        
        let toShorten = getKeyByValue(hash, longest);

        hash.shortened = toShorten;
    
        while(total > 34) {
            let temp = removeLastWord(hash[toShorten][0]) + '...';
            hash[toShorten][0] = temp;
            total = temp.length +  otherOne;
        }

    }

   return hash;

    function removeLastWord(string) {
        let arr = string.split(' ');
        arr.pop();
        return arr.join(' ');
    }

    function getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key][1] === value);
    }

 }