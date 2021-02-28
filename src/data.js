var data = {};

data.getHostURL = function () {
    return "/api";
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
        "spl": { "1": "Husband", "0": "Wife" },
        "sav": { "1": "Brother", "0": "Sister" },
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
        "same": { "1": "మనవడు", "0": "మనవరాలు" },
        "other": { "1": "మనవడు", "0": "మనవరాలు" },
        "inv": { "1": "మనవడు", "0": "మనవరాలు" }
    },
    "0": {
        "same": { "1": "సొంతం అన్నయ/తమ్ముడు", "0": "సొంతం అక్క/చెల్లి" },
        "other": { "1": "అన్నయ/తమ్ముడు", "0": "అక్క/చెల్లి" },
        "inv": { "1": "బావ/బావమరిది", "0": "వదిన/మరదలు" },
        "spl": { "1": "భర్త", "0": "భార్య" },
        "sav": { "1": "అన్నయ/తమ్ముడు", "0": "అక్క/చెల్లి" },
    },
    "1": {
        "same": { "1": "నాన్న", "0": "అమ్మ" },
        "other": { "1": "పెద్దనాన్న/చిన్నాన్న", "0": "పెద్దమ్మ/పిన్నమ్మ" },
        "inv": { "1": "మామయ్య", "0": "అత్తమ్మ" },
    },
    "-1": {
        "same": { "1": "కొడుకు", "0": "కూతురు" },
        "other": { "1": "కొడుకు వరుస", "0": "కూతురు వరుస" },
        "inv": { "1": "అల్లుడు", "0": "కోడలు" },
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
        "same": { "1": "ಮೊಮ್ಮಗ [Mommaga]", "0": "ಮೊಮ್ಮಗಳು [Mommagalu]" },
        "other": { "1": "ಮೊಮ್ಮಗ [Mommaga]", "0": "ಮೊಮ್ಮಗಳು [Mommagalu]" },
        "inv": { "1": "ಮೊಮ್ಮಗ [Mommaga]", "0": "ಮೊಮ್ಮಗಳು [Mommagalu]" },
    },
    "0": {
        "same": { "1": "ಅಣ್ಣ/ತಮ್ಮ [Anna/Tamma]", "0": "ಅಕ್ಕ/ತಂಗಿ [Akka/Tangi]" },
        "other": { "1": "ಅಣ್ಣ/ತಮ್ಮ [Anna/Tamma]", "0": "ಅಕ್ಕ/ತಂಗಿ [Akka/Tangi]" },
        "inv": { "1": "ಭಾವ/ಬಾಮೈದ [Bhaava/Baamaida]", "0": "ಅತ್ತಿಗೆ/ನಾದಿನಿ [Attige/Naadini]" },
        "spl": { "1": "ಗಂಡ [Ganda]", "0": "ಹೆಂಡತಿ [Hendathi]" },
        "sav": { "1": "ಅಣ್ಣ/ತಮ್ಮ [Anna/Tamma]", "0": "ಅಕ್ಕ/ತಂಗಿ [Akka/Tangi]" },
    },
    "1": {
        "same": { "1": "ಅಪ್ಪ [Appa]", "0": "ಅಮ್ಮ [Amma]" },
        "other": { "1": "ದೊಡ್ಡಪ್ಪ/ಚಿಕ್ಕಪ್ಪ [Doddappa/Chikkappa]", "0": "ದೊಡ್ಡಮ್ಮ/ಚಿಕ್ಕಮ್ಮ [Doddamma/Chikkamma]" },
        "inv": { "1": "ಮಾವ [Maava]", "0": "ಅತ್ತೆ [Atte]" },
    },
    "-1": {
        "same": { "1": "ಮಗ [Maga]", "0": "ಮಗಳು [Magalu]" },
        "other": { "1": "ಮಗ ವರಸೆಗೆ [Maga Varse]", "0": "ಮಗಳು ವರಸೆಗೆ [Magalu Varse]" },
        "inv": { "1": "ಅಳಿಯ [Aliya]", "0": "ಸೊಸೆ [Sose]" },
    }
};

