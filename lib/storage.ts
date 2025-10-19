import { Storage } from '@google-cloud/storage'

let storage: Storage | null = null

export function getStorage() {
  if (storage) return storage

  const projectId = process.env.GCP_PROJECT_ID
  const serviceAccountKey = process.env.GCP_SERVICE_ACCOUNT_KEY

  if (!projectId || !serviceAccountKey) {
    console.warn('GCP credentials not configured. File upload will be disabled.')
    return null
  }

  try {
    const credentials = JSON.parse(
      Buffer.from(serviceAccountKey, 'base64').toString('utf-8')
    )

    storage = new Storage({
      projectId,
      credentials,
    })

    return storage
  } catch (error) {
    console.error('Failed to initialize Google Cloud Storage:', error)
    return null
  }
}

export async function uploadPdfToGCS(
  buffer: Buffer,
  filename: string
): Promise<string | null> {
  const storage = getStorage()
  const bucketName = process.env.GCP_BUCKET_NAME

  if (!storage || !bucketName) {
    console.warn('Storage not configured')
    return null
  }

  try {
    const bucket = storage.bucket(bucketName)
    const file = bucket.file(`resumes/${filename}`)

    await file.save(buffer, {
      metadata: {
        contentType: 'application/pdf',
      },
      public: true,
    })

    return `https://storage.googleapis.com/${bucketName}/resumes/${filename}`
  } catch (error) {
    console.error('Failed to upload to GCS:', error)
    return null
  }
}

export async function deleteFileFromGCS(filename: string): Promise<boolean> {
  const storage = getStorage()
  const bucketName = process.env.GCP_BUCKET_NAME

  if (!storage || !bucketName) {
    return false
  }

  try {
    const bucket = storage.bucket(bucketName)
    const file = bucket.file(`resumes/${filename}`)
    await file.delete()
    return true
  } catch (error) {
    console.error('Failed to delete from GCS:', error)
    return false
  }
}
