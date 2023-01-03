// Karthik, Charan's submission for USDC's 2023 Software Engineering Project-Based Assessment

/** 
 * RECOMMENDATION
 * 
 * To test your code, you should open "tester.html" in a web browser.
 * You can then use the "Developer Tools" to see the JavaScript console.
 * There, you will see the results unit test execution. You are welcome
 * to run the code any way you like, but this is similar to how we will
 * run your code submission.
 * 
 * The Developer Tools in Chrome are available under the "..." menu, 
 * further hidden under the option "More Tools." In Firefox, they are 
 * under the hamburger (three horizontal lines), also hidden under "More Tools." 
 */

/**
 * Searches for matches in scanned text.
 * @param {string} searchTerm - The word or term we're searching for. 
 * @param {Array} scannedTextObj - An array of zero or more JSON objects representing the scanned text.
 * @returns {JSON} - Search results.
 * */
function findSearchTermInBooks(searchTerm, scannedTextObj) {

    // result object to be returned at the end of the function
    let result = {
        "SearchTerm": searchTerm,
        "Results": []
    };

    // exit early if there are no JSON objects in the 'scannedTextObj' array
    if (scannedTextObj.length < 1) {
        return result;
    }

    // iterate through each JSON book object in the 'scannedTextObj' array
    for (let bookObj of scannedTextObj) {
        // continue to the next iteration early if the scanned text (stored in the 'Content' key) is empty
        if (bookObj.Content.length < 1) {
            continue
        }

        // variables defined in the scope of this outer for loop that will later be accessed in the inner for loop
        // these variables are used for the edge case when a word is hyphenated and spans across two lines/pages
        let flag = false;
        let previousWord;
        let endOfPreviousWord;
        let previousPage;
        let previousLine;

        // iterate through each line of scanned text in the 'Content' array for each JSON book object (referenced in the outer loop as 'bookObj')
        for (let instance of bookObj.Content) {
            // create a list of words found on a given line
            const wordList = instance.Text.split(" ");

            // edge case consideration for when a hyphenated word is found
            // we should still indicate that the searchTerm exists even if it spans across two lines/pages
            if (flag) {
                endOfPreviousWord = wordList[0];
                const completeWord = previousWord.substring(0, previousWord.length - 1) + endOfPreviousWord;
                if (completeWord === searchTerm) {
                    result.Results.push({
                        "ISBN": bookObj.ISBN,
                        // since it was not specified in the prompt, I decided to indicate the page and line number at the start of the word
                        "Page": previousPage === instance.Page ? instance.Page : previousPage,
                        "Line": previousPage === instance.Page ? instance.Line - 1 : previousLine
                    })
                }
                flag = false;
            }

            // find the last word in the current line of text and check to see if it hyphenated
            // if it is, we'll work with it in the next iteration
            previousWord = wordList[wordList.length - 1];
            if (previousWord[previousWord.length - 1] === "-") {
                flag = true;
                previousPage = instance.Page;
                previousLine = instance.Line;
            }

            // accounting for punctuation
            // we still want to include words that may have punctuation attached at the end
            for (let word of wordList) {
                if (!isLetterOrHyphen(word[word.length - 1])) {
                    word = word.substring(0, word.length - 1);
                }

                if (word === searchTerm) {
                    result.Results.push({
                        "ISBN": bookObj.ISBN,
                        "Page": instance.Page,
                        "Line": instance.Line
                    })
                }
            }
        }
    }

    return result;
}

/**
 * Helper function to check if the passed argument is a letter.
 * @param {string} char - A single character we want to check.
 * @returns {Boolean} - True if the character is a letter (a-z, or A-Z) or a hyphen (-), False if the character is not a letter or hyphen
 * */
function isLetterOrHyphen(char) {
    // using Regular Expression to determine if the passed in argument is a letter
    return (/[a-zA-Z]/).test(char) || char === "-";
}



/** Example input object. */
const twentyLeaguesIn = [
    {
        "Title": "Twenty Thousand Leagues Under the Sea",
        "ISBN": "9780000528531",
        "Content": [
            {
                "Page": 31,
                "Line": 8,
                "Text": "now simply went on by her own momentum.  The dark-"
            },
            {
                "Page": 31,
                "Line": 9,
                "Text": "ness was then profound; and however good the Canadian\'s"
            },
            {
                "Page": 31,
                "Line": 10,
                "Text": "eyes were, I asked myself how he had managed to see, and"
            }
        ]
    }
]

/** Example output object */
const twentyLeaguesOut = {
    "SearchTerm": "the",
    "Results": [
        {
            "ISBN": "9780000528531",
            "Page": 31,
            "Line": 9
        }
    ]
}



