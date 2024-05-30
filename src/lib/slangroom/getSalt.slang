Rule unknown ignore
Given I connect to 'pb_address' and start pb client
Given I send list_parameters 'salt' and get some records and output into 'server_salt'
Given I have a 'string dictionary' named 'server_salt'
Then print data