data.relations.hindi = {
    "3": {
        "same": { "1": "परदादा [Pardada]", "0": "परदादी [Pardadi]" },
        "other": { "1": "महान चाचा [Mahan chacha]", "0": "महान भव्य चाची [Mahan chachi]" },
        "inv": { "1": "महान भव्य ससुर [mahan bhavya sasur]", "0": "बड़ी भव्य सास [badi bhavya saas]" },
    },
    "-3": {
        "same": { "1": "परपोता [parpota]", "0": "परपोती [parpoti]" },
        "other": { "1": "महान भतीजा [mahan bhateeja]", "0": "महान भतीजी [mahan bhateeji]" },
        "inv": { "1": "महान दामाद [mahan damad]", "0": "बड़ी बहू [badi bahu]" }
    },
    "2": {
        "same": { "1": "दादा [dada]", "0": "दादी [dadi]" },
        "other": { "1": "बड़े चाचा [bade chacha]", "0": "बड़ी चाची [badi chachi]" },
        "inv": { "1": "ससुराल के दादा [sasural ke dada]", "0": "दादी सास [dadi saas]" },
    },
    "-2": {
        "same": { "1": "पोता [pota]", "0": "पोती [poti]" },
        "other": { "1": "पोता [pota]", "0": "पोती [poti]" },
        "inv": { "1": "भव्य दामाद [bhavya damad]", "0": "भव्य बहू [bhavya bahu]" }
    },
    "0": {
        "same": { "1": "भाई [bhai]", "0": "बहन [behen]" },
        "other": { "1": "चचेरा भाई [chachera bhai]", "0": "चचेरी बहन [chacheri behen]" },
        "inv": { "1": "साला [saala]", "0": "ननद [nanand]" },
        "spl": { "1": "पति [pati]", "0": "पत्नी [patni]" },
        "sav": { "1": "भाई [bhai]", "0": "बहन [behen]" }
    },
    "1": {
        "same": { "1": "पिता [pita]", "0": "मां [maa]" },
        "other": { "1": "चाचा [chacha]", "0": " चाची [chachi]" },
        "inv": { "1": "ससुर [sasur]", "0": "सास [saas]" },
    },
    "-1": {
        "same": { "1": "बेटा [beta]", "0": "बेटी [beti]" },
        "other": { "1": "भतीजा [bhateeja]", "0": "भांजी [bhanji]" },
        "inv": { "1": "दामाद [damad]", "0": "बहु [bahu]" },
    }
};


data.relations.tamil = {
    "3": {
        "same": { "1": "தாத்தா [Tāttā]", "0": "பாட்டி [Pāṭṭi]" },
        "other": { "1": "தாத்தா [Tāttā]", "0": "பாட்டி [Pāṭṭi]" },
        "inv": { "1": "தாத்தா [Tāttā]", "0": "பாட்டி [Pāṭṭi]" },
    },
    "-3": {
        "same": { "1": "பேரன் [Pēraṉ]", "0": "பேத்தி [Pētti]" },
        "other": { "1": "பேரன் [Pēraṉ]", "0": "பேத்தி [Pētti]" },
        "inv": { "1": "பேரன் [Pēraṉ]", "0": "பேத்தி [Pētti]" }
    },
    "2": {
        "same": { "1": "தாத்தா [Tāttā]", "0": "பாட்டி [Pāṭṭi]" },
        "other": { "1": "தாத்தா [Tāttā]", "0": "பாட்டி [Pāṭṭi]" },
        "inv": { "1": "தாத்தா [Tāttā]", "0": "பாட்டி [Pāṭṭi]" },
    },
    "-2": {
        "same": { "1": "பேரன் [Pēraṉ]", "0": "பேத்தி [Pētti]" },
        "other": { "1": "பேரன் [Pēraṉ]", "0": "பேத்தி [Pētti]" },
        "inv": { "1": "மருமகன் [Marumakaṉ]", "0": "மருமகள் [Marumakaḷ]" }
    },
    "0": {
        "same": { "1": "அண்ணன்/தம்பி [Aṇṇaṉ/Tambi]", "0": "அக்கா/தங்கை [akka/thangi]" },
        "other": { "1": "அண்ணன்/தம்பி [Aṇṇaṉ/Tambi]", "0": "அக்கா/தங்கை [akka/thangi]" },
        "sav": { "1": "அண்ணன்/தம்பி [Aṇṇaṉ/Tambi]", "0": "அக்கா/தங்கை [akka/thangi]" },
        "inv": { "1": "மாமா/மச்சான் [Maittuṉaṉ]", "0": "அண்ணி/மச்சாள் [Maittuṉar]" },
        "spl": { "1": "கணவர் [Kaṇavar]", "0": "மனைவி [Maṉaivi]" }
    },
    "1": {
        "same": { "1": "அப்பா [Appā]", "0": "அம்மா [Am'mā]" },
        "other": { "1": "பெரிய அப்பா/சித்தப்பா [Periya appā/Cittappā]", "0": "பேரியஅம்மா / சித்தி [Pēriya'am'mā/Citti]" },
        "inv": { "1": "மாமா [Māmā]", "0": "அத்தை [Attai]" },
    },
    "-1": {
        "same": { "1": "மகன் [Makaṉ]", "0": "மகள் [Makaḷ]" },
        "other": { "1": "அண்ணன் மகன்/அக்காள் மகன் [Cakōtaraṉ makaḷ/Cakōtari makaḷ]", "0": "சகோதரன் மகள்/சகோதரி மகள் [Aṇṇaṉ makaṉ/Akkāḷ makaṉ]" },
        "inv": { "1": "மருமகன் [Marumakaṉ]", "0": "மருமகள் [Marumakaḷ]" },
    }
}

