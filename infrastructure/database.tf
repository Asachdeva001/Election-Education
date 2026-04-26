# Cloud Firestore (Native Mode)
resource "google_firestore_database" "default" {
  project     = var.project_id
  name        = "(default)"
  location_id = "nam5" # Multi-region US
  type        = "FIRESTORE_NATIVE"

  depends_on = [google_project_service.enabled_apis]
}

# Cloud SQL (PostgreSQL)
resource "google_sql_database_instance" "main" {
  name             = "election-db-instance"
  database_version = "POSTGRES_15"
  region           = var.region
  project          = var.project_id

  settings {
    tier = "db-f1-micro" # Use smallest tier for dev/setup

    ip_configuration {
      ipv4_enabled    = true
      # No require_ssl for dev simplicity, but should be enabled in prod
    }
  }

  depends_on = [google_project_service.enabled_apis]
}

resource "google_sql_database" "election_data" {
  name     = "election_data"
  instance = google_sql_database_instance.main.name
  project  = var.project_id
}

resource "google_sql_user" "admin" {
  name     = var.database_user
  instance = google_sql_database_instance.main.name
  password = var.database_password
  project  = var.project_id
}
