export default {
  name: 'prayer',
  title: 'Prayer Request',
  type: 'document',
  fields: [
    { name: 'name', type: 'string', title: 'Name' },
    { name: 'text', type: 'text', title: 'Request' },
    { name: 'approved', type: 'boolean', title: 'Approved', initialValue: false },
    { name: 'createdAt', type: 'datetime', title: 'Created at', initialValue: (new Date()).toISOString() }
  ]
}
