const ocpLifeCycleStatuses = {
  data: {
    data: [
      {
        name: 'OpenShift Container Platform 4',
        show_last_minor_release: false,
        is_layered_product: false,
        link: 'https://access.redhat.com/support/policy/updates/openshift/',
        versions: [
          {
            name: '4.6 EUS',
            type: 'Full Support',
            last_minor_release: null,
            extra_header_value: null,
            phases: [
              {
                name: 'General availability',
                date: '2020-10-27T00:00:00.000Z',
                date_format: 'date',
              },
              {
                name: 'Full support',
                date: 'Release of 4.7 + 1 month',
                date_format: 'string',
              },
              {
                name: 'Maintenance support',
                date: 'Release of 4.7 + 14 months',
                date_format: 'string',
              },
            ],
          },
          {
            name: '4.6',
            type: 'Full Support',
            last_minor_release: null,
            extra_header_value: null,
            phases: [
              {
                name: 'General availability',
                date: '2020-10-27T00:00:00.000Z',
                date_format: 'date',
              },
              {
                name: 'Full support',
                date: 'Release of 4.7 + 1 month',
                date_format: 'string',
              },
              {
                name: 'Maintenance support',
                date: 'Release of 4.9',
                date_format: 'string',
              },
            ],
          },
          {
            name: '4.5',
            type: 'Maintenance Support',
            last_minor_release: null,
            extra_header_value: null,
            phases: [
              {
                name: 'General availability',
                date: '2020-07-13T00:00:00.000Z',
                date_format: 'date',
              },
              {
                name: 'Full support',
                date: '2020-11-27T00:00:00.000Z',
                date_format: 'date',
              },
              {
                name: 'Maintenance support',
                date: 'Release of 4.8',
                date_format: 'string',
              },
            ],
          },
          {
            name: '4.4',
            type: 'Maintenance Support',
            last_minor_release: null,
            extra_header_value: null,
            phases: [
              {
                name: 'General availability',
                date: '2020-05-05T00:00:00.000Z',
                date_format: 'date',
              },
              {
                name: 'Full support',
                date: '2020-08-13T00:00:00.000Z',
                date_format: 'date',
              },
              {
                name: 'Maintenance support',
                date: 'Release of 4.7',
                date_format: 'string',
              },
            ],
          },
          {
            name: '4.3',
            type: 'End of life',
            last_minor_release: null,
            extra_header_value: null,
            phases: [
              {
                name: 'General availability',
                date: '2020-01-23T00:00:00.000Z',
                date_format: 'date',
              },
              {
                name: 'Full support',
                date: '2020-06-05T00:00:00.000Z',
                date_format: 'date',
              },
              {
                name: 'Maintenance support',
                date: '2020-10-27T00:00:00.000Z',
                date_format: 'date',
              },
            ],
          },
          {
            name: '4.2',
            type: 'End of life',
            last_minor_release: null,
            extra_header_value: null,
            phases: [
              {
                name: 'General availability',
                date: '2019-10-16T00:00:00.000Z',
                date_format: 'date',
              },
              {
                name: 'Full support',
                date: '2020-02-23T00:00:00.000Z',
                date_format: 'date',
              },
              {
                name: 'Maintenance support',
                date: '2020-07-13T00:00:00.000Z',
                date_format: 'date',
              },
            ],
          },
          {
            name: '4.1',
            type: 'End of life',
            last_minor_release: null,
            extra_header_value: null,
            phases: [
              {
                name: 'General availability',
                date: '2019-06-04T00:00:00.000Z',
                date_format: 'date',
              },
              {
                name: 'Full support',
                date: '2019-11-16T00:00:00.000Z',
                date_format: 'date',
              },
              {
                name: 'Maintenance support',
                date: '2020-05-05T00:00:00.000Z',
                date_format: 'date',
              },
            ],
          },
        ],
        all_phases: [
          {
            name: 'General availability',
            display_name: 'General availability',
          },
          {
            name: 'Full support',
            display_name: 'Full support ends',
          },
          {
            name: 'Maintenance support',
            display_name: 'Maintenance support ends',
          },
        ],
      },
    ],
  },
};

export default ocpLifeCycleStatuses;
