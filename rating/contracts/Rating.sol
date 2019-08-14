pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract Rating {
    // List of movie names
    string[] public moviesList;

    // This mapping keeps track of each movie rating. Note that the key is bytes32 type
    mapping (bytes32 => uint8) private ratings;
    // This mapping keeps track of movie names to ensure no duplicates
    mapping (bytes32 => bool) private movies;

    constructor(string[] memory _moviesList) public {
        moviesList = _moviesList;
    }

    // Adds new movie to the moviesList. Need to check whether movie already exists before adding to the list
    function addNewMovie(string memory movieName) public {
        bytes32 movieNameInBytes32 = stringToBytes32(movieName);
        require(!movies[movieNameInBytes32], "Movie already exists!");
        moviesList.push(movieName);
        movies[movieNameInBytes32] = true;
    }

    // Returns the total ratings a movie has received so far. Hint: need to convert movieName from string to bytes32
    function totalVotesFor(string memory movieName) public view returns (uint8) {
        return ratings[stringToBytes32(movieName)];
    }

    function getMovieNames() public view returns (string[] memory) {
        return moviesList;
    }

    // Increments the vote count for the specified movie. Equivalent to upvoting. Hint: need to convert movieName from string to bytes32
    function voteForMovie(string memory movieName) public {
        ratings[stringToBytes32(movieName)] += 1;
    }
  
    // Converts string to bytes32
    function stringToBytes32(string memory source) private pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }
    
        assembly {
            result := mload(add(source, 32))
        }
    }
}