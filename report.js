const _ = {
	SERVANT: "從者",
	CE: "禮裝"
};

const fs = require("fs");
const table = require("./table.json");
const data = fs.readFileSync("data.txt", "utf8").match(/\S+/g);
const pickup = fs.readFileSync("pickup.txt", "utf8").match(/\S+/g);

const result = {
	SERVANT: {},
	CE: {}
};

for (const name of data) {
	const i = table[name];
	if (!result[i.type][i.star]) {
		result[i.type][i.star] = {count: 0, pu: 0};
	}
	result[i.type][i.star].count++;
	if (pickup.includes(name)) {
		result[i.type][i.star].pu++;
	}
}

console.log(`總共 ${data.length} 抽\n`);
console.log("各星數從者/禮裝所佔比例︰\n")

{
	const markdownTable = require("markdown-table");
	const table = [["類型", "比例"]];
	
	for (const type of Object.keys(result)) {
		for (const star of [5, 4, 3]) {
			table.push([
				`★${star}${_[type]}`,
				`${(result[type][star].count * 100 / data.length).toFixed(2)}%`
			]);
			table.push([
				`★${star}${_[type]}(PU)`,
				`${(result[type][star].pu * 100 / data.length).toFixed(2)}%`
			]);
		}
	}
	
	function stringLength(s) {
		return ttyTextSize(s, {ambsize: 2});
	}

	console.log(markdownTable(table, {
		align: ["l", "r"],
		stringLength: require("power-assert-util-string-width")
	}));
	console.log("");
}

function filterData(test) {
	const result = {};
	for (const name of data) {
		const i = table[name];
		i.name = name;
		if (!test(i)) continue;
		
		if (!result[i.star]) {
			result[i.star] = {};
		}
		if (!result[i.star][name]) {
			result[i.star][name] = 0;
		}
		result[i.star][name]++;
	}
	return result;
}

function logNameCount(data) {
	for (const [name, count] of Object.entries(data)) {
		console.log(`* ${name} x ${count}`);
	}
	console.log("");
}


const STAR_INTERESTED = [4, 5];
const servantData = filterData(i => i.type === "SERVANT" && STAR_INTERESTED.includes(i.star));

for (const star of Object.keys(servantData)) {
	console.log(`★${star}${_.SERVANT}︰\n`);
	logNameCount(servantData[star]);
}


const ceData = filterData(i => i.type === "CE" && pickup.includes(i.name));

for (const star of Object.keys(ceData)) {
	console.log(`★${star}PU${_.CE}︰\n`);
	logNameCount(ceData[star]);
}
