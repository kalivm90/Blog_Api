/**************************************************************************************** 
*                                                                                       *
*   Returns bool if keyword is found in "error" or "errors" response messages           *
*   Used for checking if certain field validation keywords appear in response body      *
*                                                                                       *
*   Difference between "error" and "errors":                                            *
*   "errors" is specifically form validation handled by express-validator               *
*   "error" is for any general message sent back with the request and is more general   *
*                                                                                       *
*   Use validation=false for pasrsing regular error message                             *
*   Use validation=true if parsing validation "errors" messages                         *
*                                                                                       *
******************************************************************************************/

const parseErrorMessage = (response, keyword, validation=false) => {
    // Checking for keywords in "error" field
    if (!validation) {
        return response.body.error
            .toLowerCase()
            .split(" ")
            .includes(keyword);
    } 
    // Checking for keywords in "errors" field
    return response.body.errors.find(error => error.path === keyword);
}

module.exports ={
    parseErrorMessage
} 