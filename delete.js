



 function titlesHandler(title, author) {

    let hash = {
        title: [title, title.length],
        author: [author, author.length]
    }

    let total = hash.title[1] + hash.author[1];

    let longest = Math.max(hash.title[1], hash.author[1]);
    let otherOne = Math.min(hash.title[1], hash.author[1]);
    
    let toShorten = getKeyByValue(hash, longest);


    while(total > 36) {
        let temp = removeLastWord(hash[toShorten][0])
        hash[toShorten][0] = temp;
        total = temp.length +  otherOne;
    }


   console.log(hash[toShorten][0])

 console.log(hash[toShorten][0].length + otherOne )

    function removeLastWord(string) {
        let arr = string.split(' ');
        arr.pop();
        return arr.join(' ');
    }

    function getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key][1] === value);
    }


 }
