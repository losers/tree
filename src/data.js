var data = {};
data.isProd = true;

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

data.relations.telugu = {
    "3": {
        "same": { "1": "ముత్తాత", "0": "ముత్తవ్వ" },
        "other": { "1": "ముత్తాత", "0": "ముత్తవ్వ" },
        "inv": { "1": "ముత్తాత", "0": "ముత్తవ్వ" },
    },
    "-3": {
        "same": { "1": "ముని మనవడు", "0": "ముని మనవరాలు" },
        "other": { "1": "ముని మనవడు", "0": "ముని మనవరాలు" },
        "inv": { "1": "ముని మనవడు", "0": "ముని మనవరాలు" }
    },
    "2": {
        "same": { "1": "జేజి నాయన", "0": "జేజమ్మ" },
        "other": { "1": "జేజి నాయన", "0": "జేజమ్మ" },
        "inv": { "1": "ముత్త మామయ్య", "0": "ముత్త అత్తమ్మ" },
    },
    "-2": {
        "same": {"1" : "మనవడు", "0": "మనవరాలు"},
        "other": {"1" : "మనవడు", "0": "మనవరాలు"},
        "inv": {"1" : "ముని అల్లుడు", "0": "ముని కోడలు"}
    },
    "0": {
        "same": {"1" : "సొంతం అన్నయ/తమ్ముడు", "0": "సొంతం అక్క/చెల్లి"},
        "other": {"1" : "అన్నయ/తమ్ముడు", "0": "అక్క/చెల్లి"},
        "inv": {"1" : "బావ/బావమరిది", "0": "వదిన/మరదలు"},
        "spl": {"1" : "మొగుడు", "0": "పెళ్ళాం"}
    },
    "1": {
        "same": {"1" : "నాన్న", "0": "అమ్మ"},
        "other": {"1" : "పెద్దనాన్న/చిన్నాన్న", "0": "పెద్దమ్మ/పిన్నమ్మ"},
        "inv": {"1" : "మామయ్య", "0": "అత్తమ్మ"},
    },
    "-1": {
        "same": {"1" : "కొడుకు", "0": "కూతురు"},
        "other": {"1" : "కొడుకు", "0": "కూతురు"},
        "inv": {"1" : "అల్లుడు", "0": "కోడలు"},
    }
};

export default data;