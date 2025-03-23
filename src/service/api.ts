export const fetchMockData = async (query: string): Promise<Suggestion []> => {
    const mockData: Suggestion[] = [
      { id: 1, name: "Apple" },
      { id: 2, name: "Banana" },
      { id: 3, name: "Orange" },
      { id: 4, name: "Grape" },
      { id: 5, name: "Mango" },
    ];
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData.filter((item) => item.name.toLowerCase().includes(query.toLowerCase())));
      }, 500);
    });
};
