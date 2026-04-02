/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { AmplitudeAnalytics } from '../nodes/Amplitude Analytics/Amplitude Analytics.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('AmplitudeAnalytics Node', () => {
  let node: AmplitudeAnalytics;

  beforeAll(() => {
    node = new AmplitudeAnalytics();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Amplitude Analytics');
      expect(node.description.name).toBe('amplitudeanalytics');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 5 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(5);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(5);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Event Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-api-key',
        baseUrl: 'https://amplitude.com/api/2' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('trackEvent operation', () => {
    it('should track a single event successfully', async () => {
      const mockEvent = { event_type: 'test_event', user_id: '12345' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('trackEvent')
        .mockReturnValueOnce(mockEvent);
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ status: 'success' });

      const result = await executeEventOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://amplitude.com/api/2/httpapi',
        headers: { 'Content-Type': 'application/json' },
        body: {
          api_key: 'test-api-key',
          events: [mockEvent],
        },
        json: true,
      });
      expect(result).toHaveLength(1);
    });

    it('should handle trackEvent errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('trackEvent')
        .mockReturnValueOnce({});
      
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeEventOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json.error).toBe('API Error');
    });
  });

  describe('batchEvents operation', () => {
    it('should batch events successfully', async () => {
      const mockEvents = [
        { event_type: 'test1', user_id: '123' },
        { event_type: 'test2', user_id: '456' }
      ];
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('batchEvents')
        .mockReturnValueOnce(mockEvents)
        .mockReturnValueOnce(false);
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ status: 'success' });

      const result = await executeEventOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://amplitude.com/api/2/batch',
        headers: { 'Content-Type': 'application/json' },
        body: {
          api_key: 'test-api-key',
          events: mockEvents,
        },
        json: true,
      });
      expect(result).toHaveLength(1);
    });

    it('should handle batchEvents with gzip compression', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('batchEvents')
        .mockReturnValueOnce([])
        .mockReturnValueOnce(true);
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ status: 'success' });

      await executeEventOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: {
            'Content-Type': 'application/json',
            'Content-Encoding': 'gzip',
          },
        })
      );
    });
  });

  describe('identifyUser operation', () => {
    it('should identify user successfully', async () => {
      const mockIdentification = { user_id: '12345', user_properties: { name: 'Test User' } };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('identifyUser')
        .mockReturnValueOnce(mockIdentification);
      
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ status: 'success' });

      const result = await executeEventOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://amplitude.com/api/2/identify',
        headers: { 'Content-Type': 'application/json' },
        body: {
          api_key: 'test-api-key',
          identification: mockIdentification,
        },
        json: true,
      });
      expect(result).toHaveLength(1);
    });

    it('should handle identifyUser errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('identifyUser')
        .mockReturnValueOnce({});
      
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Identification failed'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeEventOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json.error).toBe('Identification failed');
    });
  });
});

