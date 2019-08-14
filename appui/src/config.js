import Web3 from "web3";

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

// Replace '' with a real account from ganache
let account0 = "0x6249AcCA56D04a88fD3c8c8191A07AD10BCF3069";
// Replace [] with rating ABI obtained by truffle console. Only the part between [] (inclusive)
let ratingABI = [
  {
    constant: true,
    inputs: [{ name: "", type: "uint256" }],
    name: "moviesList",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "_moviesList", type: "string[]" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    constant: false,
    inputs: [{ name: "movieName", type: "string" }],
    name: "addNewMovie",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "movieName", type: "string" }],
    name: "totalVotesFor",
    outputs: [{ name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getMovieNames",
    outputs: [{ name: "", type: "string[]" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [{ name: "movieName", type: "string" }],
    name: "voteForMovie",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  }
];
// Replace ''  with rating address obtained by truffle console
let ratingAddress = "0x6249AcCA56D04a88fD3c8c8191A07AD10BCF3069";

// Initialize the rating contract with web3
// Reference: https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html
const ratingContract = new web3.eth.Contract(ratingABI, ratingAddress);

export { ratingContract, account0 };
