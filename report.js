const _ = {
	SERVANT: "從者",
	CE: "禮裝"
};
const fs = require("fs");
const data = JSON.parse(fs.readFileSync("result.json", "utf8"));
const result = {
	SERVANT: {},
	CE: {}
};
let total = 0;

for (const r of Object.values(data)) {
	if (!result[r.type][r.star]) {
		result[r.type][r.star] = {count: 0, pu: 0};
	}
	result[r.type][r.star].count += r.count;
	if (r.PU) {
		result[r.type][r.star].pu += r.count;
	}
	total += r.count;
}

console.log(`總共 ${total} 抽\n`)

console.log("各星數從者/禮裝所佔比例︰\n")

const table = [["類型", "比例"]];

for (const type of Object.keys(result)) {
	for (const star of [5, 4, 3]) {
		table.push([
			`★${star}${_[type]}`,
			`${(result[type][star].count * 100 / total).toFixed(2)}%`
		]);
		table.push([
			`★${star}${_[type]}(PU)`,
			`${(result[type][star].pu * 100 / total).toFixed(2)}%`
		]);
	}
}

function stringLength(s) {
	return ttyTextSize(s, {ambsize: 2});
}

console.log(require("markdown-table")(table, {
	align: ["l", "r"],
	stringLength: require("power-assert-util-string-width")
}));

console.log("");

const STAR_INTERESTED = [4, 5];
const servants = {};

for (const [name, detail] of Object.entries(data)) {
	if (detail.type === "SERVANT" && STAR_INTERESTED.includes(detail.star)) {
		if (!servants[detail.star]) {
			servants[detail.star] = [];
		}
		servants[detail.star].push({name, count: detail.count});
	}
}

for (const star of Object.keys(servants)) {
	console.log(`★${star}${_.SERVANT}︰\n`);
	for (const sv of servants[star]) {
		console.log(`* ${sv.name} x ${sv.count}`);
	}
	console.log("");
}

const ces = {};

for (const [name, detail] of Object.entries(data)) {
	if (detail.type === "CE" && detail.PU) {
		if (!ces[detail.star]) {
			ces[detail.star] = [];
		}
		ces[detail.star].push({name, count: detail.count});
	}
}

for (const star of Object.keys(ces)) {
	console.log(`★${star}PU${_.CE}︰\n`);
	for (const ce of ces[star]) {
		console.log(`* ${ce.name} x ${ce.count}`);
	}
	console.log("");
}
