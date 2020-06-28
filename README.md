# onedrive-to-gsc

Transfer files from Microsoft OneDrive to Google Cloud Storage.

## Audience

People who wants to transfer files from Microsoft OneDrive to Google Cloud Storage

## The Need

OneDrive gives free storage for a limited time, for example if you buy a new Samsung phone, OneDrive will give you additional 100GB free storage for 2 years. And Samsung Gallery backups your Camera photos to OneDrive. For 2 years, everything is awesome with that 100 GB free storage. But when the free storage expires, you are left with only 15 GB storage, Samsung Gallery and Microsoft bombards you with the alerts to upgrade your account.

You are left with 3 choices:
- upgrade your account,
- delete your files,
- transfer your files to another storage option

I wanted to transfer my files to Google Cloud Storage, because it is cheap and accessible for archival needs.

## How to Configure

You should provide necessary data as environment variables. You can provide environment variables in a `.env` file.

- Copy `.env.example` to `.env`
- Fill the variables in `.env`

### Explainations of Environment Variables
###### ONE_DRIVE_ACCESS_TOKEN
Access token to be able to access OneDrive API. You can get it by following:

- visit [Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer/preview),
- Sign in to your Microsoft Account from left side,
- There will be a tab called `Access Token` , click that tab, your access token will appear.

Simply copy that token and past it to `.env` file as `ONE_DRIVE_ACCESS_TOKEN` variable.

###### BUCKET_NAME

Name of the Google Cloud Storage bucket. Make sure that there is a bucket of that name, if not, go to Google Cloud Console and create a bucket of that name.

###### DRIVE_ID

Id of your OneDrive drive. You can get it by following:

- go to [Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer/preview) and sign in,
- request `https://graph.microsoft.com/v1.0/me/drives`,
- your drive id will appear in response as `response.value.id`

###### ONE_DRIVE_FOLDER_RELATIVE_PATH

Relative path of folder that has your files. For example if you want to transfer files which are located in `OneDrive->Personal Files->Photos->Exciting Day`, then you should provide `ONE_DRIVE_FOLDER_RELATIVE_PATH=Personal Files/Photos/Exciting Day` as environment variable.
## How to Run

- `npm run build`
- `npm run start`