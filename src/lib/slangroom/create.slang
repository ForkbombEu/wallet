Rule unknown ignore
Given I connect to 'pb_address' and start capacitor pb client
Given I send create_parameters 'create_parameters' and send record_parameters 'record_parameters' and create record and output into 'output'
Given I have a 'string dictionary' named 'output'
Then print data