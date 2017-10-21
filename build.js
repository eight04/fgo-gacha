const fs = require("fs");
const data = fs.readFileSync("data.txt", "utf8");
const pool = {};

for (const name of data.match(/\S+/g)) {
	if (!pool[name]) {
		pool[name] = {
			type: "SERVANT",
			star: 0,
			PU: false,
			count: 0
		};
	}
	pool[name].count++;
}

fs.writeFileSync("result-raw.json", JSON.stringify(pool, null, 2), "utf8");
