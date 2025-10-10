const getPublicIp = async (): Promise<string> => {
  try{
      const response = await fetch('https://api.ipify.org?format=json');

      if(!response.ok){
          throw new Error(response.statusText);
      }

      const json = await response.json() as { ip: string };
      return json.ip;
  }catch (error) {
      throw error;
  }
};

export default getPublicIp;