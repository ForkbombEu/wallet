Rule unknown ignore
Given I connect to 'pb_address' and start pb client
Given I send url 'check_email' and send send_parameters 'user' and send request and output into 'output'
Given I have a 'string dictionary' named 'output'   
Then print data