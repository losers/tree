/**
 * Pre-packaged multi-generation family tree with 32 members, full relationships,
 * and birth dates for instant play and testing.
 */
export const demoFamilyTree = {
  id: "demo_1",
  name: "Alexander Sterling",
  mate: [
    { id: "demo_2", name: "Eleanor Vance" }
  ],
  children: [
    {
      id: "demo_3",
      name: "Robert Sterling",
      mate: [{ id: "demo_6", name: "Margaret Hayes" }],
      children: [
        {
          id: "demo_7",
          name: "James Sterling",
          mate: [{ id: "demo_16", name: "Sophia Laurent" }],
          children: [
            { id: "demo_17", name: "Leo Sterling" },
            { id: "demo_18", name: "Maya Sterling" }
          ]
        },
        {
          id: "demo_8",
          name: "David Sterling",
          mate: [{ id: "demo_19", name: "Emily Watson" }],
          children: [
            { id: "demo_20", name: "Oliver Sterling" }
          ]
        },
        {
          id: "demo_9",
          name: "Sarah Sterling",
          mate: [{ id: "demo_21", name: "Thomas Wright" }],
          children: [
            { id: "demo_22", name: "Lily Wright" }
          ]
        }
      ]
    },
    {
      id: "demo_4",
      name: "Victoria Sterling",
      mate: [{ id: "demo_10", name: "Charles Bennett" }],
      children: [
        {
          id: "demo_11",
          name: "Lucas Bennett",
          mate: [{ id: "demo_23", name: "Olivia Martinez" }],
          children: [
            { id: "demo_24", name: "Noah Bennett" },
            { id: "demo_25", name: "Ava Bennett" }
          ]
        },
        {
          id: "demo_12",
          name: "Chloe Bennett"
        }
      ]
    },
    {
      id: "demo_5",
      name: "William Sterling",
      mate: [{ id: "demo_13", name: "Clara Oswald" }],
      children: [
        {
          id: "demo_14",
          name: "Ethan Sterling",
          mate: [{ id: "demo_26", name: "Hannah Reed" }],
          children: [
            { id: "demo_27", name: "Mason Sterling" }
          ]
        },
        {
          id: "demo_15",
          name: "Grace Sterling"
        }
      ]
    }
  ]
};

export const demoMemberDetails = [
  { _id: "demo_1", name: "Alexander Sterling", short_name: "Alexander", gender: 1, dob_y: 1932, dod_y: 2018, is_died: true },
  { _id: "demo_2", name: "Eleanor Vance", short_name: "Eleanor", gender: 0, dob_y: 1936, dod_y: 2021, is_died: true },
  { _id: "demo_3", name: "Robert Sterling", short_name: "Robert", gender: 1, dob_y: 1958 },
  { _id: "demo_6", name: "Margaret Hayes", short_name: "Margaret", gender: 0, dob_y: 1961 },
  { _id: "demo_4", name: "Victoria Sterling", short_name: "Victoria", gender: 0, dob_y: 1962 },
  { _id: "demo_10", name: "Charles Bennett", short_name: "Charles", gender: 1, dob_y: 1960 },
  { _id: "demo_5", name: "William Sterling", short_name: "William", gender: 1, dob_y: 1967 },
  { _id: "demo_13", name: "Clara Oswald", short_name: "Clara", gender: 0, dob_y: 1970 },
  { _id: "demo_7", name: "James Sterling", short_name: "James", gender: 1, dob_y: 1985 },
  { _id: "demo_16", name: "Sophia Laurent", short_name: "Sophia", gender: 0, dob_y: 1987 },
  { _id: "demo_8", name: "David Sterling", short_name: "David", gender: 1, dob_y: 1989 },
  { _id: "demo_19", name: "Emily Watson", short_name: "Emily", gender: 0, dob_y: 1991 },
  { _id: "demo_9", name: "Sarah Sterling", short_name: "Sarah", gender: 0, dob_y: 1994 },
  { _id: "demo_21", name: "Thomas Wright", short_name: "Thomas", gender: 1, dob_y: 1992 },
  { _id: "demo_11", name: "Lucas Bennett", short_name: "Lucas", gender: 1, dob_y: 1988 },
  { _id: "demo_23", name: "Olivia Martinez", short_name: "Olivia", gender: 0, dob_y: 1990 },
  { _id: "demo_12", name: "Chloe Bennett", short_name: "Chloe", gender: 0, dob_y: 1993 },
  { _id: "demo_14", name: "Ethan Sterling", short_name: "Ethan", gender: 1, dob_y: 1996 },
  { _id: "demo_26", name: "Hannah Reed", short_name: "Hannah", gender: 0, dob_y: 1998 },
  { _id: "demo_15", name: "Grace Sterling", short_name: "Grace", gender: 0, dob_y: 2001 },
  { _id: "demo_17", name: "Leo Sterling", short_name: "Leo", gender: 1, dob_y: 2012 },
  { _id: "demo_18", name: "Maya Sterling", short_name: "Maya", gender: 0, dob_y: 2015 },
  { _id: "demo_20", name: "Oliver Sterling", short_name: "Oliver", gender: 1, dob_y: 2017 },
  { _id: "demo_22", name: "Lily Wright", short_name: "Lily", gender: 0, dob_y: 2020 },
  { _id: "demo_24", name: "Noah Bennett", short_name: "Noah", gender: 1, dob_y: 2016 },
  { _id: "demo_25", name: "Ava Bennett", short_name: "Ava", gender: 0, dob_y: 2019 },
  { _id: "demo_27", name: "Mason Sterling", short_name: "Mason", gender: 1, dob_y: 2022 },
];
