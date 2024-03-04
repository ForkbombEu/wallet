export const holder_to_authorize_on_authz_server = `Scenario 'http' : create GET
Scenario 'w3c' : create JWS

# Given I have a 'string dictionary' named 'openid-credential-issuer'
# Given I have a 'string dictionary' named 'authorization_request_body'
Given I have a 'string dictionary' named '!external-qr-code-content'
Given I have a 'string dictionary' named 'jwt-body-params' inside 'credential_request_specific_data'
Given I have a 'string' named 'client_id'
Given I have a 'string dictionary' named 'request' inside 'credential_request_specific_data'
Given I have a 'string dictionary' named 'client' inside 'credential_request_specific_data'




Given I have a 'keyring'


#- create Code Verifier (rng in url64) (used in step 7)
When I create the random object of '256' bits
When I write the string '' in 'code_verifier'
When I append the 'url64' of 'random_object' to 'code_verifier'

# - create Code Challenge (sha256 of Code Verifier printed in url64 ) (sent to /AUTHORIZE)
When I create the hash of 'code_verifier'
When I write the string '' in 'code_challenge'
When I append the 'url64' of 'hash' to 'code_challenge'

When I create the 'url64 dictionary' 
When I rename the 'url64 dictionary' to 'jws payload'

When I copy 'code_challenge' in 'jws payload'

When I create jws header for p256 signature

# When I create the jws detached signature of header 'jws header' and payload 'did document'

When I create jws signature of header 'jws header' and payload 'jws payload'
When I rename the 'jws signature' to 'clientSecret'


# - pickup stuff from jwt-body
When I pickup from path 'jwt-body-params.redirectUris'
When I pickup from path 'jwt-body-params.response_type'
When I pickup from path 'jwt-body-params.state'
When I pickup from path 'jwt-body-params.code_challenge_method'

# - fix redirectUris
When I create the copy of element '1' from array 'redirectUris'
When I rename the 'copy' to 'redirect_uri'

# - pickup stuff drom qrcode
When I pickup from path '!external-qr-code-content.scope'
When I pickup from path '!external-qr-code-content.resource'

# - request.body
When I set 'base-url' to 'http://' as 'string'
When I create the url from 'base-url'
When I append 'response_type' as http request to 'url'
When I append 'client_id' as http request to 'url'
When I append 'state' as http request to 'url'
When I append 'code_challenge' as http request to 'url'
When I append 'code_challenge_method' as http request to 'url'
When I append 'scope' as http request to 'url'

When I append the percent encoding of 'redirect_uri' as http request to 'url'
When I append the percent encoding of 'resource' as http request to 'url'
When I split the leftmost '8' bytes of 'url'
When I rename the 'url' to 'body'

# - request
When I move 'body' in 'request'
When I move the 'client_id' to 'id' in 'client'
When I move 'clientSecret' in 'client'

# then print the 'code_challenge'
then print the 'code_verifier'
# this needs to saved into a state for later usage
# code verifier will be sent authz server in a later stage
then print the 'request'  
then print the 'client'`;
