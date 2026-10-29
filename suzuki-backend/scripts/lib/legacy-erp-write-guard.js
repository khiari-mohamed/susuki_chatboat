function assertLegacyErpWritesEnabled() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Legacy ERP-data scripts are disabled in production. Use the configured ERP sync service.');
  }
  if (process.env.ALLOW_LEGACY_ERP_WRITES !== 'true') {
    throw new Error('Legacy ERP-data writes are disabled. Set ALLOW_LEGACY_ERP_WRITES=true for an explicit non-production import.');
  }
}

module.exports = { assertLegacyErpWritesEnabled };