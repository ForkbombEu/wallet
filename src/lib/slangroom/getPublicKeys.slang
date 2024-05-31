Rule unknown ignore
Given I connect to 'pb_address' and start pb client
Given I send list_parameters 'public_keys' and get some records and output into 'public_keys'
Given I have a 'string dictionary' named 'public_keys'
Then print data