/*
 _   _ _   _ ___ _____   _____ _____ ____ _____ ____  
| | | | \ | |_ _|_   _| |_   _| ____/ ___|_   _/ ___| 
| | | |  \| || |  | |     | | |  _| \___ \ | | \___ \ 
| |_| | |\  || |  | |     | | | |___ ___) || |  ___) |
 \___/|_| \_|___| |_|     |_| |_____|____/ |_| |____/ 
                                                      
 */

/* We have provided two unit tests. They're really just `if` statements that 
 * output to the console. We've provided two tests as examples, and 
 * they should pass with a correct implementation of `findSearchTermInBooks`. 
 * 
 * Please add your unit tests below.
 * */

/** We can check that, given a known input, we get a known output. */
const test1result = findSearchTermInBooks("the", twentyLeaguesIn);
if (JSON.stringify(twentyLeaguesOut) === JSON.stringify(test1result)) {
    console.log("PASS: Test 1");
} else {
    console.log("FAIL: Test 1");
    console.log("Expected:", twentyLeaguesOut);
    console.log("Received:", test1result);
}

/** We could choose to check that we get the right number of results. */
const test2result = findSearchTermInBooks("the", twentyLeaguesIn);
if (test2result.Results.length === 1) {
    console.log("PASS: Test 2");
} else {
    console.log("FAIL: Test 2");
    console.log("Expected:", twentyLeaguesOut.Results.length);
    console.log("Received:", test2result.Results.length);
}


// CHARAN KARTHIK'S UNIT TESTS

// Test 3 -> Check to make sure hyphenated words are still registered as present.
const darknessResult = {
    "SearchTerm": "darkness",
    "Results": [
        {
            "ISBN": "9780000528531",
            "Page": 31,
            "Line": 8
        }
    ]
}

const test3Result = findSearchTermInBooks("darkness", twentyLeaguesIn);
if (JSON.stringify(darknessResult) === JSON.stringify(test3Result)) {
    console.log("PASS: Test 3");
} else {
    console.log("FAIL: Test 3");
    console.log("Expected:", darknessResult);
    console.log("Received:", test3Result);
}


// Test 4 -> Check for more than one result. The word 'and' appears twice in the given 'twentyLeaguesIn' array.
const test4Result = findSearchTermInBooks("and", twentyLeaguesIn);
if (test4Result.Results.length === 2) {
    console.log("PASS: Test 4");
} else {
    console.log("FAIL: Test 4");
    console.log("Expected:", 2);
    console.log("Received:", test2result.Results.length);
}


// Test 5 -> A word that doesn't appear...
const noWordResult = {
    "SearchTerm": "javascript",
    "Results": []
}

const test5Result = findSearchTermInBooks("javascript", twentyLeaguesIn);
if (JSON.stringify(noWordResult) === JSON.stringify(test5Result)) {
    console.log("PASS: Test 5");
} else {
    console.log("FAIL: Test 5");
    console.log("Expected:", noWordResult);
    console.log("Received:", test5Result);
}


// Test 6 -> What if there's punctuation?!
const punctuationResult = {
    "SearchTerm": 'profound',
    "Results": [
        {
            "ISBN": "9780000528531",
            "Page": 31,
            "Line": 9
        }
    ]
}

const test6Result = findSearchTermInBooks('profound', twentyLeaguesIn);
if (JSON.stringify(punctuationResult) === JSON.stringify(test6Result)) {
    console.log("PASS: Test 6");
} else {
    console.log("FAIL: Test 6");
    console.log("Expected:", punctuationResult);
    console.log("Received:", test6Result);
}


// Test 7 -> cAsE sEnSiTiVe
const caseSensitiveResult = {
    "SearchTerm": "Myself",
    "Results": []
}

const test7Result = findSearchTermInBooks('Myself', twentyLeaguesIn);
if (JSON.stringify(caseSensitiveResult) === JSON.stringify(test7Result)) {
    console.log("PASS: Test 7");
} else {
    console.log("FAIL: Test 7");
    console.log("Expected:", caseSensitiveResult);
    console.log("Received:", test7Result);
}

// Test 8 -> Make sure that '-' is not considered in removing punctuation
const test8Expected = {
    "SearchTerm": "dark",
    "Results": []
}

const test8Result = findSearchTermInBooks('dark', twentyLeaguesIn);
if (JSON.stringify(test8Expected) === JSON.stringify(test8Result)) {
    console.log("PASS: Test 8");
} else {
    console.log("FAIL: Test 8");
    console.log("Expected:", test8Expected);
    console.log("Received:", test8Result);
}