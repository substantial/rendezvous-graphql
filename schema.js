const graphql = require("graphql");
const data = require("./db.json");
const axios = require("axios");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const fetchData = async path => {
  const { data } = await axios.get(`http://localhost:3000/${path}`);
  return data;
};

const writeData = async (path, body) => {
  const { data } = await axios.post(`http://localhost:3000/${path}`, body);
  return data;
};

const ArtistType = new GraphQLObjectType({
  name: "Artist",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    albums: {
      type: new GraphQLList(AlbumType),
      resolve: async (parentValue, args) => {
        // console.log("Artist", { parentValue, args });
        return await fetchData(`artists/${parentValue.id}/albums`);
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
      resolve: async (parentValue, args) => {
        // console.log("Album", { parentValue, args });
        return await fetchData(`artists/${parentValue.artistId}`);
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
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (parentValue, args) => {
        // console.log("Root Artists", { parentValue, args });
        return await fetchData(`artists/${args.id}`);
      }
    },
    album: {
      type: AlbumType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (parentValue, args) => {
        // console.log("Root Albums", { parentValue, args });
        return await fetchData(`albums/${args.id}`);
      }
    },
    allArtists: {
      type: new GraphQLList(ArtistType),
      args: {},
      resolve: async (parentValue, args) => {
        return await fetchData("artists");
      }
    },
    allAlbums: {
      type: new GraphQLList(AlbumType),
      args: {},
      resolve: async (parentValue, args) => {
        return await fetchData("albums");
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
      resolve: async (parentValue, args) => {
        console.log("addArtist", { parentValue, args });
        return await writeData("artists", { name: args.name });
      }
    },
    addAlbum: {
      type: AlbumType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        artistId: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (parentValue, args) => {
        return await writeData(`artists/${args.artistId}/albums`, {
          title: args.title
        });
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
