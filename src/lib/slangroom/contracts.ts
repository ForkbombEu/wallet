import { authWithPassword, updateProfile } from './endpoints';

export const authWithPasswordContract = `
Rule unknown ignore

Given I have a 'string' named 'pb'
Given I have a 'string dictionary' named 'auth'
When I write string '${authWithPassword}' in 'path'
When I append 'path' to 'pb'
Then print data
Then I connect to 'pb' and send object 'auth' and do post and output into 'auth_token'
`;
export const apiByIdContract = (before: string, after: string) => `
Rule unknown ignore

Given I have a 'string' named 'pb'
Given I have a 'string' named 'id'
Given I have a 'string dictionary' named 'headers'
When I write string '${before}' in 'path'
When I write string '${after}' in 'end_filter'
When I append 'path' to 'pb'
When I append 'id' to 'pb'
When I append 'end_filter' to 'pb'
Then print data
Then I connect to 'pb' and send headers 'headers' and do get and output into 'http_result'
`;
export const updateProfileContract = `
Rule unknown ignore

Given I have a 'string' named 'pb'
Given I have a 'string' named 'id'
Given I have a 'string dictionary' named 'headers'
Given I have a 'string dictionary' named 'user_data'
When I write string ${updateProfile} in 'path'
When I append 'path' to 'pb'
When I append 'id' to 'pb'
Then print data
Then I connect to 'pb' and send headers 'headers' and send object 'user_data' and do patch and output into 'http_result'
`;

export const apiContract = (url: string) => `
Rule unknown ignore

Given I have a 'string' named 'pb'
Given I have a 'string dictionary' named 'headers'
When I write string '${url}' in 'path'
When I append 'path' to 'pb'
Then print data
Then I connect to 'pb' and send headers 'headers' and do get and output into 'http_result'
`;
