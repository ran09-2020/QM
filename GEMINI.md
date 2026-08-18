# File Creation Rules

- NEVER create `.zip` files anywhere in the workspace unless the user EXPLICITLY requests it. Creating zip files can cause API keys to leak if committed to git.
- If asked to "build for FTP" or deploy, do NOT automatically compress the build output into a zip file. Simply build the folder (e.g. `dist/`) and inform the user that the folder is ready for them to upload.