data.countries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "American Samoa",
    "Andorra",
    "Angola",
    "Anguilla",
    "Antarctica",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Aruba",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bermuda",
    "Bhutan",
    "Bolivia (Plurinational State of)",
    "Bonaire, Sint Eustatius and Saba",
    "Bosnia and Herzegovina",
    "Botswana",
    "Bouvet Island",
    "Brazil",
    "British Indian Ocean Territory",
    "Brunei Darussalam",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Cayman Islands",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Christmas Island",
    "Cocos (Keeling) Islands ",
    "Colombia",
    "Comoros",
    "Congo (Democratic Republic)",
    "Congo",
    "Cook Islands",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Curaçao",
    "Cyprus",
    "Czechia",
    "Côte d'Ivoire",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Falkland Islands [Malvinas]",
    "Faroe Islands",
    "Fiji",
    "Finland",
    "France",
    "French Guiana",
    "French Polynesia",
    "French Southern Territories",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Gibraltar",
    "Greece",
    "Greenland",
    "Grenada",
    "Guadeloupe",
    "Guam",
    "Guatemala",
    "Guernsey",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Heard Island and McDonald Islands",
    "Holy See",
    "Honduras",
    "Hong Kong",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran (Islamic Republic of)",
    "Iraq",
    "Ireland",
    "Isle of Man",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jersey",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Korea (Democratic People's Republic of)",
    "Korea (Republic of)",
    "Kuwait",
    "Kyrgyzstan",
    "Lao People's Democratic Republic",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macao",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Martinique",
    "Mauritania",
    "Mauritius",
    "Mayotte",
    "Mexico",
    "Micronesia (Federated States of)",
    "Moldova (Republic of)",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Montserrat",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Caledonia",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "Niue",
    "Norfolk Island",
    "Northern Mariana Islands",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine, State of",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Pitcairn",
    "Poland",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    "Republic of North Macedonia",
    "Romania",
    "Russian Federation",
    "Rwanda",
    "Réunion",
    "Saint Barthélemy",
    "Saint Helena, Ascension and Tristan da Cunha",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Martin (French part)",
    "Saint Pierre and Miquelon",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Sint Maarten (Dutch part)",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Georgia and the South Sandwich Islands",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Svalbard and Jan Mayen",
    "Sweden",
    "Switzerland",
    "Syrian Arab Republic",
    "Taiwan",
    "Tajikistan",
    "Tanzania, United Republic of",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tokelau",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Turks and Caicos Islands",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom of Great Britain and Northern Ireland",
    "United States Minor Outlying Islands",
    "United States of America",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Venezuela (Bolivarian Republic of)",
    "Viet Nam",
    "Virgin Islands (British)",
    "Virgin Islands (U.S)",
    "Wallis and Futuna",
    "Western Sahara",
    "Yemen",
    "Zambia",
    "Zimbabwe",
    "Åland Islands"
];

