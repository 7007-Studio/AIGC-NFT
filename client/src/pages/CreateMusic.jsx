import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { FormField, Loader } from "../components";
import { getRandomPrompt } from "../utils";

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { preview } from "../assets";
import { create } from 'ipfs-http-client';
import { Buffer } from 'buffer';

import { ethers } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";

const abi = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_modelIndex",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_modelName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_modelSymbol",
				"type": "string"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ERC721IncorrectOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ERC721InsufficientApproval",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC721InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "ERC721InvalidOperator",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ERC721InvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC721InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC721InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ERC721NonexistentToken",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_fromTokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_toTokenId",
				"type": "uint256"
			}
		],
		"name": "BatchMetadataUpdate",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "MetadataUpdate",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "_tokenId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getModelIndex",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_tokenURI",
				"type": "string"
			}
		],
		"name": "mint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "modelIndex",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]


const projectId = '2V1B4bBqSCyncDB2jeHd7uy5oLN'
const projectSecret = '2b18de3a067e0a35d8700ef362c816dc'
const auth =
    'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
})

import axios from 'axios';

const CreateMusic = () => {

  const ffmpegRef = useRef(new FFmpeg());
    const videoRef = useRef(null);

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    prompt: "",
    audio: "",
    photo: ""
  });
  const [generatingImg, setGeneratingImg] = useState(false);
  const [generatingMusic, setGeneratingMusic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contractAddress, setContractAddress] = useState('');
  const [challengeId, setChallengeId] = useState('')
  const [challengeIdSet, setChallengeIdSet] = useState(false)
  const [challengerCheckpoints, setChallengerCheckpoints] = useState('')
  const [submitterCheckpoints, setSubmitterCheckpoints] = useState('')
  const [challengerRoot, setChallengeRoot] = useState('')
  const [submitterRoot, setSubmitterRoot] = useState('')
  const [challengerTurn, setChallengerTurn] = useState(true)
  const [assertResult, setAssertResult] = useState("")

  const isContractAddressSet = () => {
    return contractAddress != ''
  }

  const isChallengeIdSet = () => {
    return challengeId != '' || challengeIdSet
  }

  const isEnterPrompt = () => {
    if (form.prompt) {
        return true
    }
    return false
  }

  const checkEnterPrompt = () =>{
    if (!isEnterPrompt()) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please enter the prompt first!",
            });
        return false
    }
    return true
  }

  const checkContractAddressSet = () => {
    // if (!isContractAddressSet()) {
    //   //  initOPML()
    //     return false
    // }
    return true
  }

  const checkChallengeIdSet = () => {
    if (!isChallengeIdSet()) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please start the challenge first!",
            });
        return false
    }
    return true
  }

  const generateImage = async (contractAddr) => {
    if (form.prompt) {
      try {
        // if (!checkContractAddressSet()) {
        //     return 
        // }
        setGeneratingImg(true);
        console.log("generateImage")
        let response = await axios.post("/api/v1/dalle/txt2img", {contractAddress: contractAddr,  prompt: form.prompt }, {timeout:300000})
       
            console.log("/api/v1/dalle/txt2img")
            // const base64ImageString = Buffer.from(response.data, 'binary').toString('base64')
          const imageUrl = "data:image/png;base64," + response.data
          // console.log(imageUrl)
            setForm({ ...form, photo: imageUrl });
        return imageUrl
        
        // setCorrect
        axios.post("/api/v1/dalle/setIsCorrect", {contractAddress: contractAddr,  isCorrect: true }, {timeout:300000})
        .then((response) => {
            console.log("/api/v1/dalle/setIsCorrect: ", response.data)
        })

        // submitterUploadResult
        axios.post("/api/v1/dalle/submitterUploadResult", {contractAddress: contractAddr}, {timeout:300000})
        .then((response) => {
            console.log("submitterUploadResult")
            console.log(response.data)
            // setContractAddress(response.data.MPChallenge)
        })
        
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong! \n\n ERROR :" + error,
        });
      } finally {
        setGeneratingImg(false);
        if (checkContractAddressSet()){
            Swal.fire({
                title: "Waiting...",
                text: "please wait for 15s, if busy, please try again",
            });
        }
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "please enter the prompt",
      });
    }
  };

  const generateIncorrectImage = async (contractAddr) => {
    if (form.prompt) {
      try {
        // if (!checkContractAddressSet()) {
        //     return 
        // }
        setGeneratingImg(true);
        const randomPrompt = getRandomPrompt(form.prompt);
        axios.post("/api/v1/dalle/txt2img", {contractAddress: contractAddr,  prompt: randomPrompt }, {timeout:300000})
        .then((response) => {
            console.log("/api/v1/dalle/txt2img")
            // const base64ImageString = Buffer.from(response.data, 'binary').toString('base64')
          const imageUrl = "data:image/png;base64," + response.data
          console.log(imageUrl)
            setForm({ ...form, photo: imageUrl });
        })

        // setCorrect
        axios.post("/api/v1/dalle/setIsCorrect", {contractAddress: contractAddr,  isCorrect: false }, {timeout:300000})
        .then((response) => {
            console.log("/api/v1/dalle/setIsCorrect: ", response.data)
        })
        

        // submitterUploadResult
        axios.post("/api/v1/dalle/submitterUploadResult", {contractAddress: contractAddr,}, {timeout:300000})
        .then((response) => {
            console.log("submitterUploadResult")
            console.log(response.data)
            // setContractAddress(response.data.MPChallenge)
        })
        
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong! \n\n ERROR :" + error,
        });
      } finally {
        setGeneratingImg(false);
        if (checkContractAddressSet()){
            Swal.fire({
                title: "Waiting...",
                text: "please wait for 15s, if busy, please try again",
            });
        }
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "please enter the prompt",
      });
    }
  };

  const generateMusic = async (contractAddr, img) => {
    if (form.prompt) {
      try {
        // if (!checkContractAddressSet()) {
        //     return 
        // }
        setGeneratingMusic(true);
        console.log("generateMusic")
        axios.post("/api/v1/dalle/txt2music", {contractAddress: contractAddr,  prompt: form.prompt }, {timeout:300000})
        .then((response) => {
            console.log("/api/v1/dalle/txt2music")
            // const base64ImageString = Buffer.from(response.data, 'binary').toString('base64')
          // const imageUrl = "data:image/png;base64," + response.data
          const audioUrl = "data:audio/mpeg;base64," + response.data
          console.log(form.photo)
            setForm({ ...form, photo: img, audio: audioUrl });
        })
        
        // setCorrect
        axios.post("/api/v1/dalle/setIsCorrect", {contractAddress: contractAddr,  isCorrect: true }, {timeout:300000})
        .then((response) => {
            console.log("/api/v1/dalle/setIsCorrect: ", response.data)
        })

        // submitterUploadResult
        axios.post("/api/v1/dalle/submitterUploadResult", {contractAddress: contractAddr,}, {timeout:300000})
        .then((response) => {
            console.log("submitterUploadResult")
            console.log(response.data)
            // setContractAddress(response.data.MPChallenge)
        })
        
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong! \n\n ERROR :" + error,
        });
      } finally {
        setGeneratingMusic(false);
        // if (checkContractAddressSet()){
        //     Swal.fire({
        //         title: "Waiting...",
        //         text: "please wait for 15s, if busy, please try again",
        //     });
        // }
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "please enter the prompt",
      });
    }
  };

  const generateIncorrectMusic = async (contractAddr, img) => {
    if (form.prompt) {
      try {
        // if (!checkContractAddressSet()) {
        //     return 
        // }
        setGeneratingMusic(true);
        const randomPrompt = getRandomPrompt(form.prompt);
        axios.post("/api/v1/dalle/txt2music", {contractAddress: contractAddr,  prompt: randomPrompt }, {timeout:300000})
        .then((response) => {
            console.log("/api/v1/dalle/txt2music")
          const audioUrl = "data:audio/mpeg;base64," + response.data
            setForm({ ...form, photo: img, audio: audioUrl });
        })

        // setCorrect
        axios.post("/api/v1/dalle/setIsCorrect", {contractAddress: contractAddr,  isCorrect: false }, {timeout:300000})
        .then((response) => {
            console.log("/api/v1/dalle/setIsCorrect: ", response.data)
        })
        

        // submitterUploadResult
        axios.post("/api/v1/dalle/submitterUploadResult", {contractAddress: contractAddr,}, {timeout:300000})
        .then((response) => {
            console.log("submitterUploadResult")
            console.log(response.data)
            // setContractAddress(response.data.MPChallenge)
        })
        
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong! \n\n ERROR :" + error,
        });
      } finally {
        setGeneratingMusic(false);
        // if (checkContractAddressSet()){
        //     Swal.fire({
        //         title: "Waiting...",
        //         text: "please wait for 15s, if busy, please try again",
        //     });
        // }
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "please enter the prompt",
      });
    }
  };


  const initOPML = async (type) => {
    try {
        if (!checkEnterPrompt()) {
            return false
        }
      console.log("initOPML")
      let response, data
      if (type == "music") {
         data = {
          modelName: "MusicGen",
          prompt: form.prompt
        }
        console.log(data)
         response = await axios.post("/api/v1/dalle/opMLRequest", data, { timeout: 300000 })
      }
      else {
        data = {
          modelName: "StableDiffusion",
          prompt: form.prompt
        }
        console.log(data)

        response = await axios.post("/api/v1/dalle/opMLRequest", data, { timeout: 300000 })
      }
      console.log("response", response)
      setContractAddress(response.data.MPChallenge)
      return response.data.MPChallenge
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong! \n\n ERROR :" + error,
        });
    }
  }

  const startChallenge = async () => {
    try {
        if (!checkContractAddressSet()) {
            return 
        }
        console.log("startChallenge")
        const data = { contractAddress: contractAddress, }
        console.log("contractAddress", contractAddress)
        axios.post("/api/v1/dalle/startChallenge", data, {timeout:300000})
        .then((response) => {
            console.log("/api/v1/dalle/startChallenge")
            console.log(response.data)
            setChallengeId(response.data.challengeId)
            setChallengeIdSet(true)
        })
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong! \n\n ERROR :" + error,
        });
    }
  }

  const challengerRespond = async () => {
    try {
        if (!checkContractAddressSet() || !checkChallengeIdSet()) {
            return 
        }
        console.log("challengerRespond")
        const data = {contractAddress: contractAddress,}
        console.log(data)
        axios.post("/api/v1/dalle/challengerRespond", data, {timeout:300000})
        .then((response) => {
            console.log(response.data)
            console.log("/api/v1/dalle/challengerRespond")
            if (response.data.state == "WAIT") {
                Swal.fire({
                    title: "WAIT",
                    text: "Please wait for other's response",
                });
            } else if (response.data.state == "END") {
                Swal.fire({
                    title: "END",
                    text: "Bisection END, Please ASSERT",
                });
            } else {
                setChallengerCheckpoints(JSON.stringify(response.data.config.checkpoints))
                setChallengeRoot(response.data.root)
            }
            
        })
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong! \n\n ERROR :" + error,
        });
    }
  }

  const submitterRespond = async () => {
    try {
        if (!checkContractAddressSet() || !checkChallengeIdSet()) {
            return 
        }
        console.log("submitterRespond")
        const data = {contractAddress: contractAddress,}
        axios.post("/api/v1/dalle/submitterRespond", data, {timeout:300000})
        .then((response) => {
            console.log(response.data)
            console.log("/api/v1/dalle/submitterRespond")
            if (response.data.state == "WAIT") {
                Swal.fire({
                    title: "WAIT",
                    text: "Please wait for other's response",
                });
            } else if (response.data.state == "END") {
                Swal.fire({
                    title: "END",
                    text: "Bisection END, Please ASSERT",
                });
            } else {
                setSubmitterCheckpoints(JSON.stringify(response.data.config.checkpoints))
                setSubmitterRoot(response.data.root)
            }
            
        })
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong! \n\n ERROR :" + error,
        });
    }
  }

  const autoRespond = async () => {
    try {
        // if (!checkContractAddressSet() || !checkChallengeIdSet()) {
        //     return 
        // }
        console.log("autoRespond")
        const data = {contractAddress: contractAddress,}
        let end = false;
        for (let i = 0; i < 50; i++) {

            // challenger
            await axios.post("/api/v1/dalle/challengerRespond", data, {timeout:300000})
            .then((response) => {
                console.log("/challengerRespond")
                console.log(response.data)
                if (response.data.state == "WAIT") {
                } else if (response.data.state == "END") {
                    end = true
                } else {
                    setChallengerCheckpoints(JSON.stringify(response.data.config.checkpoints))
                    setChallengeRoot(response.data.root)
                }
            })

            // submitter
            await axios.post("/api/v1/dalle/submitterRespond", data, {timeout:300000})
            .then((response) => {
                console.log("/submitterRespond")
                console.log(response.data)
                if (response.data.state == "WAIT") {
                } else if (response.data.state == "END") {
                    end = true
                } else {
                    setSubmitterCheckpoints(JSON.stringify(response.data.config.checkpoints))
                    setSubmitterRoot(response.data.root)
                }
            })

            if (end) {
                // Swal.fire({
                //     title: "END",
                //     text: "Bisection END, Please ASSERT",
              // });
              challengerAssert()
                break
            }
        }

    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong! \n\n ERROR :" + error,
        });
    }
  }

  // Helper function to convert data URI to blob
