Rule unknown ignore

Given I connect to 'pb_address' and start capacitor pb client
Given I send create_parameters 'public_keys' and send record_parameters 'record_parameters' and create record and output into 'result'
Given I have a 'string dictionary' named 'result'
Then print the 'result'