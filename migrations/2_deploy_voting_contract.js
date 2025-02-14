// const VotingContract = artifacts.require("VotingContract");

// module.exports = function (deployer) {
//     const ownerAddress = "0x96Fc9A04a16d0d37a18836e742b79CaD8992b602"; // Replace with a valid Ethereum address
//     deployer.deploy(VotingContract, ownerAddress);
// };

// module.exports = function (deployer) {
//   const durationMinutes = 10; // Set the voting duration (in minutes)
//   deployer.deploy(VotingContract, durationMinutes);
// };
const VotingContract = artifacts.require("VotingContract");

module.exports = function (deployer) {
    const ownerAddress = "0x69f0759138af051B19743Cd5cd9772e4a15ca87A"; // Replace with a valid Ethereum address
    deployer.deploy(VotingContract, ownerAddress);
};