import express from "express";
import * as dotenv from "dotenv";

import axios from "axios"

dotenv.config();

const router = express.Router();

const sd_host = "http://localhost:5000"
const opml_host = "http://localhost:3333"

router.route("/").get((req, res) => {
  res.send("DALL E server");
});

router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log("prompt: ", prompt)
    axios.get("http://localhost:5000/")
    .then((response)=>{
        console.log("response: ", response.data)
        res.status(200).send(response.data);
    })
  } catch (error) {
    console.log("ERROR :", error);
    res.status(500).send(error?.response.data.error.message);
  }
});

router.route("/txt2img").post(async (req, res) => {
    try {
      console.log("txt2img")
      const { prompt } = req.body;
      console.log("prompt: ", prompt)
      axios.post("http://localhost:5000/txt2img", {
        prompt: prompt
      }, {responseType: 'arraybuffer'}).then((response) => {
        const base64ImageString = Buffer.from(response.data, 'binary').toString('base64')
        // const imageDataURL = `data:image/png;base64,${btoa(
        //     String.fromCharCode(...new Uint8Array(response.data))
        // //   )}`
        // console.log("imageUrl: ", imageUrl)
        res.status(200).send(base64ImageString);
      })
    } catch (error) {
      console.log("ERROR :", error);
      res.status(500).send(error?.response.data.error.message);
    }
  });

router.route("/opmlRequest").post(async (req, res) => {
    try {
        console.log("/opmlRequest")
        axios.post((opml_host + "/opmlRequest"), req.body)
        .then((response) => {
            console.log(response.data)
            res.status(200).send(response.data)
        })
    } catch (error) {
        console.log("ERROR: ", error)
        res.status(500).send(error?.response.data.error.message);
    }
});

router.route("/submitterUploadResult").post(async (req, res) => {
    try {
        console.log("/submitterUploadResult")
        axios.post((opml_host + "/submitterUploadResult"), req.body)
        .then((response) => {
            console.log(response.data)
            res.status(200).send(response.data)
        })
    } catch (error) {
        console.log("ERROR: ", error)
        res.status(500).send(error?.response.data.error.message);
    }
});

router.route("/startChallenge").post(async (req, res) => {
    try {
        console.log("/startChallenge")
        axios.post((opml_host + "/startChallenge"), req.body)
        .then((response) => {
            console.log(response.data)
            res.status(200).send(response.data)
        })
    } catch (error) {
        console.log("ERROR: ", error)
        res.status(500).send(error?.response.data.error.message);
    }
});

router.route("/challengerRespond").post(async (req, res) => {
    try {
        console.log("/challengerRespond")
        axios.post((opml_host + "/challengerRespond"), req.body)
        .then((response) => {
            console.log(response.data)
            res.status(200).send(response.data)
        })
    } catch (error) {
        console.log("ERROR: ", error)
        res.status(500).send(error?.response.data.error.message);
    }
});

router.route("/submitterRespond").post(async (req, res) => {
    try {
        console.log("/submitterRespond")
        axios.post((opml_host + "/submitterRespond"), req.body)
        .then((response) => {
            console.log(response.data)
            res.status(200).send(response.data)
        })
    } catch (error) {
        console.log("ERROR: ", error)
        res.status(500).send(error?.response.data.error.message);
    }
});

router.route("/challengerAssert").post(async (req, res) => {
    try {
        console.log("/challengerAssert")
        axios.post((opml_host + "/challengerAssert"), req.body)
        .then((response) => {
            console.log(response.data)
            res.status(200).send(response.data)
        })
    } catch (error) {
        console.log("ERROR: ", error)
        res.status(500).send(error?.response.data.error.message);
    }
});

export default router;
