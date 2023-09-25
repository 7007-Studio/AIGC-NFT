import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { preview } from "../assets";
import { getRandomPrompt,getRandomLLMPrompt } from "../utils";
import { FormField, Loader } from "../components";

import axios from 'axios';

const Llama = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    prompt: "",
    photo: "",
  });
  const [generatingText, setGeneratingText] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contractAddress, setContractAddress] = useState('');
  const [challengeId, setChallengeId] = useState('')
  const [challengerCheckpoints, setChallengerCheckpoints] = useState('')
  const [submitterCheckpoints, setSubmitterCheckpoints] = useState('')
  const [challengerRoot, setChallengeRoot] = useState('')
  const [submitterRoot, setSubmitterRoot] = useState('')
  const [challengerTurn, setChallengerTurn] = useState(true)
  const [assertResult, setAssertResult] = useState("")
  const [llmOutput, setLlmOutput] = useState("")

  const isContractAddressSet = () => {
    return contractAddress != ''
  }

  const isChallengeIdSet = () => {
    return challengeId != ''
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
        setGeneratingText(true);
        axios.post("/api/v1/dalle/llama", {contractAddress: contractAddress,  prompt: form.prompt }, {timeout:300000})
        .then((response) => {
            console.log("/api/v1/dalle/llama")
            console.log(response.data)
            setLlmOutput(response.data)
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
        setGeneratingText(false);
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
                const msg = challengerWins ? "Challenger WINS!" : "Submitter WINS"
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

  const handleSurpriseMeLLM = () => {
    const randomPrompt = getRandomLLMPrompt(form.prompt);
    console.log("getRandomLLMPrompt")
    setForm({ ...form, prompt: randomPrompt });
  };
  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">opML - Llama</h1>
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
            placeholder="How to combine blockchain and AI?"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMeLLM
            handleSurpriseMeLLM={handleSurpriseMeLLM}
          />
        </div>

        <div>
          <button
            type="button"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            onClick={initOPML}
          >
            {"Initiate OPML Request"}
          </button>
          <br></br>
          <p>contract address: {contractAddress} </p>
          <br></br>
        </div>

        <label>Output from LLAMA:</label>
        <textarea id="story" name="story" rows="12" cols="80"
            value={llmOutput} onChange={e => setLlmOutput(e.target.value)}/>
            
        <div className="mt-5 flex gap-5">
          <button
            type="button"
            onClick={generateImage}
            className="text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center "
          >
            {generatingText ? "Generating..." : "Generate"}
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

      </form>
    </section>
  );
};

export default Llama;
