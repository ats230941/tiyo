export default {
  name: 'history',
  title: 'History / Oral history',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', title: 'Title' },
    { name: 'body', type: 'array', of: [{ type: 'block' }], title: 'Body' },
    { name: 'audio', type: 'file', title: 'Audio (optional)' },
    { name: 'permissionNote', type: 'text', title: 'Permissions / Consent notes' }
  ]
}
