var data = {};
data.isProd = false;

data.getHostURL = function () {
    if (this.isProd) {
        return "https://blineapi.herokuapp.com";
    }
    else {
        return "http://localhost:5000";
    }
}

data.relations = {};
data.relations.western = {
    "3": {
        "same": { "1": "Great Grand Father", "0": "Great Grand Mother" },
        "other": { "1": "Great Grand Uncle", "0": "Great Grand Aunty" },
        "inv": { "1": "Great Grand Father-in-law", "0": "Great Grand Mother-in-law" },
    },
    "-3": {
        "same": { "1": "Great Grand Son", "0": "Great Grand Daughter" },
        "other": { "1": "Great Grand Nephew", "0": "Great Grand Niece" },
        "inv": { "1": "Great Grand Son-in-law", "0": "Great Grand Daughter-in-law" }
    },
    "2": {
        "same": { "1": "Grand Father", "0": "Grand Mother" },
        "other": { "1": "Grand Uncle", "0": "Grand Aunty" },
        "inv": { "1": "Grand Father-in-law", "0": "Grand Mother-in-law" },
    },
    "-2": {
        "same": { "1": "Grand Son", "0": "Grand Daughter" },
        "other": { "1": "Grand Son", "0": "Grand Daughter" },
        "inv": { "1": "Grand Son-in-law", "0": "Grand Daughter-in-law" }
    },
    "0": {
        "same": { "1": "Brother", "0": "Sister" },
        "other": { "1": "Brother [Cousin]", "0": "Sister [Cousin]" },
        "inv": { "1": "Brother-in-Law", "0": "Sister-in-Law" },
        "spl": { "1": "Husband", "0": "Wife" }
    },
    "1": {
        "same": { "1": "Father", "0": "Mother" },
        "other": { "1": "Uncle", "0": "Aunty" },
        "inv": { "1": "Father-in-law", "0": "Mother-in-law" },
    },
    "-1": {
        "same": { "1": "Son", "0": "Daughter" },
        "other": { "1": "Nephew", "0": "Niece" },
        "inv": { "1": "Son-in-law", "0": "Daughter-in-law" },
    }
};

export default data;