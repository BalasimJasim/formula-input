import { Tag } from '../store/formulaStore';

// For this demo, we'll use the data provided in the instructions
const MOCK_DATA: Tag[] = [
  {"name":"name 1","category":"category 1","value":"","id":"1"},
  {"name":"name 2","category":"category 2","value":"","id":"2"},
  {"name":"name 3","category":"category 3","value":95,"id":"3"},
  {"name":"name 4","category":"category 4","value":3,"id":"4"},
  {"name":"name 5","category":"category 5","value":51,"id":"5"},
  {"name":"name 6","category":"category 6","value":87,"id":"6"},
  {"name":"name 7","category":"category 7","value":57,"id":"7"},
  {"name":"name 8","category":"category 8","value":6,"id":"8"},
  {"name":"name 9","category":"category 9","value":40,"id":"9"},
  {"name":"name 10","category":"category 10","value":44,"id":"10"},
  {"name":"name 11","category":"category 11","value":90,"id":"11"},
  {"name":"name 12","category":"category 12","value":0,"id":"12"},
  {"name":"name 13","category":"category 13","value":99,"id":"13"},
  {"name":"name 14","category":"category 14","value":95,"id":"14"},
  {"name":"name 15","category":"category 15","value":60,"id":"15"},
  {"name":"name 16","category":"category 16","value":8,"id":"16"},
  {"name":"name 17","category":"category 17","value":60,"id":"17"},
  {"name":"name 18","category":"category 18","value":98,"id":"18"},
  {"name":"name 19","category":"category 19","value":75,"id":"19"},
  {"name":"name 20","category":"category 20","value":94,"id":"20"},
  {"name":"name 21","category":"category 21","value":92,"id":"21"},
  {"name":"name 22","category":"category 22","value":61,"id":"22"},
  {"name":"name 23","category":"category 23","value":24,"id":"23"},
  {"name":"name 24","category":"category 24","value":13,"id":"24"},
  {"name":"name 25","category":"category 25","value":50,"id":"25"},
  {"name":"name 26","category":"category 26","value":97,"id":"26"},
  {"name":"name 27","category":"category 27","value":22,"id":"27"},
  {"name":"name 28","category":"category 28","value":47,"id":"28"},
  {"name":"name 29","category":"category 29","value":24,"id":"29"},
  {"name":"name 30","category":"category 30","value":20,"id":"30"},
  {"name":"name 31","category":"category 31","value":"9 + 10","id":"31"},
  {"name":"name 32","category":"category 32","value":"9 + 10","id":"32"},
  {"name":"name 33","category":"category 33","value":"9 + 10","id":"33"},
  {"name":"name 34","category":"category 34","value":"9 + 10","id":"34"},
  {"name":"name 35","category":"category 35","value":21,"id":"35"},
  {"name":"name 36","category":"category 36","value":77,"id":"36"},
  {"name":"name 37","category":"category 37","value":52,"id":"37"},
  {"name":"name 38","category":"category 38","value":70,"id":"38"},
  {"name":"name 39","category":"category 39","value":49,"id":"39"},
  {"name":"name 40","category":"category 40","value":10,"id":"40"},
  {"name":"name 41","category":"category 41","value":3,"id":"41"},
  {"name":"name 42","category":"category 42","value":5,"id":"42"},
  {"name":"name 43","category":"category 43","value":16,"id":"43"},
  {"name":"name 44","category":"category 44","value":72,"id":"44"},
  {"name":"name 45","category":"category 45","value":70,"id":"45"}
];

export const fetchVariables = async (): Promise<Tag[]> => {
  // In a real app, we would fetch from the API
  // return fetch('https://api.example.com/variables').then(res => res.json());
  
  // For this demo, we'll return the mock data after a small delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_DATA);
    }, 300);
  });
};

export const searchVariables = async (searchTerm: string): Promise<Tag[]> => {
  // In a real app, we would fetch from the API with a search parameter
  // return fetch(`https://api.example.com/variables?search=${searchTerm}`).then(res => res.json());
  
  // For this demo, we'll filter the mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredData = MOCK_DATA.filter(
        (tag) => 
          tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tag.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      resolve(filteredData);
    }, 300);
  });
}; 