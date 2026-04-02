import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class AmplitudeAnalyticsApi implements ICredentialType {
	name = 'amplitudeAnalyticsApi';

	displayName = 'Amplitude Analytics API';

	documentationUrl = 'https://docs.amplitude.com/analytics/apis/';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'API Key for most operations. Obtained from Amplitude dashboard under Settings > Projects > [Project Name] > General.',
			required: true,
		},
		{
			displayName: 'Secret Key',
			name: 'secretKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Secret Key for sensitive operations. Obtained from Amplitude dashboard under Settings > Projects > [Project Name] > General.',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://amplitude.com/api/2',
			description: 'The base URL for the Amplitude Analytics API',
			required: true,
		},
	];
}