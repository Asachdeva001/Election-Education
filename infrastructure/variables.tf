variable "project_id" {
  description = "The ID of the GCP project"
  type        = string
}

variable "region" {
  description = "The default region for GCP resources"
  type        = string
  default     = "us-central1"
}

variable "database_user" {
  description = "The username for the Cloud SQL instance"
  type        = string
  default     = "election_admin"
}

variable "database_password" {
  description = "The password for the Cloud SQL instance"
  type        = string
  sensitive   = true
}
