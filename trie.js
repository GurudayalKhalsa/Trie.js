/* Trie.js
 * A simple Trie implementation written in JS, with robust built in functions for managing strings
 * Licensed under the MIT licence
 * Created by Gurudayal Khalsa
*/
function Trie(wordlist)
{
    //the trie
    var trie = {};
    var endString = "|";

    //returns the part of the trie object at the last character of the string.
    //if no string, returns the whole trie
    this.getObject = function(string)
    {
        if(!string) return trie;
        var charsDone = "";
        var currentObj = trie;

        for(var i in string)
        {
            var char = string[i];
            if(currentObj[char]) currentObj=currentObj[char];
            else return false;
        }

        if(currentObj !== trie)
        {
            return currentObj;
        }

        return false;
    }

    //returns all matching strings (that are or start with string) in array form from string specified. If no string, returns all strings in trie
    //string param can also be array, will return object of arrays
    this.get = function(string)
    {
        //handle if string is array/object
        if(typeof string === "object") 
        {
            var strings = {};
            for(var i in string) strings[string[i]]=this.get(string[i]);
            return strings;
        }

        if(typeof string !== "string" && string !== undefined) return [];

        var currentObj = this.getObject(string);

        if(typeof string === "string" && !currentObj) return [];

        currentObj = currentObj||trie;
        var strings = [];


        function findAllRecursive(currentObj)
        {
            if(currentObj[endString] && !strings[currentObj[endString]]) strings.push(currentObj[endString]);
            if(hasChildrenObjects(currentObj)) for(var i in childrenObjects(currentObj)) findAllRecursive(currentObj[i]);
            else return;
        }

        findAllRecursive(currentObj);        

        return strings;
    }    

    //insert a string into the trie (param can be array/object of strings instead)
    this.insert = function(string)
    {
        //handle if string is array/object
        if(typeof string === "object") 
        {
            for(var i in string) this.insert(string[i]);
            return true;
        }

        if(typeof string !== "string") return false;

        var charsDone = "";
        var currentObj = trie;

        for(var i in string)
        {
            var char = string[i];

            //if current object does not have an entry at current character, and string is not finished
            //add an empty object to the current object, with char of the current character
            if(!currentObj[char] && charsDone !== string) currentObj[char] = {};
            
            //update the list of characters done adding for this string
            charsDone+=char;

            //if string is done, add block to object to specify that string is done
            //the current object must be the last character of this string
            if(charsDone === string) 
            {
                currentObj[char][endString]=string;
            }
            //update current object
            currentObj=currentObj[char];
        }

        return true;
    }

    //remove a string from the trie (param can be array/object of strings instead)
    //if all is true, then the objects of strings entered that are not valid words in the trie will be removed (e.g. removing "a" will remove all words that start with "a")
    this.remove = function(string, all)
    {
        //handle if string is array/object
        if(typeof string === "object") 
        {
            for(var i in string) this.remove(string[i]);
            return true;
        }

        if(typeof string !== "string") return false;

        var all = all||false;

        var currentObj = this.getObject(string);
        //return false if string not in trie, string must be a valid word, and all is false
        if((typeof string === "string" && this.getObject(string)===false) || (!this.has(string) && all===false && currentObj[endString]!==string)) return false;
        //if there are children underneath the string, only delete the string (or delete all  children if specified)
        if(currentObj[endString] && currentObj[endString]===string) delete currentObj[endString];
        var currentParent = parent(currentObj, string, trie);
        //if string in trie, but is not a word inside, delete
        if(!this.has(string) && all===true && currentParent[string])
        {
            delete currentParent[string];
            return true;
        }
        else if(all===false) return false;
        if(hasChildrenObjects(currentObj)) 
        {
            //remove all matches if specified
            if(all===true)for(var i in currentObj) delete currentObj[i];
            //if this object is the only child of its parent, return
            if(childrenLength(currentParent)===1 && currentParent[string[string.length-1]])return true;
        }

        //otherwise, loop backwards and delete all objects that are characters of this string that do not have additional children
        for(var i = string.length-1; i>=0; i--)
        {
            var char = string[i];
            var currentParent = parent(currentObj, string, trie);            
            if(childrenLength(currentParent)>=1 && currentParent[char]) 
            {
                delete currentParent[char];
                if(childrenLength(currentParent)>=1)return true;
            }
            currentObj = currentParent;
        }

        return true;
    }

    //will return a boolean based on whether the string is in the trie or not
    //can handle objects, will return an object of whether or not each string is in trie
    this.has = function(string)
    {
        //handle if string is array/object
        if(typeof string === "object") 
        {
            var strings = {};
            for(var i in string) strings[string[i]]=this.has(string[i]);
            return strings;
        }

        if(typeof string !== "string") return false;

        var arr = this.getObject(string);
        //return false if string not in trie
        if(typeof string === "string" && !arr) return false;
        if(arr[endString] && arr[endString]===string) return true;
        return false;
    }

    //INITIALIZE
    //if data is object, convert whole of data into this Trie
    this.insert(wordlist);

    //Helper functions

    //determina if the object has direct children that are objects
    function hasChildrenObjects(obj)
    {
        if(obj.length===0) return false;
        for(var i in obj) if(typeof obj[i] === "object") return true;
        return false;    
    }

    //get all the children that are objects
    function childrenObjects(obj)
    {
        var objects = {};
        for(var i in obj)
        {
            if(obj[i]!==endString) objects[i]=obj[i];
        }
        return objects;
    }  

    //find the amount of direct children
    function childrenLength(obj)
    {
        var count = 0;
        for(var i in obj)
        {
            count++;
        }
        return count;
    }

    //find the parent of the object, given the string the object is on and root object
    function parent(obj, string, root)
    {
        var charsDone = "";
        var currentObj = root;
        var pastObjects = [];

        for(var i in string)
        {
            var char = string[i];
            if(currentObj[char]) 
            {
                pastObjects.push(currentObj);
                currentObj=currentObj[char];
            }
            else return false;

            if(currentObj===obj) return pastObjects.pop();
        }
    } 
    //copy the javascript object(does not copy functions inside)
    function copy(obj)
    {
        return JSON.parse(JSON.stringify(obj));
    }
}

