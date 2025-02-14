// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

contract VotingContract {
    address public owner;
    uint256 public startTime;
    uint256 public endTime;
    uint256 public totalVotes;

    mapping(address => bool) public hasVoted;
    mapping(address => bool) public isRegisteredVoter;
    mapping(address => string) private otpStorage;
    mapping(string => uint256) public candidates;  // Mapping for storing votes by candidate name
    string[] public candidateList;

    mapping(string => address) private emailToAddress; // Maps email to Ethereum address
    mapping(address => string) private addressToEmail; // Maps Ethereum address to email

    enum State { NotStarted, Voting, Closed }
    State public state;

    event CandidateAdded(string candidate);
    event VoterRegistered(address voter);
    event OTPGenerated(address voter, string otp);
    event Voted(address indexed voter, string candidate);
    event VotingStarted(uint256 startTime, uint256 endTime);
    event VotingEnded(uint256 endTime);
    event WinnerDeclared(string winner, uint256 votes);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    modifier onlyDuringVoting() {
        require(state == State.Voting, "Voting is not currently active");
        _;
    }

    modifier onlyOnce() {
        require(!hasVoted[msg.sender], "You have already voted");
        _;
    }

    constructor(uint256 _durationMinutes) public {
        owner = msg.sender;
        state = State.NotStarted;
        startTime = 0;
        endTime = 0;
        totalVotes = 0;
        emit VotingStarted(startTime, endTime);
    }

    // Admin functions
    function addCandidate(string memory candidate) public onlyOwner {
    require(state == State.NotStarted, "Cannot add candidates after voting has started");
    require(candidates[candidate] == 0, "Candidate already exists");
    candidates[candidate] = 0;
    candidateList.push(candidate);
    emit CandidateAdded(candidate);
}


    function startVoting(uint256 _durationMinutes) public onlyOwner {
        require(state == State.NotStarted, "Voting has already started");
        state = State.Voting;
        startTime = block.timestamp;
        endTime = startTime + (_durationMinutes * 1 minutes);
        emit VotingStarted(startTime, endTime);
    }

    function endVoting() public onlyOwner {
        require(state == State.Voting, "Voting is not currently active or has already ended");

        state = State.Closed; // Change state to closed
        emit VotingEnded(block.timestamp); // Emit the event
    }

    function declareWinner() public view onlyOwner returns (string memory winner, uint256 votes) {
        require(state == State.Closed, "Voting is still ongoing");

        string memory topCandidate;
        uint256 topVotes = 0;

        for (uint256 i = 0; i < candidateList.length; i++) {
            string memory candidate = candidateList[i];
            if (candidates[candidate] > topVotes) {
                topVotes = candidates[candidate];
                topCandidate = candidate;
            }
        }

        return (topCandidate, topVotes);
    }


    // Voter functions
    function generateOTP(address voter, string memory otp) public onlyOwner {
        otpStorage[voter] = otp;
        emit OTPGenerated(voter, otp);
    }

    function validateOTP(address voter, string memory otp) public view returns (bool) {
        return keccak256(abi.encodePacked(otpStorage[voter])) == keccak256(abi.encodePacked(otp));
    }

    function registerVoter(address voter, string memory email) public {
        require(!isRegisteredVoter[voter], "Voter is already registered."); 
        require(emailToAddress[email] == address(0), "Email is already linked to another account."); 
        
        isRegisteredVoter[voter] = true;
        emailToAddress[email] = voter; // Link email to the Ethereum address
        addressToEmail[voter] = email; // Link Ethereum address to the email

        emit VoterRegistered(voter);
    }


    function vote(uint256 candidateIndex) public onlyDuringVoting onlyOnce {
        require(isRegisteredVoter[msg.sender], "You are not a registered voter");
        require(candidateIndex < candidateList.length, "Candidate index out of bounds");

        hasVoted[msg.sender] = true;
        totalVotes++;

        string memory candidate = candidateList[candidateIndex];
        candidates[candidate]++;
        emit Voted(msg.sender, candidate);
    }

    // Helper functions
    function getAllCandidates() public view returns (string[] memory) {
        return candidateList;
    }

    function getVotes(string memory candidate) public view returns (uint256) {
        return candidates[candidate];
    }

    function getVotingStatus() public view returns (string memory status, uint256 remainingTime) {
        if (state == State.NotStarted) {
            return ("Not started", 0);
        } else if (state == State.Voting) {
            if (block.timestamp <= endTime) {
                return ("Ongoing", endTime - block.timestamp);
            } else {
                return ("Voting period ended", 0);
            }
        } else {
            return ("Voting Ended", 0);
        }
    }

    function toggleVotingStatus() public onlyOwner {
        if (state == State.NotStarted || state == State.Closed) {
            state = State.Voting;
            startTime = block.timestamp;
            endTime = startTime + (60 minutes); // Example duration
            emit VotingStarted(startTime, endTime);
        } else {
            state = State.Closed;
            emit VotingEnded(block.timestamp);
        }
    }

    function getCandidateCount() public view returns (uint256) {
        return candidateList.length;
    }

    function checkVoterRegistration(address voter) public view returns (bool) {
        return isRegisteredVoter[voter];
    }
}