function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}
  

// Function to run FFmpeg and generate video
  const generateVideo = async (imgUrl, audioUrl) => {
   
  
   try {
    //  console.log("generateVideo", imgUrl, audioUrl)
    //  console.log(await fetchFile(imgUrl))

    //  const ffmpeg = ffmpegRef.current;

    //  await ffmpeg.load()


    //  console.log(await fetchFile(audioUrl))
    
    //  let ret = await ffmpeg.writeFile('input.png', await fetchFile(imgUrl));
    //  console.log(ret)
    //  await ffmpeg.writeFile('input.mpeg', await fetchFile(audioUrl));
  
   
    //  await ffmpeg.exec(['-i', 'input.png', '-i', 'input.mpeg', '-shortest', 'output.mp4']);

    //  const data = await ffmpeg.readFile('output.mp4');
    //  console.log("data", data)
    //  const videoURL = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));

    //  console.log(videoURL)
   } catch (err) {
     console.log(err)
   }
    
    // if (videoRef.current) {
    //   videoRef.current.src = videoURL;
    // }
  };

  const mintNft = async () => {
    console.log("mintNft")
    // mint an nft with the photo and audio
    // make an mp4 with the photo and audio
    // generateVideo(form.photo, form.audio)
    let response = await fetch(form.photo);
    let blob = await response.blob();
    let file = new File([blob], "file.png", { type: "image/png" });
    let result = await client.add(file);
    const ipfsLinkImg = "https://gateway.pinata.cloud/ipfs/" + result.path
    // console.log("ipfs hash: ", result.path)

    response = await fetch(form.audio);
    blob = await response.blob();
    file = new File([blob], "file.mp3", { type: "audio/mp3" });
    result = await client.add(file);
    const ipfsLinkAudio = "https://gateway.pinata.cloud/ipfs/" + result.path

    // upload the mp4 to ipfs
    const metadata = {
      name: "7007 AIGC NFT",
      description: "This NFT is generated and verified with OPML on https://demo.7007.studio/. The model used is Stable Diffusion and MusicGen. The original prompt is: " + form.prompt,
      image: ipfsLinkImg,
      external_url: "https://demo.7007.studio/",
      attributes: [
        {
          trait_type: "prompt",
          value: form.prompt,
        },
        {
          trait_type: "music",
          value: ipfsLinkAudio,
        },
        {
          trait_type: "model",
          value: "Stable Diffusion, MusicGen",
        }
      ],
    }

    let buffer = Buffer.from(JSON.stringify(metadata));
    result = await client.add(buffer);
    const ipfsLinkMetadata = "https://gateway.pinata.cloud/ipfs/" + result.path
    console.log("ipfs metadata: ", ipfsLinkMetadata)

    // mint the nft
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    // const provider = new JsonRpcProvider("https://goerli.infura.io/v3/a84b538abf714818b3662cd1fcd7c530");
    const contract = new ethers.Contract("0x4754a4059128fF45ae408bc7AB8Efe52b69cc5a4", abi, signer);
    console.log("contract: ", contract)
    let tx = await contract.mint(ipfsLinkMetadata)
    await tx.wait()
    console.log("tx: ", tx)
  }


  const challengerAssert = async () => {
    try {
        // if (!checkContractAddressSet() || !checkChallengeIdSet()) {
        //     return 
        // }
        console.log("challengerAssert")
        const data = {contractAddress: contractAddress,}
        // console.log(data)
        axios.post("/api/v1/dalle/challengerAssert", data, {timeout:300000})
        .then((response) => {
            // console.log(response.data)
            console.log("/api/v1/dalle/challengerAssert")
            if (response.data.state == "NO DONE") {
                Swal.fire({
                    title: "WAIT",
                    text: "Bisection is NOT DONE!",
                });
            } else  { // if (response.data.state == "ok")
                const result_events = JSON.stringify(response.data.events)
                let challengerWins = false
                if (result_events.includes("ChallengerWins")){
                    challengerWins= true
                }
                const msg = challengerWins ? "Verification Failed! The ML Result is corrupted." : "Verification Success! The ML Result is verified."
                Swal.fire({
                    title: "Verification Result",
                    text: msg,
                });
                setAssertResult(msg)

              if (!challengerWins) {
                // mint the photo and img as nft 
                mintNft();
              }
            } 
        })
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong! \n\n ERROR :" + error,
        });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.prompt && form.audio) {
      setLoading(true);
      try {
        const response = await fetch(`${serverURL}` + "/api/v1/post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
        await response.json();
        navigate("/");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong! \n\n ERROR :" + error,
        });
      } finally {
        setLoading(false);
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please generate an image with proper details",
      });
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };
  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">7007 Studio: Verifiable Generative Art</h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w-[500px]">
         Optimistic Machine Learning on Blockchain
        </p>
      </div>

      <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            LabelName="Prompt"
            type="text"
            name="prompt"
            placeholder="A joyful and emotional piece of art work"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />
          <div>
            <div className="flex gap-5">
              <button
                type="button"
                onClick={async () => {
                  let contractAddr = await initOPML("img")
                  // console.log("contractAddr: ", contractAddr)
                  let img = await generateImage(contractAddr)
                  contractAddr = await initOPML("music")
                  await generateMusic(contractAddr, img)
                }}
            
            className="text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center "
          >
            {generatingMusic ? "Generating..." : "Generate"}
          </button>
        </div>
            <div className="mt-5 flex gap-5">
              <button
                type="button"
                onClick={async () => {
                  let contractAddr = await initOPML("img")
                  let img = await generateIncorrectImage(contractAddr)
                  contractAddr = await initOPML("music")
                  await generateIncorrectMusic(contractAddr, img)
                }}
            className="text-white bg-red-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center "
          >
            {generatingMusic ? "Generating..." : "Incorrectly Generate"}
          </button>
        </div>
          {/* <button
            type="button"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            onClick={initOPML}
          >
            {"Initiate OPML Request"}
          </button> */}
          
        </div>

          {/* audio tag */}
          
          <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
            {form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-9/12 h-9/12 object-contain opacity-40"
              />
            )}

            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>

          <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-10 flex justify-center items-center">
            {form.audio ? 
              (<audio controls
                src={form.audio}
                alt={form.prompt} 
                type="audio/ogg"
                className="w-full h-full object-contain">
              </audio>): <p>Loading...</p>
            }

            {generatingMusic && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>

        
        <div>
          <button
            type="button"
            className="mt-5 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            onClick={async () => {
              await startChallenge()
              autoRespond()
              
              
            }
            }
          >
            {"Start Verification"}
          </button>
        </div>
        <div className="mt-5 flex gap-5">Smart contract address: {contractAddress}</div>
        {/* <div>
          <button
            type="button"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            onClick={startChallenge}
          >
            {"Start Challenge"}
          </button> */}
          {/* <p>challengeId: {challengeId}</p> */}
        {/* </div> */}


        <div>
          {/* <button
            type="button"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            onClick={challengerRespond}
          >
            {"Challenger Respond"}
          </button> */}
          <h3 className="font-extrabold text-[#222328] text-[20px]">Challenger Respond</h3>
          <p>checkpoints: {challengerCheckpoints}</p>
          <p>root: {challengerRoot}</p>
        </div>

        <div>
          {/* <button
            type="button"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            onClick={submitterRespond}
          >
            {"Submitter Respond"}
          </button> */}
          <h3 className="font-extrabold text-[#222328] text-[20px]">Submitter Respond</h3>
          <p>checkpoints: {submitterCheckpoints}</p>
          <p>root: {submitterRoot}</p>
        </div>

        

        {/* <div>
          <button
            type="button"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            onClick={challengerAssert}
          >
            {"Assert"}
          </button>
          <p>Assert Result: {assertResult}</p>
        </div> */}

        {/* <div className="mt-10">
          <p className="mt-2 text-[#666e75] text-[14px]">
            Once you have created the image you want, you can upload it as an NFT
          </p>
          <button
            type="button"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {loading ? "Sharing..." : "Upload as NFT"}
          </button>
        </div> */}
      </form>
    </section>
  );
};

export default CreateMusic;
