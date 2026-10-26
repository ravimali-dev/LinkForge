 export function generateRandomMix(length){
   const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
   let result = "";

   for(let i=0; i< length; i++){
    const index = Math.floor(Math.random() * characters.length)
    result += characters[index]
   }

   return result
}

export const isValidUrl = (url) => {
    try {
        const isUrl = new URL(url);
        return isUrl.protocol === "http:" || isUrl.protocol === "https:"
    } catch (error) {
        return false
    }
     
}