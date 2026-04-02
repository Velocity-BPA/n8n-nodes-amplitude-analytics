# n8n-nodes-amplitude-analytics

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides seamless integration with Amplitude Analytics platform, offering 5 core resources for comprehensive product analytics and user behavior tracking. It enables automated event tracking, cohort management, data export, taxonomy configuration, and chart data retrieval for data-driven decision making.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Analytics](https://img.shields.io/badge/Analytics-Amplitude-orange)
![Product Analytics](https://img.shields.io/badge/Product-Analytics-green)

## Features

- **Event Tracking** - Send, track, and manage user events with custom properties and metadata
- **Cohort Management** - Create, update, and retrieve user cohorts for behavioral analysis
- **Data Export** - Export raw event data and user segments for external analysis
- **Taxonomy Control** - Manage event types, properties, and data structure definitions
- **Chart Analytics** - Retrieve chart data and visualization metrics programmatically
- **Real-time Processing** - Stream events and data with minimal latency
- **Batch Operations** - Handle bulk data operations efficiently
- **Custom Properties** - Support for complex event properties and user attributes

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-amplitude-analytics`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-amplitude-analytics
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-amplitude-analytics.git
cd n8n-nodes-amplitude-analytics
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-amplitude-analytics
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Amplitude Analytics API key from project settings | Yes |
| Secret Key | Project secret key for write operations | Yes |
| Server Zone | Data residency zone (US or EU) | No |

## Resources & Operations

### 1. Event

| Operation | Description |
|-----------|-------------|
| Send Event | Track single or batch user events with properties |
| Upload Events | Bulk upload events from external sources |
| Get Event | Retrieve event data and metadata |
| List Events | Get all events for a project or user |
| Delete Event | Remove events from project data |

### 2. Cohort

| Operation | Description |
|-----------|-------------|
| Create Cohort | Define new user cohort based on behavioral criteria |
| Update Cohort | Modify existing cohort definitions and membership |
| Get Cohort | Retrieve cohort details and user lists |
| List Cohorts | Get all cohorts for the project |
| Delete Cohort | Remove cohort and associated data |
| Download Cohort | Export cohort user data as CSV or JSON |

### 3. Export

| Operation | Description |
|-----------|-------------|
| Request Export | Initiate data export job for events or users |
| Get Export Status | Check progress of ongoing export operations |
| Download Export | Retrieve completed export files |
| List Exports | View all export jobs and their status |
| Cancel Export | Stop running export operations |

### 4. Taxonomy

| Operation | Description |
|-----------|-------------|
| Get Event Types | Retrieve all defined event types and schemas |
| Update Event Type | Modify event type definitions and validation rules |
| Get Properties | List all event and user properties |
| Update Property | Modify property definitions and data types |
| Validate Schema | Check event data against taxonomy rules |

### 5. Chart

| Operation | Description |
|-----------|-------------|
| Get Chart Data | Retrieve data for existing charts and dashboards |
| Create Chart | Build new chart configurations programmatically |
| Update Chart | Modify chart parameters and visualization settings |
| List Charts | Get all charts and their configurations |
| Delete Chart | Remove charts from project dashboards |

## Usage Examples

```javascript
// Track user signup event
{
  "user_id": "user_12345",
  "event_type": "user_signup",
  "event_properties": {
    "signup_method": "email",
    "plan_type": "premium",
    "referral_source": "google"
  },
  "user_properties": {
    "email": "user@example.com",
    "age": 28,
    "location": "San Francisco"
  }
}
```

```javascript
// Create behavioral cohort
{
  "name": "Active Premium Users",
  "definition": {
    "filters": [
      {
        "event_type": "subscription_active",
        "properties": {
          "plan_type": "premium"
        }
      }
    ],
    "time_range": "last_30_days"
  }
}
```

```javascript
// Export user data
{
  "export_type": "users",
  "date_range": {
    "start": "2024-01-01",
    "end": "2024-01-31"
  },
  "format": "json",
  "filters": {
    "cohort_id": "cohort_67890"
  }
}
```

```javascript
// Get funnel chart data
{
  "chart_type": "funnel",
  "events": [
    "page_view",
    "add_to_cart",
    "purchase_complete"
  ],
  "date_range": "last_7_days",
  "group_by": ["device_type"]
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key and secret in project settings |
| Rate Limit Exceeded | Too many requests sent in short time period | Implement exponential backoff and retry logic |
| Event Validation Error | Event data doesn't match taxonomy requirements | Check event schema and required properties |
| Export Job Failed | Data export operation encountered errors | Review export parameters and data size limits |
| Cohort Not Found | Referenced cohort ID doesn't exist | Verify cohort exists and user has access permissions |
| Invalid Date Range | Date parameters are malformed or out of bounds | Use ISO 8601 format and valid date ranges |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-amplitude-analytics/issues)
- **Amplitude Documentation**: [Amplitude Developer Docs](https://developers.amplitude.com/)
- **Analytics Community**: [Amplitude Community](https://community.amplitude.com/)