const { assert } = require('chai'); // Using Truffle's assertion library
const Web3 = require('web3'); // Web3.js for interacting with Ethereum

// This is your contract abstraction
const VotingContract = artifacts.require("VotingContract");

contract('VotingContract', (accounts) => {
    let voting; // Contract instance
    let owner = accounts[0]; // Owner of the contract
    let addr1 = accounts[1]; // Another account for testing

    beforeEach(async () => {
        // Deploy a new instance of the contract before each test
        voting = await VotingContract.new(10); // Assume constructor takes max candidates as an argument
    });

    it('should deploy the contract and set the owner', async () => {
        const contractOwner = await voting.owner(); // Assuming `owner` is a state variable in your contract
        assert.equal(contractOwner, owner, "Owner address should be correct");
    });

    // it('should allow adding a candidate', async () => {
    //     await voting.addCandidate("Alice", { from: owner }); // Assume `addCandidate` function is available

    //     const candidate = await voting.candidates(0); // Fetch the first candidate
    //     assert.equal(candidate.name, "Alice", "Candidate name should be 'Alice'");
    // });
    // it('should allow adding a candidate', async () => {
    //     console.log("first");
    //     const result = await voting.addCandidate("Alice", { from: owner });
    //     const candidate = await voting.candidates(0); // Assuming the first candidate added is at index 0
    //     assert.equal(candidate.name, "Alice", "Candidate name should match");
    //     console.log("here");
    //     console.log(candidate+" "+candidate.name);
    // });
    it('should allow adding a candidate', async () => {
        console.log("first");
        const result = await voting.addCandidate("Alice", { from: owner });
        
        // Retrieve the candidate name using the getter function
        const candidateName = await voting.getCandidate(0); // Assuming "Alice" is the first candidate added
        assert.equal(candidateName, "Alice", "Candidate name should match");
        console.log("here");
        console.log(candidateName);
    });
    

    it('should allow voting for a candidate', async () => {
        await voting.addCandidate("Alice", { from: owner }); // Add a candidate
        await voting.vote(0, { from: addr1 }); // Vote for Alice (candidate index 0)

        // Fetch the votes for Alice
        const aliceVotes = await voting.getVotes("Alice");
        assert.equal(aliceVotes.toString(), "1", "Alice should have 1 vote");
    });

    it('should not allow voting for a non-existent candidate', async () => {
        try {
            await voting.vote(999, { from: addr1 }); // Vote for a non-existent candidate
            assert.fail("The vote should not have been accepted");
        } catch (error) {
            assert(error.message.includes("revert"), "Expected revert error");
        }
    });
});
