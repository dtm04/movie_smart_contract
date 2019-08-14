var Ratings = artifacts.require("./Rating.sol");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(
    Ratings,
    [
      "Avatar",
      "Inception",
      "Spider Man: Home Coming",
      "Star Wars: The last Jedi"
    ],
    { from: accounts[0], gas: 6700000 }
  );
};
