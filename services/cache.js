const mongoose = require("mongoose");
const redis = require("redis");
const promisify = require("util").promisify;
const keys = require("../config/keys");

const client = redis.createClient(keys.redisUrl);
client.hget = promisify(client.hget);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options = {}) {
	this.useCache = true;
	// DO NOT USE EMPTY STRING AS KEY
	this.hashKey = JSON.stringify(options.key || "");

	return this;
};

mongoose.Query.prototype.exec = async function() {

	if (!this.useCache) {
		console.log("NO CACHE");
		return exec.apply(this, arguments);
	}

	const key = JSON.stringify({
		...this.getQuery(),
		collection: this.mongooseCollection.name
	});

	console.log("key", key);

	const cachedValue = await client
		.hget(this.hashKey, key)
		.catch(err => console.log(err));

	if (cachedValue) {
		const doc = JSON.parse(cachedValue);

		console.log("RETURN FROM CACHE");

		return Array.isArray(doc)
			? doc.map(d => new this.model(d))
			: new this.model(doc);

	} else {
		console.log("RETURN FROM MONGODB");

		const result = await exec
			.apply(this, arguments)
			.catch(err => console.log(err));

		client.hset(this.hashKey, key, JSON.stringify(result));

		client.expire(this.hashKey, 15);

		return result;
	}
};

module.exports = {
	clearHash(hashKey) {
		client.del(JSON.stringify(hashKey));
	}
};
