const graphql = require("graphql");
const axios = require("axios");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const ArtistType = new GraphQLObjectType({
  name: "Artist",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    albums: {
      type: new GraphQLList(AlbumType),
      resolve(parentValue, args) {
        console.log("artist", { parentValue, args });
        return axios
          .get(`http://localhost:3000/artists/${parentValue.id}/albums`)
          .then(response => response.data);
      }
    }
  })
});

const AlbumType = new GraphQLObjectType({
  name: "Album",
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    artist: {
      type: ArtistType,
      resolve(parentValue, args) {
        console.log("album", { parentValue, args });
        return axios
          .get(`http://localhost:3000/artists/${parentValue.artistId}`)
          .then(response => response.data);
      }
    }
  })
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
    },
    allArtists: {
      type: new GraphQLList(ArtistType),
      args: {},
      resolve() {
        return axios
          .get(`http://localhost:3000/artists`)
          .then(response => response.data);
      }
    },
    allAlbums: {
      type: new GraphQLList(AlbumType),
      args: {},
      resolve() {
        return axios
          .get(`http://localhost:3000/albums`)
          .then(response => response.data);
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addArtist: {
      type: ArtistType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parentValue, { name }) {
        return axios
          .post("http://localhost:3000/artists", { name })
          .then(res => res.data);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
