Rule unknown ignore

Given I connect to 'pb_address' and start capacitor pb client
Given I send my_credentials 'my_credentials' and login and output into 'login_output'
Given I refresh token and output into 'refresh_output'
Given I have a 'string dictionary' named 'login_output'
Given I have a 'string dictionary' named 'refresh_output'
Then print data