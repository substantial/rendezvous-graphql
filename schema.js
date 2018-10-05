const graphql = require("graphql");

const { GraphQLStringType, GraphQLObjectType } = graphql;

const AlbumType = new GraphQLObjectType({
  name: "Album",
  fields: {
    id: { type: GraphQLStringType },
    title: { type: GraphQLStringType }
  }
});

const ArtistType = new GraphQLObjectType({
  name: "Artist",
  fields: {
    id: { type: GraphQLStringType },
    name: { type: GraphQLStringType }
  }
});
