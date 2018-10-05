const graphql = require("graphql");
const data = require("./db.json");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const AlbumType = new GraphQLObjectType({
  name: "Album",
  fields: {
    id: { type: GraphQLString },
    title: { type: GraphQLString }
  }
});

const ArtistType = new GraphQLObjectType({
  name: "Artist",
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString }
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
        console.log("Root Artists", { parentValue, args });
        return data.artists.find(a => a.id === args.id);
      }
    },
    album: {
      type: AlbumType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        console.log("Root Albums", { parentValue, args });
        return data.albums.find(a => a.id === args.id);
      }
    },
    allArtists: {
      type: new GraphQLList(ArtistType),
      args: {},
      resolve(parentValue, args) {
        return data.artists;
      }
    },
    allAlbums: {
      type: new GraphQLList(AlbumType),
      args: {},
      resolve(parentValue, args) {
        return data.albums;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
