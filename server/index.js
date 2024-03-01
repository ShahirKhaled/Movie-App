const express = require("express");
const app = express();
const fs = require("fs");
const { networkInterfaces } = require("os");
const folderPath = "C:/Users/shahi/Videos/Movies";

const movieData = [];

app.use(express.static("../react-streaming-app/build"));

getLocalMovieData();

app.get("/movies", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.send(movieData);
});

app.get("/video/:name", (req, res) => {
  const range = req.headers.range;
  if (range) {
    const videoPath = `${folderPath}/${req.params.name}`;
    const videoExtension = videoPath.slice(videoPath.lastIndexOf(".") + 1);
    const videoSize = fs.statSync(videoPath).size;
    const rangePrefix = "bytes=";
    const bytesRanges = range.substring(rangePrefix.length).split("-");
    let contentLength;
    let start;
    let end;

    if (bytesRanges[0].length) start = parseInt(bytesRanges[0]);
    if (bytesRanges[1].length) end = parseInt(bytesRanges[1]);

    if (start !== undefined && end !== undefined)
      contentLength = end + 1 - start;
    else if (start !== undefined) contentLength = videoSize - start;
    else if (end !== undefined) {
      contentLength = end + 1;
      console.log("Only Range-End request HAPPENED! 😕😶");
    }

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end || videoSize - 1}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": `video/${videoExtension}`,
    });

    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
  } else
    res.status(400).send("This Movie Streaming Service REQUIRES range headers");
});

app.get("*", (req, res) => {
  res.redirect("/");
});

app.listen(5500, () =>
  console.log(
    `http://${
      networkInterfaces()["Wi-Fi"]
        ? networkInterfaces()["Wi-Fi"][1].address
        : "localhost"
    }:5500`
  )
);

async function getLocalMovieData() {
  const data = fs.readdirSync(folderPath, { withFileTypes: true });
  const fileNames = [];
  const movieName = [];
  const movieYear = [];
  data.forEach((fileOrFolder) => {
    if (fileOrFolder.isFile()) {
      const partOne = fileOrFolder.name.replace(/\.[a-z]+.+/g, "").split(" ");
      movieYear.push(partOne.splice(partOne.length - 1, 1).toString());
      movieName.push(partOne.join(" "));
      fileNames.push(fileOrFolder.name);
    }
  });

  for (let i = 0; i < fileNames.length; i++) {
    try {
      const API_KEY = "51f3a29d6dc9a872900b367f0ca7e94a";
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${movieName[i]}&year=${movieYear[i]}`;
      const response = await (await fetch(url)).json();
      const movieDetails = await (
        await fetch(
          `https://api.themoviedb.org/3/movie/${response.results[0].id}?api_key=${API_KEY}`
        )
      ).json();
      response.results[0].media_type = "movie";
      response.results[0].genres = movieDetails.genres;
      response.results[0].runtime = movieDetails.runtime;
      movieData.push(response.results[0]);
    } catch (error) {
      console.log(error);
    }
  }
}