data.countries.data = [
    {
        code: "ad",
        name: "Andorra",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "ae",
        name: "United Arab Emirates",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "af",
        name: "Afghanistan",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "ag",
        name: "Antigua and Barbuda",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "ai",
        name: "Anguilla",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "al",
        name: "Albania",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "am",
        name: "Armenia",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "ao",
        name: "Angola",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "aq",
        name: "Antarctica",
        continent: "Antarctica",
        continent_code: "an"
    },
    {
        code: "ar",
        name: "Argentina",
        continent: "South America",
        continent_code: "sa"
    },
    {
        code: "as",
        name: "American Samoa",
        continent: "Oceania",
        continent_code: "oc"
    },
    {
        code: "at",
        name: "Austria",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "au",
        name: "Australia",
        continent: "Oceania",
        continent_code: "oc"
    },
    {
        code: "aw",
        name: "Aruba",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "ax",
        name: "Aland Islands",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "az",
        name: "Azerbaijan",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "ba",
        name: "Bosnia and Herzegovina",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "bb",
        name: "Barbados",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "bd",
        name: "Bangladesh",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "be",
        name: "Belgium",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "bf",
        name: "Burkina Faso",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "bg",
        name: "Bulgaria",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "bh",
        name: "Bahrain",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "bi",
        name: "Burundi",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "bj",
        name: "Benin",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "bl",
        name: "Saint-Barthélemy",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "bm",
        name: "Bermuda",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "bn",
        name: "Brunei Darussalam",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "bo",
        name: "Bolivia",
        continent: "South America",
        continent_code: "sa"
    },
    {
        code: "bq",
        name: "Caribbean Netherlands",
        continent: "South America",
        continent_code: "sa"
    },
    {
        code: "br",
        name: "Brazil",
        continent: "South America",
        continent_code: "sa"
    },
    {
        code: "bs",
        name: "Bahamas",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "bt",
        name: "Bhutan",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "bv",
        name: "Bouvet Island",
        continent: "Antarctica",
        continent_code: "an"
    },
    {
        code: "bw",
        name: "Botswana",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "by",
        name: "Belarus",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "bz",
        name: "Belize",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "ca",
        name: "Canada",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "cc",
        name: "Cocos (Keeling) Islands",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "cd",
        name: "Democratic Republic of the Congo",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "cf",
        name: "Central African Republic",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "cg",
        name: "Republic of the Congo",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "ch",
        name: "Switzerland",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "ci",
        name: "Côte d'Ivoire",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "ck",
        name: "Cook Islands",
        continent: "Oceania",
        continent_code: "oc"
    },
    {
        code: "cl",
        name: "Chile",
        continent: "South America",
        continent_code: "sa"
    },
    {
        code: "cm",
        name: "Cameroon",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "cn",
        name: "China",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "co",
        name: "Colombia",
        continent: "South America",
        continent_code: "sa"
    },
    {
        code: "cr",
        name: "Costa Rica",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "cu",
        name: "Cuba",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "cv",
        name: "Cabo Verde",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "cw",
        name: "Curaçao",
        continent: "South America",
        continent_code: "sa"
    },
    {
        code: "cx",
        name: "Christmas Island",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "cy",
        name: "Cyprus",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "cz",
        name: "Czech Republic",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "de",
        name: "Germany",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "dj",
        name: "Djibouti",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "dk",
        name: "Denmark",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "dm",
        name: "Dominica",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "do",
        name: "Dominican Republic",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "dz",
        name: "Algeria",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "ec",
        name: "Ecuador",
        continent: "South America",
        continent_code: "sa"
    },
    {
        code: "ee",
        name: "Estonia",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "eg",
        name: "Egypt",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "eh",
        name: "Western Sahara",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "er",
        name: "Eritrea",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "es",
        name: "Spain",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "et",
        name: "Ethiopia",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "fi",
        name: "Finland",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "fj",
        name: "Fiji",
        continent: "Oceania",
        continent_code: "oc"
    },
    {
        code: "fk",
        name: "Falkland Islands",
        continent: "South America",
        continent_code: "sa"
    },
    {
        code: "fm",
        name: "Micronesia",
        continent: "Oceania",
        continent_code: "oc"
    },
    {
        code: "fo",
        name: "Faroe Islands",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "fr",
        name: "France",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "ga",
        name: "Gabon",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "gb",
        name: "United Kingdom",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "gd",
        name: "Grenada",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "ge",
        name: "Georgia",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "gf",
        name: "French Guiana",
        continent: "South America",
        continent_code: "sa"
    },
    {
        code: "gg",
        name: "Guernsey",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "gh",
        name: "Ghana",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "gi",
        name: "Gibraltar",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "gl",
        name: "Greenland",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "gm",
        name: "The Gambia",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "gn",
        name: "Guinea",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "gp",
        name: "Guadeloupe",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "gq",
        name: "Equatorial Guinea",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "gr",
        name: "Greece",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "gs",
        name: "South Georgia and the South Sandwich Islands",
        continent: "Antarctica",
        continent_code: "an"
    },
    {
        code: "gt",
        name: "Guatemala",
        continent: "North AMerica",
        continent_code: "na"
    },
    {
        code: "gu",
        name: "Guam",
        continent: "Oceania",
        continent_code: "oc"
    },
    {
        code: "gw",
        name: "Guinea Bissau",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "gy",
        name: "Guyana",
        continent: "South America",
        continent_code: "sa"
    },
    {
        code: "hk",
        name: "Hong Kong",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "hm",
        name: "Heard Island and McDonald Islands",
        continent: "Antarctica",
        continent_code: "an"
    },
    {
        code: "hn",
        name: "Honduras",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "hr",
        name: "Croatia",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "ht",
        name: "Haiti",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "hu",
        name: "Hungary",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "id",
        name: "Indonesia",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "ie",
        name: "Ireland",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "il",
        name: "Israel",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "im",
        name: "Isle of Man",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "in",
        name: "India",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "io",
        name: "British Indian Ocean Territory",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "iq",
        name: "Iraq",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "ir",
        name: "Iran",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "is",
        name: "Iceland",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "it",
        name: "Italy",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "je",
        name: "Jersey",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "jm",
        name: "Jamaica",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "jo",
        name: "Jordan",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "jp",
        name: "Japan",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "ke",
        name: "Kenya",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "kg",
        name: "Kyrgyzstan",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "kh",
        name: "Cambodia",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "ki",
        name: "Kiribati",
        continent: "Oceania",
        continent_code: "oc"
    },
    {
        code: "km",
        name: "Comoros",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "kn",
        name: "Saint Kitts and Nevis",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "kp",
        name: "North Korea",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "kr",
        name: "South Korea",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "kw",
        name: "Kuwait",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "ky",
        name: "Cayman Islands",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "kz",
        name: "Kazakhstan",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "la",
        name: "Laos",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "lb",
        name: "Lebanon",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "lc",
        name: "Saint Lucia",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "li",
        name: "Liechtenstein",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "lk",
        name: "Sri Lanka",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "lr",
        name: "Liberia",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "ls",
        name: "Lesotho",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "lt",
        name: "Lithuania",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "lu",
        name: "Luxembourg",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "lv",
        name: "Latvia",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "ly",
        name: "Libya",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "ma",
        name: "Morocco",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "mc",
        name: "Monaco",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "md",
        name: "Moldova",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "me",
        name: "Montenegro",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "mf",
        name: "Saint Martin (French part)",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "mg",
        name: "Madagascar",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "mh",
        name: "Marshall Islands",
        continent: "Oceania",
        continent_code: "oc"
    },
    {
        code: "mk",
        name: "North Macedonia",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "ml",
        name: "Mali",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "mm",
        name: "Myanmar",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "mn",
        name: "Mongolia",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "mo",
        name: "Macao",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "mp",
        name: "Northern Mariana Islands",
        continent: "Oceania",
        continent_code: "oc"
    },
    {
        code: "mq",
        name: "Martinique",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "mr",
        name: "Mauritania",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "ms",
        name: "Montserrat",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "mt",
        name: "Malta",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "mu",
        name: "Mauritius",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "mv",
        name: "Maldives",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "mw",
        name: "Malawi",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "mx",
        name: "Mexico",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "my",
        name: "Malaysia",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "mz",
        name: "Mozambique",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "na",
        name: "Namibia",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "nc",
        name: "New Caledonia",
        continent: "Oceania",
        continent_code: "oc"
    },
    {
        code: "ne",
        name: "Niger",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "nf",
        name: "Norfolk Island",
        continent: "Oceania",
        continent_code: "oc"
    },
    {
        code: "ng",
        name: "Nigeria",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "ni",
        name: "Nicaragua",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "nl",
        name: "The Netherlands",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "no",
        name: "Norway",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "np",
        name: "Nepal",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "nr",
        name: "Nauru",
        continent: "Oceania",
        continent_code: "oc"
    },
    {
        code: "nu",
        name: "Niue",
        continent: "Oceania",
        continent_code: "oc"
    },
    {
        code: "nz",
        name: "New Zealand",
        continent: "Oceania",
        continent_code: "oc"
    },
    {
        code: "om",
        name: "Oman",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "pa",
        name: "Panama",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "pe",
        name: "Peru",
        continent: "South America",
        continent_code: "sa"
    },
    {
        code: "pf",
        name: "French Polynesia",
        continent: "Oceania",
        continent_code: "oc"
    },
    {
        code: "pg",
        name: "Papua New Guinea",
        continent: "Oceania",
        continent_code: "oc"
    },
    {
        code: "ph",
        name: "Philippines",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "pk",
        name: "Pakistan",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "pl",
        name: "Poland",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "pm",
        name: "Saint Pierre and Miquelon",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "pn",
        name: "Pitcairn",
        continent: "Oceania",
        continent_code: "oc"
    },
    {
        code: "pr",
        name: "Puerto Rico",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "ps",
        name: "Palestine",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "pt",
        name: "Portugal",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "pw",
        name: "Palau",
        continent: "Oceania",
        continent_code: "oc"
    },
    {
        code: "py",
        name: "Paraguay",
        continent: "South America",
        continent_code: "sa"
    },
    {
        code: "qa",
        name: "Qatar",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "re",
        name: "Réunion",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "ro",
        name: "Romania",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "rs",
        name: "Serbia",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "ru",
        name: "Russia",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "rw",
        name: "Rwanda",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "sa",
        name: "Saudi Arabia",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "sb",
        name: "Solomon Islands",
        continent: "Oceania",
        continent_code: "oc"
    },
    {
        code: "sc",
        name: "Seychelles",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "sd",
        name: "Sudan",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "se",
        name: "Sweden",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "sg",
        name: "Singapore",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "sh",
        name: "Saint Helena",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "si",
        name: "Slovenia",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "sj",
        name: "Svalbard and Jan Mayen",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "sk",
        name: "Slovakia",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "sl",
        name: "Sierra Leone",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "sm",
        name: "San Marino",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "sn",
        name: "Sénégal",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "so",
        name: "Somalia",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "sr",
        name: "Suriname",
        continent: "South America",
        continent_code: "sa"
    },
    {
        code: "ss",
        name: "South Sudan",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "st",
        name: "São Tomé and Príncipe",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "sv",
        name: "El Salvador",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "sx",
        name: "Saint Martin (Dutch part)",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "sy",
        name: "Syria",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "sz",
        name: "Swaziland",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "tc",
        name: "Turks and Caicos Islands",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "td",
        name: "Chad",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "tf",
        name: "French Southern and Antarctic Lands",
        continent: "Antarctica",
        continent_code: "an"
    },
    {
        code: "tg",
        name: "Togo",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "th",
        name: "Thailand",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "tj",
        name: "Tajikistan",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "tk",
        name: "Tokelau",
        continent: "Oceania",
        continent_code: "oc"
    },
    {
        code: "tl",
        name: "Timor-Leste",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "tm",
        name: "Turkmenistan",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "tn",
        name: "Tunisia",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "to",
        name: "Tonga",
        continent: "Oceania",
        continent_code: "oc"
    },
    {
        code: "tr",
        name: "Turkey",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "tt",
        name: "Trinidad and Tobago",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "tv",
        name: "Tuvalu",
        continent: "Oceania",
        continent_code: "oc"
    },
    {
        code: "tw",
        name: "Taiwan",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "tz",
        name: "Tanzania",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "ua",
        name: "Ukraine",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "ug",
        name: "Uganda",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "um",
        name: "United States Minor Outlying Islands",
        continent: "Oceania",
        continent_code: "oc"
    },
    {
        code: "us",
        name: "United States",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "uy",
        name: "Uruguay",
        continent: "South America",
        continent_code: "sa"
    },
    {
        code: "uz",
        name: "Uzbekistan",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "va",
        name: "City of the Vatican",
        continent: "Europe",
        continent_code: "eu"
    },
    {
        code: "vc",
        name: "Saint Vincent and the Grenadines",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "ve",
        name: "Venezuela",
        continent: "South America",
        continent_code: "sa"
    },
    {
        code: "vg",
        name: "British Virgin Islands",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "vi",
        name: "United States Virgin Islands",
        continent: "North America",
        continent_code: "na"
    },
    {
        code: "vn",
        name: "Vietnam",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "vu",
        name: "Vanuatu",
        continent: "Oceania",
        continent_code: "oc"
    },
    {
        code: "wf",
        name: "Wallis and Futuna",
        continent: "Oceania",
        continent_code: "oc"
    },
    {
        code: "ws",
        name: "Samoa",
        continent: "Oceania",
        continent_code: "oc"
    },
    {
        code: "ye",
        name: "Yemen",
        continent: "Asia",
        continent_code: "as"
    },
    {
        code: "yt",
        name: "Mayotte",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "za",
        name: "South Africa",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "zm",
        name: "Zambia",
        continent: "Africa",
        continent_code: "af"
    },
    {
        code: "zw",
        name: "Zimbabwe",
        continent: "Africa",
        continent_code: "af"
    }
];
export default data;
