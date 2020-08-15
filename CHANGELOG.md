# Changelog
All notable changes to this project will be documented in this file.

## [0.0.4-beta0.1] - 2020-08-15
### Added
- You can now parse blob to base64 - `ira.blobToBase64`

### Removed
- `.reset() method` , you can use `ira.config({})`

### Fixed
- Now user wont get utf-8 version of binary inside data.blob

## [0.0.4] - 2020-08-13
### Added
- Params can be passed from request: `ira.get("/", { params: { } })`
- This log was created

### Changed
- Root const's were changed to var

