Rule unknown ignore

Given I connect to 'pb_address' and start capacitor pb client
Given I send create_parameters 'new_user' and send record_parameters 'record_parameters' and create record and output into 'user'
Given I have a 'string dictionary' named 'user'
Then print data
