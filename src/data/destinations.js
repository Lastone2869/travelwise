const destinations = [
  {
    id: "goa",
    name: "Goa",
    subdestinations: [
      { id: "anjuna", name: "Anjuna Flea Market", description: "Famous for its vibrant flea market and beach parties.", tags: ["Shopping", "Beach"], safetyRating: 4.5, duration: "2-3 days" },
      { id: "baga", name: "Baga Beach", description: "Known for its nightlife and water sports.", tags: ["Beach", "Nightlife"], safetyRating: 4.0, duration: "1-2 days" },
      { id: "fort-aguada", name: "Fort Aguada", description: "A 17th-century Portuguese fort with scenic views.", tags: ["History", "Viewpoint"], safetyRating: 4.2, duration: "Half day" },
      { id: "basilica", name: "Basilica of Bom Jesus", description: "A UNESCO World Heritage Site with Baroque architecture.", tags: ["Religious", "History"], safetyRating: 4.7, duration: "2-3 hours" },
      { id: "candolim", name: "Candolim Beach", description: "A quieter beach with golden sands and clear waters.", tags: ["Beach", "Relaxation"], safetyRating: 4.3, duration: "1 day" },
    ],
  },
  {
    id: "rajasthan",
    name: "Rajasthan",
    subdestinations: [
      { id: "jaipur", name: "Jaipur", description: "The Pink City with palaces and vibrant bazaars.", tags: ["History", "Palace"], safetyRating: 4.7, duration: "3-4 days" },
      { id: "udaipur", name: "Udaipur", description: "City of Lakes with romantic boat rides.", tags: ["Lakes", "Romantic"], safetyRating: 4.6, duration: "2-3 days" },
      { id: "pushkar", name: "Pushkar", description: "Sacred town with a famous camel fair.", tags: ["Religious", "Cultural"], safetyRating: 4.4, duration: "1-2 days" },
    ],
  },
  // ... (other destinations as per your list)
];

export default destinations;