describe('Cohort Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-api-key', 
        baseUrl: 'https://amplitude.com/api/2' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('getAllCohorts operation', () => {
    it('should retrieve all cohorts successfully', async () => {
      const mockResponse = { data: [{ id: '1', name: 'Test Cohort' }] };
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllCohorts');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCohortOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });

    it('should handle errors in getAllCohorts', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllCohorts');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeCohortOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('getCohort operation', () => {
    it('should get a specific cohort successfully', async () => {
      const mockResponse = { id: '123', name: 'Test Cohort' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getCohort')
        .mockReturnValueOnce('123');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCohortOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('createCohort operation', () => {
    it('should create a cohort successfully', async () => {
      const mockResponse = { id: '456', name: 'New Cohort', status: 'created' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createCohort')
        .mockReturnValueOnce('New Cohort')
        .mockReturnValueOnce({ criteria: 'test' });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCohortOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('updateCohort operation', () => {
    it('should update a cohort successfully', async () => {
      const mockResponse = { id: '789', name: 'Updated Cohort', status: 'updated' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('updateCohort')
        .mockReturnValueOnce('789')
        .mockReturnValueOnce('Updated Cohort')
        .mockReturnValueOnce({ criteria: 'updated' });
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCohortOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });

  describe('deleteCohort operation', () => {
    it('should delete a cohort successfully', async () => {
      const mockResponse = { status: 'deleted', message: 'Cohort deleted successfully' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('deleteCohort')
        .mockReturnValueOnce('999');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeCohortOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Export Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://amplitude.com/api/2' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should export events successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('exportEvents')
      .mockReturnValueOnce('20230101')
      .mockReturnValueOnce('20230131');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce({
      data: 'exported_events_data'
    });

    const result = await executeExportOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ data: 'exported_events_data' });
  });

  it('should export table successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('exportTable')
      .mockReturnValueOnce('events')
      .mockReturnValueOnce('20230101')
      .mockReturnValueOnce('20230131');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce({
      table_data: 'exported_table_data'
    });

    const result = await executeExportOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ table_data: 'exported_table_data' });
  });

  it('should request user deletion successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('requestUserDeletion')
      .mockReturnValueOnce('user1,user2,user3')
      .mockReturnValueOnce('admin@company.com');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce({
      deletion_job_id: 'job123'
    });

    const result = await executeExportOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ deletion_job_id: 'job123' });
  });

  it('should get user deletions successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getUserDeletions')
      .mockReturnValueOnce('2023-01-01')
      .mockReturnValueOnce('2023-01-31');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce({
      deletions: [{ id: 'job123', status: 'completed' }]
    });

    const result = await executeExportOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ deletions: [{ id: 'job123', status: 'completed' }] });
  });

  it('should handle errors when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('exportEvents');
    mockExecuteFunctions.continueOnFail.mockReturnValueOnce(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValueOnce(new Error('API Error'));

    const result = await executeExportOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ error: 'API Error' });
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('exportEvents');
    mockExecuteFunctions.continueOnFail.mockReturnValueOnce(false);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValueOnce(new Error('API Error'));

    await expect(executeExportOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
  });
});

describe('Taxonomy Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				baseUrl: 'https://amplitude.com/api/2'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('getAllEventTypes', () => {
		it('should get all event types successfully', async () => {
			const mockResponse = { data: { event_types: ['login', 'signup'] } };
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllEventTypes');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeTaxonomyOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://amplitude.com/api/2/taxonomy/event',
				headers: {
					'Authorization': 'Api-Key test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should handle errors when getting all event types', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllEventTypes');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeTaxonomyOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('getEventType', () => {
		it('should get specific event type successfully', async () => {
			const mockResponse = { data: { event_type: 'login', description: 'User login event' } };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getEventType')
				.mockReturnValueOnce('login');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeTaxonomyOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://amplitude.com/api/2/taxonomy/event/login',
				headers: {
					'Authorization': 'Api-Key test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});
	});

	describe('createEventType', () => {
		it('should create event type successfully', async () => {
			const mockResponse = { success: true, message: 'Event type created' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createEventType')
				.mockReturnValueOnce('new_event')
				.mockReturnValueOnce('New event description');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeTaxonomyOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://amplitude.com/api/2/taxonomy/event',
				headers: {
					'Authorization': 'Api-Key test-api-key',
					'Content-Type': 'application/json',
				},
				body: {
					event_type: 'new_event',
					description: 'New event description',
				},
				json: true,
			});
		});
	});

	describe('updateEventType', () => {
		it('should update event type successfully', async () => {
			const mockResponse = { success: true, message: 'Event type updated' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateEventType')
				.mockReturnValueOnce('login')
				.mockReturnValueOnce('Updated description');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeTaxonomyOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'PUT',
				url: 'https://amplitude.com/api/2/taxonomy/event/login',
				headers: {
					'Authorization': 'Api-Key test-api-key',
					'Content-Type': 'application/json',
				},
				body: {
					description: 'Updated description',
				},
				json: true,
			});
		});
	});

	describe('deleteEventType', () => {
		it('should delete event type successfully', async () => {
			const mockResponse = { success: true, message: 'Event type deleted' };
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteEventType')
				.mockReturnValueOnce('old_event');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeTaxonomyOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'DELETE',
				url: 'https://amplitude.com/api/2/taxonomy/event/old_event',
				headers: {
					'Authorization': 'Api-Key test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});
	});

	describe('getAllEventProperties', () => {
		it('should get all event properties successfully', async () => {
			const mockResponse = { data: { event_properties: ['prop1', 'prop2'] } };
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllEventProperties');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeTaxonomyOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://amplitude.com/api/2/taxonomy/event-property',
				headers: {
					'Authorization': 'Api-Key test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});
	});

	describe('getAllUserProperties', () => {
		it('should get all user properties successfully', async () => {
			const mockResponse = { data: { user_properties: ['age', 'location'] } };
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getAllUserProperties');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeTaxonomyOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://amplitude.com/api/2/taxonomy/user-property',
				headers: {
					'Authorization': 'Api-Key test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});
	});
});

describe('Chart Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://amplitude.com/api/2',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('getChartData operation', () => {
		it('should successfully query chart data', async () => {
			const chartData = { data: 'test-chart-data' };
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				if (param === 'operation') return 'getChartData';
				if (param === 'chartId') return 'chart123';
				return '';
			});
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(chartData);

			const result = await executeChartOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: chartData, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://amplitude.com/api/2/chart/chart123/query',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should handle errors when querying chart data', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				if (param === 'operation') return 'getChartData';
				if (param === 'chartId') return 'invalid-chart';
				return '';
			});
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Chart not found'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeChartOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'Chart not found' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('createChart operation', () => {
		it('should successfully create a chart', async () => {
			const chartDefinition = { name: 'Test Chart', type: 'line' };
			const createdChart = { id: 'chart123', ...chartDefinition };
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				if (param === 'operation') return 'createChart';
				if (param === 'chartDefinition') return chartDefinition;
				return '';
			});
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(createdChart);

			const result = await executeChartOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: createdChart, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://amplitude.com/api/2/chart',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				body: chartDefinition,
				json: true,
			});
		});
	});

	describe('updateChart operation', () => {
		it('should successfully update a chart', async () => {
			const chartDefinition = { name: 'Updated Chart', type: 'bar' };
			const updatedChart = { id: 'chart123', ...chartDefinition };
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				if (param === 'operation') return 'updateChart';
				if (param === 'chartId') return 'chart123';
				if (param === 'chartDefinition') return chartDefinition;
				return '';
			});
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(updatedChart);

			const result = await executeChartOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: updatedChart, pairedItem: { item: 0 } }]);
		});
	});

	describe('deleteChart operation', () => {
		it('should successfully delete a chart', async () => {
			const deleteResponse = { success: true };
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				if (param === 'operation') return 'deleteChart';
				if (param === 'chartId') return 'chart123';
				return '';
			});
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(deleteResponse);

			const result = await executeChartOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: deleteResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('getAllDashboards operation', () => {
		it('should successfully get all dashboards', async () => {
			const dashboards = { dashboards: [{ id: 'dash1' }, { id: 'dash2' }] };
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				if (param === 'operation') return 'getAllDashboards';
				return '';
			});
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(dashboards);

			const result = await executeChartOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: dashboards, pairedItem: { item: 0 } }]);
		});
	});

	describe('getDashboard operation', () => {
		it('should successfully get a specific dashboard', async () => {
			const dashboard = { id: 'dash123', name: 'Test Dashboard' };
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				if (param === 'operation') return 'getDashboard';
				if (param === 'dashboardId') return 'dash123';
				return '';
			});
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(dashboard);

			const result = await executeChartOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: dashboard, pairedItem: { item: 0 } }]);
		});
	});
});
});
