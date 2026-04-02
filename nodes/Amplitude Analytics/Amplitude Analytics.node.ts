/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-amplitudeanalytics/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class AmplitudeAnalytics implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Amplitude Analytics',
    name: 'amplitudeanalytics',
    icon: 'file:amplitudeanalytics.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Amplitude Analytics API',
    defaults: {
      name: 'Amplitude Analytics',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'amplitudeanalyticsApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Event',
            value: 'event',
          },
          {
            name: 'Cohort',
            value: 'cohort',
          },
          {
            name: 'Export',
            value: 'export',
          },
          {
            name: 'Taxonomy',
            value: 'taxonomy',
          },
          {
            name: 'Chart',
            value: 'chart',
          }
        ],
        default: 'event',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['event'] } },
  options: [
    { 
      name: 'Track Event', 
      value: 'trackEvent', 
      description: 'Send events to Amplitude for tracking', 
      action: 'Track event' 
    },
    { 
      name: 'Batch Events', 
      value: 'batchEvents', 
      description: 'Send multiple events in a single request', 
      action: 'Batch events' 
    },
    { 
      name: 'Identify User', 
      value: 'identifyUser', 
      description: 'Set or update user properties', 
      action: 'Identify user' 
    }
  ],
  default: 'trackEvent',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['cohort'] } },
  options: [
    { name: 'Get All Cohorts', value: 'getAllCohorts', description: 'Retrieve all cohorts for a project', action: 'Get all cohorts' },
    { name: 'Get Cohort', value: 'getCohort', description: 'Get a specific cohort by ID', action: 'Get a cohort' },
    { name: 'Create Cohort', value: 'createCohort', description: 'Create a new cohort', action: 'Create a cohort' },
    { name: 'Update Cohort', value: 'updateCohort', description: 'Update an existing cohort', action: 'Update a cohort' },
    { name: 'Delete Cohort', value: 'deleteCohort', description: 'Delete a cohort', action: 'Delete a cohort' }
  ],
  default: 'getAllCohorts',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['export'] } },
  options: [
    { name: 'Export Events', value: 'exportEvents', description: 'Export event data for a date range', action: 'Export events' },
    { name: 'Export Table', value: 'exportTable', description: 'Export specific data table', action: 'Export table' },
    { name: 'Request User Deletion', value: 'requestUserDeletion', description: 'Request deletion of user data for GDPR/CCPA compliance', action: 'Request user deletion' },
    { name: 'Get User Deletions', value: 'getUserDeletions', description: 'Get status of user deletion requests', action: 'Get user deletions' }
  ],
  default: 'exportEvents',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['taxonomy'] } },
	options: [
		{
			name: 'Get All Event Types',
			value: 'getAllEventTypes',
			description: 'Get all event types in the project',
			action: 'Get all event types',
		},
		{
			name: 'Get Event Type',
			value: 'getEventType',
			description: 'Get details of a specific event type',
			action: 'Get event type',
		},
		{
			name: 'Create Event Type',
			value: 'createEventType',
			description: 'Create a new event type',
			action: 'Create event type',
		},
		{
			name: 'Update Event Type',
			value: 'updateEventType',
			description: 'Update event type details',
			action: 'Update event type',
		},
		{
			name: 'Delete Event Type',
			value: 'deleteEventType',
			description: 'Delete an event type',
			action: 'Delete event type',
		},
		{
			name: 'Get All Event Properties',
			value: 'getAllEventProperties',
			description: 'Get all event properties',
			action: 'Get all event properties',
		},
		{
			name: 'Get All User Properties',
			value: 'getAllUserProperties',
			description: 'Get all user properties',
			action: 'Get all user properties',
		},
	],
	default: 'getAllEventTypes',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['chart'],
		},
	},
	options: [
		{
			name: 'Create Chart',
			value: 'createChart',
			description: 'Create a new analytics chart',
			action: 'Create chart',
		},
		{
			name: 'Delete Chart',
			value: 'deleteChart',
			description: 'Delete an existing chart',
			action: 'Delete chart',
		},
		{
			name: 'Get All Dashboards',
			value: 'getAllDashboards',
			description: 'Get all dashboards',
			action: 'Get all dashboards',
		},
		{
			name: 'Get Chart Data',
			value: 'getChartData',
			description: 'Query chart data and results',
			action: 'Get chart data',
		},
		{
			name: 'Get Dashboard',
			value: 'getDashboard',
			description: 'Get specific dashboard by ID',
			action: 'Get dashboard',
		},
		{
			name: 'Update Chart',
			value: 'updateChart',
			description: 'Update chart configuration',
			action: 'Update chart',
		},
	],
	default: 'getChartData',
},
{
  displayName: 'Events',
  name: 'events',
  type: 'json',
  required: true,
  displayOptions: { 
    show: { 
      resource: ['event'], 
      operation: ['trackEvent'] 
    } 
  },
  default: '{}',
  description: 'Event data to track in JSON format with required fields',
},
{
  displayName: 'Events Array',
  name: 'eventsArray',
  type: 'json',
  required: true,
  displayOptions: { 
    show: { 
      resource: ['event'], 
      operation: ['batchEvents'] 
    } 
  },
  default: '[]',
  description: 'Array of events to send in batch request',
},
{
  displayName: 'Use Gzip Compression',
  name: 'useGzip',
  type: 'boolean',
  displayOptions: { 
    show: { 
      resource: ['event'], 
      operation: ['batchEvents'] 
    } 
  },
  default: false,
  description: 'Whether to use gzip compression for large payloads',
},
{
  displayName: 'Identification',
  name: 'identification',
  type: 'json',
  required: true,
  displayOptions: { 
    show: { 
      resource: ['event'], 
      operation: ['identifyUser'] 
    } 
  },
  default: '{}',
  description: 'User identification data in JSON format',
},
{
  displayName: 'Cohort ID',
  name: 'cohort_id',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['cohort'], operation: ['getCohort', 'updateCohort', 'deleteCohort'] } },
  default: '',
  description: 'The ID of the cohort to retrieve, update, or delete',
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['cohort'], operation: ['createCohort', 'updateCohort'] } },
  default: '',
  description: 'The name of the cohort',
},
{
  displayName: 'Definition',
  name: 'definition',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['cohort'], operation: ['createCohort', 'updateCohort'] } },
  default: '{}',
  description: 'The cohort definition as a JSON object containing the criteria for user inclusion',
},
{
  displayName: 'Start Date',
  name: 'start',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['export'],
      operation: ['exportEvents', 'exportTable']
    }
  },
  default: '',
  description: 'Start date in YYYYMMDD format'
},
{
  displayName: 'End Date',
  name: 'end',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['export'],
      operation: ['exportEvents', 'exportTable']
    }
  },
  default: '',
  description: 'End date in YYYYMMDD format'
},
{
  displayName: 'Table',
  name: 'table',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['export'],
      operation: ['exportTable']
    }
  },
  default: '',
  description: 'Table name to export'
},
{
  displayName: 'User IDs',
  name: 'user_ids',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['export'],
      operation: ['requestUserDeletion']
    }
  },
  default: '',
  description: 'Comma-separated list of user IDs to delete'
},
{
  displayName: 'Requester',
  name: 'requester',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['export'],
      operation: ['requestUserDeletion']
    }
  },
  default: '',
  description: 'Email address of the requester'
},
{
  displayName: 'Start Day',
  name: 'start_day',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['export'],
      operation: ['getUserDeletions']
    }
  },
  default: '',
  description: 'Start day in YYYY-MM-DD format'
},
{
  displayName: 'End Day',
  name: 'end_day',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['export'],
      operation: ['getUserDeletions']
    }
  },
  default: '',
  description: 'End day in YYYY-MM-DD format'
},
{
	displayName: 'Event Type',
	name: 'eventType',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['taxonomy'],
			operation: ['getEventType', 'updateEventType', 'deleteEventType'],
		},
	},
	default: '',
	description: 'The name of the event type',
},
{
	displayName: 'Event Type',
	name: 'eventType',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['taxonomy'],
			operation: ['createEventType'],
		},
	},
	default: '',
	description: 'The name of the event type to create',
},
{
	displayName: 'Description',
	name: 'description',
	type: 'string',
	required: false,
	displayOptions: {
		show: {
			resource: ['taxonomy'],
			operation: ['createEventType', 'updateEventType'],
		},
	},
	default: '',
	description: 'Description of the event type',
},
{
	displayName: 'Chart ID',
	name: 'chartId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['chart'],
			operation: ['getChartData'],
		},
	},
	default: '',
	description: 'The ID of the chart to query',
},
{
	displayName: 'Chart Definition',
	name: 'chartDefinition',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['chart'],
			operation: ['createChart'],
		},
	},
	default: '{}',
	description: 'The chart configuration and definition in JSON format',
},
{
	displayName: 'Chart ID',
	name: 'chartId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['chart'],
			operation: ['updateChart'],
		},
	},
	default: '',
	description: 'The ID of the chart to update',
},
{
	displayName: 'Chart Definition',
	name: 'chartDefinition',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['chart'],
			operation: ['updateChart'],
		},
	},
	default: '{}',
	description: 'The updated chart configuration and definition in JSON format',
},
{
	displayName: 'Chart ID',
	name: 'chartId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['chart'],
			operation: ['deleteChart'],
		},
	},
	default: '',
	description: 'The ID of the chart to delete',
},
{
	displayName: 'Dashboard ID',
	name: 'dashboardId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['chart'],
			operation: ['getDashboard'],
		},
	},
	default: '',
	description: 'The ID of the dashboard to retrieve',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'event':
        return [await executeEventOperations.call(this, items)];
      case 'cohort':
        return [await executeCohortOperations.call(this, items)];
      case 'export':
        return [await executeExportOperations.call(this, items)];
      case 'taxonomy':
        return [await executeTaxonomyOperations.call(this, items)];
      case 'chart':
        return [await executeChartOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeEventOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('amplitudeanalyticsApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'trackEvent': {
          const events = this.getNodeParameter('events', i) as any;
          const options: any = {
            method: 'POST',
            url: 'https://amplitude.com/api/2/httpapi',
            headers: {
              'Content-Type': 'application/json',
            },
            body: {
              api_key: credentials.apiKey,
              events: Array.isArray(events) ? events : [events],
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'batchEvents': {
          const eventsArray = this.getNodeParameter('eventsArray', i) as any;
          const useGzip = this.getNodeParameter('useGzip', i) as boolean;
          
          const options: any = {
            method: 'POST',
            url: 'https://amplitude.com/api/2/batch',
            headers: {
              'Content-Type': 'application/json',
            },
            body: {
              api_key: credentials.apiKey,
              events: eventsArray,
            },
            json: true,
          };

          if (useGzip) {
            options.headers['Content-Encoding'] = 'gzip';
          }

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'identifyUser': {
          const identification = this.getNodeParameter('identification', i) as any;
          const options: any = {
            method: 'POST',
            url: 'https://amplitude.com/api/2/identify',
            headers: {
              'Content-Type': 'application/json',
            },
            body: {
              api_key: credentials.apiKey,
              identification: identification,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), 'Unknown operation: ' + operation);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }
  return returnData;
}

async function executeCohortOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('amplitudeanalyticsApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getAllCohorts': {
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl || 'https://amplitude.com/api/2'}/cohorts`,
            headers: {
              'Authorization': `Api-Key ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getCohort': {
          const cohortId = this.getNodeParameter('cohort_id', i) as string;
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl || 'https://amplitude.com/api/2'}/cohorts/${cohortId}`,
            headers: {
              'Authorization': `Api-Key ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createCohort': {
          const name = this.getNodeParameter('name', i) as string;
          const definition = this.getNodeParameter('definition', i) as object;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl || 'https://amplitude.com/api/2'}/cohorts`,
            headers: {
              'Authorization': `Api-Key ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              name,
              definition,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updateCohort': {
          const cohortId = this.getNodeParameter('cohort_id', i) as string;
          const name = this.getNodeParameter('name', i) as string;
          const definition = this.getNodeParameter('definition', i) as object;
          
          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl || 'https://amplitude.com/api/2'}/cohorts/${cohortId}`,
            headers: {
              'Authorization': `Api-Key ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              name,
              definition,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteCohort': {
          const cohortId = this.getNodeParameter('cohort_id', i) as string;
          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl || 'https://amplitude.com/api/2'}/cohorts/${cohortId}`,
            headers: {
              'Authorization': `Api-Key ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeExportOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('amplitudeanalyticsApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'exportEvents': {
          const start = this.getNodeParameter('start', i) as string;
          const end = this.getNodeParameter('end', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/export`,
            qs: {
              start,
              end
            },
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`
            },
            json: true
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'exportTable': {
          const table = this.getNodeParameter('table', i) as string;
          const start = this.getNodeParameter('start', i) as string;
          const end = this.getNodeParameter('end', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/export/T/${table}`,
            qs: {
              start,
              end
            },
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`
            },
            json: true
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'requestUserDeletion': {
          const userIds = this.getNodeParameter('user_ids', i) as string;
          const requester = this.getNodeParameter('requester', i) as string;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/deletions/users`,
            body: {
              user_ids: userIds.split(',').map(id => id.trim()),
              requester
            },
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getUserDeletions': {
          const startDay = this.getNodeParameter('start_day', i) as string;
          const endDay = this.getNodeParameter('end_day', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/deletions/users`,
            qs: {
              start_day: startDay,
              end_day: endDay
            },
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`
            },
            json: true
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({
        json: result,
        pairedItem: { item: i }
      });
      
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        throw error;
      }
    }
  }
  
  return returnData;
}

async function executeTaxonomyOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('amplitudeanalyticsApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getAllEventTypes': {
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/taxonomy/event`,
						headers: {
							'Authorization': `Api-Key ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getEventType': {
					const eventType = this.getNodeParameter('eventType', i) as string;
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/taxonomy/event/${encodeURIComponent(eventType)}`,
						headers: {
							'Authorization': `Api-Key ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createEventType': {
					const eventType = this.getNodeParameter('eventType', i) as string;
					const description = this.getNodeParameter('description', i) as string;
					
					const body: any = {
						event_type: eventType,
					};
					
					if (description) {
						body.description = description;
					}

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/taxonomy/event`,
						headers: {
							'Authorization': `Api-Key ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateEventType': {
					const eventType = this.getNodeParameter('eventType', i) as string;
					const description = this.getNodeParameter('description', i) as string;
					
					const body: any = {};
					
					if (description) {
						body.description = description;
					}

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/taxonomy/event/${encodeURIComponent(eventType)}`,
						headers: {
							'Authorization': `Api-Key ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deleteEventType': {
					const eventType = this.getNodeParameter('eventType', i) as string;
					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/taxonomy/event/${encodeURIComponent(eventType)}`,
						headers: {
							'Authorization': `Api-Key ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAllEventProperties': {
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/taxonomy/event-property`,
						headers: {
							'Authorization': `Api-Key ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAllUserProperties': {
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/taxonomy/user-property`,
						headers: {
							'Authorization': `Api-Key ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeChartOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('amplitudeanalyticsApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getChartData': {
					const chartId = this.getNodeParameter('chartId', i) as string;
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl || 'https://amplitude.com/api/2'}/chart/${chartId}/query`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createChart': {
					const chartDefinition = this.getNodeParameter('chartDefinition', i) as any;
					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl || 'https://amplitude.com/api/2'}/chart`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: chartDefinition,
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateChart': {
					const chartId = this.getNodeParameter('chartId', i) as string;
					const chartDefinition = this.getNodeParameter('chartDefinition', i) as any;
					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl || 'https://amplitude.com/api/2'}/chart/${chartId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: chartDefinition,
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deleteChart': {
					const chartId = this.getNodeParameter('chartId', i) as string;
					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl || 'https://amplitude.com/api/2'}/chart/${chartId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAllDashboards': {
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl || 'https://amplitude.com/api/2'}/dashboard`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getDashboard': {
					const dashboardId = this.getNodeParameter('dashboardId', i) as string;
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl || 'https://amplitude.com/api/2'}/dashboard/${dashboardId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}
