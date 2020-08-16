# Changelog

All notable changes to this project will be documented in this file.

## [0.0.5] - 2020-08-16

### Changed

- Forks now return another Ira instance

### Fixed

- All `.blob, .text, .json` responses are provided now

## [0.0.4-beta0.2] - 2020-08-16

### Added

- Minified version - really added, comments kept : )
- **Now you can .extend.extend.extend.... Ira's:** Keep in mind that from a `.extend` function prop `._config` will return config provided on function call.

### Changed

- Custom function export has been replaced

### Fixed

- Removed string version of Blob if it's text type or type's undefined

## [0.0.4-beta0.1] - 2020-08-15

### Added

- You can now parse blob to base64 - `ira.blobToBase64`

### Fixed

- Now user wont get utf-8 version of binary inside data.blob

### Removed

- `.reset() method` , you can use `ira.config({})`

## [0.0.4] - 2020-08-13

### Added

- Params can be passed from request: `ira.get("/", { params: { } })`
- This log was created

### Changed

- Root const's were changed to var
