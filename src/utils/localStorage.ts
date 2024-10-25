export const setItemToLocalStorage = (key: string, value:string) => {
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        console.log(error);
        
    }
   
  };
  
  export const getItemFromLocalStorage = (key: string) =>
    localStorage.getItem(key);
  export const removeItemFromLocalStorage = (key: string) =>
    localStorage.removeItem(key);