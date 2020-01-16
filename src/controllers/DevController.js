const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/ParseStringAsArray');

module.exports = {
  async index(request,response){
    const devs = await Dev.find();

    response.json(devs);
  },

  async store(request,response) {
    const { github_username, techs, latitude, longitude } = request.body;

    let dev = await Dev.findOne({ github_username });

    console.log(`Aqui ${dev.data}`);

    if(!dev){
      const responseApi = await axios.get(`https://api.github.com/users/${github_username}`);
  
      //name = login serve para caso o nome for vazio, ele substitui pelo login, vindo da api github
      const {name = login, avatar_url, bio } = responseApi.data;

      const techsArray = parseStringAsArray(techs);

      const location = {
        type: 'Point',
        coordinates: [longitude,latitude],
      }

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location,
      });
    }
  
    return response.json(dev);
  }
}