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
        "same": { "1": "Brother [Sibling]", "0": "Sister [Sibling]" },
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
        "inv": { "1": "తాత", "0": "అవ్వ" },
    },
    "-2": {
        "same": {"1" : "మనవడు", "0": "మనవరాలు"},
        "other": {"1" : "మనవడు", "0": "మనవరాలు"},
        "inv": {"1" : "మనవడు", "0": "మనవరాలు"}
    },
    "0": {
        "same": {"1" : "సొంతం అన్నయ/తమ్ముడు", "0": "సొంతం అక్క/చెల్లి"},
        "other": {"1" : "అన్నయ/తమ్ముడు", "0": "అక్క/చెల్లి"},
        "inv": {"1" : "బావ/బావమరిది", "0": "వదిన/మరదలు"},
        "spl": {"1" : "భర్త", "0": "భార్య"}
    },
    "1": {
        "same": {"1" : "నాన్న", "0": "అమ్మ"},
        "other": {"1" : "పెద్దనాన్న/చిన్నాన్న", "0": "పెద్దమ్మ/పిన్నమ్మ"},
        "inv": {"1" : "మామయ్య", "0": "అత్తమ్మ"},
    },
    "-1": {
        "same": {"1" : "కొడుకు", "0": "కూతురు"},
        "other": {"1" : "కొడుకు వరుస", "0": "కూతురు వరుస"},
        "inv": {"1" : "అల్లుడు", "0": "కోడలు"},
    }
};

data.relations.kannada = {
    "3": {
        "same": { "1": "ಮುತ್ತಜ್ಜ [Muthhatha]", "0": "ಮುತ್ತಜ್ಜಿ [Muthhajji]" },
        "other": { "1": "ಮುತ್ತಜ್ಜ [Muthhatha]", "0": "ಮುತ್ತಜ್ಜಿ [Muthhajji]" },
        "inv": { "1": "ಮುತ್ತಜ್ಜ [Muthhatha]", "0": "ಮುತ್ತಜ್ಜಿ [Muthhajji]" },
    },
    "-3": {
        "same": { "1": "ಮರಿ ಮೊಮ್ಮಗ [Mari Mommaga]", "0": "ಮರಿ ಮೊಮ್ಮಗಳು[Mari Mommagalu]" },
        "other": { "1": "ಮರಿ ಮೊಮ್ಮಗ [Mari Mommaga]", "0": "ಮರಿ ಮೊಮ್ಮಗಳು[Mari Mommagalu]" },
        "inv": { "1": "ಮರಿ ಮೊಮ್ಮಗ [Mari Mommaga]", "0": "ಮರಿ ಮೊಮ್ಮಗಳು[Mari Mommagalu]" }
    },
    "2": {
        "same": { "1": "ಅಜ್ಜ [Ajja]", "0": "ಅಜ್ಜಿ [Ajji]" },
        "other": { "1": "ಅಜ್ಜ [Ajja]", "0": "ಅಜ್ಜಿ [Ajji]" },
        "inv": { "1": "ತಾತ [Taata]", "0": "ಅಜ್ಜಿ [Ajji]" },
    },
    "-2": {
        "same": {"1" : "ಮೊಮ್ಮಗ [Mommaga]", "0": "ಮೊಮ್ಮಗಳು [Mommagalu]"},
        "other": {"1" : "ಮೊಮ್ಮಗ [Mommaga]", "0": "ಮೊಮ್ಮಗಳು [Mommagalu]"},
        "inv": {"1" : "ಮೊಮ್ಮಗ [Mommaga]", "0": "ಮೊಮ್ಮಗಳು [Mommagalu]"},
    },
    "0": {
        "same": {"1" : "ಅಣ್ಣ/ತಮ್ಮ [Anna/Tamma]", "0": "ಅಕ್ಕ/ತಂಗಿ [Akka/Tangi]"},
        "other": {"1" : "ಅಣ್ಣ/ತಮ್ಮ [Anna/Tamma]", "0": "ಅಕ್ಕ/ತಂಗಿ [Akka/Tangi]"},
        "inv": {"1" : "ಭಾವ/ಬಾಮೈದ [Bhaava/Baamaida]", "0": "ಅತ್ತಿಗೆ/ನಾದಿನಿ [Attige/Naadini]"},
        "spl": {"1" : "ಗಂಡ [Ganda]", "0": "ಹೆಂಡತಿ [Hendathi]"}
    },
    "1": {
        "same": {"1" : "ಅಪ್ಪ [Appa]", "0": "ಅಮ್ಮ [Amma]"},
        "other": {"1" : "ದೊಡ್ಡಪ್ಪ/ಚಿಕ್ಕಪ್ಪ [Doddappa/Chikkappa]", "0": "ದೊಡ್ಡಮ್ಮ/ಚಿಕ್ಕಮ್ಮ [Doddamma/Chikkamma]"},
        "inv": {"1" : "ಮಾವ [Maava]", "0": "ಅತ್ತೆ [Atte]"},
    },
    "-1": {
        "same": {"1" : "ಮಗ [Maga]", "0": "ಮಗಳು [Magalu]"},
        "other": {"1" : "ಮಗ ವರಸೆಗೆ [Maga Varse]", "0": "ಮಗಳು ವರಸೆಗೆ [Magalu Varse]"},
        "inv": {"1" : "ಅಳಿಯ [Aliya]", "0": "ಸೊಸೆ [Sose]"},
    }
};

export default data;