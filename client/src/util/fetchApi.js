const fetchApi = async (url, method, body) => {
    try {
      const requestOptions = {
        method: method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      };
  
      // Add the 'body' property conditionally if it's provided
      if (body) {
        requestOptions.body = JSON.stringify(body);
      }
  
      const res = await fetch(url, requestOptions);
    

      let resJSON = await res.json();
      return resJSON;
    } catch (err) {
      return err;
    }
}

export default fetchApi;