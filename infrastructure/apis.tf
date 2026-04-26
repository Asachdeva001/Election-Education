locals {
  services = [
    "civicinfo.googleapis.com",      # Google Civic Information API
    "maps-backend.googleapis.com",   # Google Maps Platform (could vary based on specific usage, using general backend)
    "translate.googleapis.com",      # Cloud Translation API
    "dialogflow.googleapis.com",     # Dialogflow API
    "aiplatform.googleapis.com",     # Vertex AI API
    "run.googleapis.com",            # Cloud Run API
    "sqladmin.googleapis.com",       # Cloud SQL Admin API
    "firestore.googleapis.com",      # Firestore API
    "compute.googleapis.com"         # Compute Engine API (for networking/Cloud SQL)
  ]
}

resource "google_project_service" "enabled_apis" {
  for_each           = toset(local.services)
  project            = var.project_id
  service            = each.value
  disable_on_destroy = false
}
