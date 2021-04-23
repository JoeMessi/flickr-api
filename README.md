Hi reviewer :)

I thought I would tell you a little bit about what I did, just a quick overview.

I know in the assignment you encourage to use a framework, but the thing is that at this moment in time I feel more confident with pure vanilla javascript so I thought I would stick with it, hope that’s ok, so the technologies used for the project are HTML, CSS, and Javascript.

I do the actual fetching with the Javascript Fetch API. 

Some images have a very long description or tags, as well as the title and author name, to keep a good visual balance, I truncate whatever string is too long until it fits nicely inside the card.

For example, the image title and author name are displayed together in 1 single line, to avoid text wrapping when that line gets too long, I get the total of the 2 strings lengths, find the longest, and shorten it until the new total fits nicely in 1 line. When that happens I add a tooltip with the full uncut string in it, which it’s shown only when you hover the truncated word, so the user can still see the full name or title.
I do not add this feature for descriptions and tags, which sometimes can be very long texts, I thought that in a real-life scenario the user would click the links and go to the Flickr site to see the full info about the image.

I show some messages when there’s a problem with the search and there’s a loading spinning icon when the fetching is happening.

It was a bit of a challenge to make the code compatible for IE, to be 100% honest with you, in my previous jobs they never really cared about IE so I wasn’t fully aware of all the many features that don’t work on IE, the Javascript Fetch() method is one of them, as other Array methods and arrow syntax. My solution to this problem was to detect when the user is using IE and add 2 polyfills, one for Promises and one for Fetch. The polyfills are added only when IE is detected to avoid loading the program with resources it wouldn’t need otherwise.

That should be it!

Thank you and looking forward to hearing from you,
Joe