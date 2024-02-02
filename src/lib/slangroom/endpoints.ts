export const updateProfile = 'api/collections/users/records/'
export const authWithPassword = 'api/collections/users/auth-with-password/'
export const servicesByOrganization = ['api/collections/services/records?filters=(organization="', '")']
export const organizationAuthorizations = ['api/collections/orgAuthorizations/records?filter=(user="',
		'")&&expand=organization&&fields=expand.organization.name,expand.organization.id']
export const webauthnCredentials = ['api/collections/webauthnCredentials/records?filter=(user="', '")']
export const webauthnSessions = ['api/collections/sessionDataWebauthn/records?filter=(user="', '")']
export const showProfile = ['api/collections/users/records/', '']
export const fetchTemplates = 'api/collections/templates/records'