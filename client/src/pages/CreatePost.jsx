import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { preview } from "../assets";
import { getRandomPrompt } from "../utils";
import { FormField, Loader } from "../components";

import axios from 'axios';

const CreatePost = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    prompt: "",
    photo: "",
  });
  const [generatingImg, setGeneratingImg] = useState(false);
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
    if (!isContractAddressSet()) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please initiate opML request first!",
            });
        return false
    }
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

  const generateImage = async () => {
    if (form.prompt) {
      try {
        if (!checkContractAddressSet()) {
            return 
        }
        setGeneratingImg(true);
        axios.post("/api/v1/dalle/txt2img", {contractAddress: contractAddress,  prompt: form.prompt }, {timeout:300000})
        .then((response) => {
            console.log("/api/v1/dalle/txt2img")
            // const base64ImageString = Buffer.from(response.data, 'binary').toString('base64')
            const imageUrl = "data:image/png;base64,"+response.data
            setForm({ ...form, photo: imageUrl });
        })
        
        // setCorrect
        axios.post("/api/v1/dalle/setIsCorrect", {contractAddress: contractAddress,  isCorrect: true }, {timeout:300000})
        .then((response) => {
            console.log("/api/v1/dalle/setIsCorrect: ", response.data)
        })

        // submitterUploadResult
        axios.post("/api/v1/dalle/submitterUploadResult", {contractAddress: contractAddress,}, {timeout:300000})
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

  const generateIncorrectImage = async () => {
    if (form.prompt) {
      try {
        if (!checkContractAddressSet()) {
            return 
        }
        setGeneratingImg(true);
        const randomPrompt = getRandomPrompt(form.prompt);
        axios.post("/api/v1/dalle/txt2img", {contractAddress: contractAddress,  prompt: randomPrompt }, {timeout:300000})
        .then((response) => {
            console.log("/api/v1/dalle/txt2img")
            // const base64ImageString = Buffer.from(response.data, 'binary').toString('base64')
            const imageUrl = "data:image/png;base64,"+response.data
            setForm({ ...form, photo: imageUrl });
        })

        // setCorrect
        axios.post("/api/v1/dalle/setIsCorrect", {contractAddress: contractAddress,  isCorrect: false }, {timeout:300000})
        .then((response) => {
            console.log("/api/v1/dalle/setIsCorrect: ", response.data)
        })
        

        // submitterUploadResult
        axios.post("/api/v1/dalle/submitterUploadResult", {contractAddress: contractAddress,}, {timeout:300000})
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


  const initOPML = async () => {
    try {
        if (!checkEnterPrompt()) {
            return false
        }
        console.log("initOPML")
        const data = {
            modelName: "StableDiffusion",
            prompt: form.prompt
        }
        console.log(data)
        axios.post("/api/v1/dalle/opMLRequest", data, {timeout:300000})
        .then((response) => {
            console.log("/api/v1/dalle/opMLRequest")
            console.log(response.data)
            setContractAddress(response.data.MPChallenge)
        })
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
        console.log(data)
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
        if (!checkContractAddressSet() || !checkChallengeIdSet()) {
            return 
        }
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
                Swal.fire({
                    title: "END",
                    text: "Bisection END, Please ASSERT",
                });
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


  const challengerAssert = async () => {
    try {
        if (!checkContractAddressSet() || !checkChallengeIdSet()) {
            return 
        }
        console.log("challengerAssert")
        const data = {contractAddress: contractAddress,}
        console.log(data)
        axios.post("/api/v1/dalle/challengerAssert", data, {timeout:300000})
        .then((response) => {
            console.log(response.data)
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
                const msg = challengerWins ? "Challenger WINS! The submitted result is incorrect. Please regenerate!" : "Submitter WINS!"
                Swal.fire({
                    title: "END",
                    text: msg,
                });
                setAssertResult(msg)
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
    if (form.prompt && form.photo) {
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
        <h1 className="font-extrabold text-[#222328] text-[32px]">7007 Studio: Verifiable Generative Art </h1>
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
            placeholder="A Space Shuttle flying above Cape Town, digital art"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />
        <div>
          <button
            type="button"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            onClick={initOPML}
          >
            {"Initiate OPML Request"}
          </button>
          <p>contract address: {contractAddress}</p>
        </div>

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

        </div>

        <div className="mt-5 flex gap-5">
          <button
            type="button"
            onClick={generateImage}
            className="text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center "
          >
            {generatingImg ? "Generating..." : "Generate"}
          </button>
        </div>
        <div className="mt-5 flex gap-5">
          <button
            type="button"
            onClick={generateIncorrectImage}
            className="text-white bg-red-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center "
          >
            {generatingImg ? "Generating..." : "Incorrectly Generate"}
          </button>
        </div>

        <div>
          <button
            type="button"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            onClick={startChallenge}
          >
            {"Start Challenge"}
          </button>
          <p>challengeId: {challengeId}</p>
        </div>


        <div>
          <button
            type="button"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            onClick={challengerRespond}
          >
            {"Challenger Respond"}
          </button>
          <p>checkpoints: {challengerCheckpoints}</p>
          <p>root: {challengerRoot}</p>
        </div>

        <div>
          <button
            type="button"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            onClick={submitterRespond}
          >
            {"Submitter Respond"}
          </button>
          <p>checkpoints: {submitterCheckpoints}</p>
          <p>root: {submitterRoot}</p>
        </div>

        <div>
          <button
            type="button"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            onClick={autoRespond}
          >
            {"Automatically Respond"}
          </button>
        </div>

        <div>
          <button
            type="button"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            onClick={challengerAssert}
          >
            {"Assert"}
          </button>
          <p>Assert Result: {assertResult}</p>
        </div>

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

export default CreatePost;
