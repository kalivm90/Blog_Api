Google Auth Backend Instructions (this took me a long time to figure out)

Start with Google Console and setup project and Credentials > OAuth 

under JavaScript Origins put the client domain, if local do not use the IP, instead use localhost:port  (be careful of http vs https)
under redirect URIs use the servers callback domain + route example: http://localhost:5000/api/google/callback

copy the secret and client id into a .env 

SERVER --------------------------------------------------------------------------------------------------------------------------------

``` npm i passport passport-google-oauth20 ```

create the passport middleware and the /google and /google/callback routes

since I was using JWTs I did not handle sessions and instead signed a token and passed it in a httpOnly cookie then redirected the server back to the client. (look at it in api/auth router)

CLIENT----------------------------------------------------------------------------------------------------------------------------------

make a component like a button. onclick call a function like this 

```
const handleGoogleLogin = () => {
    // Construct the URL for Google OAuth authorization endpoint
    const googleAuthUrl = `http://localhost:5000/api/google`; // Replace with your server's endpoint

    // Open a new window to initiate the Google OAuth flow
    window.open(googleAuthUrl, "_blank");
};
```

