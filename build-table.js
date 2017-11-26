const fs = require("fs");
const oldTable = require("./table.json");
const newTable = {};

for (const key in oldTable) {
	newTable[key] = {
		type: oldTable[key].type,
		star: oldTable[key].star
	};
}

const data = fs.readFileSync("data.txt", "utf8");
for (const name of data.match(/\S+/g)) {
	if (newTable[name]) continue;
	newTable[name] = {
		type: "?",
		star: 0
	};
}

fs.writeFileSync("table.json", JSON.stringify(newTable, null, 2), "utf8");
