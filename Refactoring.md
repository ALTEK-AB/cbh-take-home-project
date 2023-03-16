# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here


Commenting on current code: 
    
    // Too many if/else blocks,
    // Too many repeated function calls
    // We can move to Typescript in the near future

    const crypto = require("crypto");
    
    exports.deterministicPartitionKey = (event) => { // event can be null or its inner properties empty/undefined
        const TRIVIAL_PARTITION_KEY = "0";  // constants can be outside of this function - to make reusable throughout the app if needed
        const MAX_PARTITION_KEY_LENGTH = 256; // constants can be outside of this function - to make reusable throughout the app if needed
        let candidate;
    
        // Too many if blocks - can return a guard clause to return earlier
        // The below lines can be simplified to one line
        if (event) {
            if (event.partitionKey) {
                candidate = event.partitionKey;
            } else {
                const data = JSON.stringify(event); // JSON.stringify is repeated twice in this file + can throw error
                candidate = crypto.createHash("sha3-512").update(data).digest("hex"); // crypto.createHash is repeated twice in this file
            }
        }

        // We can lose track here.  Need to reduce the number of if/else blocks to make code more readable
        // event goes to candidate and candidate goes to TRIVIAL_PARTITION_KEY...just return earlier
        // The below lines can be simplified to one line
        if (candidate) {
            if (typeof candidate !== "string") {
                candidate = JSON.stringify(candidate); // JSON.stringify is repeated twice in this file + can throw error
            }
        } else {
            candidate = TRIVIAL_PARTITION_KEY;
        }

        // The below lines can be simplified to one line
        if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
            candidate = crypto.createHash("sha3-512").update(candidate).digest("hex"); // crypto.createHash is repeated twice in this file
        }
        return candidate;
    };

### Approach
* Eliminate repeated function calls
* Catch errors and handle them
* Modularity - smaller functions make them swappable and testable.  This is a personal preference, but I like to keep functions under 10 lines; whenever possible.
* Each function should have a unique purpose
* Reduce/Eliminate if/else blocks
* Make code more readable and concise
* Test both negative and positive scenarios
* Sort imports/exports alphabetically.  This is a personal preference, but it makes it easier to find things when the list is long.

I am nearing my 2 hours, but I believe, in the big lines, this is what should be done.
