export const parseLocalStorageItem =(item:string)=>{
    const  localStorageItem= localStorage.getItem(item);
      if(!localStorageItem)return []
      try{
          const JsonItem =JSON.parse(localStorageItem)
          return JsonItem
      }
      catch{
          return []
      }
  }