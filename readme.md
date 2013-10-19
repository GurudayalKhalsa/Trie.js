
Trie.js - A Trie Implementation in Javascript 
_______________________________________________


- useful/fast for getting all strings starting with the query
- all strings of the same character length take the same amount of time to retrieve (which is not long at all)
- practical use: Livesearch/autocomplete library for thousands of strings, quick finding


**Usage**:

    var trie = new Trie(["apple", "orange", "banana", "pear", "pineapple", "grape", "blueberry", "blackberry", "mango", "peach", "plum", "grapefruit"]);
    trie.get() -> returns the above array, sorted alphabetically
    trie.get("p") -> gets all strings starting with p, returns ["peach", "pear", "pineapple", "plum"], returns [] if not found
    trie.has("peach") -> returns true if successful, false if not
    trie.insert("melon") -> returns true if successful, false if not
    trie.remove("apple") -> returns true if successful, false if not
    trie.remove("p", true) -> deletes all strings starting with p, true allows you to delete starting with any string, even if not a string in list. returns true if successful, false if not

All of the above work with arrays as parameters also, e.g. 
    
    trie.get(["a", "p", "m"]) -> returns {"a":["apple"], "p":["peach", "pear", "pineapple", "plum"], "m":["mango", "melon"]}

