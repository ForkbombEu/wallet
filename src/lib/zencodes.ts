import { zencode_exec } from "zenroom";

export const generateKeyring = async () => {
    const CONTRACT = `Scenario 'ecdh': Create the key
    Scenario 'ethereum': Create key
    Scenario 'reflow': Create the key
    Scenario 'schnorr': Create the key
    Scenario 'eddsa': Create the key
    Scenario 'bbs': implementation of https://identity.foundation/bbs-signature/draft-irtf-cfrg-bbs-signatures.html
    Scenario 'pvss': Create the key
    
    Given nothing
    
    # Here we are creating the keys
    When I create the ecdh key
    When I create the ethereum key
    When I create the reflow key
    When I create the schnorr key
    When I create the bitcoin key
    When I create the eddsa key
    When I create the bbs key
    When I create the pvss key
    
    Then print the 'keyring'`;

    const { result } = await zencode_exec(CONTRACT);
    return JSON.stringify(JSON.parse(result), null, 2);
}