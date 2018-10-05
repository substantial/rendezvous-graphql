const graphql = require("graphql");
const axios = require("axios");

const { GraphQLObjectType, GraphQLString, GraphQLSchema } = graphql;

const ArtistType = new GraphQLObjectType({
  name: "Artist",
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString }
  }
});

const AlbumType = new GraphQLObjectType({
  name: "Album",
  fields: {
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    artist: {
      type: ArtistType,
      resolve(parentValue, args) {
        console.log(parentValue, args);
        return axios
          .get(`http://localhost:3000/artists/${parentValue.artistId}`)
          .then(response => response.data);
      }
    }
  }
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    artist: {
      type: ArtistType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/artists/${args.id}`)
          .then(response => response.data);
      }
    },
    album: {
      type: AlbumType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/albums/${args.id}`)
          .then(response => response.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
