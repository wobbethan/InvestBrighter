const baseRoute =
  process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000'

export const server = `${baseRoute}/api/v2`
export const backend_url = `${baseRoute}http://localhost:8000/`
export const frontend_uploads = 'http://localhost:3000/uploads'
