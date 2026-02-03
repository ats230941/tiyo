export default {
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', title: 'Title' },
    { name: 'description', type: 'text', title: 'Description' },
    { name: 'date', type: 'datetime', title: 'Date' },
    { name: 'location', type: 'string', title: 'Location' }
  ]
}
