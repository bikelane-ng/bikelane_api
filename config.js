let mongoUriRegExp = /(mongodb):\/\/([\w]+):([\w]+)@([\w.]+):([\d]+)\/([\w]+)/,
  mongoUri = process.env.MONGODB_URI,
  split = [];

if (mongoUri) {
  split = mongoUriRegExp.exec(mongoUri);
}
let config = {
  dev: {
    server: {
      protocol: "http",
      address: "127.0.0.1",
      port: 8030
    },
    database: {
      protocol: "mongodb",
      name: "bikelane",
      host: "127.0.0.1",
      port: "27017",
      username: "",
      password: ""
    },
    auth: {
      saltRounds: 10,
      secret: "toomuchsauce"
    }
  },
  production: {
    server: {
      protocol: "https",
      address: "spinero-dev.herokuapp.com",
      port: 9000
    },
    database: {
      protocol: split[1],
      name: split[6],
      host: split[4],
      port: split[5],
      username: split[2],
      password: split[3]
    },
    auth: {
      saltRounds: 10,
      secret: "toomuchsauce"
    }
  }
};

config = new Proxy(config, {
  get(target, prop, receiver) {
    if (prop in target) return target[prop];
    else return target["dev"];
  }
});

module.exports = config;