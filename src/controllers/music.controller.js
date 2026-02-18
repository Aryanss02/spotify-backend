import musicModel from "../models/music.model.js";
import albumModel from "../models/album.model.js";
import uploadFile from "../services/storage.service.js";
import jwt from "jsonwebtoken";




//api for creating music as an artist
async function createMusic(req, res) {


  const { title } = req.body;
  const file = req.file;

  const result = await uploadFile(file.buffer.toString('base64'))

  const music = await musicModel.create({
    uri: result.url,
    title,
    artist: req.user.id,
  })


  res.status(201).json({
    message: "Music created successfully",
    music: {
      id: music.id,
      uri: music.uri,
      title: music.title,
      artist: music.artist,
    }

  })
}
//api END here






//api for creating Album as an artist
async function createAlbum(req, res) {


  const { title, musicIds } = req.body;

  const album = await albumModel.create({
    title,
    artist: req.user.id,
    musics: musicIds,

  })


  res.status(201).json({
    message: "Album created successfully",
    album: {
      id: album._id,
      title: album.title,
      artist: album.artist,
      musics: album.musics,
    }
  })
}
//api END here




async function getAllMusics(req, res) {
  const musics = await musicModel
    .find()
    .limit(3)
    .populate("artist", "username email")

  res.status(200).json({
    message: "Musics Fetched Siccessfully",
    musics: musics,

  })
}





async function getAllAlbums(req, res) {

  const albums = await albumModel.find().select("title artist").populate("artist", "username email")

  res.status(200).json({
    message: "Albums Fetched Siccessfully",
    albums: albums,

  })

}





async function getAlbumsById(req, res) {

  const albumId = req.params.albumId;

  const album = await albumModel.findById(albumId).populate("artist", "username email").populate("musics")


  return res.status(200).json({
    message: "Album fetched successfullly",
    album: album,
  })
}





export default { createMusic, createAlbum, getAllMusics, getAllAlbums, getAlbumsById };