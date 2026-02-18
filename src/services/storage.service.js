import { ImageKit } from "@imagekit/nodejs";


const imagekit = new ImageKit({


  privateKey: "private_Y00my4EfTy4iJxd85y6nFOecpZ8=",



})



async function uploadFile(file) {

  const result = await imagekit.files.upload({
    file,
    fileName: "image_" + Date.now(),
    folder: "Spotify/music"
  });

  return result;

}

export default uploadFile;