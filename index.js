const { GraphQLServer, PubSub } = require('graphql-yoga');

let defaultName = "MEW";

const pubsub = new PubSub();

const typeDefs = `
	type Query {
		hello(name: String): String!
		sayhi: String!
		welcome(name: String): String!
	}

	type Mutation {
		changeDefaultName(name: String!): String!
	}

	type Subscription {
		updateName: String!
	}
`;

const resolvers = {
	Query: {
		hello: (root, { name }, ctx, info) => {
			if (!name)
				name = defaultName;
			return `Hello World API from ${name}!`;
		},
		sayhi: () => "Hi! This is from graphQL",
		welcome: (root,{name},ctx,info)=>{
			if(!name)
				name = defaultName;
			return `Welcome~ ${name}~ Have A GOOD DAY!`;
		}
	},
	Mutation: {
		changeDefaultName: (root, { name }, ctx, info) => {
			defaultName = name;
			pubsub.publish('update_name', {
				updateName: `Notify Update Default Name to ${name}`
			})
			return `Ok change the default and welcome name to ${defaultName}`;
		}
	},
	Subscription: {
		updateName: {
			subscribe(root, args, ctx, info) {
				return pubsub.asyncIterator('update_name');
			}
		}
	}
};

const server = new GraphQLServer({
	typeDefs,
	resolvers
});

const options = {
	port: 4000,
	endpoint: '/graphql'
};

server.start(options, (args) => { 
	const { port } = args;
  console.log(`Server start on port: ${port}`)
});