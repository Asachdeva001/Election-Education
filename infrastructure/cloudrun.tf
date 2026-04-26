# Backend Service Cloud Run Placeholder
resource "google_cloud_run_v2_service" "backend_api" {
  name     = "election-backend-api"
  location = var.region
  project  = var.project_id

  template {
    containers {
      # Using a placeholder image until the real backend is built and pushed to Artifact Registry
      image = "us-docker.pkg.dev/cloudrun/container/hello"
      
      env {
        name  = "NODE_ENV"
        value = "production"
      }
      
      env {
        name  = "DB_HOST"
        value = google_sql_database_instance.main.public_ip_address
      }
      
      # Additional environment variables for APIs would go here
    }
  }

  depends_on = [
    google_project_service.enabled_apis,
    google_sql_database_instance.main
  ]
}

# Allow unauthenticated access to the backend API
resource "google_cloud_run_service_iam_member" "backend_public_access" {
  location = google_cloud_run_v2_service.backend_api.location
  project  = google_cloud_run_v2_service.backend_api.project
  service  = google_cloud_run_v2_service.backend_api.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
